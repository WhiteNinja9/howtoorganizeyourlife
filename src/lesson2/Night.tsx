import React from "react";
import { C, F } from "../lib/theme";
import { flood, gl, lerp, multi, sp, SOFT, TINY } from "../lib/motion";
import { Rise, Shape } from "../ui/kit";
import { Cursor } from "../ui/Cursor";
import { WordmarkLetters, wordmarkGeom } from "../ui/Wordmark";
import { NIGHT } from "../ui/Lids";
import { T } from "./script";

/**
 * Open: "Rise." squeezes into its dot, the dot floods black — the eyes open on a phone at 1:47 AM.
 * A full-screen vertical-video feed snaps post to post; the room is lit by whatever is on screen.
 * The third swipe lands on a "Sensitive content" screen. The cursor hovers "See post"… and the eyes close.
 */
const PH = { x: 760, y: 112, w: 400, h: 856, r: 64 };
const BEZ = 9;
const SW = PH.w - BEZ * 2;
const SH = PH.h - BEZ * 2;
/** room light per post (dark → dark, so a straight mix stays clean) */
const GLOW = [
  [40, 110, 160],
  [196, 106, 74],
  [70, 130, 110],
  [150, 70, 90],
];

const Post0: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(172deg, #08121F 0%, #0F2A45 52%, #1B4F6B 78%, #0A1B2A 100%)" }}>
    <div style={{ position: "absolute", left: 238 + Math.sin(t * 0.6) * 6, top: 168, width: 54, height: 54, borderRadius: 27, background: "#EAF2F8", boxShadow: "0 0 0 10px rgba(234,242,248,0.05)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 560, height: 2, background: "rgba(200,225,240,0.25)" }} />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <div key={i} style={{ position: "absolute", left: 60 + i * 44 + Math.sin(t * 1.3 + i) * 10, top: 590 + i * 22, width: 120 - i * 10, height: 2, borderRadius: 1, background: "rgba(220,235,245,0.22)" }} />
    ))}
  </div>
);
const Post1: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #120E22 0%, #2E2140 40%, #8B4A44 74%, #D9875A 100%)" }}>
    <div style={{ position: "absolute", left: 120, top: 470 - Math.sin(t * 0.5) * 6, width: 150, height: 150, borderRadius: 75, background: "radial-gradient(circle, #F4C08A, #E0874F 70%)" }} />
    {[
      [0, 520, 70, 300],
      [64, 470, 54, 350],
      [112, 560, 80, 260],
      [186, 430, 46, 390],
      [226, 500, 70, 320],
      [290, 455, 92, 365],
    ].map(([x, y, w, h], i) => (
      <div key={i} style={{ position: "absolute", left: x, top: y, width: w, height: h, background: "#0D0A16" }}>
        {[0, 1, 2].map((k) => (
          <div key={k} style={{ position: "absolute", left: 10 + k * 14, top: 24 + ((i * 37 + k * 53) % 90), width: 5, height: 7, background: "rgba(255,200,130,0.5)" }} />
        ))}
      </div>
    ))}
  </div>
);
const Post2: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #0B1714 0%, #183A31 50%, #5C8170 82%, #A6BBA9 100%)" }}>
    {[0, 1, 2, 3, 4, 5, 6].map((i) => {
      const h = 220 + ((i * 71) % 160);
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: -20 + i * 62 + Math.sin(t * 0.4 + i) * 2,
            top: 640 - h,
            width: 0,
            height: 0,
            borderLeft: "38px solid transparent",
            borderRight: "38px solid transparent",
            borderBottom: `${h}px solid ${i % 2 ? "#0C1F1A" : "#12302A"}`,
          }}
        />
      );
    })}
    <div style={{ position: "absolute", left: 0, right: 0, top: 560, height: 120, background: "linear-gradient(180deg, rgba(200,220,210,0), rgba(200,220,210,0.25), rgba(200,220,210,0))" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 640, bottom: 0, background: "#0A1512" }} />
  </div>
);
/** The sensitive post: never shown — only the platform's warning over a heavy blur. */
const Post3: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, background: "#1A1013", overflow: "hidden" }}>
    <div style={{ position: "absolute", inset: -60, background: "radial-gradient(ellipse at 45% 40%, #9A5A62, #5A2E38 45%, #1E1216 80%)", filter: "blur(36px)" }} />
    <div style={{ position: "absolute", inset: 0, background: "rgba(10,8,10,0.38)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, textAlign: "center", padding: "0 44px" }}>
      <svg width={54} height={54} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12s3.5-6.5 9-6.5S21 12 21 12s-3.5 6.5-9 6.5S3 12 3 12Z" />
        <circle cx={12} cy={12} r={2.8} />
        <path d="M4 4l16 16" />
      </svg>
      <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 24, color: "#fff" }}>Sensitive content</div>
      <div style={{ fontFamily: F.ui, fontSize: 16, lineHeight: 1.4, color: "rgba(255,255,255,0.75)" }}>
        This post may contain content that some people may find upsetting.
      </div>
    </div>
    <div style={{ position: "absolute", left: 24, right: 24, bottom: 120, height: 1, background: "rgba(255,255,255,0.18)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 64, textAlign: "center", fontFamily: F.ui, fontWeight: 600, fontSize: 19, color: "#fff" }}>See post</div>
  </div>
);
const POSTS = [Post0, Post1, Post2];

const Icon: React.FC<{ d: string; label: string; y: number }> = ({ d, label, y }) => (
  <div style={{ position: "absolute", right: 14, top: y, width: 58, textAlign: "center" }}>
    <svg width={34} height={34} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.5))" }}>
      <path d={d} />
    </svg>
    <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 12, color: "#fff", marginTop: 2, textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>{label}</div>
  </div>
);
const FeedUI: React.FC<{ t: number; i: number }> = ({ t, i }) => (
  <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 70, display: "flex", justifyContent: "center", gap: 22, fontFamily: F.ui, fontSize: 17, fontWeight: 600 }}>
      <span style={{ color: "rgba(255,255,255,0.6)" }}>Following</span>
      <span style={{ color: "#fff", borderBottom: "2px solid #fff", paddingBottom: 4 }}>For You</span>
    </div>
    <Icon y={430} label={["98.2K", "41.7K", "12.9K"][i] ?? ""} d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
    <Icon y={512} label={["1,204", "873", "402"][i] ?? ""} d="M20 12a8 8 0 0 1-11.5 7.2L4 20l1-4A8 8 0 1 1 20 12Z" />
    <Icon y={594} label="Share" d="M14 5l7 7-7 7M21 12H9a6 6 0 0 0-6 6" />
    <div style={{ position: "absolute", left: 18, right: 90, bottom: 58 }}>
      <div style={{ width: 120, height: 12, borderRadius: 6, background: "rgba(255,255,255,0.9)", marginBottom: 10 }} />
      <div style={{ width: "92%", height: 9, borderRadius: 5, background: "rgba(255,255,255,0.55)", marginBottom: 7 }} />
      <div style={{ width: "64%", height: 9, borderRadius: 5, background: "rgba(255,255,255,0.4)" }} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 26, height: 2, background: "rgba(255,255,255,0.2)" }}>
      <div style={{ width: `${((t * 9 + i * 23) % 100).toFixed(2)}%`, height: "100%", background: "rgba(255,255,255,0.85)" }} />
    </div>
  </>
);

