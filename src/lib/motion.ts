/**
 * Motion engine. Everything is a pure function of time t (seconds, may be fractional:
 * motion blur samples sub-frames). No remotion spring() here — closed-form step responses.
 */
export const FPS = 60;
export const W = 1920;
export const H = 1080;

export type Spring = { w: number; z: number };
export const RISE: Spring = { w: 16, z: 0.9 };
export const SOFT: Spring = { w: 9, z: 1 };
export const GENTLE: Spring = { w: 6.5, z: 1 };
export const SNAP: Spring = { w: 22, z: 1 };
export const POP: Spring = { w: 16, z: 0.6 };
export const TINY: Spring = { w: 13, z: 0.86 };

export const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const inv = (a: number, b: number, x: number) => clamp01((x - a) / (b - a));

/** Closed-form unit step response of a damped spring; snaps to exactly 1 once settled. */
export const step = (t: number, w: number, z: number) => {
  if (t <= 0) return 0;
  let v: number;
  let env: number;
  if (z < 1) {
    const wd = w * Math.sqrt(1 - z * z);
    const e = Math.exp(-z * w * t);
    v = 1 - e * (Math.cos(wd * t) + ((z * w) / wd) * Math.sin(wd * t));
    env = e * (1 + (z * w) / wd);
  } else {
    const e = Math.exp(-w * t);
    v = 1 - e * (1 + w * t);
    env = e * (1 + w * t);
  }
  return env < 4e-4 ? 1 : v;
};

export const sp = (t: number, t0: number, s: Spring = SOFT) => step(t - t0, s.w, s.z);

/** A value with many targets: the sum of one step per change. */
export const multi = (t: number, init: number, keys: [number, number, Spring?][], s: Spring = SOFT) => {
  let v = init;
  let prev = init;
  for (const [t0, target, ks] of keys) {
    v += (target - prev) * sp(t, t0, ks ?? s);
    prev = target;
  }
  return v;
};

/* ---------- glide: cubic-bezier(.45, 0, .15, 1) ---------- */

const bez = (x1: number, y1: number, x2: number, y2: number) => {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const X = (s: number) => ((ax * s + bx) * s + cx) * s;
  const Y = (s: number) => ((ay * s + by) * s + cy) * s;
  const dX = (s: number) => (3 * ax * s + 2 * bx) * s + cx;
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let s = x;
    for (let i = 0; i < 8; i++) {
      const d = dX(s);
      if (Math.abs(d) < 1e-6) break;
      s -= (X(s) - x) / d;
    }
    let lo = 0, hi = 1;
    if (Math.abs(X(s) - x) > 1e-5) {
      s = x;
      for (let i = 0; i < 30; i++) {
        if (X(s) < x) lo = s; else hi = s;
        s = (lo + hi) / 2;
      }
    }
    return Y(s);
  };
};
export const GLIDE = bez(0.45, 0, 0.15, 1);
export const EASE_IN = bez(0.55, 0, 1, 0.45);
export const EASE_OUT = bez(0, 0.55, 0.45, 1);

/** Glide progress of a move that starts at t0 and lasts dur seconds. */
export const gl = (t: number, t0: number, dur = 0.8) => GLIDE(inv(t0, t0 + dur, t));

/** Value that glides between keyed targets: keys = [t0, value, dur?]. */
export const glideKeys = (t: number, init: number, keys: [number, number, number?][]) => {
  let v = init;
  for (const [t0, target, dur] of keys) {
    if (t <= t0) break;
    v = lerp(v, target, gl(t, t0, dur ?? 0.8));
  }
  return v;
};

/* ---------- rects ---------- */

export type Rect = { x: number; y: number; w: number; h: number; r: number };
export const cRect = (cx: number, cy: number, w: number, h: number, r = Math.min(w, h) / 2): Rect => ({
  x: cx - w / 2,
  y: cy - h / 2,
  w,
  h,
  r,
});
export const center = (r: Rect) => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });
export const rectLerp = (a: Rect, b: Rect, t: number): Rect => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  w: lerp(a.w, b.w, t),
  h: lerp(a.h, b.h, t),
  r: lerp(a.r, b.r, t),
});

