import { interpolate, interpolateColors, spring, SpringConfig } from "remotion";

export const FPS = 60;
export const W = 1920;
export const H = 1080;
/** 120 BPM: one beat = 0.5s = 30 frames. Everything is placed on this grid. */
export const BEAT = 30;
export const b = (beats: number) => Math.round(beats * BEAT);

// Spring presets. Tiny overshoot at most.
export const SOFT: Partial<SpringConfig> = { damping: 20, stiffness: 150, mass: 1 };
export const SNAP: Partial<SpringConfig> = { damping: 26, stiffness: 260, mass: 1 };
export const POP: Partial<SpringConfig> = { damping: 15, stiffness: 210, mass: 0.9 };
export const FLOOD: Partial<SpringConfig> = { damping: 30, stiffness: 240, mass: 1 };
export const SLOW: Partial<SpringConfig> = { damping: 24, stiffness: 70, mass: 1 };

/** Closed-form spring step response that starts at `start`. Pure function of frame. */
export const sp = (
  frame: number,
  start: number,
  config: Partial<SpringConfig> = SOFT,
) =>
  frame < start ? 0 : spring({ frame: frame - start, fps: FPS, config });

/**
 * A value with many targets: the sum of one spring per change,
 * so it stays a pure function of time.
 */
export const multi = (
  frame: number,
  initial: number,
  changes: [number, number][],
  config: Partial<SpringConfig> = SOFT,
) => {
  let v = initial;
  let prev = initial;
  for (const [f, target] of changes) {
    v += (target - prev) * sp(frame, f, config);
    prev = target;
  }
  return v;
};

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

export const lerp = (a: number, c: number, t: number) => a + (c - a) * t;

export const kf = (frame: number, input: number[], output: number[]) =>
  interpolate(frame, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const mixColor = (t: number, a: string, c: string) =>
  interpolateColors(clamp01(t), [0, 1], [a, c]);

export type Rect = { x: number; y: number; w: number; h: number; r: number };

export const rectLerp = (a: Rect, c: Rect, t: number): Rect => ({
  x: lerp(a.x, c.x, t),
  y: lerp(a.y, c.y, t),
  w: lerp(a.w, c.w, t),
  h: lerp(a.h, c.h, t),
  r: lerp(a.r, c.r, t),
});

/** Rect from centre + size. */
export const cRect = (cx: number, cy: number, w: number, h: number, r = h / 2): Rect => ({
  x: cx - w / 2,
  y: cy - h / 2,
  w,
  h,
  r,
});

/** A circle around (cx, cy) big enough to overscale past every corner of the frame. */
export const floodRect = (cx: number, cy: number): Rect => {
  const R =
    Math.max(
      Math.hypot(cx, cy),
      Math.hypot(W - cx, cy),
      Math.hypot(cx, H - cy),
      Math.hypot(W - cx, H - cy),
    ) + 60;
  return cRect(cx, cy, R * 2, R * 2, R);
};

export const FULL: Rect = { x: 0, y: 0, w: W, h: H, r: 0 };

/** Sequence of rect targets driven by springs (one spring per change). */
export const rectMulti = (
  frame: number,
  initial: Rect,
  changes: [number, Rect][],
  config: Partial<SpringConfig> = SOFT,
): Rect => {
  const keys: (keyof Rect)[] = ["x", "y", "w", "h", "r"];
  const out = { ...initial };
  for (const k of keys) {
    out[k] = multi(
      frame,
      initial[k],
      changes.map(([f, r]) => [f, r[k]] as [number, number]),
      config,
    );
  }
  return out;
};
