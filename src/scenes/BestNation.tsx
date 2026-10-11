import React from "react";
import { AbsoluteFill } from "remotion";
import { b, kf } from "../lib/anim";
import { C, F } from "../lib/theme";
import { Mono, Pop, Rise, Words } from "../ui/primitives";
import { Check, RefChip } from "../ui/Quote";
import { Hud } from "../ui/Hud";
import { Sfx, T } from "../timeline";

const s = (beats: number) => T.bestNation + b(beats);
const OUT = s(14);

export const BEST_SFX: Sfx[] = [
  { f: s(1), kind: "rise" },
  { f: s(3), kind: "rise" },
  { f: s(5), kind: "rise" },
  { f: s(7), kind: "pop" },
  { f: s(9), kind: "check" },
  { f: s(10), kind: "check" },
  { f: s(11), kind: "check" },
  { f: s(12), kind: "rise" },
  { f: OUT, kind: "swap" },
];

const chips = ["Enjoin what is right", "Forbid what is wrong", "Believe in Allah"];

export const BestNation: React.FC<{ frame: number }> = ({ frame }) => {
  const zoom = kf(frame, [T.bestNation, T.bento], [1, 1.035]);
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <div style={{ position: "absolute", left: 96, top: 84 }}>
          <Rise frame={frame} at={s(0.5)} out={OUT}>
            <Mono color={C.goldSoft}>01 — The best nation</Mono>
          </Rise>
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            paddingTop: 170,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Words
            frame={frame}
            at={s(1)}
            out={OUT}
            rtl
            text="كُنْتُمْ خَيْرَ أُمَّةٍ أُخْرِجَتْ لِلنَّاسِ"
            pad="0.3em"
            style={{ fontFamily: F.ar, fontWeight: 700, fontSize: 104, color: C.goldSoft, lineHeight: 1.5, justifyContent: "center" }}
          />
          <Words
            frame={frame}
            at={s(3)}
            out={OUT}
            rtl
            stagger={2}
            text="تَأْمُرُونَ بِالْمَعْرُوفِ وَتَنْهَوْنَ عَنِ الْمُنْكَرِ وَتُؤْمِنُونَ بِاللَّهِ"
            pad="0.3em"
            style={{ fontFamily: F.ar, fontSize: 58, color: "rgba(255,253,248,0.88)", lineHeight: 1.6, justifyContent: "center", marginTop: 4 }}
          />
          <div style={{ marginTop: 48, width: 1320, textAlign: "center" }}>
            <Words
              frame={frame}
              at={s(5)}
              out={OUT}
              stagger={1}
              text="“You are the best nation brought forth for mankind: you enjoin what is right, forbid what is wrong, and believe in Allah.”"
              style={{ fontFamily: F.ui, fontSize: 40, color: "#CFCAC0", lineHeight: 1.35, justifyContent: "center", columnGap: "0.26em" }}
            />
          </div>
          <RefChip frame={frame} at={s(7)} out={OUT} color={C.goldSoft} style={{ marginTop: 36 }}>
            ĀL ʿIMRĀN · 3:110
          </RefChip>
          <div style={{ display: "flex", gap: 22, marginTop: 64 }}>
            {chips.map((t, i) => (
              <Pop key={t} frame={frame} at={s(9 + i)} out={OUT + i * 2}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    background: C.emerald,
                    color: C.white,
                    borderRadius: 999,
                    padding: "16px 30px 16px 20px",
                    fontFamily: F.ui,
                    fontWeight: 600,
                    fontSize: 32,
                  }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 20, background: C.white, display: "grid", placeItems: "center" }}>
                    <Check color={C.emerald} size={26} />
                  </div>
                  {t}
                </div>
              </Pop>
            ))}
          </div>
          <div style={{ marginTop: 44 }}>
            <Rise frame={frame} at={s(12)} out={OUT}>
              <span style={{ fontFamily: F.ui, fontSize: 34, color: "#9DA39F" }}>
                That is what makes this Ummah the best.
              </span>
            </Rise>
          </div>
        </div>
      </AbsoluteFill>
      <Hud frame={frame} at={s(0.5)} out={OUT} index={1} color={C.goldSoft} />
    </AbsoluteFill>
  );
};
