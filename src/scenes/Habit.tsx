import React from "react";
import { C, F } from "../lib/theme";
import { exitK, flood, gl, POP, Rect, rectLerp, sp, tq } from "../lib/motion";
import { Digits, Mono, RefChip, Rise, Shape, Words } from "../ui/kit";
import { Cursor } from "../ui/Cursor";
import { T } from "../script";
import { BAR } from "./Day";

const CELL = 72;
const GAP = 14;
const COLS = 14;
const X0 = 960 - (COLS * CELL + (COLS - 1) * GAP) / 2;
const Y0 = 650;
const cell = (i: number): Rect => ({ x: X0 + (i % COLS) * (CELL + GAP), y: Y0 + Math.floor(i / COLS) * (CELL + GAP), w: CELL, h: CELL, r: 16 });
const FILL = (i: number) => T.fills + (i - 1) * 0.077;
const LAST = cell(27);
const OUT = T.habitClick - 0.05;

export const Habit: React.FC<{ t: number }> = ({ t }) => {
  const h = T.habit;
  const first = rectLerp(BAR, cell(0), gl(t, h, 0.8));
  let filled = 1;
  for (let i = 1; i < 27; i++) if (tq(t) >= FILL(i)) filled++;
  if (tq(t) >= T.habitClick) filled = 28;
  const press = sp(t, T.habitClick - 0.06, { w: 60, z: 1 }) - sp(t, T.habitClick + 0.05, { w: 26, z: 0.8 });

  return (
    <>
      <div style={{ position: "absolute", left: -400, top: -400, right: -400, bottom: -400, background: C.paper }} />
      <div style={{ position: "absolute", left: 96, top: 84 }}>
        <Rise t={t} at={h + 0.3} out={OUT}>
          <Mono>06 — Small, but daily</Mono>
        </Rise>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 140, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Words
          t={t}
          at={h + 0.5}
          out={OUT}
          per={0.07}
          rtl
          text="أَحَبُّ الْأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا، وَإِنْ قَلَّ"
          pad="0.3em"
          style={{ fontFamily: F.ar, fontWeight: 700, fontSize: 74, color: C.emerald, lineHeight: 1.6, justifyContent: "center" }}
        />
        <div style={{ height: 14 }} />
        <div style={{ width: 1300 }}>
          <Words
            t={t}
            at={h + 1.2}
            out={OUT}
            per={0.025}
            text="“The most beloved deeds to Allah are the most consistent ones, even if they are small.”"
            style={{ fontFamily: F.ui, fontSize: 38, color: C.ink, justifyContent: "center", lineHeight: 1.35 }}
          />
        </div>
        <div style={{ height: 22 }} />
        <RefChip t={t} at={h + 1.8} out={OUT} color={C.ink}>
          AL-BUKHĀRĪ &amp; MUSLIM
        </RefChip>
      </div>

      <div style={{ position: "absolute", left: X0, top: Y0 - 72, width: COLS * (CELL + GAP) - GAP, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <Rise t={t} at={h + 2.1} out={OUT}>
          <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 34, color: C.ink }}>Two pages of Qur'an a day</span>
        </Rise>
        <Rise t={t} at={h + 2.2} out={OUT}>
          <span style={{ fontFamily: F.mono, fontSize: 24, color: C.ink, letterSpacing: "0.12em" }}>
            DAY <Digits value={String(filled).padStart(2, "0")} slot={16} /> / 28
          </span>
        </Rise>
      </div>

      {Array.from({ length: 28 }, (_, i) => {
        if (i === 0) return null;
        const r = cell(i);
        const d = Math.hypot(r.x - cell(0).x, r.y - cell(0).y);
        const k = sp(t, h + 2.0 + d * 0.0005, POP) * (1 - (i === 27 ? 0 : exitK(t, OUT + (i % 7) * 0.02, 0.3).off));
        if (k < 0.002) return null;
        const at = i === 27 ? T.habitClick : FILL(i);
        const f = sp(t, at, POP);
        const kk = k * (1 - (i === 27 ? 0.08 * press : 0));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: r.x,
              top: r.y,
              width: CELL,
              height: CELL,
              borderRadius: 16,
              border: `2px solid ${C.line}`,
              boxSizing: "border-box",
              transform: `scale(${kk})`,
              zIndex: i === 27 ? 5 : 1,
            }}
          >
            <div style={{ position: "absolute", inset: -2, borderRadius: 16, background: C.ink, transform: `scale(${f})` }} />
          </div>
        );
      })}
      <Shape rect={first} color={C.ink} style={{ transform: `scale(${1 - exitK(t, OUT, 0.3).off})` }} />
      {t >= T.flood2 && <Shape rect={flood(t, T.flood2, LAST, 0.4)} color={C.ink} style={{ zIndex: 10 }} />}

      <Cursor
        t={t}
        show={[T.habitClick - 0.75, T.habitClick + 0.2]}
        keys={[
          [T.habitClick - 0.75, 1720, 1040],
          [T.habitClick - 0.73, LAST.x + CELL / 2 + 6, LAST.y + CELL / 2 + 6, 0.5],
        ]}
        clicks={[T.habitClick]}
        hovers={[[T.habitClick - 0.25, T.habitClick + 0.2]]}
      />
    </>
  );
};
