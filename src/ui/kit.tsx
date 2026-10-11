import React from "react";
import { C, F } from "../lib/theme";
import { exitK, POP, Rect, RISE, sp, Spring, SOFT } from "../lib/motion";
import widths from "../lib/widths.json";

/** Measured label width (HarfBuzz, scripts/measure.py ← scripts/labels.json). */
export const tw = (font: string, weight: number, size: number, text: string) => {
  const w = (widths as Record<string, number>)[`${font}|${weight}|${size}|${text}`];
  if (w === undefined) {
    console.warn("unmeasured label", font, weight, size, text);
    return text.length * size * 0.55;
  }
  return w;
};

/**
 * Text rising out of a mask line. Exit accelerates upward with a blur ramp (no fades in).
 */
export const Rise: React.FC<{
  t: number;
  at: number;
  out?: number;
  pad?: string;
  spring?: Spring;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ t, at, out, pad = "0.2em", spring = RISE, style, children }) => {
  const e = exitK(t, out);
  const hidden = t < at || e.gone;
  const y = (1 - sp(t, at, spring)) * 108 - e.off * 110;
  return (
    <span
      style={{
        display: "inline-block",
        overflow: "hidden",
        verticalAlign: "top",
        padding: pad,
        margin: `-${pad}`,
        visibility: hidden ? "hidden" : "inherit",
        ...style,
      }}
    >
      <span
        style={{
          display: "inline-block",
          transform: `translateY(${y}%)`,
          filter: e.blur > 0.05 ? `blur(${e.blur}px)` : undefined,
          opacity: e.op,
        }}
      >
        {children}
      </span>
    </span>
  );
};

/** Words rising one by one in reading order (RTL aware). `mark` styles chosen words. */
export const Words: React.FC<{
  t: number;
  at: number;
  out?: number;
  text: string;
  per?: number;
  rtl?: boolean;
  gap?: string;
  pad?: string;
  style?: React.CSSProperties;
  mark?: (i: number) => React.CSSProperties | undefined;
  deco?: (i: number) => React.ReactNode;
}> = ({ t, at, out, text, per = 0.05, rtl, gap = "0.27em", pad, style, mark, deco }) => {
  const words = text.split(" ");
  return (
    <div style={{ display: "flex", flexWrap: "wrap", direction: rtl ? "rtl" : "ltr", columnGap: gap, ...style }}>
      {words.map((w, i) => (
        <Rise key={i} t={t} at={at + i * per} out={out === undefined ? undefined : out + i * 0.012} pad={pad}>
          <span style={{ position: "relative", display: "inline-block", ...mark?.(i) }}>
            {w}
            {deco?.(i)}
          </span>
        </Rise>
      ))}
    </div>
  );
};

export const Shape: React.FC<{ rect: Rect; color: string; style?: React.CSSProperties; children?: React.ReactNode }> = ({
  rect,
  color,
  style,
  children,
}) => (
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

export const Mono: React.FC<{ children: React.ReactNode; color?: string; size?: number }> = ({
  children,
  color = C.muted,
  size = 20,
}) => (
  <span
    style={{
      fontFamily: F.mono,
      fontSize: size,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color,
      fontWeight: 500,
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </span>
);

/** Pops from zero on a spring; exits shrinking with acceleration. */
export const PopIn: React.FC<{
  t: number;
  at: number;
  out?: number;
  spring?: Spring;
  origin?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ t, at, out, spring = POP, origin = "center", style, children }) => {
  const e = exitK(t, out, 0.28);
  const s = sp(t, at, spring) * (1 - e.off);
  return (
    <div
      style={{
        transform: `scale(${s})`,
        transformOrigin: origin,
        visibility: s < 0.002 ? "hidden" : "inherit",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Underline that grows from the reading start on a critical spring. */
export const Underline: React.FC<{ t: number; at: number; out?: number; color: string; rtl?: boolean; h?: number }> = ({
  t,
  at,
  out,
  color,
  rtl,
  h = 5,
}) => {
  const k = sp(t, at, SOFT) * (1 - exitK(t, out, 0.25).off);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: "-0.05em",
        height: h,
        borderRadius: h,
        background: color,
        transform: `scaleX(${k})`,
        transformOrigin: rtl ? "right" : "left",
      }}
    />
  );
};

export const Check: React.FC<{ size?: number; color: string; stroke?: number }> = ({ size = 28, color, stroke = 3 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M5 12.5 L10 17.5 L19 7" stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Outlined reference chip. */
export const RefChip: React.FC<{ t: number; at: number; out?: number; color: string; children: React.ReactNode }> = ({
  t,
  at,
  out,
  color,
  children,
}) => (
  <PopIn t={t} at={at} out={out} style={{ display: "inline-block" }}>
    <div
      style={{
        border: `2px solid ${color}`,
        color,
        borderRadius: 999,
        padding: "9px 24px",
        fontFamily: F.mono,
        fontSize: 21,
        letterSpacing: "0.08em",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  </PopIn>
);

/** Number with every digit in a fixed-width slot (no sideways jumps while counting). */
export const Digits: React.FC<{ value: string; slot: number; style?: React.CSSProperties }> = ({ value, slot, style }) => (
  <span style={{ display: "inline-flex", ...style }}>
    {Array.from(value).map((ch, i) => (
      <span key={i} style={{ display: "inline-block", width: /[0-9]/.test(ch) ? slot : "auto", textAlign: "center" }}>
        {ch}
      </span>
    ))}
  </span>
);

/** The goo filter: blur + alpha threshold. Apply only during splits/merges, ramping `blur` in and out. */
export const GooDefs: React.FC<{ id: string; blur: number }> = ({ id, blur }) => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <defs>
      <filter id={id} x="-20%" y="-50%" width="140%" height="200%" colorInterpolationFilters="sRGB">
        <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="b" />
        <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" result="g" />
        <feComposite in="SourceGraphic" in2="g" operator="atop" />
      </filter>
    </defs>
  </svg>
);