/** Interpolate two rects so that the AREA moves linearly with u (floods/contractions feel even). */
export const rectByArea = (a: Rect, b: Rect, u: number): Rect => {
  const A0 = a.w * a.h;
  const A1 = b.w * b.h;
  const target = lerp(A0, A1, clamp01(u));
  // area(p) = (a.w + dw p)(a.h + dh p) = target  → quadratic in p
  const dw = b.w - a.w;
  const dh = b.h - a.h;
  const qa = dw * dh;
  const qb = a.w * dh + a.h * dw;
  const qc = A0 - target;
  let p: number;
  if (Math.abs(qa) < 1e-9) p = Math.abs(qb) < 1e-9 ? u : -qc / qb;
  else {
    const disc = Math.max(0, qb * qb - 4 * qa * qc);
    const r1 = (-qb + Math.sqrt(disc)) / (2 * qa);
    const r2 = (-qb - Math.sqrt(disc)) / (2 * qa);
    p = r1 >= -1e-6 && r1 <= 1 + 1e-6 ? r1 : r2;
  }
  return rectLerp(a, b, clamp01(p));
};

export const FULL: Rect = { x: 0, y: 0, w: W, h: H, r: 0 };

/** A circle around (cx, cy) that passes every corner of the (camera-free) frame. */
export const floodCircle = (cx: number, cy: number, pad = 80): Rect => {
  const R =
    Math.max(Math.hypot(cx, cy), Math.hypot(W - cx, cy), Math.hypot(cx, H - cy), Math.hypot(W - cx, H - cy)) + pad;
  return cRect(cx, cy, R * 2, R * 2, R);
};

/** Flood from a rect to past the corners, eased by area, ~0.4 s. */
export const flood = (t: number, t0: number, from: Rect, dur = 0.42): Rect => {
  const c = center(from);
  const u = EASE_IN(inv(t0, t0 + dur, t)) * 0.35 + inv(t0, t0 + dur, t) * 0.65;
  return rectByArea(from, floodCircle(c.x, c.y), u);
};

/** Contract from full cover into a rect, eased by area. */
export const contract = (t: number, t0: number, to: Rect, dur = 0.5): Rect => {
  const u = GLIDE(inv(t0, t0 + dur, t));
  const big = { x: -260, y: -260, w: W + 520, h: H + 520, r: 0 };
  return rectByArea(big, to, u);
};

/* ---------- exits ---------- */

/** Accelerating exit: k in [0,1] over dur; returns offset factor k², blur, opacity. */
export const exitK = (t: number, t0: number | undefined, dur = 0.32) => {
  if (t0 === undefined) return { k: 0, off: 0, blur: 0, op: 1, gone: false };
  const k = inv(t0, t0 + dur, t);
  return { k, off: k * k, blur: 2 * k * 5, op: 1 - k * k * k, gone: k >= 1 };
};

/* ---------- camera ---------- */

export type CamKey = [t: number, x: number, y: number, s: number, dur?: number];
export type Cam = { x: number; y: number; s: number };

/** Screen-studio camera: glides between keys, zoom interpolated in log space. Lands exactly. */
export const camAt = (t: number, keys: CamKey[]): Cam => {
  let x = keys[0][1];
  let y = keys[0][2];
  let ls = Math.log(keys[0][3]);
  for (let i = 1; i < keys.length; i++) {
    const [t0, kx, ky, ks, dur] = keys[i];
    if (t <= t0) break;
    const u = gl(t, t0, dur ?? 0.8);
    x = lerp(x, kx, u);
    y = lerp(y, ky, u);
    ls = lerp(ls, Math.log(ks), u);
  }
  return { x, y, s: Math.exp(ls) };
};

export const camTransform = (c: Cam) =>
  `translate(${W / 2 - c.x * c.s}px, ${H / 2 - c.y * c.s}px) scale(${c.s})`;

/* ---------- misc ---------- */

/** Whole-frame time: counters and swaps read this so they never smear across motion-blur samples. */
export const tq = (t: number) => Math.floor(t * FPS + 1e-6) / FPS;

/** Deterministic hash noise in [0,1). */
export const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

type Seg = { segment(s: string): Iterable<{ segment: string }> };
/** Split by grapheme so shaping never breaks while typing. */
export const graphemes = (s: string) => {
  const I = Intl as unknown as { Segmenter?: new (l?: string, o?: { granularity: string }) => Seg };
  if (!I.Segmenter) return Array.from(s);
  return Array.from(new I.Segmenter(undefined, { granularity: "grapheme" }).segment(s), (g) => g.segment);
};
