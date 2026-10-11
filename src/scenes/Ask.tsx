import React from "react";
import { C, F, SHADOW } from "../lib/theme";
import {
  clamp01,
  cRect,
  exitK,
  gl,
  graphemes,
  lerp,
  POP,
  Rect,
  rectLerp,
  sp,
  SNAP,
  tq,
  inv,
} from "../lib/motion";
import { Check, GooDefs, RefChip, Rise, Shape, tw, Underline, Words } from "../ui/kit";
import { WordmarkLetters, wordmarkGeom } from "../ui/Wordmark";
import { Cursor } from "../ui/Cursor";
import { CHIP_H, CHIP_LABELS, CHIP_X, chipW, QUESTION, T, TYPE_TIMES } from "../script";

/* ---------- geometry ---------- */
export const PILL = cRect(960, 540, 820, 116);
const TEXT_X = PILL.x + 52;
const SEND = { x: PILL.x + PILL.w - 18 - 40, y: 540 };
const CAPSULE = cRect(960, 540, 168, 64);
const DOT30 = cRect(960, 540, 30, 30);
const PANEL = cRect(960, 600, 1560, 720, 44);
const Q_W = tw("Geist", 500, 36, QUESTION);
const BUBBLE_Y = 150;

const CHIPS: Rect[] = CHIP_LABELS.map((l, i) => ({ x: CHIP_X[i], y: 560 - CHIP_H / 2, w: chipW(l), h: CHIP_H, r: CHIP_H / 2 }));
export const MERGED_LABEL = "That is what makes us the best.";
export const MERGED = cRect(960, 560, tw("Geist", 600, 40, MERGED_LABEL) + 112, 104);

const VERSE_1 = "كُنْتُمْ خَيْرَ أُمَّةٍ أُخْرِجَتْ لِلنَّاسِ";
const VERSE_2 = "تَأْمُرُونَ بِالْمَعْرُوفِ وَتَنْهَوْنَ عَنِ الْمُنْكَرِ وَتُؤْمِنُونَ بِاللَّهِ";

const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const mix = (a: number[], b: number[], k: number) => a.map((v, i) => lerp(v, b[i], clamp01(k)));
const css = (c: number[]) => `rgb(${c.map(Math.round).join(",")})`;

