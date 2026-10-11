import React from "react";
import { AbsoluteFill } from "remotion";
import { b, FLOOD, floodRect, POP, Rect, rectLerp, sp, SOFT, SNAP } from "../lib/anim";
import { C, F } from "../lib/theme";
import { Mono, Rise, Shape, Words } from "../ui/primitives";
import { RefChip } from "../ui/Quote";
import { Cursor } from "../ui/Cursor";
import { Hud } from "../ui/Hud";
import { Sfx, T } from "../timeline";
import { BAR } from "./Day";

const h = (beats: number) => T.habit + b(beats);
const OUT = h(9);
const CELL = 72;
const GAP = 14;
const COLS = 14;
const X0 = 960 - (COLS * CELL + (COLS - 1) * GAP) / 2;
const Y0 = 640;
const cell = (i: number): Rect => ({
  x: X0 + (i % COLS) * (CELL + GAP),
  y: Y0 + Math.floor(i / COLS) * (CELL + GAP),
  w: CELL,
  h: CELL,
  r: 16,
});
const FILL = (i: number) => h(4.5) + (i - 1) * 3; // days 2..27
const CLICK = h(9);
const FLOOD_AT = h(9.5);
const LAST = cell(27);

export const HABIT_SFX: Sfx[] = [
  { f: h(0), kind: "contract" },
  { f: h(1), kind: "rise" },
  { f: h(2.5), kind: "rise" },
  { f: h(3.5), kind: "pop" },
  ...Array.from({ length: 26 }, (_, i) => ({ f: FILL(i + 1), kind: "tick" as const })),
  { f: CLICK, kind: "click" },
  { f: FLOOD_AT, kind: "flood" },
];

export const Habit: React.FC<{ frame: number }> = ({ frame }) => {
  const first = rectLerp(BAR, cell(0), sp(frame, h(0), SOFT));
  let filled = 1;
  for (let i = 1; i < 27; i++) if (frame >= FILL(i)) filled++;
  if (frame >= CLICK) filled = 28;

  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <div style={{ position: "absolute", left: 96, top: 84 }}>
        <Rise frame={frame} at={h(0.5)} out={OUT}>
          <Mono>07 — Small, but daily</Mono>
        </Rise>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Words
          frame={frame}
          at={h(1)}
          out={OUT}
          rtl
          text="أَحَبُّ الْأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا، وَإِنْ قَلَّ"
          pad="0.3em"
          style={{ fontFamily: F.ar, fontWeight: 700, fontSize: 92, color: C.emerald, lineHeight: 1.5, justifyContent: "center" }}
        />
        <div style={{ height: 18 }} />
        <Words
          frame={frame}
          at={h(2.5)}
          out={OUT}
          stagger={1}
          text="“The most beloved deeds to Allah are the most consistent ones, even if they are small.”"
          style={{ fontFamily: F.ui, fontSize: 38, color: C.ink, justifyContent: "center", width: 1300 }}
        />
        <div style={{ height: 24 }} />
        <RefChip frame={frame} at={h(3.5)} out={OUT} color={C.ink}>
          AL-BUKHĀRĪ &amp; MUSLIM
        </RefChip>
      </div>

      <div style={{ position: "absolute", left: X0, top: Y0 - 74, width: COLS * (CELL + GAP) - GAP, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <Rise frame={frame} at={h(3)} out={OUT}>
          <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 34, color: C.ink }}>Two pages of Qur'an a day</span>
        </Rise>
        <Rise frame={frame} at={h(3.2)} out={OUT}>
          <Mono color={C.ink} size={24}>
            Day {String(filled).padStart(2, "0")} / 28
          </Mono>
        </Rise>
      </div>

      {Array.from({ length: 28 }, (_, i) => {
        if (i === 0) return null;
        const k = sp(frame, h(3.5) + i, POP) * (1 - sp(frame, OUT + (i % 7), SNAP) * (i === 27 ? 0 : 1));
        if (k < 0.001) return null;
        const r = cell(i);
        const at = i === 27 ? CLICK : FILL(i);
        const f = sp(frame, at, POP);
        const press = i === 27 ? sp(frame, CLICK - 4, { damping: 30, stiffness: 600 }) - sp(frame, CLICK + 3, { damping: 18, stiffness: 300 }) : 0;
        const kk = k * (1 - 0.08 * press);
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
      {/* day 1: the bar from the planner, contracted into a cell */}
      <Shape rect={first} color={C.ink} style={{ transform: `scale(${1 - sp(frame, OUT, SNAP)})` }} />
      {/* day 28 floods the frame */}
      <Shape rect={rectLerp(LAST, floodRect(LAST.x + CELL / 2, LAST.y + CELL / 2), sp(frame, FLOOD_AT, FLOOD))} color={C.ink} style={{ visibility: frame >= FLOOD_AT ? "inherit" : "hidden", zIndex: 10 }} />

      <Cursor
        frame={frame}
        show={[h(7), h(9.6)]}
        keys={[
          { f: h(7), x: 1700, y: 1040 },
          { f: h(7.3), x: LAST.x + CELL / 2 + 8, y: LAST.y + CELL / 2 + 6 },
        ]}
        clicks={[CLICK]}
      />
      <Hud frame={frame} at={h(0.5)} out={OUT} index={7} color={C.ink} />
    </AbsoluteFill>
  );
};
