import React from "react";
import { F } from "../lib/theme";
import { Pop } from "./primitives";

/** Outlined reference chip (source of a verse / hadith / quote). */
export const RefChip: React.FC<{
  frame: number;
  at: number;
  out?: number;
  color: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ frame, at, out, color, children, style }) => (
  <Pop frame={frame} at={at} out={out} style={{ display: "inline-block", ...style }}>
    <div
      style={{
        border: `2px solid ${color}`,
        color,
        borderRadius: 999,
        padding: "10px 26px",
        fontFamily: F.mono,
        fontSize: 22,
        letterSpacing: "0.08em",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  </Pop>
);

export const Check: React.FC<{ size?: number; color: string; stroke?: number }> = ({ size = 28, color, stroke = 3 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M5 12.5 L10 17.5 L19 7" stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
