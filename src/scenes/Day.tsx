import React from "react";
import { AbsoluteFill } from "remotion";
import { b, cRect, POP, rectLerp, sp, SOFT, SNAP } from "../lib/anim";
import { C, F } from "../lib/theme";
import { Mono, Rise, Shape, Words } from "../ui/primitives";
import { Check } from "../ui/Quote";
import { Cursor } from "../ui/Cursor";
import { Hud } from "../ui/Hud";
import { Sfx, T } from "../timeline";
import { CHAIN_C, CHAIN_H, CHAIN_LAST_W } from "./Book";

const d = (beats: number) => T.day + b(beats);
const OUT = d(20);

export const BAR = cRect(960, 560, 1600, 14, 7);
const hx = (h: number) => 160 + ((h - 4) / 19) * 1600;

const PRAYERS = [
  { en: "Fajr", ar: "الفجر", h: 5 },
  { en: "Dhuhr", ar: "الظهر", h: 12.5 },
  { en: "Asr", ar: "العصر", h: 15.75 },
  { en: "Maghrib", ar: "المغرب", h: 18.5 },
  { en: "Isha", ar: "العشاء", h: 20 },
];

const BLOCKS = [
  { a: 5.25, z: 7.6, label: ["Qur'an", "& adhkār"], bg: C.emerald, fg: C.white },
  { a: 7.85, z: 12.2, label: ["Deep work", "& study"], bg: C.paper2, fg: C.ink },
  { a: 12.8, z: 15.5, label: ["Work"], bg: C.paper2, fg: C.ink },
  { a: 16, z: 18.25, label: ["Family", "& exercise"], bg: C.gold, fg: C.ink },
  { a: 18.65, z: 19.8, label: ["Learn"], bg: C.white, fg: C.ink },
  { a: 20.3, z: 22.8, label: ["Sleep", "early"], bg: C.ink, fg: C.white },
];
const BLOCK_Y = 612;
const BLOCK_H = 116;
const CLICKS = [d(15), d(16), d(17)];
const CLICKED = [0, 3, 5];

export const DAY_SFX: Sfx[] = [
  { f: d(0), kind: "drag" },
  { f: d(1.5), kind: "rise" },
  ...PRAYERS.map((_, i) => ({ f: d(3 + i), kind: "pop" as const })),
  ...BLOCKS.map((_, i) => ({ f: d(8 + i), kind: "draw" as const })),
  ...CLICKS.map((f) => ({ f, kind: "check" as const })),
  { f: d(18), kind: "swap" },
  { f: OUT, kind: "swap" },
];

