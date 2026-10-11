import React from "react";
import { C, F } from "../lib/theme";
import { cRect, exitK, gl, POP, rectLerp, sp, SOFT } from "../lib/motion";
import { Check, Mono, Rise, Shape, Words } from "../ui/kit";
import { Cursor } from "../ui/Cursor";
import { hx, PRAYER_HOURS, T } from "../script";
import { CHAIN_C, CHAIN_H, CHAIN_LAST_W } from "./Book";

export const BAR = cRect(960, 560, 1600, 14, 7);

const PRAYERS = [
  { en: "Fajr", ar: "الفجر" },
  { en: "Dhuhr", ar: "الظهر" },
  { en: "Asr", ar: "العصر" },
  { en: "Maghrib", ar: "المغرب" },
  { en: "Isha", ar: "العشاء" },
];
const BLOCKS = [
  { a: 5.25, z: 7.6, label: ["Qur'an", "& adhkār"], bg: C.emerald, fg: C.white },
  { a: 7.85, z: 12.2, label: ["Deep work", "& study"], bg: C.paper2, fg: C.ink },
  { a: 12.8, z: 15.5, label: ["Work"], bg: C.paper2, fg: C.ink },
  { a: 16, z: 18.25, label: ["Family", "& exercise"], bg: C.gold, fg: C.ink },
  { a: 18.65, z: 19.8, label: ["Learn"], bg: C.white, fg: C.ink },
  { a: 20.3, z: 22.8, label: ["Sleep", "early"], bg: C.ink, fg: C.white },
];
const BLOCK_Y = 606;
const BLOCK_H = 116;
const CLICKED = [0, 3, 5];
const blockC = (i: number) => ({ x: (hx(BLOCKS[i].a) + hx(BLOCKS[i].z)) / 2, y: BLOCK_Y + BLOCK_H / 2 });

export const Day: React.FC<{ t: number }> = ({ t }) => {
  const bar = rectLerp(cRect(CHAIN_C.x, CHAIN_C.y, CHAIN_LAST_W, CHAIN_H), BAR, gl(t, T.day, 0.8));
  const OUT = T.dayOut;
  return (
    <>
      <div style={{ position: "absolute", left: -400, top: -400, right: -400, bottom: -400, background: C.paper }} />
      <div style={{ position: "absolute", left: 160, top: 110, width: 1600 }}>
        <Rise t={t} at={T.dayOverview + 0.3} out={OUT}>
          <Mono>05 — Organize your day</Mono>
        </Rise>
        <div style={{ height: 20 }} />
        <div style={{ position: "relative", height: 150 }}>
          <div style={{ position: "absolute", inset: 0 }}>
            <Words t={t} at={T.dayOverview + 0.45} out={T.daySwap} per={0.05} text="Build your day around the five prayers." style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 62, color: C.ink, letterSpacing: "-0.02em" }} />
          </div>
          <div style={{ position: "absolute", inset: 0 }}>
            <Words t={t} at={T.daySwap + 0.15} out={OUT} per={0.04} text="The prayers are the anchors. Fill the space between them with purpose." style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 54, color: C.ink, letterSpacing: "-0.02em", lineHeight: 1.15, width: 1300 }} />
          </div>
        </div>
      </div>

      {/* hour ticks ripple out from Fajr */}
      {Array.from({ length: 20 }, (_, i) => {
        const h = 4 + i;
        const k = sp(t, T.day + 0.6 + Math.abs(h - 5) * 0.035, POP) * (1 - exitK(t, OUT + i * 0.01).off);
        if (k < 0.002) return null;
        const major = h % 2 === 0;
        return (
          <div key={h} style={{ position: "absolute", left: hx(h) - 1, top: 574, width: 2, height: (major ? 16 : 9) * k, background: C.muted }}>
            {major && (
              <div style={{ position: "absolute", top: 22, left: -30, width: 60, textAlign: "center", fontFamily: F.mono, fontSize: 14, color: C.muted, transform: `scale(${k})` }}>
                {String(h).padStart(2, "0")}:00
              </div>
            )}
          </div>
        );
      })}

      <Shape rect={bar} color={C.ink} />

      {/* prayer pins: the camera tracks along as each one lands */}
      {PRAYERS.map((p, i) => {
        const k = sp(t, T.pins[i], POP) * (1 - exitK(t, OUT + i * 0.04).off);
        if (k < 0.002) return null;
        const x = hx(PRAYER_HOURS[i]);
        const stem = sp(t, T.pins[i] + 0.05, SOFT);
        return (
          <div key={p.en} style={{ position: "absolute", left: x, top: 0 }}>
            <div style={{ position: "absolute", left: -1.5, top: 470 + 72 * (1 - stem), width: 3, height: 72 * stem * k, background: C.ink }} />
            <div style={{ position: "absolute", left: -19, top: 541, width: 38, height: 38, borderRadius: 19, background: C.ink, border: `6px solid ${C.paper}`, boxSizing: "border-box", transform: `scale(${k})` }} />
            <div style={{ position: "absolute", left: -150, width: 300, top: 366, textAlign: "center", transform: `scale(${k})`, transformOrigin: "50% 100%" }}>
              <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 30, color: C.ink }}>{p.en}</div>
              <div style={{ fontFamily: F.ar, fontWeight: 600, fontSize: 26, color: C.emerald, lineHeight: 1.6 }}>{p.ar}</div>
            </div>
          </div>
        );
      })}

      {/* blocks draw across from their start */}
      {BLOCKS.map((bl, i) => {
        const k = gl(t, T.blocks + i * 0.25, 0.6);
        const e = exitK(t, OUT + i * 0.03, 0.35);
        if (k < 0.002 || e.gone) return null;
        const x = hx(bl.a);
        const w = (hx(bl.z) - x) * k;
        const ci = CLICKED.indexOf(i);
        const c = ci >= 0 ? T.dayClicks[ci] : 1e9;
        const done = sp(t, c + 0.02, POP);
        const press = sp(t, c - 0.06, { w: 60, z: 1 }) - sp(t, c + 0.05, { w: 26, z: 0.8 });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: BLOCK_Y - e.off * 40,
              width: w,
              height: BLOCK_H * (1 - e.off),
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
                  <Rise t={t} at={T.blocks + i * 0.25 + 0.25 + j * 0.04}>
                    <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 24, color: bl.fg, lineHeight: 1.2, whiteSpace: "nowrap" }}>{l}</span>
                  </Rise>
                </div>
              ))}
            </div>
            {done > 0.002 && (
              <div style={{ position: "absolute", right: 12, bottom: 12, width: 36, height: 36, borderRadius: 18, background: bl.fg, display: "grid", placeItems: "center", transform: `scale(${done})` }}>
                <Check color={bl.bg} size={24} />
              </div>
            )}
          </div>
        );
      })}

      <Cursor
        t={t}
        show={[T.dayClicks[0] - 0.7, T.dayClicks[2] + 0.45]}
        keys={[
          [T.dayClicks[0] - 0.7, 520, 900],
          [T.dayClicks[0] - 0.68, blockC(0).x + 10, blockC(0).y + 4, 0.5],
          [T.dayClicks[1] - 0.5, blockC(3).x + 10, blockC(3).y + 4, 0.45],
          [T.dayClicks[2] - 0.5, blockC(5).x + 10, blockC(5).y + 4, 0.45],
          [T.dayClicks[2] + 0.15, 1560, 860, 0.5],
        ]}
        clicks={T.dayClicks}
        hovers={T.dayClicks.map((c) => [c - 0.2, c + 0.15] as [number, number])}
      />
    </>
  );
};
