"""Noise-only foley for the film (no music, nothing pitched), built from src/script.ts.

python3 scripts/sfx.py  → public/sfx.wav (48 kHz stereo, −14 LUFS, ≤ −1 dBFS peak)

Every sound is filtered noise: whooshes, air, ticks, key taps, clicks, pops, thuds, paper,
shimmer. Each generator returns (stereo, peak_index) and the peak lands exactly on its cue.
Camera moves get an air whoosh sized by the move.
"""
import json
import math
import subprocess
import wave

import numpy as np
import pyloudnorm as pyln
from scipy.signal import butter, lfilter, sosfilt

SR = 48000
rng = np.random.default_rng(7)


def noise(n):
    return rng.standard_normal(n)


def bp(x, lo, hi, order=2):
    sos = butter(order, [lo / (SR / 2), min(hi, SR / 2 - 100) / (SR / 2)], btype="band", output="sos")
    return sosfilt(sos, x)


def lp(x, f, order=2):
    return sosfilt(butter(order, f / (SR / 2), output="sos"), x)


def hp(x, f, order=2):
    return sosfilt(butter(order, f / (SR / 2), btype="high", output="sos"), x)


def sweep_lp(x, f0, f1):
    """One-pole low-pass whose cutoff glides f0 → f1 (block-wise, state carried)."""
    out = np.empty_like(x)
    zi = np.zeros(1)
    blk = 256
    nb = math.ceil(len(x) / blk)
    for i in range(nb):
        f = f0 * (f1 / f0) ** (i / max(1, nb - 1))
        a = math.exp(-2 * math.pi * f / SR)
        seg = x[i * blk:(i + 1) * blk]
        y, zi = lfilter([1 - a], [1, -a], seg, zi=zi)
        out[i * blk:(i + 1) * blk] = y
    return out


def env_ar(n, peak, attack_pow=2.0, decay=6.0):
    t = np.arange(n) / n
    p = peak / n
    e = np.where(t < p, (t / p) ** attack_pow, np.exp(-decay * (t - p) / (1 - p)))
    return e


def pan(mono, l2r=None, pos=0.0):
    """Equal-power pan; l2r=(a, b) sweeps from a to b across the sound."""
    n = len(mono)
    if l2r is None:
        p = np.full(n, pos)
    else:
        p = np.linspace(l2r[0], l2r[1], n)
    ang = (p + 1) * math.pi / 4
    return np.stack([mono * np.cos(ang), mono * np.sin(ang)], axis=1)


def norm(x):
    m = np.max(np.abs(x))
    return x / m if m > 0 else x


# ---------------- generators: return (stereo float, peak index) ----------------

def whoosh(dur=0.5, lo=300, hi=4500, peak=0.6, width=0.8):
    n = int(dur * SR)
    pk = int(peak * n)
    x = noise(n)
    rise = sweep_lp(x, lo, hi)
    x = hp(rise, 120) * env_ar(n, pk, 2.2, 5.0)
    return pan(norm(x), (-width, width)), pk


def air(dur=0.8, size=1.0):
    n = int(dur * SR)
    pk = int(0.62 * n)
    x = sweep_lp(noise(n), 250, 2200 + 1800 * size)
    x = hp(x, 180) * env_ar(n, pk, 1.6, 4.0)
    return pan(norm(x) * (0.5 + 0.5 * size), (-0.5, 0.5)), pk


def tick(lo=2800, hi=7000, ms=5, decay_ms=7):
    n = int(0.06 * SR)
    x = bp(noise(n), lo, hi)
    t = np.arange(n) / SR
    e = np.exp(-t / (decay_ms / 1000)) * (t < ms / 1000 + 0.04)
    return pan(norm(x * e), pos=rng.uniform(-0.15, 0.15)), 0


def key():
    a, _ = tick(1500, 4200, 4, 9)
    n = len(a)
    thump = lp(noise(n), 260) * np.exp(-np.arange(n) / SR / 0.012)
    out = a + pan(norm(thump) * 0.35, pos=0)
    return out, 0


def click():
    d, _ = tick(1800, 6000, 4, 6)
    u, _ = tick(2600, 7500, 3, 5)
    n = int(0.09 * SR)
    out = np.zeros((n, 2))
    out[: len(d)] += d
    o = int(0.045 * SR)
    out[o: o + len(u)] += u[: n - o] * 0.55
    return out, 0


def pop():
    n = int(0.14 * SR)
    t = np.arange(n) / SR
    body = bp(noise(n), 500, 1800) * np.exp(-t / 0.022)
    low = lp(noise(n), 300) * np.exp(-t / 0.03)
    x = norm(body) + 0.6 * norm(low)
    return pan(norm(x), pos=rng.uniform(-0.2, 0.2)), 0


