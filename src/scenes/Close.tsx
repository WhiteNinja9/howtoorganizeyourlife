import React from "react";
import { C, F } from "../lib/theme";
import { contract, cRect, gl, glideKeys, rectLerp } from "../lib/motion";
import { Rise, Shape, tw } from "../ui/kit";
import { WordmarkLetters, wordmarkGeom } from "../ui/Wordmark";
import { T } from "../script";

const PAD = 72;
const PILL_H = 150;
const LABELS = [
  { text: "Start today.", ar: false },
  { text: "One small deed at a time.", ar: false },
  { text: "إن شاء الله", ar: true },
];
const lw = (l: (typeof LABELS)[number]) => (l.ar ? tw("Plex", 700, 60, l.text) : tw("Geist", 600, 56, l.text)) + PAD * 2;

export const Close: React.FC<{ t: number }> = ({ t }) => {
  const w = glideKeys(t, lw(LABELS[0]), LABELS.slice(1).map((l, i) => [T.labels[i + 1] - 0.1, lw(l), 0.5]));
  const pill = cRect(960, 540, w, PILL_H);
  const p = 1 - gl(t, T.unfoldWord, 0.8);
  const g = wordmarkGeom(p);
  let rect = contract(t, T.contract2, pill, 0.5);
  rect = rectLerp(rect, g.dot, gl(t, T.toDot, 0.6));

  return (
    <>
      <div style={{ position: "absolute", left: -400, top: -400, right: -400, bottom: -400, background: C.paper }} />
      <WordmarkLetters p={p} />
      <Shape rect={rect} color={C.ink} />
      {LABELS.map((l, i) => (
        <div key={l.text} style={{ position: "absolute", left: 0, right: 0, top: 540, transform: "translateY(-50%)", textAlign: "center" }}>
          <Rise t={t} at={T.labels[i]} out={i < LABELS.length - 1 ? T.labels[i + 1] - 0.12 : T.toDot - 0.12} pad={l.ar ? "0.32em" : "0.18em"}>
            <span
              style={{
                fontFamily: l.ar ? F.ar : F.ui,
                fontWeight: l.ar ? 700 : 600,
                fontSize: l.ar ? 60 : 56,
                lineHeight: l.ar ? 1.6 : 1.15,
                color: l.ar ? C.goldSoft : C.white,
                whiteSpace: "nowrap",
              }}
            >
              {l.text}
            </span>
          </Rise>
        </div>
      ))}
    </>
  );
};
