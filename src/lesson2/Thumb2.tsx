import React from "react";
import { AbsoluteFill } from "remotion";
import { C, F } from "../lib/theme";
import { NIGHT } from "../ui/Lids";
import { Post3 } from "./Night";

/** Lesson 2 thumbnails, 1280×720. "look": the 1:47 a.m. phone. "spot": one sin, one black spot. */
const WORD: React.CSSProperties = {
  fontFamily: F.word,
  fontWeight: 800,
  fontVariationSettings: "'wdth' 125, 'wght' 800",
  lineHeight: 0.92,
  letterSpacing: "-0.02em",
  color: C.white,
};

const Pill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: "inline-block", background: C.paper, color: C.ink, fontFamily: F.ui, fontWeight: 600, fontSize: 30, padding: "9px 24px", borderRadius: 999 }}>{children}</div>
);

/** the film's phone: titanium frame, island, status bar at 1:47 with 9 %, the sensitive-content screen */
const Phone: React.FC = () => {
  const w = 400;
  const h = 856;
  const bez = 9;
  return (
    <div style={{ position: "relative", width: w, height: h, borderRadius: 64, background: "linear-gradient(135deg, #5A5B60, #1C1D21 30%, #121316 60%, #44454A)", boxShadow: "0 60px 120px rgba(0,0,0,0.7)" }}>
      <div style={{ position: "absolute", inset: bez, borderRadius: 64 - bez, overflow: "hidden", background: "#000" }}>
        <Post3 />
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 34px 0", fontFamily: F.ui, fontWeight: 600, fontSize: 19, color: "#fff" }}>
          <span>1:47</span>
          <span style={{ color: "#FF5A4E" }}>9%</span>
        </div>
        <div style={{ position: "absolute", left: w / 2 - bez - 62, top: 12, width: 124, height: 36, borderRadius: 18, background: "#000" }} />
      </div>
    </div>
  );
};

const Cursor: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <svg style={{ position: "absolute", left: x, top: y, transform: `scale(${s})`, transformOrigin: "0 0", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.5))" }} width={40} height={52} viewBox="0 0 20 26">
    <path d="M2 2 L2 21 L7 16.5 L10.5 24 L13.5 22.6 L10 15.4 L17 15.4 Z" fill="#fff" stroke="#000" strokeWidth={1.4} strokeLinejoin="round" />
  </svg>
);

const Look: React.FC = () => (
  <AbsoluteFill style={{ background: NIGHT, overflow: "hidden" }}>
    {/* the screen lights the room */}
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 55% 75% at 76% 52%, rgba(150,62,82,0.5), rgba(60,22,32,0.25) 45%, rgba(7,9,10,0) 75%)" }} />
    <div style={{ position: "absolute", left: 872, top: 46, transform: "rotate(-7deg) scale(0.76)", transformOrigin: "0 0" }}>
      <Phone />
    </div>
    <Cursor x={1128} y={604} s={1.2} />

    <div style={{ position: "absolute", left: 64, top: 118 }}>
      <Pill>Ibn al-Qayyim</Pill>
      <div style={{ ...WORD, marginTop: 26, fontSize: 116 }}>
        ONE MORE
        <br />
        <span style={{ color: C.goldSoft }}>LOOK?</span>
      </div>
      <div style={{ marginTop: 34, fontFamily: F.ui, fontWeight: 600, fontSize: 40, color: "rgba(244,239,230,0.88)", letterSpacing: "-0.01em" }}>
        What it does to your heart
      </div>
    </div>
  </AbsoluteFill>
);

const Spot: React.FC = () => {
  const c = { x: 1036, y: 360, r: 190 };
  return (
    <AbsoluteFill style={{ background: NIGHT, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 50% 70% at 75% 50%, rgba(244,239,230,0.08), rgba(7,9,10,0) 70%)" }} />
      <div style={{ position: "absolute", left: c.x - c.r - 14, top: c.y - c.r - 14, width: c.r * 2 + 28, height: c.r * 2 + 28, borderRadius: c.r + 14, border: "3px solid rgba(244,239,230,0.35)", boxSizing: "border-box" }} />
      <div style={{ position: "absolute", left: c.x - c.r, top: c.y - c.r, width: c.r * 2, height: c.r * 2, borderRadius: c.r, background: C.paper, boxShadow: "0 40px 90px rgba(0,0,0,0.6)" }} />
      {/* one sin: one black spot */}
      <div style={{ position: "absolute", left: c.x - 58 - 30, top: c.y + 44 - 30, width: 60, height: 60, borderRadius: 30, background: C.ink }} />

      <div style={{ position: "absolute", left: 64, top: 130 }}>
        <Pill>The hadith of the black spot</Pill>
        <div style={{ ...WORD, marginTop: 26, fontSize: 108 }}>
          ONE SIN.
          <br />
          <span style={{ color: C.goldSoft }}>ONE SPOT.</span>
        </div>
        <div style={{ marginTop: 34, fontFamily: F.ui, fontWeight: 600, fontSize: 40, color: "rgba(244,239,230,0.88)", letterSpacing: "-0.01em" }}>
          What sins do to your heart
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Thumb2: React.FC<{ variant: "look" | "spot" }> = ({ variant }) => (variant === "look" ? <Look /> : <Spot />);
