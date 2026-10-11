import React from "react";
import { C, F } from "../lib/theme";
import { cRect, gl, glideKeys, rectLerp } from "../lib/motion";
import { Rise, Shape, tw } from "../ui/kit";
import { WordmarkLetters, wordmarkGeom } from "../ui/Wordmark";
import { DAWN_HEART, DawnBg, PolishedHeart } from "./Dawn";
import { T } from "./script";

/** Close: the clean heart fills with ink from its centre, becomes the pill, then the dot, then "Rise." */
const LABELS = ["Close the app.", "Make wuḍūʾ.", "Say: astaghfirullāh."];
const PAD = 72;

export const Close2: React.FC<{ t: number }> = ({ t }) => {
  const ink = gl(t, T.toPill, 0.45); // ink dissolves outward inside the white heart
  const paperIn = gl(t, T.toPill, 0.9); // the dawn warmth dissolves back into flat paper, outward from centre
  const w = glideKeys(t, tw("Geist", 600, 56, LABELS[0]) + PAD * 2, LABELS.slice(1).map((l, i) => [T.labels[i + 1] - 0.1, tw("Geist", 600, 56, l) + PAD * 2, 0.5]));
  const heart = cRect(DAWN_HEART.x, DAWN_HEART.y, DAWN_HEART.r * 2, DAWN_HEART.r * 2);
  const p = 1 - gl(t, T.unfoldWord, 0.8);
  const g = wordmarkGeom(p);
  let rect = rectLerp(heart, cRect(960, 540, w, 150), gl(t, T.toPill + 0.4, 0.7));
  rect = rectLerp(rect, g.dot, gl(t, T.toDot, 0.6));
  return (
    <>
      <div style={{ position: "absolute", left: -600, top: -600, right: -600, bottom: -600, background: C.paper }} />
      {paperIn < 1 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            WebkitMaskImage: `radial-gradient(circle at 960px 540px, transparent ${paperIn * 1500 - 220}px, black ${paperIn * 1500}px)`,
            maskImage: `radial-gradient(circle at 960px 540px, transparent ${paperIn * 1500 - 220}px, black ${paperIn * 1500}px)`,
          }}
        >
          <DawnBg />
        </div>
      )}
      <WordmarkLetters p={p} />
      {ink < 1 ? (
        <>
          <PolishedHeart t={t} />
          <div
            style={{
              position: "absolute",
              left: heart.x,
              top: heart.y,
              width: heart.w,
              height: heart.h,
              borderRadius: heart.w / 2,
              background: C.ink,
              WebkitMaskImage: `radial-gradient(circle, black ${ink * 240 - 30}px, transparent ${ink * 240}px)`,
              maskImage: `radial-gradient(circle, black ${ink * 240 - 30}px, transparent ${ink * 240}px)`,
            }}
          />
        </>
      ) : (
        <Shape rect={rect} color={C.ink} />
      )}
      {LABELS.map((l, i) => (
        <div key={l} style={{ position: "absolute", left: 0, right: 0, top: 540, transform: "translateY(-50%)", textAlign: "center" }}>
          <Rise t={t} at={T.labels[i]} out={i < LABELS.length - 1 ? T.labels[i + 1] - 0.12 : T.toDot - 0.12}>
            <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 56, color: C.white, whiteSpace: "nowrap" }}>{l}</span>
          </Rise>
        </div>
      ))}
    </>
  );
};
