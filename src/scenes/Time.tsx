import React from "react";
import { AbsoluteFill } from "remotion";
import { b, kf, POP, sp, SNAP } from "../lib/anim";
import { C, F } from "../lib/theme";
import { Mono, Rise, Words } from "../ui/primitives";
import { RefChip } from "../ui/Quote";
import { Hud } from "../ui/Hud";
import { Sfx, T } from "../timeline";

const t = (beats: number) => T.time + b(beats);
const OUT = t(11.5);
const RC = { x: 500, y: 540 };
const RR = 250;

export const TIME_SFX: Sfx[] = [
  { f: t(0.5), kind: "draw" },
  { f: t(1.5), kind: "rise" },
  { f: t(3), kind: "rise" },
  { f: t(5), kind: "rise" },
  { f: t(6.5), kind: "pop" },
  { f: t(8), kind: "chime" },
  { f: OUT, kind: "swap" },
];

export const Time: React.FC<{ frame: number }> = ({ frame }) => {
  const ring = sp(frame, t(0.5), { damping: 26, stiffness: 45 });
  const gone = sp(frame, OUT + 6, SNAP);
  const sweep = kf(frame, [t(1), t(11)], [0, 0.82]);
  const hand = (frame - T.time) * 2.4;
  const circ = 2 * Math.PI * RR;
  const col: React.CSSProperties = { position: "absolute", left: 880, width: 880 };
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <div style={{ position: "absolute", left: 96, top: 84 }}>
        <Rise frame={frame} at={t(0.5)} out={OUT}>
          <Mono color={C.goldSoft}>08 — Time</Mono>
        </Rise>
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${RC.x} ${RC.y}) scale(${1 - gone})`}>
          <circle r={RR} fill="none" stroke="rgba(255,253,248,0.9)" strokeWidth={3} strokeDasharray={circ} strokeDashoffset={circ * (1 - ring)} transform="rotate(-90)" />
          <circle r={RR + 22} fill="none" stroke={C.mint} strokeWidth={6} strokeLinecap="round" strokeDasharray={`${circ * 1.088 * sweep} ${circ * 2}`} transform="rotate(-90)" />
          {Array.from({ length: 60 }, (_, i) => {
            const k = sp(frame, t(1) + i, POP);
            const major = i % 5 === 0;
            const a = (i / 60) * Math.PI * 2;
            const r1 = RR - 14;
            const r2 = RR - 14 - (major ? 22 : 10) * k;
            return (
              <line
                key={i}
                x1={Math.sin(a) * r1}
                y1={-Math.cos(a) * r1}
                x2={Math.sin(a) * r2}
                y2={-Math.cos(a) * r2}
                stroke={major ? C.goldSoft : "rgba(255,253,248,0.45)"}
                strokeWidth={major ? 3 : 2}
                strokeLinecap="round"
              />
            );
          })}
          <g transform={`rotate(${hand})`} opacity={ring}>
            <line x1={0} y1={30} x2={0} y2={-RR + 50} stroke={C.white} strokeWidth={3} strokeLinecap="round" />
          </g>
          <circle r={9 * ring} fill={C.goldSoft} />
        </g>
      </svg>

      <div style={{ ...col, top: 170, textAlign: "right" }}>
        <Words
          frame={frame}
          at={t(1.5)}
          out={OUT}
          rtl
          text="إضاعة الوقت أشدُّ من الموت"
          pad="0.3em"
          style={{ fontFamily: F.ar, fontWeight: 700, fontSize: 88, color: C.goldSoft, lineHeight: 1.5 }}
        />
        <div style={{ height: 8 }} />
        <Words
          frame={frame}
          at={t(3)}
          out={OUT}
          rtl
          stagger={2}
          text="لأنَّ إضاعة الوقت تقطعك عن الله والدار الآخرة، والموتُ يقطعك عن الدنيا وأهلها"
          pad="0.3em"
          style={{ fontFamily: F.ar, fontSize: 44, color: "rgba(255,253,248,0.88)", lineHeight: 1.6 }}
        />
      </div>
      <div style={{ ...col, top: 560 }}>
        <Words
          frame={frame}
          at={t(5)}
          out={OUT}
          stagger={1}
          text="“Wasting time is worse than death, because wasting time cuts you off from Allah and the Hereafter, while death cuts you off from this world and its people.”"
          style={{ fontFamily: F.ui, fontSize: 32, color: "#CFCAC0", lineHeight: 1.4 }}
        />
        <div style={{ height: 24 }} />
        <RefChip frame={frame} at={t(6.5)} out={OUT} color={C.goldSoft}>
          IBN AL-QAYYIM · AL-FAWĀʾID · P. 44
        </RefChip>
        <div style={{ height: 50 }} />
        <Words
          frame={frame}
          at={t(8)}
          out={OUT}
          stagger={2}
          text="Your time is your life. Spend it on purpose."
          style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 46, color: C.white, letterSpacing: "-0.015em" }}
        />
      </div>
      <Hud frame={frame} at={t(0.5)} out={OUT} index={8} color={C.goldSoft} />
    </AbsoluteFill>
  );
};