def thud():
    n = int(0.45 * SR)
    t = np.arange(n) / SR
    sub = lp(noise(n), 140, 4) * np.exp(-t / 0.11)
    mid = bp(noise(n), 350, 1100) * np.exp(-t / 0.035)
    att = (t / 0.004).clip(0, 1)
    x = (norm(sub) + 0.55 * norm(mid)) * att
    return pan(norm(x), pos=0), int(0.004 * SR)


def soft():
    n = int(0.32 * SR)
    pk = int(0.35 * n)
    x = lp(noise(n), 900) * env_ar(n, pk, 1.5, 5.0)
    return pan(norm(x), (-0.2, 0.2)), pk


def swish():
    return whoosh(0.26, 900, 7000, 0.55, 0.6)


def shimmer(dur=0.9):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = hp(noise(n), 6500, 4)
    trem = 0.6 + 0.4 * np.sin(2 * math.pi * 17 * t + rng.uniform(0, 6))
    e = env_ar(n, int(0.3 * n), 1.5, 4.0)
    return pan(norm(x * trem * e), (-0.6, 0.6)), int(0.3 * n)


def paper(dur=0.32):
    n = int(dur * SR)
    x = bp(noise(n), 1800, 7000)
    crackle = (rng.random(n) < 0.004).astype(float)
    crackle = lfilter([1], [1, -0.985], crackle)
    e = env_ar(n, int(0.25 * n), 1.2, 3.5)
    return pan(norm(x * (0.35 + crackle) * e), (0.3, -0.3)), int(0.25 * n)


GEN = {
    "whoosh": whoosh,
    "air": air,
    "tick": tick,
    "key": key,
    "click": click,
    "pop": pop,
    "thud": thud,
    "soft": soft,
    "swish": swish,
    "shimmer": shimmer,
    "paper": paper,
}
BASE_DB = {"whoosh": -8, "air": -12, "tick": -14, "key": -16, "click": -10, "pop": -10, "thud": -6, "soft": -12, "swish": -12, "shimmer": -18, "paper": -14}


def reverb(x, secs=0.45, mix_db=-20):
    n = int(secs * SR)
    t = np.arange(n) / SR
    ir = np.stack([noise(n), noise(n)], axis=1) * np.exp(-t / (secs / 5))[:, None]
    ir /= np.sqrt(np.sum(ir ** 2, axis=0))
    from scipy.signal import fftconvolve
    wet = np.stack([fftconvolve(x[:, c], ir[:, c])[: len(x)] for c in range(2)], axis=1)
    return x + wet * 10 ** (mix_db / 20)


def limit(x, ceiling_db=-1.0, look_ms=3, release_ms=80):
    ceil = 10 ** (ceiling_db / 20)
    amp = np.max(np.abs(x), axis=1)
    look = int(look_ms / 1000 * SR)
    # required gain per sample, held over the look-ahead window
    need = np.minimum(1.0, ceil / np.maximum(amp, 1e-9))
    from scipy.ndimage import minimum_filter1d
    need = minimum_filter1d(need, size=2 * look + 1)
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
    bus = np.zeros((n + SR, 2))

    def place(sig, pk, t, db):
        start = int(round(t * SR)) - pk
        s0 = max(0, start)
        sig = sig[s0 - start:]
        e = min(len(bus), s0 + len(sig))
        bus[s0:e] += sig[: e - s0] * 10 ** (db / 20)

    for t, kind, *g in data["cues"]:
        sig, pk = GEN[kind]()
        place(sig, pk, t, BASE_DB[kind] + (g[0] if g else 0))

    # camera moves → air whooshes sized by the move (skip cuts made under full cover)
    cam = data["cam"]
    for prev, k in zip(cam, cam[1:]):
        t0, x, y, s = k[:4]
        dur = k[4] if len(k) > 4 else 0.8
        if dur < 0.1:
            continue
        mag = abs(math.log(s / prev[3])) + math.hypot(x - prev[1], y - prev[2]) / 1400
        if mag < 0.06:
            continue
        size = min(1.0, mag / 0.6)
        sig, pk = air(max(0.35, dur * 1.1), size)
        place(sig, pk, t0 + dur * 0.62, -16 + 8 * size)

    mix = reverb(bus[:n])
    meter = pyln.Meter(SR)
    for _ in range(3):
        lufs = meter.integrated_loudness(mix)
        mix = limit(mix * 10 ** ((-14 - lufs) / 20))
    lufs = meter.integrated_loudness(mix)
    peak = 20 * math.log10(np.max(np.abs(mix)))
    pcm = (np.clip(mix, -1, 1) * 32767).astype("<i2")
    with wave.open("public/sfx.wav", "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    print(f"public/sfx.wav  {data['duration']} s  {lufs:.1f} LUFS  peak {peak:.1f} dBFS  {len(data['cues'])} cues")


if __name__ == "__main__":
    main()
