import React from "react";
import { AbsoluteFill } from "remotion";
import { b, cRect, FLOOD, floodRect, FULL, multi, rectLerp, sp, SOFT } from "../lib/anim";
import { C, F } from "../lib/theme";
import { Rise, Shape, tw } from "../ui/primitives";
import { WordmarkLetters, wordmarkGeom } from "../ui/Wordmark";
import { Cursor } from "../ui/Cursor";
import { Sfx, T } from "../timeline";

const PILL_H = 150;
const PAD = 72;
const SQUEEZE = { damping: 26, stiffness: 80, mass: 1 };

const settle = (v: number) => (v > 0.9995 ? 1 : v);

const Label: React.FC<{ frame: number; at: number; out: number; children: React.ReactNode; ar?: boolean }> = ({
  frame,
  at,
  out,
  children,
  ar,
}) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      top: 540,
      transform: "translateY(-50%)",
      textAlign: "center",
      color: ar ? C.goldSoft : C.white,
      fontFamily: ar ? F.ar : F.ui,
      fontWeight: ar ? 700 : 600,
      fontSize: ar ? 64 : 56,
      lineHeight: ar ? 1.5 : 1.15,
      letterSpacing: ar ? 0 : "-0.01em",
    }}
  >
    <Rise frame={frame} at={at} out={out} pad={ar ? "0.3em" : "0.15em"}>
      {children}
    </Rise>
  </div>
);

/* ---------- Open: "Rise." squeezes into its period, the dot becomes a pill, then floods ---------- */

export const OPEN_SFX: Sfx[] = [
  { f: b(1), kind: "squeeze" },
  { f: b(3), kind: "pop" },
  { f: b(4), kind: "rise" },
  { f: b(6), kind: "swap" },
  { f: b(8.5), kind: "click" },
  { f: b(9), kind: "flood" },
];

export const Open: React.FC<{ frame: number }> = ({ frame }) => {
  const p = settle(sp(frame, b(1), SQUEEZE));
  const g = wordmarkGeom(p);

  const w1 = tw("Amiri", 700, 64, "بِسْمِ اللَّهِ") + PAD * 2;
  const w2 = tw("Geist", 600, 56, "For the Ummah") + PAD * 2;
  const pillW = multi(frame, w1, [[b(6), w2]], SOFT);

  const click = b(8.5);
  const press = sp(frame, click - 4, { damping: 30, stiffness: 600 }) - sp(frame, click + 3, { damping: 18, stiffness: 300 });
  const k = 1 - 0.04 * press;
  const pill = cRect(960, 540, pillW * k, PILL_H * k);

  let rect = rectLerp(g.dot, pill, sp(frame, b(3), SOFT));
  rect = rectLerp(rect, floodRect(960, 540), sp(frame, b(9), FLOOD));

  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <WordmarkLetters p={p} />
      <Shape rect={rect} color={C.ink} />
      <Label frame={frame} at={b(4)} out={b(6)} ar>
        بِسْمِ اللَّهِ
      </Label>
      <Label frame={frame} at={b(6) + 4} out={b(8.8)}>
        For the Ummah
      </Label>
      <Cursor
        frame={frame}
        show={[b(7), b(9.3)]}
        keys={[
          { f: b(7), x: 1580, y: 1010 },
          { f: b(7.2), x: 1060, y: 570 },
        ]}
        clicks={[click]}
      />
    </AbsoluteFill>
  );
};

/* ---------- Close: black contracts into the pill, labels swap, pill → dot → "Rise." ---------- */

const c = (beats: number) => T.close + b(beats);

export const CLOSE_SFX: Sfx[] = [
  { f: c(0), kind: "contract" },
  { f: c(0.8), kind: "rise" },
  { f: c(2.7), kind: "swap" },
  { f: c(4.7), kind: "swap" },
  { f: c(7), kind: "pop" },
  { f: c(8), kind: "squeeze" },
];

export const Close: React.FC<{ frame: number }> = ({ frame }) => {
  const l1 = tw("Geist", 600, 56, "Start today.") + PAD * 2;
  const l2 = tw("Geist", 600, 56, "One small deed at a time.") + PAD * 2;
  const l3 = tw("Amiri", 700, 64, "إِنْ شَاءَ اللَّهُ") + PAD * 2;
  const pillW = multi(frame, l1, [
    [c(2.7), l2],
    [c(4.7), l3],
  ]);
  const pill = cRect(960, 540, pillW, PILL_H);

  const p = 1 - settle(sp(frame, c(8), SQUEEZE));
  const g = wordmarkGeom(p);

  let rect = rectLerp(FULL, pill, settle(sp(frame, c(0), FLOOD)));
  rect = rectLerp(rect, g.dot, settle(sp(frame, c(7), SOFT)));

  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <WordmarkLetters p={p} />
      <Shape rect={rect} color={C.ink} />
      <Label frame={frame} at={c(0.8)} out={c(2.5)}>
        Start today.
      </Label>
      <Label frame={frame} at={c(2.7)} out={c(4.5)}>
        One small deed at a time.
      </Label>
      <Label frame={frame} at={c(4.7)} out={c(6.6)} ar>
        إِنْ شَاءَ اللَّهُ
      </Label>
    </AbsoluteFill>
  );
};
