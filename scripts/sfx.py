"""Foley for the film from recorded, non-tonal Mixkit takes (no music, nothing pitched).

python3 scripts/fetch_sfx.py   # once: downloads the takes into sfx/mixkit/
python3 scripts/sfx.py         # → public/sfx.wav (48 kHz stereo, −14 LUFS, ≤ −1 dBFS)

- Cues come from src/script.ts (scripts/cues.ts), the same timeline the visuals use.
- Each take is trimmed around its loudest instant and that instant lands exactly on the cue.
- Takes rotate per kind with ±1.5 dB jitter; keystrokes are sliced from real typing sequences.
- Whooshes travel across the stereo field (camera moves follow the move's direction); a short room
  reverb glues the bus; the master is gained to −14 LUFS through a look-ahead limiter.
"""
import json
import math
import os
import subprocess
import sys
import wave

import numpy as np
import pyloudnorm as pyln
import soundfile as sf
from scipy.ndimage import minimum_filter1d
from scipy.signal import fftconvolve, find_peaks

sys.path.insert(0, os.path.dirname(__file__))
from sfx_library import LIB, TYPING_SEQUENCES  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
SR = 48000
rng = np.random.default_rng(11)

# loudness of each kind (LUFS of the take on its own, ~400 ms window); transients sit lower so the
# master limiter only shaves a little instead of flattening every click to the same peak
KIND_DB = {"key": -27, "click": -25, "tick": -30, "pop": -26, "whoosh": -17, "air": -22, "swish": -24,
           "thud": -16, "soft": -23, "paper": -28, "shimmer": -25}
METER = pyln.Meter(SR, block_size=0.1)
# longest slice kept after the peak (clicks: just the first transient)
MAX_AFTER = {"key": 0.11, "click": 0.14, "tick": 0.12, "pop": 0.25}
# where the peak lands relative to the cue (thuds hit when a flood/contraction is complete)
PEAK_SHIFT = {"thud": 0.36}
TRAVEL = {"whoosh", "air", "swish", "shimmer"}


def load(i):
    x, sr = sf.read(f"sfx/mixkit/{i}.wav", always_2d=True)
    assert sr == SR
    return x


def envelope(x, ms=5):
    m = np.abs(x).mean(axis=1)
    n = max(1, int(ms / 1000 * SR))
    return np.sqrt(np.convolve(m ** 2, np.ones(n) / n, "same"))


