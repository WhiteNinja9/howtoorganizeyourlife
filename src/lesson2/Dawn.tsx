import React from "react";
import { C, F, SHADOW } from "../lib/theme";
import { exitK, gl, inv, lerp, POP, sp, tq } from "../lib/motion";
import { Ayah, Digits, GooDefs, RefChip, Rise, Words } from "../ui/kit";
import { HEART_C, HEART_R, SPOTS } from "./Heart";
import { Cursor } from "../ui/Cursor";
import { AYAT2 } from "./ayat";
import { HADITH } from "./pages";
import { T } from "./script";

/** Dawn: 39:53, then istighfār polishes the black heart, spot by spot. */
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

/**
 * The sin scene played backwards: the black cover cracks into the same spots at the first click,
 * each click lifts a few (biggest first), and the long press lifts the rest.
 */
const SC = DAWN_HEART.r / HEART_R;
const DSPOTS = SPOTS.map((s, i) => ({ x: DAWN_HEART.r + (s.x - HEART_C.x) * SC, y: DAWN_HEART.r + (s.y - HEART_C.y) * SC, r: s.r * SC, i }));
const PER_CLICK = 3;
const goneAt = (i: number) => {
  const k = SPOTS.length - 1 - i; // biggest (last placed) first
  const j = Math.floor(k / PER_CLICK);
  if (j < T.clicks.length) return T.clicks[j] + (k % PER_CLICK) * 0.04;
  const rest = SPOTS.length - PER_CLICK * T.clicks.length;
  return T.hold[0] + 0.1 + (T.hold[1] - T.hold[0] - 0.45) * ((k - PER_CLICK * T.clicks.length) / (rest - 1));
};
/** contraction eased by area */
const shrink = (t: number, at: number, d = 0.4) => Math.sqrt(1 - gl(t, at, d));

export const PolishedHeart: React.FC<{ t: number; scale?: number }> = ({ t, scale = 1 }) => {
  const { x, y, r } = DAWN_HEART;
  const press = T.clicks.reduce((a, k) => a + sp(t, k - 0.05, { w: 50, z: 1 }) - sp(t, k + 0.06, { w: 24, z: 0.7 }), 0);
  const cover = shrink(t, T.clicks[0] - 0.02, 0.45);
  const done = t >= T.hold[1] + 0.05;
  const goo = done ? 0 : Math.min(1, inv(T.clicks[0] - 0.12, T.clicks[0], t));
  const id = `pg${Math.round(t * 6000)}`;
  return (
    <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, transform: `scale(${scale * (1 - 0.02 * press)})` }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: r, background: C.white, boxShadow: SHADOW, overflow: "hidden" }}>
        {!done && (
          <div style={{ position: "absolute", inset: 0, filter: goo > 0.001 ? `url(#${id})` : undefined }}>
            {goo > 0.001 && <GooDefs id={id} blur={14 * goo} />}
            {DSPOTS.map((s) => {
              const k = t < T.clicks[0] - 0.1 ? 1 : shrink(t, goneAt(s.i), 0.38);
              if (k < 0.002) return null;
              return <div key={s.i} style={{ position: "absolute", left: s.x - s.r, top: s.y - s.r, width: s.r * 2, height: s.r * 2, borderRadius: s.r, background: C.ink, transform: `scale(${k})` }} />;
            })}
            {cover > 0.002 && <div style={{ position: "absolute", inset: 0, borderRadius: r, background: C.ink, transform: `scale(${cover})` }} />}
          </div>
        )}
      </div>
      <div style={{ position: "absolute", inset: -10, borderRadius: r + 10, border: `2px solid rgba(13,21,18,0.18)` }} />
    </div>
  );
};

export const Dawn: React.FC<{ t: number }> = ({ t }) => {
  // the heart comes back as a dot that opens (never zoom into a dot)
  const heartK = sp(t, T.polish, POP) * lerp(14 / DAWN_HEART.r, 1, gl(t, T.polish + 0.22, 0.8));
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