export const Night: React.FC<{ t: number }> = ({ t }) => {
  const p = gl(t, T.squeeze, 0.8);
  const g = wordmarkGeom(p);
  if (t < T.dotFlood + 0.5) {
    return (
      <>
        <div style={{ position: "absolute", left: -600, top: -600, right: -600, bottom: -600, background: C.paper }} />
        <WordmarkLetters p={p} />
        <Shape rect={t >= T.dotFlood ? flood(t, T.dotFlood, g.dot, 0.42) : g.dot} color={t >= T.dotFlood ? NIGHT : C.ink} />
      </>
    );
  }
  // snap scrolling with a small overshoot, one post per swipe
  const idx = multi(t, 0, T.swipes.map((s, i) => [s + 0.04, i + 1, TINY] as [number, number, typeof TINY]));
  const scroll = idx * SH;
  const k = Math.max(0, Math.min(3, idx));
  const a = Math.floor(Math.min(2.999, k));
  const glow = GLOW[a].map((v, j) => Math.round(lerp(v, GLOW[a + 1][j], k - a)));
  const lit = sp(t, T.eyesOpen - 0.3, SOFT);
  return (
    <>
      <div style={{ position: "absolute", left: -600, top: -600, right: -600, bottom: -600, background: "#030405" }} />
      {/* the room, lit only by the screen (its colour follows the post) */}
      <div
        style={{
          position: "absolute",
          left: 960 - 1100,
          top: 540 - 820,
          width: 2200,
          height: 1640,
          borderRadius: 9999,
          background: `radial-gradient(closest-side, rgba(${glow.join(",")},0.20), rgba(${glow.join(",")},0.06) 55%, rgba(0,0,0,0))`,
          opacity: lit,
        }}
      />
      {/* phone: titanium frame, buttons, screen */}
      <div style={{ position: "absolute", left: PH.x - 3, top: PH.y + 170, width: 4, height: 64, borderRadius: 2, background: "#2A2B2F" }} />
      <div style={{ position: "absolute", left: PH.x - 3, top: PH.y + 250, width: 4, height: 64, borderRadius: 2, background: "#2A2B2F" }} />
      <div style={{ position: "absolute", left: PH.x + PH.w - 1, top: PH.y + 210, width: 4, height: 100, borderRadius: 2, background: "#2A2B2F" }} />
      <Shape
        rect={PH}
        color="linear-gradient(135deg, #4A4B50, #1C1D21 30%, #121316 60%, #3A3B40)"
        style={{ boxShadow: `0 50px 100px rgba(0,0,0,0.65), 0 0 120px rgba(${glow.join(",")},0.12)` }}
      >
        <div style={{ position: "absolute", left: BEZ, top: BEZ, width: SW, height: SH, borderRadius: PH.r - BEZ, background: "#000", overflow: "hidden" }}>
          {POSTS.map((P, i) => (
            <div key={i} style={{ position: "absolute", left: 0, top: i * SH - scroll, width: SW, height: SH }}>
              <P t={t} />
              <FeedUI t={t} i={i} />
            </div>
          ))}
          <div style={{ position: "absolute", left: 0, top: 3 * SH - scroll, width: SW, height: SH }}>
            <Post3 />
          </div>
          {/* status bar + island */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 34px", fontFamily: F.ui, fontWeight: 600, fontSize: 18, color: "#fff" }}>
            <span>1:47</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14 }}>
              9%
              <span style={{ display: "inline-block", width: 30, height: 14, borderRadius: 4, border: "1.6px solid rgba(255,255,255,0.85)", position: "relative" }}>
                <span style={{ position: "absolute", left: 2, top: 2, bottom: 2, width: 4, borderRadius: 1, background: "#FF5A4F" }} />
              </span>
            </span>
          </div>
          <div style={{ position: "absolute", left: "50%", top: 12, width: 112, height: 33, marginLeft: -56, borderRadius: 17, background: "#000" }} />
        </div>
      </Shape>

      {/* the voice in your head */}
      {[
        ["One more scroll.", T.lines[0], T.lines[1] - 0.15],
        ["One more look.", T.lines[1], T.heavyBlink],
      ].map(([txt, at, out]) => (
        <div key={txt as string} style={{ position: "absolute", left: 140, width: 560, top: 470, textAlign: "right" }}>
          <Rise t={t} at={at as number} out={out as number}>
            <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 50, color: "rgba(255,255,255,0.88)", letterSpacing: "-0.01em" }}>{txt}</span>
          </Rise>
        </div>
      ))}

      <Cursor
        t={t}
        show={[T.swipes[0] - 0.5, T.heavyBlink + 1.0]}
        keys={[
          [T.swipes[0] - 0.5, 1230, 900],
          [T.swipes[0] - 0.48, 990, 800, 0.4],
          ...T.swipes.flatMap((s) => [
            [s, 990, 470, 0.28] as [number, number, number, number],
            [s + 0.36, 990, 800, 0.4] as [number, number, number, number],
          ]),
          [T.theCard + 0.15, 975, PH.y + BEZ + SH - 58, 0.5],
        ]}
        holds={T.swipes.map((s) => [s - 0.02, s + 0.26] as [number, number])}
        hovers={[[T.theCard + 0.55, T.heavyBlink + 1.0]]}
      />
    </>
  );
};

