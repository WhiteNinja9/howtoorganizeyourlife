import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, F } from "../lib/theme";
import { GooDefs } from "../ui/kit";
import { NIGHT } from "../ui/Lids";
import { HEART_C, HEART_R, SPOTS } from "./Heart";

/**
 * Lesson 2 thumbnail, 1280×720: the promise left, the stained heart (the film's own spots) right with the
 * real book behind it, and the way back along the bottom: covered → stained → polished.
 */
const HC = { x: 1000, y: 318, r: 182 };

const Disc: React.FC<{ x: number; y: number; r: number; spots: number; full?: boolean; id: string; size?: number }> = ({ x, y, r, spots, full, id, size = 1 }) => {
  const s = r / HEART_R;
  return (
    <>
    <div style={{ position: "absolute", left: x - r - 4, top: y - r - 4, width: r * 2 + 8, height: r * 2 + 8, borderRadius: r + 4, border: "2px solid rgba(244,239,230,0.45)", boxSizing: "border-box" }} />
    <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: r, background: C.paper, overflow: "hidden" }}>
      <GooDefs id={id} blur={3 + 3 * s} />
      <div style={{ position: "absolute", inset: 0, filter: `url(#${id})` }}>
        {full ? (
          <div style={{ position: "absolute", inset: 0, borderRadius: r, background: C.ink }} />
        ) : (
          SPOTS.slice(0, spots).map((p, i) => {
            const cx = r + (p.x - HEART_C.x) * s;
            const cy = r + (p.y - HEART_C.y) * s;
            const rr = p.r * s * size;
            return <div key={i} style={{ position: "absolute", left: cx - rr, top: cy - rr, width: rr * 2, height: rr * 2, borderRadius: rr, background: C.ink }} />;
          })
        )}
      </div>
    </div>
    </>
  );
};

export const Thumb2: React.FC = () => (
  <AbsoluteFill style={{ background: NIGHT, overflow: "hidden" }}>
    {/* the room at night: a low warm light from the right, like the screen-lit room in the film */}
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 90% at 78% 45%, rgba(120,40,24,0.55), rgba(7,9,10,0) 70%)" }} />

    {/* the real book behind the heart */}
    <Img
      src={staticFile("img/al-jawab-al-kafi.jpg")}
      style={{
        position: "absolute",
        left: 1040,
        top: 92,
        width: 232,
        height: 232 * 1.45,
        objectFit: "cover",
        borderRadius: 8,
        transform: "rotate(8deg)",
        boxShadow: "0 30px 60px rgba(0,0,0,0.6), 0 6px 14px rgba(0,0,0,0.4)",
      }}
    />

    {/* the stained heart */}
    <div style={{ position: "absolute", left: HC.x - HC.r - 10, top: HC.y - HC.r - 10, width: HC.r * 2 + 20, height: HC.r * 2 + 20, borderRadius: HC.r + 10, border: "3px solid rgba(244,239,230,0.5)", boxSizing: "border-box" }} />
    <div style={{ position: "absolute", left: HC.x - HC.r, top: HC.y - HC.r, width: HC.r * 2, height: HC.r * 2, borderRadius: HC.r, boxShadow: "0 30px 70px rgba(0,0,0,0.6)" }} />
    <Disc x={HC.x} y={HC.y} r={HC.r} spots={30} size={0.62} id="th-main" />
    <div style={{ position: "absolute", left: HC.x - 200, width: 400, top: HC.y + HC.r + 22, textAlign: "center", fontFamily: F.mono, fontSize: 22, letterSpacing: "0.14em", color: "rgba(244,239,230,0.7)" }}>
      YOUR HEART
    </div>

    {/* the promise */}
    <div style={{ position: "absolute", left: 64, top: 84 }}>
      <div
        style={{
          display: "inline-block",
          background: C.paper,
          color: C.ink,
          fontFamily: F.ui,
          fontWeight: 600,
          fontSize: 32,
          padding: "10px 26px",
          borderRadius: 999,
        }}
      >
        Ibn al-Qayyim
      </div>
      <div
        style={{
          marginTop: 22,
          fontFamily: F.word,
          fontWeight: 800,
          fontVariationSettings: "'wdth' 125, 'wght' 800",
          fontSize: 84,
          lineHeight: 0.94,
          letterSpacing: "-0.02em",
          color: C.white,
        }}
      >
        WHAT SINS
        <br />
        DO TO YOUR
        <br />
        <span style={{ color: C.goldSoft }}>HEART</span>
      </div>
    </div>

    {/* the way back: covered → stained → polished */}
    <div style={{ position: "absolute", left: 64, top: 548, display: "flex", alignItems: "center", gap: 18 }}>
      {[
        { spots: 0, full: true },
        { spots: 12, full: false },
        { spots: 0, full: false },
      ].map((d, i) => (
        <React.Fragment key={i}>
          {i > 0 && (
            <svg width={34} height={20} viewBox="0 0 34 20">
              <path d="M2 10 H30 M22 3 L30 10 L22 17" stroke={C.goldSoft} strokeWidth={3.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          <div style={{ position: "relative", width: 76, height: 76 }}>
            <Disc x={38} y={38} r={38} spots={d.spots} full={d.full} id={`th-s${i}`} />
          </div>
        </React.Fragment>
      ))}
      <div style={{ marginLeft: 14, fontFamily: F.ar, fontWeight: 700, fontSize: 40, color: C.mint, lineHeight: 1.6 }}>أستغفر الله</div>
    </div>
  </AbsoluteFill>
);
