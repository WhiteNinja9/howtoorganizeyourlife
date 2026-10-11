import React from "react";
import { SpringConfig } from "remotion";
import { C, F } from "../lib/theme";
import { Rect, sp, SOFT, SNAP } from "../lib/anim";
import widths from "../lib/widths.json";

/** Measured label width (HarfBuzz, see scripts/measure.py). */
export const tw = (font: string, weight: number, size: number, text: string) => {
  const w = (widths as Record<string, number>)[`${font}|${weight}|${size}|${text}`];
  if (w === undefined) {
    // Missing from scripts/labels.json: rough estimate so the frame still renders.
    console.warn("unmeasured label", font, weight, size, text);
    return text.length * size * 0.55;
  }
  return w;
};

/**
 * Text that rises out of a mask line. `at` = enter frame, `out` = exit frame.
 * Exits upward by default (so the next line can rise in under it).
 */
export const Rise: React.FC<{
  frame: number;
  at: number;
  out?: number;
  outDir?: 1 | -1;
  pad?: string;
  config?: Partial<SpringConfig>;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ frame, at, out, outDir = -1, pad = "0.18em", config = SOFT, style, children }) => {
  const enter = 1 - sp(frame, at, config);
  const exit = out === undefined ? 0 : sp(frame, out, SNAP);
  const y = enter * 115 + exit * 115 * outDir;
  if (frame < at || (out !== undefined && exit > 0.999)) {
    return (
      <span style={{ display: "inline-block", padding: pad, margin: `-${pad}`, visibility: "hidden", ...style }}>
        {children}
      </span>
    );
  }
  return (
    <span
      style={{
        display: "inline-block",
        overflow: "hidden",
        verticalAlign: "top",
        padding: pad,
        margin: `-${pad}`,
        ...style,
      }}
    >
      <span style={{ display: "inline-block", transform: `translateY(${y}%)` }}>{children}</span>
    </span>
  );
};

/** Words rising one by one (works for RTL too: DOM order = reading order). */
export const Words: React.FC<{
  frame: number;
  at: number;
  out?: number;
  text: string;
  stagger?: number;
  rtl?: boolean;
  gap?: string;
  style?: React.CSSProperties;
  pad?: string;
}> = ({ frame, at, out, text, stagger = 3, rtl, gap = "0.28em", style, pad }) => {
  const words = text.split(" ");
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        direction: rtl ? "rtl" : "ltr",
        columnGap: gap,
        ...style,
      }}
    >
      {words.map((w, i) => (
        <Rise
          key={i}
          frame={frame}
          at={at + i * stagger}
          out={out === undefined ? undefined : out + i * Math.max(1, Math.round(stagger / 2))}
          pad={pad}
        >
          {w}
        </Rise>
      ))}
    </div>
  );
};

export const Shape: React.FC<{
  rect: Rect;
  color: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ rect, color, style, children }) => (
  <div
    style={{
      position: "absolute",
      left: rect.x,
      top: rect.y,
      width: Math.max(0, rect.w),
      height: Math.max(0, rect.h),
      borderRadius: Math.max(0, Math.min(rect.r, rect.w / 2, rect.h / 2)),
      background: color,
      overflow: "hidden",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Small mono label used for the HUD / section markers. */
export const Mono: React.FC<{ children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties }> = ({
  children,
  color = C.muted,
  size = 20,
  style,
}) => (
  <span
    style={{
      fontFamily: F.mono,
      fontSize: size,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color,
      fontWeight: 500,
      ...style,
    }}
  >
    {children}
  </span>
);

/** Pops from zero on a spring around its own centre. */
export const Pop: React.FC<{
  frame: number;
  at: number;
  out?: number;
  config?: Partial<SpringConfig>;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ frame, at, out, config, style, children }) => {
  const s = sp(frame, at, config ?? { damping: 15, stiffness: 210, mass: 0.9 }) * (1 - (out === undefined ? 0 : sp(frame, out, SNAP)));
  return (
    <div style={{ transform: `scale(${s})`, visibility: s < 0.001 ? "hidden" : "inherit", ...style }}>{children}</div>
  );
};
