import React from "react";
import { clamp01, exitK, glideKeys, multi, sp } from "../lib/motion";

/** [t, x, y, glideSeconds] — the cursor arrives at (x, y) at t + glide. */
export type CurKey = [number, number, number, number?];

const pos = (t: number, keys: CurKey[]) => {
  const [first, ...rest] = keys;
  return {
    x: glideKeys(t, first[1], rest.map(([t0, x, , d]) => [t0, x, d ?? 0.55])),
    y: glideKeys(t, first[2], rest.map(([t0, , y, d]) => [t0, y, d ?? 0.55])),
  };
};

/**
 * World-space macOS arrow. Glides between keys, turns to face its direction of travel,
 * grows on hover, presses to 0.85. Lives inside the camera so it scales with it.
 */
export const Cursor: React.FC<{
  t: number;
  keys: CurKey[];
  show: [number, number];
  clicks?: number[];
  hovers?: [number, number][];
  /** long-presses: held down between the two times */
  holds?: [number, number][];
}> = ({ t, keys, show, clicks = [], hovers = [], holds = [] }) => {
  if (t < show[0] || t > show[1] + 0.4) return null;
  const p = pos(t, keys);
  const dt = 1 / 120;
  const a = pos(t - dt, keys);
  const b = pos(t + dt, keys);
  const vx = (b.x - a.x) / (2 * dt);
  const vy = (b.y - a.y) / (2 * dt);
  const speed = Math.hypot(vx, vy);
  // the arrow's tip points up-left (~ -112° from +x); lean it toward the travel direction
  let rot = 0;
  if (speed > 40) {
    const heading = (Math.atan2(vy, vx) * 180) / Math.PI;
    let d = heading - -112;
    while (d > 180) d -= 360;
    while (d < -180) d += 360;
    rot = Math.max(-34, Math.min(34, d * 0.35)) * clamp01(speed / 1600);
  }
  let press = 0;
  for (const c of clicks) press += sp(t, c - 0.06, { w: 60, z: 1 }) - sp(t, c + 0.05, { w: 26, z: 0.8 });
  for (const [h0, h1] of holds) press += sp(t, h0 - 0.06, { w: 40, z: 1 }) - sp(t, h1, { w: 26, z: 0.8 });
  const hover = multi(
    t,
    0,
    hovers.flatMap(([h0, h1]) => [
      [h0, 1],
      [h1, 0],
    ]) as [number, number][],
    { w: 18, z: 0.85 },
  );
  const appear = sp(t, show[0], { w: 20, z: 0.9 }) * (1 - exitK(t, show[1], 0.3).off);
  const s = appear * (1 + 0.14 * hover) * (1 - 0.15 * press);
  if (s < 0.003) return null;
  return (
    <svg
      width={40}
      height={49}
      viewBox="0 0 32 39"
      style={{
        position: "absolute",
        left: p.x,
        top: p.y,
        transform: `translate(-3px,-2px) rotate(${rot}deg) scale(${s})`,
        transformOrigin: "3px 2px",
        overflow: "visible",
        filter: "drop-shadow(0 5px 7px rgba(0,0,0,0.22))",
        zIndex: 100,
      }}
    >
      <path
        d="M2 2 L2 31 L9.5 24 L14.5 35.5 L19.5 33.3 L14.6 22 L25 22 Z"
        fill="#0b0b0b"
        stroke="#ffffff"
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
    </svg>
  );
};
