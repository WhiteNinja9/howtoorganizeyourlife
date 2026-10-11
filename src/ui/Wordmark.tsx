import React from "react";
import { C, F } from "../lib/theme";
import { clamp01, lerp, Rect } from "../lib/motion";

/**
 * "Rise." in Archivo 800 / wdth 125 at 240px (metrics measured with fontTools):
 * "Rise" advance 2.737em at wdth 125 → 1.501em at wdth 62; period advance 0.349em,
 * its ink x 0.066–0.284em, height 0.183em.
 * squeeze p: 0 = full word, 1 = only the dot, centred. The first half narrows the wdth axis
 * (letters keep touching, each moves toward the dot by the same factor), the second half scales.
 */
const SIZE = 240;
const RISE_W125 = 2.737 * SIZE;
const RISE_W62 = 1.501 * SIZE;
const DOT_ADV = 0.349 * SIZE;
export const BASELINE = 622;

export const wordmarkGeom = (p: number) => {
  const q = clamp01(p);
  let wdth = 125;
  let scale = 1;
  let riseW = RISE_W125;
  if (q < 0.5) {
    const t = q * 2;
    wdth = lerp(125, 62, t);
    riseW = lerp(RISE_W125, RISE_W62, t);
  } else {
    const t = (q - 0.5) * 2;
    wdth = 62;
    scale = 1 - t;
    riseW = RISE_W62 * scale;
  }
  const origin = 960 + riseW / 2 - DOT_ADV / 2;
  const dot: Rect = { x: origin + 0.066 * SIZE, y: BASELINE - 0.183 * SIZE, w: 0.218 * SIZE, h: 0.183 * SIZE, r: 8 };
  return { wdth, scale, origin, dot };
};

export const WordmarkLetters: React.FC<{ p: number }> = ({ p }) => {
  const g = wordmarkGeom(p);
  if (g.scale < 0.002) return null;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <text
        x={g.origin}
        y={BASELINE}
        textAnchor="end"
        fill={C.ink}
        transform={`translate(${g.origin} 0) scale(${g.scale} 1) translate(${-g.origin} 0)`}
        style={{
          fontFamily: F.word,
          fontSize: SIZE,
          fontWeight: 800,
          fontVariationSettings: `'wdth' ${g.wdth.toFixed(3)}, 'wght' 800`,
        }}
      >
        Rise
      </text>
    </svg>
  );
};
