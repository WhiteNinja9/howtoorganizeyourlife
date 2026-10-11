import React from "react";
import { clamp01, glideKeys, lerp } from "../lib/motion";

/**
 * Cinematic first-person eyelids (screen space). openness 1 = no lids, 0 = closed.
 *
 * - Anatomy: the upper lid does most of the travel; the lower lid barely moves. They meet below the centre.
 *   Each edge is an arc (highest at the middle for the upper lid), with a feathered lash line.
 * - Light through skin: when the eyes close in front of light, the lids glow a deep warm red (`tint` 1),
 *   brighter at the centre. In the dark (`tint` 0) they are the shared NIGHT black.
 * - A vignette only while half-open; nothing extra when fully closed, so blinks never pop.
 * The world's defocus / head-dip live in the film (they read the same openness).
 */
export type LidKey = [number, number, number?];

/** NIGHT = the one black shared by the flood, the closed lids and the heart scene (no colour jumps). */
export const NIGHT = "#07090A";
const MEET = 610;

export const lidOpenness = (t: number, keys: LidKey[]) =>
  clamp01(glideKeys(t, keys[0][1], keys.slice(1).map(([t0, v, d]) => [t0, v, d ?? 0.4])));

const mixRGB = (a: number[], b: number[], k: number) => `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], k))).join(",")})`;

export const Lids: React.FC<{ t: number; keys: LidKey[]; tint?: number; id: string }> = ({ t, keys, tint = 0, id }) => {
  const o = lidOpenness(t, keys);
  if (o >= 0.999) return null;
  const up = Math.pow(o, 0.8);
  const low = Math.pow(o, 1.35);
  // upper lid: centre lifts to off-frame, corners stay lower (an arc)
  const uc = lerp(MEET + 60, -330, up); // closed: the lids overlap so their soft edges leave no seam
  const uk = lerp(MEET + 66, -280, Math.pow(up, 1.6)); // corners trail the centre, then leave the frame too
  // lower lid: barely moves until the eye is well open
  const lc = lerp(MEET - 60, 1340, low);
  const lk = lerp(MEET - 66, 1320, Math.pow(low, 1.6));
  const upper = `M -300 -700 H 2220 V ${uk} Q 960 ${2 * uc - uk} -300 ${uk} Z`;
  const lower = `M -300 1800 H 2220 V ${lk} Q 960 ${2 * lc - lk} -300 ${lk} Z`;
  const feather = 9 + 22 * (1 - o);
  const night = [7, 9, 10];
  const edge = mixRGB(night, [26, 6, 4], tint);
  const centre = mixRGB(night, [92, 26, 12], tint);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}>
      <defs>
        <filter id={id} x="-20%" y="-80%" width="140%" height="260%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation={feather} />
        </filter>
        <filter id={`${id}l`} x="-20%" y="-80%" width="140%" height="260%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation={6 + 6 * (1 - o)} />
        </filter>
        <radialGradient id={`${id}g`} gradientUnits="userSpaceOnUse" cx={960} cy={MEET} r={1300}>
          <stop offset="0%" stopColor={centre} />
          <stop offset="100%" stopColor={edge} />
        </radialGradient>
        <radialGradient id={`${id}v`} cx="50%" cy="56%" r="72%">
          <stop offset="50%" stopColor="#000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.8 * (1 - o) * Math.min(1, o * 5)} />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${id}v)`} />
      <g filter={`url(#${id})`}>
        <path d={upper} fill={`url(#${id}g)`} />
        <path d={lower} fill={`url(#${id}g)`} />
      </g>
      {/* lash line: a darker, tighter band right at each lid's edge */}
      {o > 0.02 && (
        <g filter={`url(#${id}l)`} opacity={0.55 * Math.min(1, o * 4) * (1 - tint * 0.5)}>
          <path d={`M -300 ${uk} Q 960 ${2 * uc - uk} 2220 ${uk}`} stroke="#000" strokeWidth={26} fill="none" />
          <path d={`M -300 ${lk} Q 960 ${2 * lc - lk} 2220 ${lk}`} stroke="#000" strokeWidth={14} fill="none" />
        </g>
      )}
    </svg>
  );
};
