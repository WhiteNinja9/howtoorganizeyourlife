import React from "react";
import { C, F } from "../lib/theme";
import { exitK, flood, gl, glideKeys, hash, Rect, sp, SOFT } from "../lib/motion";
import { Rise, Shape } from "../ui/kit";
import { Cursor } from "../ui/Cursor";
import { WordmarkLetters, wordmarkGeom } from "../ui/Wordmark";
import { NIGHT } from "../ui/Lids";
import { T } from "./script";

/** Open: "Rise." squeezes into its dot, the dot floods black — the eyes open on a phone at 1:47 AM. */
const PHONE: Rect = { x: 760, y: 150, w: 400, h: 820, r: 58 };
const CARD_H = 380;
const CARD_HUES = [
  ["#2B3A4A", "#4C6378"],
  ["#3A3328", "#6E5B44"],
  ["#23383A", "#3F6669"],
  ["#4A2F36", "#8A5A60"], // "that" card — never shown, only blurred
  ["#2E2E3E", "#55557A"],
];

const Card: React.FC<{ i: number; y: number; blurred: boolean }> = ({ i, y, blurred }) => (
  <div style={{ position: "absolute", left: 18, right: 18, top: y, height: CARD_H - 24 }}>
    <div
      style={{
        position: "absolute",
        inset: "0 0 64px 0",
        borderRadius: 24,
        background: `linear-gradient(140deg, ${CARD_HUES[i][0]}, ${CARD_HUES[i][1]})`,
        filter: blurred ? "blur(18px)" : undefined,
        overflow: "hidden",
      }}
    >
      {!blurred &&
        [0, 1, 2].map((k) => (
          <div
            key={k}
            style={{
              position: "absolute",
              left: `${10 + hash(i * 7 + k) * 60}%`,
              top: `${12 + hash(i * 11 + k) * 60}%`,
              width: 60 + hash(i + k * 3) * 90,
              height: 60 + hash(i + k * 3) * 90,
              borderRadius: 999,
              background: "rgba(255,255,255,0.07)",
            }}
          />
        ))}
    </div>
    <div style={{ position: "absolute", left: 4, bottom: 30, width: "70%", height: 12, borderRadius: 6, background: "rgba(255,255,255,0.22)" }} />
    <div style={{ position: "absolute", left: 4, bottom: 8, width: "42%", height: 10, borderRadius: 5, background: "rgba(255,255,255,0.12)" }} />
  </div>
);

export const Night: React.FC<{ t: number }> = ({ t }) => {
  const p = gl(t, T.squeeze, 0.8);
  const g = wordmarkGeom(p);
  const opening = t < T.dotFlood + 0.5;
  const scroll = glideKeys(t, 0, T.swipes.map((s, i) => [s + 0.05, CARD_H * (i + 1), 0.5] as [number, number, number]));
  const phoneIn = sp(t, T.eyesOpen - 0.2, SOFT);

  if (opening) {
    return (
      <>
        <div style={{ position: "absolute", left: -600, top: -600, right: -600, bottom: -600, background: C.paper }} />
        <WordmarkLetters p={p} />
        <Shape rect={t >= T.dotFlood ? flood(t, T.dotFlood, g.dot, 0.42) : g.dot} color={t >= T.dotFlood ? NIGHT : C.ink} />
      </>
    );
  }
  return (
    <>
      {/* a dark room; the only light is the phone */}
      <div style={{ position: "absolute", left: -600, top: -600, right: -600, bottom: -600, background: "#040607" }} />
      <div
        style={{
          position: "absolute",
          left: 960 - 900,
          top: 560 - 700,
          width: 1800,
          height: 1400,
          borderRadius: 999,
          background: "radial-gradient(closest-side, rgba(120,150,180,0.14), rgba(120,150,180,0))",
          opacity: phoneIn,
        }}
      />
      <Shape rect={PHONE} color="#141518" style={{ boxShadow: "0 40px 80px rgba(0,0,0,0.6)" }}>
        <div style={{ position: "absolute", inset: 12, borderRadius: 48, background: "#0D1015", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 70, bottom: 0, overflow: "hidden" }}>
            {CARD_HUES.map((_, i) => (
              <Card key={i} i={i} y={10 + i * CARD_H - scroll} blurred={i === 3} />
            ))}
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 30px", fontFamily: F.ui, fontWeight: 600, fontSize: 22, color: "#E8E8EA" }}>
            <span>1:47</span>
            <span style={{ display: "inline-block", width: 34, height: 15, borderRadius: 4, border: "2px solid #E8E8EA", position: "relative" }}>
              <span style={{ position: "absolute", left: 2, top: 2, bottom: 2, width: 7, borderRadius: 2, background: "#E8605A" }} />
            </span>
          </div>
          <div style={{ position: "absolute", left: "50%", top: 14, width: 110, height: 32, marginLeft: -55, borderRadius: 16, background: "#000" }} />
        </div>
      </Shape>

      {/* the voice in your head */}
      {[
        ["One more scroll.", T.lines[0], T.lines[1] - 0.15],
        ["One more look.", T.lines[1], T.heavyBlink],
      ].map(([txt, at, out]) => (
        <div key={txt as string} style={{ position: "absolute", left: 160, width: 560, top: 470, textAlign: "right" }}>
          <Rise t={t} at={at as number} out={out as number}>
            <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 50, color: "rgba(255,255,255,0.86)", letterSpacing: "-0.01em" }}>{txt}</span>
          </Rise>
        </div>
      ))}
      {t >= T.theCard && (
        <div style={{ position: "absolute", left: 1200, top: 480, opacity: 1 - exitK(t, T.bilal - 0.4, 0.3).off }}>
          <Rise t={t} at={T.theCard + 0.3} out={T.bilal - 0.4}>
            <span style={{ fontFamily: F.mono, fontSize: 22, letterSpacing: "0.14em", color: "rgba(255,255,255,0.6)" }}>YOU KNOW THE ONE.</span>
          </Rise>
        </div>
      )}

      <Cursor
        t={t}
        show={[T.swipes[0] - 0.5, T.theCard + 0.6]}
        keys={[
          [T.swipes[0] - 0.5, 1230, 900],
          [T.swipes[0] - 0.48, 990, 780, 0.4],
          ...T.swipes.flatMap((s) => [
            [s, 990, 470, 0.28] as [number, number, number, number],
            [s + 0.36, 990, 780, 0.4] as [number, number, number, number],
          ]),
          [T.theCard + 0.2, 1240, 960, 0.5],
        ]}
        holds={T.swipes.map((s) => [s - 0.02, s + 0.26] as [number, number])}
      />
    </>
  );
};
