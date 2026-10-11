import React from "react";
import { AbsoluteFill } from "remotion";
import { b, kf } from "../lib/anim";
import { C, F } from "../lib/theme";
import { Mono, Rise, Words } from "../ui/primitives";
import { RefChip } from "../ui/Quote";
import { Hud } from "../ui/Hud";
import { Sfx, T } from "../timeline";

const s = (beats: number) => T.within + b(beats);
const OUT = s(9.5);

export const WITHIN_SFX: Sfx[] = [
  { f: s(1), kind: "rise" },
  { f: s(2.5), kind: "rise" },
  { f: s(4.5), kind: "rise" },
  { f: s(6), kind: "pop" },
  { f: s(7.5), kind: "chime" },
  { f: OUT, kind: "swap" },
];

export const Within: React.FC<{ frame: number }> = ({ frame }) => {
  const zoom = kf(frame, [T.within, T.book], [1.03, 1]);
  return (
    <AbsoluteFill style={{ background: C.emerald }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <div style={{ position: "absolute", left: 96, top: 84 }}>
          <Rise frame={frame} at={s(0.5)} out={OUT}>
            <Mono color="rgba(255,253,248,0.7)">03 — Change starts within</Mono>
          </Rise>
        </div>
        <div style={{ position: "absolute", inset: 0, paddingTop: 175, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Words
            frame={frame}
            at={s(1)}
            out={OUT}
            rtl
            text="إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ"
            pad="0.3em"
            style={{ fontFamily: F.ar, fontWeight: 700, fontSize: 110, color: C.white, lineHeight: 1.45, justifyContent: "center" }}
          />
          <Words
            frame={frame}
            at={s(2.5)}
            out={OUT}
            rtl
            text="حَتَّى يُغَيِّرُوا مَا بِأَنْفُسِهِمْ"
            pad="0.3em"
            style={{ fontFamily: F.ar, fontWeight: 700, fontSize: 110, color: C.goldSoft, lineHeight: 1.45, justifyContent: "center" }}
          />
          <div style={{ marginTop: 40, width: 1240, textAlign: "center" }}>
            <Words
              frame={frame}
              at={s(4.5)}
              out={OUT}
              stagger={1}
              text="“Indeed, Allah will not change the condition of a people until they change what is within themselves.”"
              style={{ fontFamily: F.ui, fontSize: 40, color: "#CDE6DE", lineHeight: 1.35, justifyContent: "center", columnGap: "0.26em" }}
            />
          </div>
          <RefChip frame={frame} at={s(6)} out={OUT} color={C.goldSoft} style={{ marginTop: 34 }}>
            AR-RAʿD · 13:11
          </RefChip>
          <div style={{ marginTop: 58 }}>
            <Words
              frame={frame}
              at={s(7.5)}
              out={OUT}
              stagger={3}
              text="The Ummah rises one person at a time."
              style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 56, color: C.white, letterSpacing: "-0.015em", columnGap: "0.24em" }}
            />
          </div>
        </div>
      </AbsoluteFill>
      <Hud frame={frame} at={s(0.5)} out={OUT} index={3} color={C.white} />
    </AbsoluteFill>
  );
};
