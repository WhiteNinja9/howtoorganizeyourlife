import React from "react";
import { C, F } from "../lib/theme";
import { exitK, gl, inv, POP, sp } from "../lib/motion";
import { Mono, RefChip, Rise, Words } from "../ui/kit";
import { T } from "../script";

const RC = { x: 500, y: 540 };
const RR = 250;

export const Time: React.FC<{ t: number }> = ({ t }) => {
  const s = T.time;
  const OUT = T.timeOut;
  const ring = gl(t, s + 0.1, 1.3);
  const gone = exitK(t, OUT + 0.1, 0.4);
  const sweep = inv(s + 1, s + 6.6, t) * 0.82;
  const hand = (t - s) * 72;
  const circ = 2 * Math.PI * RR;
  const col: React.CSSProperties = { position: "absolute", left: 820, width: 960 };
  return (
    <>
      <div style={{ position: "absolute", left: -400, top: -400, right: -400, bottom: -400, background: C.ink }} />
      <div style={{ position: "absolute", left: 96, top: 84 }}>
        <Rise t={t} at={s + 1.0} out={OUT}>
          <Mono color={C.goldSoft}>07 — Time</Mono>
        </Rise>
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <g transform={`translate(${RC.x} ${RC.y}) scale(${1 - gone.off})`}>
          <circle r={RR} fill="none" stroke="rgba(255,253,248,0.9)" strokeWidth={3} strokeDasharray={circ} strokeDashoffset={circ * (1 - ring)} transform="rotate(-90)" />
          <circle r={RR + 22} fill="none" stroke={C.mint} strokeWidth={6} strokeLinecap="round" strokeDasharray={`${(RR + 22) * 2 * Math.PI * sweep} ${circ * 3}`} transform="rotate(-90)" />
          {Array.from({ length: 60 }, (_, i) => {
            const k = sp(t, s + 0.3 + i * 0.012, POP);
            const major = i % 5 === 0;
            const a = (i / 60) * Math.PI * 2;
            const r1 = RR - 14;
            const r2 = RR - 14 - (major ? 22 : 10) * k;
            return (
              <line key={i} x1={Math.sin(a) * r1} y1={-Math.cos(a) * r1} x2={Math.sin(a) * r2} y2={-Math.cos(a) * r2} stroke={major ? C.goldSoft : "rgba(255,253,248,0.45)"} strokeWidth={major ? 3 : 2} strokeLinecap="round" />
            );
          })}
          <g transform={`rotate(${hand})`}>
            <line x1={0} y1={30} x2={0} y2={-(RR - 50) * ring} stroke={C.white} strokeWidth={3} strokeLinecap="round" />
          </g>
          <circle r={9 * ring} fill={C.goldSoft} />
        </g>
      </svg>

      <div style={{ ...col, top: 150, textAlign: "right" }}>
        <Words t={t} at={s + 1.3} out={OUT} per={0.08} rtl text="إضاعة الوقت أشدُّ من الموت" pad="0.3em" style={{ fontFamily: F.ar, fontWeight: 700, fontSize: 74, color: C.goldSoft, lineHeight: 1.6 }} />
        <div style={{ height: 6 }} />
        <Words
          t={t}
          at={s + 2.1}
          out={OUT}
          per={0.045}
          rtl
          text="لأنَّ إضاعة الوقت تقطعك عن الله والدار الآخرة، والموتُ يقطعك عن الدنيا وأهلها"
          pad="0.3em"
          style={{ fontFamily: F.ar, fontSize: 40, color: "rgba(255,253,248,0.88)", lineHeight: 1.7 }}
        />
      </div>
      <div style={{ ...col, top: 560 }}>
        <Words
          t={t}
          at={s + 3.0}
          out={OUT}
          per={0.02}
          text="“Wasting time is worse than death, because wasting time cuts you off from Allah and the Hereafter, while death cuts you off from this world and its people.”"
          style={{ fontFamily: F.ui, fontSize: 32, color: "#CFCAC0", lineHeight: 1.4 }}
        />
        <div style={{ height: 22 }} />
        <RefChip t={t} at={s + 3.7} out={OUT} color={C.goldSoft}>
          IBN AL-QAYYIM · AL-FAWĀʾID · P. 44
        </RefChip>
        <div style={{ height: 46 }} />
        <Words t={t} at={s + 4.4} out={OUT} per={0.05} text="Your time is your life. Spend it on purpose." style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 44, color: C.white, letterSpacing: "-0.015em" }} />
      </div>
    </>
  );
};
