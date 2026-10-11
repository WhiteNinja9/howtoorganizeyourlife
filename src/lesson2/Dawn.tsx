import React from "react";
import { C, F, SHADOW } from "../lib/theme";
import { exitK, gl, inv, POP, sp, tq } from "../lib/motion";
import { Ayah, Digits, RefChip, Rise, Words } from "../ui/kit";
import { Cursor } from "../ui/Cursor";
import { AYAT2 } from "./ayat";
import { HADITH } from "./pages";
import { T } from "./script";

/** Dawn: 39:53, then istighfār polishes the black heart from its centre outward. */
export const DAWN_HEART = { x: 960, y: 470, r: 170 };
const BTN = { x: 960, y: 800, w: 420, h: 104 };

export const DawnBg: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: -600,
      top: -600,
      right: -600,
      bottom: -600,
      background: `linear-gradient(to bottom, ${C.paper} 0%, ${C.paper} 45%, #F1DDBA 75%, #EBC994 100%)`,
    }}
  />
);

/** How much black is left on the heart (1 = covered, 0 = polished). */
export const blackLeft = (t: number) => {
  let c = 1;
  for (const k of T.clicks) c -= 0.06 * gl(t, k, 0.25);
  c -= (1 - 0.06 * T.clicks.length) * inv(T.hold[0], T.hold[1], t);
  return Math.max(0, c);
};

export const PolishedHeart: React.FC<{ t: number; scale?: number }> = ({ t, scale = 1 }) => {
  const c = blackLeft(t);
  const { x, y, r } = DAWN_HEART;
  const hole = Math.sqrt(1 - c) * (r + 30); // polished from the centre outward, evened by area
  const press = T.clicks.reduce((a, k) => a + sp(t, k - 0.05, { w: 50, z: 1 }) - sp(t, k + 0.06, { w: 24, z: 0.7 }), 0);
  return (
    <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, transform: `scale(${scale * (1 - 0.02 * press)})` }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: r, background: C.white, boxShadow: SHADOW }} />
      {c > 0.001 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: r,
            background: C.ink,
            WebkitMaskImage: `radial-gradient(circle at 50% 50%, transparent ${hole - 26}px, black ${hole}px)`,
            maskImage: `radial-gradient(circle at 50% 50%, transparent ${hole - 26}px, black ${hole}px)`,
          }}
        />
      )}
      <div style={{ position: "absolute", inset: -10, borderRadius: r + 10, border: `2px solid rgba(13,21,18,0.18)` }} />
    </div>
  );
};

export const Dawn: React.FC<{ t: number }> = ({ t }) => {
  const heartK = sp(t, T.polish, POP);
  const btnK = sp(t, T.polish + 0.6, POP) * (1 - exitK(t, T.clean - 0.2, 0.3).off);
  let n = 0;
  for (const k of T.clicks) if (tq(t) >= k) n++;
  if (tq(t) >= T.hold[0]) n = Math.min(100, 8 + Math.floor(92 * inv(T.hold[0], T.hold[1], tq(t))));
  return (
    <>
      <DawnBg />
      {/* Az-Zumar 39:53 */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 190, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Ayah t={t} at={T.ayahA} out={T.ayahOut} per={0.07} words={AYAT2.v39_53_a} page={464} size={66} color={C.ink} />
        <Ayah
          t={t}
          at={T.ayahB}
          out={T.ayahOut}
          per={0.07}
          words={AYAT2.v39_53_b}
          page={464}
          size={66}
          color={C.ink}
          mark={{ from: 2, to: 4, color: C.emerald, underlineAt: T.ayahB + 1.2 }}
        />
        <div style={{ height: 26 }} />
        <div style={{ width: 1300 }}>
          <Words
            t={t}
            at={T.ayahB + 1.6}
            out={T.ayahOut}
            per={0.02}
            text="“Say: O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins. Indeed, He is the Forgiving, the Merciful.”"
            style={{ fontFamily: F.ui, fontSize: 34, color: C.ink2, lineHeight: 1.38, justifyContent: "center" }}
          />
        </div>
        <div style={{ height: 24 }} />
        <RefChip t={t} at={T.ayahB + 2.4} out={T.ayahOut} color={C.ink}>
          AZ-ZUMAR · 39:53
        </RefChip>
      </div>

      {/* the way back */}
      {t >= T.polish && (
        <>
          <div style={{ position: "absolute", left: 0, right: 0, top: 70, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Words t={t} at={T.polish + 0.2} out={T.clean - 0.3} per={0.06} rtl text={HADITH.c} pad="0.3em" style={{ fontFamily: F.ar, fontWeight: 700, fontSize: 54, color: C.emerald, lineHeight: 1.6, justifyContent: "center" }} />
            <Words t={t} at={T.polish + 0.8} out={T.clean - 0.3} per={0.02} text="“If he repents, stops, and seeks forgiveness, his heart is polished.”" style={{ fontFamily: F.ui, fontSize: 30, color: C.ink2, justifyContent: "center" }} />
          </div>
          <div style={{ transform: `scale(${heartK})`, transformOrigin: `${DAWN_HEART.x}px ${DAWN_HEART.y}px`, position: "absolute", inset: 0 }}>
            <PolishedHeart t={t} />
          </div>
          <div
            style={{
              position: "absolute",
              left: BTN.x - BTN.w / 2,
              top: BTN.y - BTN.h / 2,
              width: BTN.w,
              height: BTN.h,
              borderRadius: BTN.h / 2,
              background: C.ink,
              transform: `scale(${btnK * (1 - 0.04 * (T.clicks.reduce((a, k) => a + sp(t, k - 0.05, { w: 50, z: 1 }) - sp(t, k + 0.06, { w: 24, z: 0.7 }), 0) + sp(t, T.hold[0] - 0.05, { w: 40, z: 1 }) - sp(t, T.hold[1], { w: 24, z: 0.7 })))})`,
              display: btnK < 0.002 ? "none" : "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 22,
              boxShadow: SHADOW,
            }}
          >
            <span style={{ fontFamily: F.ar, fontWeight: 700, fontSize: 40, color: C.white, lineHeight: 1.6 }}>أستغفر الله</span>
            <span style={{ fontFamily: F.mono, fontSize: 24, color: C.mint, letterSpacing: "0.06em" }}>
              ×<Digits value={String(n).padStart(3, "0")} slot={15} />
            </span>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 690, display: "flex", justifyContent: "center" }}>
            <Rise t={t} at={T.clean + 0.1} out={T.polishOut}>
              <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 58, color: C.ink, letterSpacing: "-0.02em" }}>Polish your heart tonight.</span>
            </Rise>
          </div>
          <Cursor
            t={t}
            show={[T.polish + 1.0, T.hold[1] + 0.3]}
            keys={[
              [T.polish + 1.0, 1400, 1020],
              [T.polish + 1.02, BTN.x + 120, BTN.y + 18, 0.6],
            ]}
            clicks={T.clicks}
            holds={[T.hold]}
            hovers={[[T.clicks[0] - 0.3, T.hold[1]]]}
          />
        </>
      )}
    </>
  );
};