/* ---------- the scene ---------- */
export const Ask: React.FC<{ t: number }> = ({ t }) => {
  /* wordmark → dot → input pill */
  const p = gl(t, T.squeeze, 0.8);
  const g = wordmarkGeom(p);
  const pillK = gl(t, T.pill, 0.8);
  let hero = rectLerp(g.dot, PILL, pillK);
  // press squash on focus/send clicks
  const press = (c: number) => sp(t, c - 0.06, { w: 60, z: 1 }) - sp(t, c + 0.05, { w: 26, z: 0.8 });
  const squash = 1 - 0.035 * (press(T.focus) + press(T.send));
  // pill → capsule (thinking) → gone into the merging dots
  hero = rectLerp(hero, CAPSULE, gl(t, T.dots, 0.6));
  hero = rectLerp(hero, DOT30, gl(t, T.merge1, 0.3));
  const heroVisible = t < T.merge1 + 0.3;

  // ink dissolves outward from the caret into white (never lerp dark → light)
  const dissolve = gl(t, T.pill + 0.25, 0.75);
  const inkR = (1 - dissolve) * 1100;

  /* typing */
  const chars = graphemes(QUESTION);
  let n = 0;
  for (const tt of TYPE_TIMES) if (tq(t) >= tt) n++;
  const typed = chars.slice(0, n).join("");
  const focusK = sp(t, T.focus, SNAP);
  const typing = t >= T.typeFrom && t < T.typeTo + 0.15;
  const caretOn = t >= T.focus && t < T.send && (typing || (tq(t) - T.focus) % 1 < 0.5);
  const sendOn = gl(t, T.sendOn, 0.35);

  /* the question flies into a bubble */
  const fly = gl(t, T.send + 0.04, 0.65);
  const qFrom = { x: TEXT_X + Q_W / 2, y: 540 };
  const qTo = { x: 960, y: BUBBLE_Y };
  const qx = lerp(qFrom.x, qTo.x, fly);
  const qy = lerp(qFrom.y, qTo.y, fly) - Math.sin(Math.PI * fly) * 60;
  const bubbleK = sp(t, T.send + 0.45, { w: 18, z: 0.85 });
  const bubbleOut = exitK(t, T.merge2, 0.32);

  /* thinking dots → one dot → panel */
  const dotsK = sp(t, T.dots + 0.35, POP);
  const merge = gl(t, T.merge1, 0.35);
  const panelK = gl(t, T.panel, 0.8);
  const panel = rectLerp(DOT30, PANEL, panelK);

  /* split into chips, then merge into one container */
  const splitK = (i: number) => gl(t, T.split + i * 0.05, 0.8);
  const mergeK = gl(t, T.merge2, 0.7);
  const blobs = CHIPS.map((c, i) => rectLerp(rectLerp(PANEL, c, splitK(i)), MERGED, mergeK));
  const blobColor = css(mix(mix(rgb(C.ink), rgb(C.emerald), splitK(1)), rgb(C.ink), mergeK));
  const gooAmt = (a: number, b: number) => Math.min(inv(a, a + 0.15, t), 1 - inv(b - 0.2, b, t));
  const goo = Math.max(gooAmt(T.split - 0.05, T.split + 1.0), gooAmt(T.merge2 - 0.05, T.merge2 + 0.85));
  const gooId = `goo${Math.round(t * 6000)}`;

  return (
    <>
      <WordmarkLetters p={p} />

      {/* question bubble (after send) */}
      {tq(t) >= T.send + 0.04 && !bubbleOut.gone && (
        <div
          style={{
            position: "absolute",
            left: qx,
            top: qy - bubbleOut.off * 160,
            transform: "translate(-50%,-50%)",
            filter: bubbleOut.blur > 0.05 ? `blur(${bubbleOut.blur}px)` : undefined,
            opacity: bubbleOut.op,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: "-16px -30px",
              borderRadius: 30,
              background: C.bubble,
              transform: `scale(${bubbleK})`,
            }}
          />
          <div style={{ position: "relative", fontFamily: F.ui, fontWeight: 500, fontSize: 36, color: C.ink, whiteSpace: "nowrap" }}>
            {QUESTION}
          </div>
        </div>
      )}

      {/* hero: dot → input pill → capsule */}
      {heroVisible && (
        <Shape rect={hero} color={pillK > 0 ? C.white : C.ink} style={{ boxShadow: pillK > 0.3 ? SHADOW : undefined, transform: `scale(${squash})` }}>
          {/* ink dissolving outward from the caret */}
          {inkR > 0.5 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: C.ink,
                WebkitMaskImage: `radial-gradient(circle at ${TEXT_X - hero.x}px 50%, transparent ${Math.max(0, 1100 - inkR - 60)}px, black ${1100 - inkR + 60}px)`,
                maskImage: `radial-gradient(circle at ${TEXT_X - hero.x}px 50%, transparent ${Math.max(0, 1100 - inkR - 60)}px, black ${1100 - inkR + 60}px)`,
              }}
            />
          )}
          {/* contents laid out at full size; the shape clips them as it changes */}
          <div style={{ position: "absolute", left: PILL.x - hero.x, top: PILL.y - hero.y, width: PILL.w, height: PILL.h }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 58,
                boxShadow: `inset 0 0 0 ${3 * focusK * (1 - gl(t, T.send, 0.2))}px ${C.emerald}`,
              }}
            />
            <div style={{ position: "absolute", left: 52, top: 0, height: PILL.h, display: "flex", alignItems: "center" }}>
              {t < T.focus + 0.02 ? (
                <Rise t={t} at={T.pill + 0.6} out={T.focus}>
                  <span style={{ fontFamily: F.ui, fontSize: 36, color: "#A8A397" }}>Ask anything…</span>
                </Rise>
              ) : (
                tq(t) < T.send + 0.04 && (
                  <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 36, color: C.ink, whiteSpace: "nowrap" }}>{typed}</span>
                )
              )}
              {caretOn && <span style={{ width: 3, height: 44, background: C.emerald, marginLeft: 3, borderRadius: 2 }} />}
            </div>
            {/* send button */}
            <div
              style={{
                position: "absolute",
                left: SEND.x - PILL.x - 40,
                top: PILL.h / 2 - 40,
                width: 80,
                height: 80,
                borderRadius: 40,
                background: C.line,
                overflow: "hidden",
                transform: `scale(${sp(t, T.pill + 0.5, POP) * (1 - 0.08 * press(T.send))})`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: C.emerald,
                  WebkitMaskImage: `radial-gradient(circle, black ${sendOn * 60}px, transparent ${sendOn * 60 + 12}px)`,
                  maskImage: `radial-gradient(circle, black ${sendOn * 60}px, transparent ${sendOn * 60 + 12}px)`,
                }}
              />
              <svg width={80} height={80} viewBox="0 0 80 80" style={{ position: "absolute", inset: 0 }}>
                <path d="M40 54 V27 M28 38 L40 26 L52 38" stroke={C.white} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </Shape>
      )}

      {/* thinking dots → goo-merge into one dot → that dot opens into the verse panel */}
      {t >= T.dots && t < T.panel + 0.02 && (
        <div style={{ position: "absolute", inset: 0, filter: merge > 0.001 ? `url(#${gooId}d)` : undefined }}>
          {merge > 0.001 && <GooDefs id={`${gooId}d`} blur={14 * Math.min(1, merge * 4) * (1 - inv(T.merge1 + 0.25, T.merge1 + 0.3, t))} />}
          {[-1, 0, 1].map((k) => {
            const bob = t < T.merge1 ? Math.sin((t - T.dots) * 9 - (k + 1) * 0.9) * 7 * dotsK : 0;
            const size = lerp(16 * dotsK, 30, merge);
            const x = lerp(960 + k * 40, 960, merge);
            return (
              <div
                key={k}
                style={{
                  position: "absolute",
                  left: x - size / 2,
                  top: 540 - size / 2 - Math.max(0, bob),
                  width: size,
                  height: size,
                  borderRadius: size,
                  background: C.ink,
                }}
              />
            );
          })}
        </div>
      )}

      {t >= T.panel && t < T.split + 0.02 && <Shape rect={panel} color={C.ink} />}

      {/* chips (goo during split / merge) */}
      {t >= T.split && t < T.bento + 0.02 && (
        <div style={{ position: "absolute", inset: 0, filter: goo > 0.001 ? `url(#${gooId})` : undefined }}>
          {goo > 0.001 && <GooDefs id={gooId} blur={14 * goo} />}
          {blobs.map((r, i) => (
            <Shape key={i} rect={r} color={blobColor} />
          ))}
        </div>
      )}
      {/* verse content inside the panel */}
      {t >= T.panel && t < T.split + 0.6 && (
        <div style={{ position: "absolute", left: PANEL.x, top: PANEL.y, width: PANEL.w, height: PANEL.h, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 54 }}>
          <RefChip t={t} at={T.panel + 0.7} out={T.verseOut} color={C.goldSoft}>
            ĀL ʿIMRĀN · 3:110
          </RefChip>
          <div style={{ height: 18 }} />
          <Words
            t={t}
            at={T.panel + 0.85}
            out={T.verseOut}
            per={0.07}
            rtl
            text={VERSE_1}
            pad="0.35em"
            style={{ fontFamily: F.ayah, fontSize: 88, lineHeight: 1.75, color: C.white, justifyContent: "center" }}
            mark={(i) => (i === 1 ? { color: C.mint } : undefined)}
            deco={(i) => (i === 1 ? <Underline t={t} at={T.panel + 2.3} out={T.verseOut} color={C.mint} rtl h={5} /> : null)}
          />
          <Words
            t={t}
            at={T.panel + 1.6}
            out={T.verseOut}
            per={0.045}
            rtl
            text={VERSE_2}
            pad="0.35em"
            style={{ fontFamily: F.ayah, fontSize: 54, lineHeight: 1.8, color: "rgba(255,253,248,0.82)", justifyContent: "center" }}
          />
          <div style={{ height: 30 }} />
          <div style={{ width: 1220 }}>
            <Words
              t={t}
              at={T.panel + 2.6}
              out={T.verseOut}
              per={0.022}
              text="“You are the best nation brought forth for mankind: you enjoin what is right, forbid what is wrong, and believe in Allah.”"
              style={{ fontFamily: F.ui, fontSize: 36, lineHeight: 1.38, color: "#C9C5BC", justifyContent: "center" }}
            />
          </div>
        </div>
      )}

      {t >= T.split && t < T.merge2 + 0.1 &&
        CHIPS.map((c, i) => {
          const chk = sp(t, T.checks[i], POP);
          const outK = exitK(t, T.merge2 - 0.08, 0.25);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: c.x + 22,
                top: c.y,
                height: CHIP_H,
                display: "flex",
                alignItems: "center",
                gap: 16,
                opacity: outK.op,
                filter: outK.blur > 0.05 ? `blur(${outK.blur}px)` : undefined,
              }}
            >
              <div style={{ position: "relative", width: 44, height: 44, transform: `scale(${sp(t, T.split + 0.5 + i * 0.08, POP)})` }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: 22, border: "2.5px solid rgba(255,253,248,0.55)" }} />
                <div style={{ position: "absolute", inset: 0, borderRadius: 22, background: C.white, display: "grid", placeItems: "center", transform: `scale(${chk})` }}>
                  <Check color={C.emerald} size={28} />
                </div>
              </div>
              <Rise t={t} at={T.split + 0.55 + i * 0.08}>
                <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 30, color: C.white, whiteSpace: "nowrap" }}>{CHIP_LABELS[i]}</span>
              </Rise>
            </div>
          );
        })}
      {t >= T.merge2 && t < T.bento && (
        <div style={{ position: "absolute", left: MERGED.x, top: MERGED.y, width: MERGED.w, height: MERGED.h, display: "grid", placeItems: "center" }}>
          <Rise t={t} at={T.merge2 + 0.45} out={T.bento - 0.4}>
            <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 40, color: C.white, whiteSpace: "nowrap" }}>{MERGED_LABEL}</span>
          </Rise>
        </div>
      )}

      <Cursor
        t={t}
        show={[2.2, T.send + 0.3]}
        keys={[
          [2.2, 1560, 880],
          [2.22, 720, 560, 0.55],
          [T.focus + 0.2, 1110, 660, 0.5],
          [T.sendOn - 0.25, SEND.x + 6, SEND.y + 8, 0.45],
          [T.send + 0.12, 1250, 760, 0.5],
        ]}
        clicks={[T.focus, T.send]}
        hovers={[
          [2.6, T.focus + 0.15],
          [T.sendOn, T.send + 0.1],
        ]}
      />
    </>
  );
};
