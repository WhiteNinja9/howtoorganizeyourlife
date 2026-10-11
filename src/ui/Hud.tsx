import React from "react";
import { F } from "../lib/theme";
import { sp, SNAP } from "../lib/anim";

/**
 * A light sci-fi frame: corner registration marks, a running timecode and the
 * section index. Marks draw in from the corners at `at` and retract at `out`.
 */
export const Hud: React.FC<{
  frame: number;
  at: number;
  out: number;
  index: number;
  total?: number;
  color: string;
}> = ({ frame, at, out, index, total = 8, color }) => {
  const k = sp(frame, at, SNAP) * (1 - sp(frame, out, SNAP));
  if (k < 0.001) return null;
  const L = 34 * k;
  const inset = 44;
  const corners = [
    [inset, inset, 1, 1],
    [1920 - inset, inset, -1, 1],
    [inset, 1080 - inset, 1, -1],
    [1920 - inset, 1080 - inset, -1, -1],
  ];
  const secs = frame / 60;
  const tc = `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(Math.floor(secs % 60)).padStart(2, "0")}:${String(Math.floor(frame % 60)).padStart(2, "0")}`;
  const label: React.CSSProperties = {
    position: "absolute",
    fontFamily: F.mono,
    fontSize: 17,
    letterSpacing: "0.16em",
    color,
    opacity: 0.75,
    bottom: inset - 6,
    transform: `translateY(${(1 - k) * 40}px)`,
  };
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {corners.map(([x, y, dx, dy], i) => (
          <path
            key={i}
            d={`M ${x} ${y + dy * L} L ${x} ${y} L ${x + dx * L} ${y}`}
            stroke={color}
            strokeWidth={2}
            fill="none"
            opacity={0.7}
          />
        ))}
      </svg>
      <div style={{ ...label, left: inset + 52 }}>RISE — A REMINDER FOR THE UMMAH</div>
      <div style={{ ...label, right: inset + 52 }}>
        {tc} &nbsp;·&nbsp; {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>
    </div>
  );
};
