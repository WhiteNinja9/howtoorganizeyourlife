import React from "react";
import { multi, sp } from "../lib/anim";

export type CursorKey = { f: number; x: number; y: number };

const MOVE = { damping: 24, stiffness: 120, mass: 1 };

/**
 * A macOS-style arrow driven by keyframes (one spring per move) with real clicks:
 * each click dips the cursor to 82% and springs back. `zoom` scales it with the camera.
 */
export const Cursor: React.FC<{
  frame: number;
  keys: CursorKey[];
  clicks?: number[];
  show: [number, number];
}> = ({ frame, keys, clicks = [], show }) => {
  if (frame < show[0] || frame > show[1] || keys.length === 0) return null;
  const [k0, ...rest] = keys;
  const x = multi(frame, k0.x, rest.map((k) => [k.f, k.x]), MOVE);
  const y = multi(frame, k0.y, rest.map((k) => [k.f, k.y]), MOVE);
  let press = 0;
  for (const c of clicks) {
    const down = sp(frame, c - 4, { damping: 30, stiffness: 600 });
    const up = sp(frame, c + 3, { damping: 18, stiffness: 300 });
    press += down - up;
  }
  const appear = sp(frame, show[0], { damping: 22, stiffness: 260 }) * (1 - sp(frame, show[1] - 12, { damping: 26, stiffness: 300 }));
  const s = appear * (1 - 0.18 * press);
  return (
    <svg
      width={44}
      height={54}
      viewBox="0 0 32 39"
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-3px,-2px) scale(${s})`,
        transformOrigin: "3px 2px",
        overflow: "visible",
        filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.25))",
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
