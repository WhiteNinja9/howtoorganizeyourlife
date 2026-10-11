import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, F } from "./lib/theme";

/** YouTube thumbnail, 1280×720: big promise left, the two real books right, the 5-prayer day along the bottom. */
const PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
const PRAYER_X = [0.06, 0.28, 0.5, 0.72, 0.94];

const Book: React.FC<{ src: string; x: number; y: number; rot: number; w: number }> = ({ src, x, y, rot, w }) => (
  <Img
    src={staticFile(src)}
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: w * 1.45,
      objectFit: "cover",
      borderRadius: 8,
      transform: `rotate(${rot}deg)`,
      boxShadow: "0 30px 60px rgba(0,0,0,0.45), 0 6px 14px rgba(0,0,0,0.3)",
    }}
  />
);

export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: C.emerald, overflow: "hidden" }}>
    {/* soft light behind the books */}
    <div style={{ position: "absolute", right: -120, top: -80, width: 760, height: 760, borderRadius: 380, background: "radial-gradient(circle, rgba(127,209,185,0.35), rgba(14,107,88,0) 70%)" }} />
    <Book src="img/al-fawaid.jpg" x={985} y={58} rot={7} w={250} />
    <Book src="img/al-jawab-al-kafi.jpg" x={800} y={84} rot={-6} w={262} />

    <div style={{ position: "absolute", left: 64, top: 96 }}>
      <div
        style={{
          display: "inline-block",
          background: C.ink,
          color: C.white,
          fontFamily: F.ui,
          fontWeight: 600,
          fontSize: 34,
          padding: "10px 26px",
          borderRadius: 999,
        }}
      >
        Ibn al-Qayyim's advice
      </div>
      <div
        style={{
          marginTop: 22,
          fontFamily: F.word,
          fontWeight: 800,
          fontVariationSettings: "'wdth' 125, 'wght' 800",
          fontSize: 104,
          lineHeight: 0.92,
          letterSpacing: "-0.02em",
          color: C.white,
        }}
      >
        ORGANIZE
        <br />
        <span style={{ color: C.goldSoft }}>YOUR LIFE</span>
      </div>
    </div>

    {/* the day, anchored on the five prayers */}
    <div style={{ position: "absolute", left: 64, right: 64, bottom: 78, height: 12, borderRadius: 6, background: C.white }} />
    {PRAYERS.map((p, i) => {
      const x = 64 + PRAYER_X[i] * (1280 - 128);
      return (
        <div key={p} style={{ position: "absolute", left: x, bottom: 0, width: 0 }}>
          <div style={{ position: "absolute", left: -17, bottom: 66, width: 34, height: 34, borderRadius: 17, background: C.ink, border: `6px solid ${C.white}`, boxSizing: "border-box" }} />
          <div style={{ position: "absolute", left: -100, width: 200, bottom: 108, textAlign: "center", fontFamily: F.ui, fontWeight: 700, fontSize: 30, color: C.white, textShadow: "0 2px 8px rgba(0,0,0,0.35)" }}>{p}</div>
        </div>
      );
    })}
  </AbsoluteFill>
);
