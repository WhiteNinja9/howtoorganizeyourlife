import React from "react";
import { clamp01, glideKeys } from "../lib/motion";

/**
 * First-person eyelids in screen space. openness 1 = no lids, 0 = closed (black).
 * The opening is a lens: two curved lids meeting at the eye corners, edges softened like a real blink,
 * plus a dark vignette that deepens as they close.
 */
export const lidOpenness = (t: number, keys: [number, number, number?][]) =>
  clamp01(glideKeys(t, keys[0][1], keys.slice(1).map(([t0, v, d]) => [t0, v, d ?? 0.4])));

/** NIGHT = the one black shared by the flood, the closed lids and the heart scene (no colour jumps). */
export const NIGHT = "#07090A";

export const Lids: React.FC<{ t: number; keys: [number, number, number?][]; id: string }> = ({ t, keys, id }) => {
  const o = lidOpenness(t, keys);
  if (o >= 0.999) return null;
  const apex = 640 * o; // how far each lid's edge has lifted at the centre
  const away = Math.max(0, (o - 0.55) / 0.45) ** 2 * 520; // fully open: lids slide off-frame
  const top = `M -200 -400 H 2120 V 540 Q 960 ${540 - apex * 2} -200 540 Z`;
  const bottom = `M -200 1480 H 2120 V 540 Q 960 ${540 + apex * 2} -200 540 Z`;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}>
      <defs>
        <filter id={id} x="-10%" y="-60%" width="120%" height="220%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation={10 + 26 * (1 - o)} />
        </filter>
        <radialGradient id={`${id}v`} cx="50%" cy="50%" r="70%">
          <stop offset="55%" stopColor="#000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.75 * (1 - o) * Math.min(1, o * 6)} />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${id}v)`} />
      <g filter={`url(#${id})`}>
        <path d={top} fill={NIGHT} transform={`translate(0 ${-away})`} />
        <path d={bottom} fill={NIGHT} transform={`translate(0 ${away})`} />
      </g>
    </svg>
  );
};
