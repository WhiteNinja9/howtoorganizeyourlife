import React from "react";
import { C, F } from "../lib/theme";
import { cRect, gl, hash, inv, POP, rectLerp, sp } from "../lib/motion";
import { Ayah, GooDefs, Mono, RefChip, Rise, Shape, Words } from "../ui/kit";
import { AYAT2 } from "./ayat";
import { HADITH } from "./pages";
import { T } from "./script";
import { NIGHT } from "../ui/Lids";

/** The heart: a white disc. Each sin places a black spot; they spread until the heart is covered (rān). */
export const HEART_C = { x: 600, y: 540 };
export const HEART_R = 200;

/** Seeded spots inside the disc, biggest last. */
export const SPOTS = Array.from({ length: 34 }, (_, i) => {
  const a = hash(i * 3.1) * Math.PI * 2;
  const d = Math.sqrt(hash(i * 7.7)) * (HEART_R - 30);
  return { x: HEART_C.x + Math.cos(a) * d, y: HEART_C.y + Math.sin(a) * d, r: 16 + hash(i * 1.9) * 30 + i * 0.8 };
});
const spotAt = (i: number) => T.spread + 2.4 * Math.pow(i / SPOTS.length, 0.7);

/** Black coverage of the heart from the scene's events (shared with the polish scene). */
export const HeartDisc: React.FC<{ t: number; id: string; covered?: boolean }> = ({ t, id, covered }) => {
  const grow = covered ? 1 : gl(t, T.covered - 0.6, 0.8);
  const gooAmt = covered ? 0 : Math.min(inv(T.spread, T.spread + 0.3, t), 1 - inv(T.covered + 0.2, T.covered + 0.5, t));
  return (
    <>
      <div style={{ position: "absolute", left: HEART_C.x - HEART_R, top: HEART_C.y - HEART_R, width: HEART_R * 2, height: HEART_R * 2, borderRadius: HEART_R, background: C.paper }} />
      <div style={{ position: "absolute", inset: 0, filter: gooAmt > 0.001 ? `url(#${id})` : undefined }}>
        {gooAmt > 0.001 && <GooDefs id={id} blur={14 * gooAmt} />}
        {!covered && (
          <div style={{ position: "absolute", left: SPOTS[0].x - 26, top: SPOTS[0].y - 26, width: 52, height: 52, borderRadius: 26, background: C.ink, transform: `scale(${sp(t, T.firstSpot, POP)})` }} />
        )}
        {!covered &&
          SPOTS.map((s, i) => {
            const k = sp(t, spotAt(i), POP);
            if (k < 0.002) return null;
            return <div key={i} style={{ position: "absolute", left: s.x - s.r, top: s.y - s.r, width: s.r * 2, height: s.r * 2, borderRadius: s.r, background: C.ink, transform: `scale(${k})` }} />;
          })}
        <div
          style={{
            position: "absolute",
            left: HEART_C.x - HEART_R,
            top: HEART_C.y - HEART_R,
            width: HEART_R * 2,
            height: HEART_R * 2,
            borderRadius: HEART_R,
            background: C.ink,
            transform: `scale(${grow})`,
          }}
        />
      </div>
      <div style={{ position: "absolute", left: HEART_C.x - HEART_R - 8, top: HEART_C.y - HEART_R - 8, width: HEART_R * 2 + 16, height: HEART_R * 2 + 16, borderRadius: HEART_R + 8, border: "2px solid rgba(244,239,230,0.55)", boxSizing: "border-box" }} />
    </>
  );
};

export const Heart: React.FC<{ t: number }> = ({ t }) => {
  const open = gl(t, T.heartOpen, 0.8);
  const dot = cRect(960, 540, 26, 26);
  const disc = rectLerp(dot, cRect(HEART_C.x, HEART_C.y, HEART_R * 2, HEART_R * 2), open);
  const col: React.CSSProperties = { position: "absolute", left: 930, width: 860 };
  const OUT = T.heartTextOut;
  return (
    <>
      <div style={{ position: "absolute", left: -600, top: -600, right: -600, bottom: -600, background: NIGHT }} />
      {open < 0.999 ? (
        <Shape rect={disc} color={C.paper} style={{ transform: `scale(${sp(t, T.heart + 0.15, POP)})` }} />
      ) : (
        <HeartDisc t={t} id={`hg${Math.round(t * 6000)}`} />
      )}
      <div style={{ position: "absolute", left: HEART_C.x - 200, width: 400, top: HEART_C.y + HEART_R + 40, textAlign: "center" }}>
        <Rise t={t} at={T.heartOpen + 0.6} out={T.ranOut}>
          <Mono color="rgba(244,239,230,0.6)">Your heart</Mono>
        </Rise>
      </div>

      {/* the hadith of the black spot */}
      <div style={{ ...col, top: 210, textAlign: "right" }}>
        <Words t={t} at={T.hadith1} out={OUT} per={0.06} rtl text={HADITH.a} pad="0.3em" style={{ fontFamily: F.ar, fontWeight: 700, fontSize: 44, color: C.white, lineHeight: 1.6 }} />
        <div style={{ height: 6 }} />
        <Words t={t} at={T.hadith1 + 0.8} out={OUT} per={0.02} text="“When the believer commits a sin, a black spot is placed on his heart.”" style={{ fontFamily: F.ui, fontSize: 32, color: "#CFCAC0", lineHeight: 1.35 }} />
        <div style={{ height: 34 }} />
        <Words t={t} at={T.hadith2} out={OUT} per={0.06} rtl text={HADITH.b} pad="0.3em" style={{ fontFamily: F.ar, fontWeight: 700, fontSize: 44, color: C.white, lineHeight: 1.6 }} />
        <div style={{ height: 6 }} />
        <Words t={t} at={T.hadith2 + 0.6} out={OUT} per={0.02} text="“If he increases, it increases until it covers his heart.”" style={{ fontFamily: F.ui, fontSize: 32, color: "#CFCAC0", lineHeight: 1.35 }} />
        <div style={{ height: 28 }} />
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <RefChip t={t} at={T.hadith2 + 1.6} out={OUT} color={C.goldSoft}>
            AḤMAD &amp; AL-TIRMIDHĪ · AL-DĀʾ WA AL-DAWĀʾ, P. 51
          </RefChip>
        </div>
      </div>

      {/* the rān: Al-Muṭaffifīn 83:14 */}
      <div style={{ ...col, top: 300 }}>
        <Ayah
          t={t}
          at={T.ran}
          out={T.ranOut}
          per={0.09}
          words={AYAT2.v83_14}
          page={588}
          size={74}
          color={C.white}
          mark={{ from: 2, to: 4, color: C.goldSoft, underlineAt: T.ran + 1.2 }}
        />
        <div style={{ height: 18 }} />
        <Words t={t} at={T.ran + 1.0} out={T.ranOut} per={0.02} text="“No! Rather, the stain has covered their hearts from what they used to earn.”" style={{ fontFamily: F.ui, fontSize: 32, color: "#CFCAC0", lineHeight: 1.35, justifyContent: "center" }} />
        <div style={{ height: 24 }} />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <RefChip t={t} at={T.ran + 1.6} out={T.ranOut} color={C.goldSoft}>
            AL-MUṬAFFIFĪN · 83:14
          </RefChip>
        </div>
      </div>
    </>
  );
};