export const Day: React.FC<{ frame: number }> = ({ frame }) => {
  const bar = rectLerp(cRect(CHAIN_C.x, CHAIN_C.y, CHAIN_LAST_W, CHAIN_H), BAR, sp(frame, d(0), SOFT));

  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <div style={{ position: "absolute", left: 160, top: 120, width: 1600 }}>
        <Rise frame={frame} at={d(1)} out={OUT}>
          <Mono>06 — Organize your day</Mono>
        </Rise>
        <div style={{ height: 22 }} />
        <div style={{ position: "relative", height: 150 }}>
          <div style={{ position: "absolute", inset: 0 }}>
            <Words
              frame={frame}
              at={d(1.5)}
              out={d(18)}
              stagger={2}
              text="Build your day around the five prayers."
              style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 60, color: C.ink, letterSpacing: "-0.02em" }}
            />
          </div>
          <div style={{ position: "absolute", inset: 0 }}>
            <Words
              frame={frame}
              at={d(18) + 4}
              out={OUT}
              stagger={2}
              text="The prayers are the anchors. Fill the space between them with purpose."
              style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 52, color: C.ink, letterSpacing: "-0.02em", lineHeight: 1.15, width: 1300 }}
            />
          </div>
        </div>
      </div>

      {/* hour ticks */}
      {Array.from({ length: 20 }, (_, i) => {
        const h = 4 + i;
        const k = sp(frame, d(2) + i, POP) * (1 - sp(frame, OUT + i, SNAP));
        const major = h % 2 === 0;
        return (
          <div key={h} style={{ position: "absolute", left: hx(h), top: 576, transform: `translateX(-50%) scale(${k})`, transformOrigin: "top center", textAlign: "center" }}>
            <div style={{ width: 2, height: major ? 14 : 8, background: C.muted, margin: "0 auto" }} />
          </div>
        );
      })}

      <Shape rect={bar} color={C.ink} />

      {/* prayer pins */}
      {PRAYERS.map((p, i) => {
        const k = sp(frame, d(3 + i), POP) * (1 - sp(frame, OUT + i * 2, SNAP));
        if (k < 0.001) return null;
        const x = hx(p.h);
        return (
          <div key={p.en} style={{ position: "absolute", left: x, top: 0 }}>
            <div style={{ position: "absolute", left: -1.5, top: 470 + 70 * (1 - k), width: 3, height: 70 * k, background: C.ink }} />
            <div style={{ position: "absolute", left: -18, top: 542, width: 36, height: 36, borderRadius: 18, background: C.ink, border: `6px solid ${C.paper}`, boxSizing: "border-box", transform: `scale(${k})` }} />
            <div style={{ position: "absolute", left: -150, width: 300, top: 368, textAlign: "center", transform: `scale(${k})`, transformOrigin: "bottom center" }}>
              <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 30, color: C.ink }}>{p.en}</div>
              <div style={{ fontFamily: F.ar, fontWeight: 700, fontSize: 28, color: C.emerald, lineHeight: 1.5 }}>{p.ar}</div>
            </div>
          </div>
        );
      })}

      {/* blocks draw across from their start */}
      {BLOCKS.map((bl, i) => {
        const k = sp(frame, d(8 + i), SOFT);
        const o = 1 - sp(frame, OUT + i, SNAP);
        if (k < 0.001 || o < 0.001) return null;
        const x = hx(bl.a);
        const w = (hx(bl.z) - x) * k;
        const ci = CLICKED.indexOf(i);
        const done = ci >= 0 ? sp(frame, CLICKS[ci] + 1, POP) : 0;
        const press = ci >= 0 ? sp(frame, CLICKS[ci] - 4, { damping: 30, stiffness: 600 }) - sp(frame, CLICKS[ci] + 3, { damping: 18, stiffness: 300 }) : 0;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: BLOCK_Y,
              width: w,
              height: BLOCK_H * o,
              borderRadius: 18,
              background: bl.bg,
              border: bl.bg === C.white ? `2px solid ${C.line}` : "none",
              boxSizing: "border-box",
              transform: `scale(${1 - 0.04 * press})`,
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", left: 16, top: 16, width: 400 }}>
              {bl.label.map((l, j) => (
                <div key={l}>
                  <Rise frame={frame} at={d(8 + i) + 6 + j * 2}>
                    <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 24, color: bl.fg, lineHeight: 1.2 }}>{l}</span>
                  </Rise>
                </div>
              ))}
            </div>
            {done > 0.001 && (
              <div
                style={{
                  position: "absolute",
                  right: 12,
                  bottom: 12,
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  background: bl.fg,
                  display: "grid",
                  placeItems: "center",
                  transform: `scale(${done})`,
                }}
              >
                <Check color={bl.bg} size={24} />
              </div>
            )}
          </div>
        );
      })}

      <Cursor
        frame={frame}
        show={[d(14), d(18.5)]}
        keys={[
          { f: d(14), x: 700, y: 1040 },
          { f: d(14.2), x: (hx(BLOCKS[0].a) + hx(BLOCKS[0].z)) / 2, y: 690 },
          { f: d(15.4), x: (hx(BLOCKS[3].a) + hx(BLOCKS[3].z)) / 2, y: 690 },
          { f: d(16.4), x: (hx(BLOCKS[5].a) + hx(BLOCKS[5].z)) / 2, y: 690 },
          { f: d(17.6), x: 1500, y: 1000 },
        ]}
        clicks={CLICKS}
      />
      <Hud frame={frame} at={d(1)} out={OUT} index={6} color={C.ink} />
    </AbsoluteFill>
  );
};
