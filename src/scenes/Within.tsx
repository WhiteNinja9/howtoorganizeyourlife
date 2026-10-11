import React from "react";
import { C, F } from "../lib/theme";
import { exitK, hash, POP, sp } from "../lib/motion";
import { Ayah, Mono, RefChip, Rise, Words } from "../ui/kit";
import { AYAT, T } from "../script";

const COLS = 23;
const ROWS = 11;
const GAP = 70;
const GX = 960 - ((COLS - 1) * GAP) / 2;
const GY = 600 - ((ROWS - 1) * GAP) / 2;

export const Within: React.FC<{ t: number }> = ({ t }) => {
  const s = T.within;
  return (
    <>
      <div style={{ position: "absolute", left: -400, top: -400, right: -400, bottom: -400, background: C.emerald }} />
      <div style={{ position: "absolute", left: 96, top: 84 }}>
        <Rise t={t} at={s + 0.2} out={T.withinOut}>
          <Mono color="rgba(255,253,248,0.7)">02 — Change starts within</Mono>
        </Rise>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Ayah t={t} at={s + 0.4} out={T.withinOut} per={0.08} words={AYAT.v13_11_a} page={250} size={108} color={C.white} />
        <Ayah
          t={t}
          at={s + 1.2}
          out={T.withinOut}
          per={0.08}
          words={AYAT.v13_11_b}
          page={250}
          size={108}
          color={C.white}
          mark={{ from: 1, to: 3, color: C.goldSoft, underlineAt: s + 2.0 }}
        />
        <div style={{ height: 26 }} />
        <div style={{ width: 1240 }}>
          <Words
            t={t}
            at={s + 2.3}
            out={T.withinOut}
            per={0.022}
            text="“Indeed, Allah will not change the condition of a people until they change what is within themselves.”"
            style={{ fontFamily: F.ui, fontSize: 38, lineHeight: 1.36, color: "#CDE6DE", justifyContent: "center" }}
          />
        </div>
        <div style={{ height: 30 }} />
        <RefChip t={t} at={s + 2.9} out={T.withinOut} color={C.goldSoft}>
          AR-RAʿD · 13:11
        </RefChip>
      </div>

      {/* one person → the whole Ummah: a dot ripples into a grid, the light spreads */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", justifyContent: "center" }}>
        <Words
          t={t}
          at={T.grid + 0.3}
          out={T.gridOut}
          per={0.05}
          text="The Ummah rises one person at a time."
          style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 60, color: C.white, letterSpacing: "-0.02em" }}
        />
      </div>
      {t >= T.grid &&
        Array.from({ length: COLS * ROWS }, (_, i) => {
          const cx = i % COLS;
          const cy = Math.floor(i / COLS);
          const x = GX + cx * GAP;
          const y = GY + cy * GAP;
          const d = Math.hypot(x - 960, y - 600);
          const isCenter = d < 1;
          const appear = isCenter ? sp(t, T.grid, POP) : sp(t, T.grid + 0.2 + d * 0.0009, POP);
          const lit = isCenter ? sp(t, T.grid + 0.1, POP) : sp(t, T.spread + d * 0.0011 + hash(i) * 0.22, POP);
          const e = exitK(t, T.gridOut + (900 - Math.min(900, d)) * 0.0004, 0.3);
          const size = (14 + 8 * lit) * appear * (1 - e.off);
          if (size < 0.2) return null;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x - size / 2,
                top: y - size / 2,
                width: size,
                height: size,
                borderRadius: size,
                background: lit > 0.5 ? C.goldSoft : "rgba(255,253,248,0.28)",
              }}
            />
          );
        })}
    </>
  );
};