def prep(x, kind):
    """Trim around the loudest instant, fade the edges, normalise; return (take, peak index)."""
    env = envelope(x)
    pk = int(np.argmax(env))
    thr = env[pk] * 0.02
    on = pk
    while on > 0 and env[on] > thr:
        on -= 1
    on = max(0, on - int(0.006 * SR))
    off = pk
    while off < len(env) - 1 and env[off] > thr:
        off += 1
    if kind in MAX_AFTER:
        off = min(off, pk + int(MAX_AFTER[kind] * SR))
    off = min(len(x), off + int(0.03 * SR))
    y = x[on:off].copy()
    fi = min(int(0.003 * SR), len(y) // 4)
    fo = min(int(0.02 * SR), len(y) // 3)
    y[:fi] *= np.linspace(0, 1, fi)[:, None]
    y[-fo:] *= np.linspace(1, 0, fo)[:, None]
    p = pk - on
    # normalise to 0 LUFS (momentary, 100 ms blocks) so KIND_DB is a loudness target
    pad = np.concatenate([y, np.zeros((max(0, int(0.4 * SR) - len(y)), 2))])
    lufs = METER.integrated_loudness(pad)
    if not np.isfinite(lufs):
        lufs = 20 * math.log10(np.sqrt(np.mean(y ** 2)) + 1e-9)
    return y * 10 ** ((0 - lufs) / 20), p


def keystrokes():
    """Slice clean single keystrokes out of the typing sequences."""
    out = []
    for i in TYPING_SEQUENCES:
        x = load(i)
        env = envelope(x, 3)
        peaks, props = find_peaks(env, height=env.max() * 0.25, distance=int(0.09 * SR))
        for p in peaks:
            pre = env[max(0, p - int(0.05 * SR)): p - int(0.008 * SR)]
            if len(pre) and pre.max() > env[p] * 0.35:
                continue  # another key right before — not clean
            seg = x[max(0, p - int(0.03 * SR)): p + int(0.14 * SR)]
            out.append(prep(seg, "key"))
    out.sort(key=lambda tp: -np.max(np.abs(tp[0])))
    return out[:18]


TAKES = {k: [prep(load(i), k) for i in ids] for k, ids in LIB.items()}
TAKES["key"] = TAKES["key"] + keystrokes()
counter = {k: int(rng.integers(0, 100)) for k in TAKES}


def take(kind):
    lst = TAKES[kind]
    counter[kind] += 1
    return lst[counter[kind] % len(lst)]


def travel(y, direction, amount=0.7):
    """Mono-sum, then pan across the take with equal power."""
    m = y.mean(axis=1)
    p = np.linspace(-direction * amount, direction * amount, len(m))
    ang = (p + 1) * math.pi / 4
    return np.stack([m * np.cos(ang), m * np.sin(ang)], axis=1) * math.sqrt(2)


def nudge(y, pos):
    ang = (pos + 1) * math.pi / 4
    return y * np.array([math.cos(ang), math.sin(ang)]) * math.sqrt(2)


def reverb(x, secs=0.5, mix_db=-22):
    n = int(secs * SR)
    t = np.arange(n) / SR
    ir = rng.standard_normal((n, 2)) * np.exp(-t / (secs / 5))[:, None]
    ir[: int(0.012 * SR)] = 0  # pre-delay
    ir /= np.sqrt(np.sum(ir ** 2, axis=0))
    wet = np.stack([fftconvolve(x[:, c], ir[:, c])[: len(x)] for c in range(2)], axis=1)
    return x + wet * 10 ** (mix_db / 20)


def limit(x, ceiling_db=-1.0, look_ms=3, release_ms=60):
    ceil = 10 ** (ceiling_db / 20)
    need = np.minimum(1.0, ceil / np.maximum(np.max(np.abs(x), axis=1), 1e-9))
    need = minimum_filter1d(need, size=2 * int(look_ms / 1000 * SR) + 1)
    g = np.empty_like(need)
    rel = math.exp(-1 / (release_ms / 1000 * SR))
    cur = 1.0
    for i, v in enumerate(need):
        cur = v if v < cur else v + (cur - v) * rel
        g[i] = cur
    return x * g[:, None]


def main():
    data = json.loads(subprocess.check_output(["npx", "tsx", "scripts/cues.ts"], text=True))
    n = int(data["duration"] * SR)
    bus = np.zeros((n + 2 * SR, 2))

    def place(y, pk, t, db):
        start = int(round(t * SR)) - pk
        s0 = max(0, start)
        y = y[s0 - start:]
        e = min(len(bus), s0 + len(y))
        bus[s0:e] += y[: e - s0] * 10 ** (db / 20)

    side = 1
    for t, kind, *g in data["cues"]:
        y, pk = take(kind)
        if kind in TRAVEL:
            side = -side
            y = travel(y, side)
        else:
            y = nudge(y, float(rng.uniform(-0.15, 0.15)))
        db = KIND_DB[kind] + (g[0] if g else 0) * 0.6 + float(rng.uniform(-1.5, 1.5))
        place(y, pk, t + PEAK_SHIFT.get(kind, 0), db)

    # camera moves → air whooshes sized by the move, travelling with it (cuts under full cover skipped)
    cam = data["cam"]
    airs = sorted(TAKES["air"], key=lambda tp: tp[1])
    for prev, k in zip(cam, cam[1:]):
        t0, x, y_, s = k[:4]
        dur = k[4] if len(k) > 4 else 0.8
        if dur < 0.1:
            continue
        dx = x - prev[1]
        mag = abs(math.log(s / prev[3])) + math.hypot(dx, y_ - prev[2]) / 1400
        if mag < 0.06:
            continue
        size = min(1.0, mag / 0.6)
        lead = dur * 0.62
        y, pk = min(airs, key=lambda tp: abs(tp[1] / SR - lead))  # take whose build matches the glide
        direction = -1 if dx > 40 else 1 if dx < -40 else (1 if s > prev[3] else -1)
        place(travel(y, direction, 0.55 + 0.25 * size), pk, t0 + lead, KIND_DB["air"] - 7 + 7 * size)

    mix = reverb(bus[:n])
    meter = pyln.Meter(SR)
    for _ in range(3):
        mix = limit(mix * 10 ** ((-14 - meter.integrated_loudness(mix)) / 20))
    lufs = meter.integrated_loudness(mix)
    peak = 20 * math.log10(np.max(np.abs(mix)))
    with wave.open("public/sfx.wav", "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((np.clip(mix, -1, 1) * 32767).astype("<i2").tobytes())
    print(f"public/sfx.wav  {data['duration']} s  {lufs:.1f} LUFS  peak {peak:.1f} dBFS  "
          f"{len(data['cues'])} cues  {sum(len(v) for v in TAKES.values())} takes")


if __name__ == "__main__":
    main()
