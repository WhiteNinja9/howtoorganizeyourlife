import React from "react";
import { AbsoluteFill } from "remotion";
import { C, F } from "./lib/theme";

/**
 * YouTube channel banner, 2560×1440. Everything important sits in the 1546×423 area that every
 * device shows (x 507–2053, y 508–931); the prayer line runs the full width for TV / desktop.
 */
const SAFE = { x: 507, y: 508, w: 1546, h: 423 };
const PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
const LINE_Y = 884;

export const Banner: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper, overflow: "hidden" }}>
    {/* soft emerald light, mostly outside the safe area */}
    <div style={{ position: "absolute", left: -500, top: -700, width: 1800, height: 1800, borderRadius: 900, background: "radial-gradient(circle, rgba(14,107,88,0.10), rgba(14,107,88,0) 65%)" }} />
    <div style={{ position: "absolute", right: -600, bottom: -900, width: 2000, height: 2000, borderRadius: 1000, background: "radial-gradient(circle, rgba(201,162,74,0.12), rgba(201,162,74,0) 65%)" }} />

    {/* wordmark + pill */}
    <div style={{ position: "absolute", left: SAFE.x, width: SAFE.w, top: SAFE.y + 18, display: "flex", alignItems: "center", justifyContent: "center", gap: 44 }}>
      <div
        style={{
          fontFamily: F.word,
          fontWeight: 800,
          fontVariationSettings: "'wdth' 125, 'wght' 800",
          fontSize: 190,
          lineHeight: 1,
          color: C.ink,
          letterSpacing: "-0.01em",
        }}
      >
        Rise<span style={{ color: C.emerald }}>.</span>
      </div>
      <div style={{ background: C.ink, color: C.white, fontFamily: F.ui, fontWeight: 600, fontSize: 52, padding: "18px 40px", borderRadius: 999, whiteSpace: "nowrap" }}>
        for the Ummah
      </div>
    </div>

    <div style={{ position: "absolute", left: SAFE.x, width: SAFE.w, top: SAFE.y + 214, textAlign: "center", fontFamily: F.ui, fontSize: 40, color: C.ink2, letterSpacing: "-0.005em" }}>
      Short Islamic reminders to organize your life, one small deed at a time.
    </div>

    {/* the day, anchored on the five prayers (full width for TV, pins inside the safe area) */}
    <div style={{ position: "absolute", left: 0, right: 0, top: LINE_Y - 5, height: 10, borderRadius: 5, background: C.ink }} />
    {PRAYERS.map((p, i) => {
      const x = SAFE.x + 120 + (i * (SAFE.w - 240)) / 4;
      return (
        <div key={p} style={{ position: "absolute", left: x, top: 0, width: 0 }}>
          <div style={{ position: "absolute", left: -20, top: LINE_Y - 20, width: 40, height: 40, borderRadius: 20, background: i === 0 ? C.emerald : C.ink, border: `7px solid ${C.paper}`, boxSizing: "border-box" }} />
          <div style={{ position: "absolute", left: -120, width: 240, top: LINE_Y - 70, textAlign: "center", fontFamily: F.mono, fontSize: 26, letterSpacing: "0.14em", textTransform: "uppercase", color: i === 0 ? C.emerald : C.muted }}>
            {p}
          </div>
        </div>
      );
    })}
  </AbsoluteFill>
);
