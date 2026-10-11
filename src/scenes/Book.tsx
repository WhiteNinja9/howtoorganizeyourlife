import React from "react";
import { AbsoluteFill } from "remotion";
import { b, FULL, multi, POP, Rect, rectLerp, sp, SOFT, SNAP } from "../lib/anim";
import { C, F } from "../lib/theme";
import { Mono, Rise, Shape, tw, Words } from "../ui/primitives";
import { RefChip } from "../ui/Quote";
import { Hud } from "../ui/Hud";
import { Sfx, T } from "../timeline";

const s = (beats: number) => T.book + b(beats);

/** The book cover the emerald contracts into. Designed stand-in, not a photo. */
const BOOK: Rect = { x: 236, y: 170, w: 500, h: 740, r: 14 };
const OUT1 = s(13); // first half (al-Dāʾ wa al-Dawāʾ) leaves
const RECOLOR = s(13); // cover repaints into al-Fawāʾid
const EXIT = s(32); // everything leaves; chain pill hands over to the day bar

/** The chain from al-Fawāʾid p.45 (Ibn al-Qayyim). */
export const CHAIN = [
  { ar: "خَطْرَة", en: "a passing thought" },
  { ar: "فِكْرَة", en: "a thought you dwell on" },
  { ar: "شَهْوَة", en: "a desire" },
  { ar: "عَزِيمَة", en: "resolve" },
  { ar: "فِعْل", en: "an action" },
  { ar: "عَادَة", en: "a habit" },
];
const STAGE = (i: number) => s(16 + i * 2);
export const CHAIN_C = { x: 1310, y: 560 };
export const CHAIN_H = 132;
const chainW = (i: number) => tw("Amiri", 700, 62, CHAIN[i].ar) + 30 + tw("Geist", 500, 32, CHAIN[i].en) + 120;
export const CHAIN_LAST_W = chainW(CHAIN.length - 1);

export const BOOK_SFX: Sfx[] = [
  { f: s(0), kind: "contract" },
  { f: s(1), kind: "draw" },
  { f: s(1.5), kind: "pop" },
  { f: s(2), kind: "rise" },
  { f: s(5), kind: "rise" },
  { f: s(6.5), kind: "rise" },
  { f: s(8.5), kind: "pop" },
  { f: s(10), kind: "chime" },
  { f: RECOLOR, kind: "swap" },
  ...CHAIN.map((_, i) => ({ f: STAGE(i), kind: (i === 0 ? "pop" : "swap") as Sfx["kind"] })),
  { f: s(28), kind: "rise" },
  { f: s(29.5), kind: "pop" },
  { f: EXIT, kind: "swap" },
];

const Star: React.FC<{ k: number; color: string }> = ({ k, color }) => (
  <svg width={150} height={150} viewBox="-75 -75 150 150" style={{ transform: `scale(${k}) rotate(${(1 - k) * -45}deg)` }}>
    <rect x={-46} y={-46} width={92} height={92} fill="none" stroke={color} strokeWidth={2.5} />
    <rect x={-46} y={-46} width={92} height={92} fill="none" stroke={color} strokeWidth={2.5} transform="rotate(45)" />
    <circle r={26} fill="none" stroke={color} strokeWidth={2} />
    <circle r={6} fill={color} />
  </svg>
);

const Cover: React.FC<{ frame: number }> = ({ frame }) => {
  const border = sp(frame, s(1), { damping: 26, stiffness: 50 });
  const spine = sp(frame, s(1), SOFT);
  const paint = sp(frame, RECOLOR, { damping: 28, stiffness: 120 });
  const center: React.CSSProperties = { position: "absolute", left: 0, right: 0, textAlign: "center", direction: "rtl" };
  return (
    <>
      {/* repaint: ink sweeps across from the right edge (Arabic books open from the right) */}
      <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: `${paint * 100}%`, background: C.ink }} />
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 22 * spine, background: "rgba(0,0,0,0.28)" }} />
      <svg width={BOOK.w} height={BOOK.h} style={{ position: "absolute", inset: 0 }}>
        <rect x={34} y={34} width={BOOK.w - 68} height={BOOK.h - 68} rx={6} fill="none" stroke={C.gold} strokeWidth={2.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - border} />
        <rect x={46} y={46} width={BOOK.w - 92} height={BOOK.h - 92} rx={4} fill="none" stroke={C.gold} strokeWidth={1.2} opacity={0.7} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - border} />
      </svg>
      <div style={{ position: "absolute", left: BOOK.w / 2 - 75, top: 92 }}>
        <Star k={sp(frame, s(1.5), POP)} color={C.gold} />
      </div>
      <div style={{ ...center, top: 290, fontFamily: F.ar, fontWeight: 700, fontSize: 82, color: C.goldSoft, lineHeight: 1.5 }}>
        <Rise frame={frame} at={s(2)} out={OUT1} pad="0.3em">الداء والدواء</Rise>
      </div>
      <div style={{ ...center, top: 290, fontFamily: F.ar, fontWeight: 700, fontSize: 92, color: C.goldSoft, lineHeight: 1.5 }}>
        <Rise frame={frame} at={RECOLOR + 8} pad="0.3em">الفوائد</Rise>
      </div>
      <div style={{ ...center, top: 430, fontFamily: F.ar, fontSize: 30, color: "rgba(255,253,248,0.8)", lineHeight: 1.55 }}>
        <Rise frame={frame} at={s(2.5)} out={OUT1} pad="0.3em">الجواب الكافي</Rise>
        <br />
        <Rise frame={frame} at={s(2.7)} out={OUT1} pad="0.3em">لمن سأل عن الدواء الشافي</Rise>
      </div>
      <div
        style={{
          position: "absolute",
          left: BOOK.w / 2 - 90,
          top: 560,
          width: 180 * sp(frame, s(3), SOFT),
          height: 2,
          background: C.gold,
          transformOrigin: "center",
          marginLeft: 90 * (1 - sp(frame, s(3), SOFT)),
        }}
      />
      <div style={{ ...center, top: 590, fontFamily: F.ar, fontWeight: 700, fontSize: 42, color: C.white, lineHeight: 1.5 }}>
        <Rise frame={frame} at={s(3)} pad="0.3em">ابن قيم الجوزية</Rise>
      </div>
      <div style={{ ...center, top: 655, fontFamily: F.ar, fontSize: 28, color: C.gold, lineHeight: 1.5 }}>
        <Rise frame={frame} at={s(3.5)} pad="0.3em">ت ٧٥١ هـ</Rise>
      </div>
    </>
  );
};

export const Book: React.FC<{ frame: number }> = ({ frame }) => {
  // emerald contracts from full frame into the cover; later the cover slides out left (page push)
  const push = sp(frame, EXIT - 6, SNAP);
  let book = rectLerp(FULL, BOOK, sp(frame, s(0), { damping: 30, stiffness: 170 }));
  book = { ...book, x: book.x - push * 900 };

  // the chain pill: pops at stage 0, width follows each word
  const pillW = multi(frame, chainW(0), CHAIN.slice(1).map((_, i) => [STAGE(i + 1), chainW(i + 1)] as [number, number]));
  const pillK = sp(frame, STAGE(0), POP);
  const col: React.CSSProperties = { position: "absolute", left: 860, width: 900 };

  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <Shape rect={book} color={C.emerald} style={{ boxShadow: `0 ${30 * sp(frame, s(1), SOFT)}px 60px rgba(13,21,18,0.18)` }}>
        <div style={{ position: "absolute", left: BOOK.x - push * 900 - book.x, top: BOOK.y - book.y, width: BOOK.w, height: BOOK.h }}>
          <Cover frame={frame} />
        </div>
      </Shape>

      {/* ---- part 1: al-Dāʾ wa al-Dawāʾ ---- */}
      <div style={{ ...col, top: 150 }}>
        <Rise frame={frame} at={s(1)} out={OUT1}>
          <Mono>04 — The cure</Mono>
        </Rise>
        <div style={{ height: 30 }} />
        <Rise frame={frame} at={s(2)} out={OUT1}>
          <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 64, color: C.ink, letterSpacing: "-0.02em" }}>Ibn al-Qayyim</span>
        </Rise>
        <br />
        <Rise frame={frame} at={s(2.5)} out={OUT1}>
          <span style={{ fontFamily: F.ui, fontSize: 30, color: C.muted }}>Damascus · died 751 AH</span>
        </Rise>
        <div style={{ height: 34 }} />
        <Words frame={frame} at={s(5)} out={OUT1} stagger={1} text="opened his book al-Dāʾ wa al-Dawāʾ with this hadith:" style={{ fontFamily: F.ui, fontSize: 34, color: C.ink2 }} />
        <div style={{ height: 22 }} />
        <Words
          frame={frame}
          at={s(6.5)}
          out={OUT1}
          rtl
          text="مَا أَنْزَلَ اللَّهُ دَاءً إِلَّا أَنْزَلَ لَهُ شِفَاءً"
          pad="0.3em"
          style={{ fontFamily: F.ar, fontWeight: 700, fontSize: 76, color: C.emerald, lineHeight: 1.5 }}
        />
        <div style={{ height: 14 }} />
        <Words
          frame={frame}
          at={s(7.5)}
          out={OUT1}
          stagger={1}
          text="“Allah has not sent down any disease except that He also sent down its cure.”"
          style={{ fontFamily: F.ui, fontSize: 36, color: C.ink, lineHeight: 1.35 }}
        />
        <div style={{ height: 26 }} />
        <RefChip frame={frame} at={s(8.5)} out={OUT1} color={C.ink}>
          ṢAḤĪḤ AL-BUKHĀRĪ · 5678
        </RefChip>
        <div style={{ height: 40 }} />
        <Words
          frame={frame}
          at={s(10)}
          out={OUT1}
          stagger={2}
          text="The heart has its illnesses too, and every one has a cure."
          style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 38, color: C.emerald, lineHeight: 1.3 }}
        />
      </div>

      {/* ---- part 2: al-Fawāʾid, how a habit is born ---- */}
      <div style={{ ...col, top: 150 }}>
        <Rise frame={frame} at={RECOLOR + 10} out={EXIT}>
          <Mono>05 — How a habit is born</Mono>
        </Rise>
        <div style={{ height: 30 }} />
        <Words
          frame={frame}
          at={s(14)}
          out={EXIT}
          stagger={2}
          text="In al-Fawāʾid, he traces it step by step."
          style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 48, color: C.ink, letterSpacing: "-0.015em", lineHeight: 1.2 }}
        />
      </div>

      {/* the chain pill */}
      {pillK > 0.001 && (
        <Shape
          rect={{
            x: CHAIN_C.x - (pillW * pillK) / 2,
            y: CHAIN_C.y - (CHAIN_H * pillK) / 2,
            w: pillW * pillK,
            h: CHAIN_H * pillK,
            r: (CHAIN_H * pillK) / 2,
          }}
          color={C.ink}
        />
      )}
      {CHAIN.map((c, i) => (
        <div
          key={c.ar}
          style={{
            position: "absolute",
            left: CHAIN_C.x - 600,
            width: 1200,
            top: CHAIN_C.y,
            transform: "translateY(-50%)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 30,
          }}
        >
          <Rise frame={frame} at={STAGE(i) + 3} out={i < CHAIN.length - 1 ? STAGE(i + 1) : EXIT - 8} pad="0.3em">
            <span style={{ fontFamily: F.ar, fontWeight: 700, fontSize: 62, color: C.goldSoft, lineHeight: 1.5 }}>{c.ar}</span>
          </Rise>
          <Rise frame={frame} at={STAGE(i) + 5} out={i < CHAIN.length - 1 ? STAGE(i + 1) : EXIT - 8}>
            <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 32, color: C.white }}>{c.en}</span>
          </Rise>
        </div>
      ))}
      {/* step track */}
      <div style={{ position: "absolute", left: CHAIN_C.x - 330, top: CHAIN_C.y + 120, width: 660, height: 60 }}>
        <div
          style={{
            position: "absolute",
            left: 15,
            top: 14,
            height: 2,
            background: C.line,
            width: 630 * sp(frame, STAGE(0), SOFT) * (1 - sp(frame, EXIT - 10, SNAP)),
          }}
        />
        {CHAIN.map((_, i) => {
          const on = sp(frame, STAGE(i), POP);
          const k = sp(frame, STAGE(0) + i * 2, POP) * (1 - sp(frame, EXIT - 10 + i, SNAP));
          return (
            <div key={i} style={{ position: "absolute", left: i * 126, top: 0, width: 30, transform: `scale(${k})` }}>
              <div style={{ width: 30, height: 30, borderRadius: 15, background: C.paper, border: `2px solid ${C.ink}` }}>
                <div style={{ margin: 5, width: 16, height: 16, borderRadius: 8, background: C.ink, transform: `scale(${on})` }} />
              </div>
              <div style={{ fontFamily: F.mono, fontSize: 16, color: C.muted, marginTop: 8, textAlign: "center" }}>0{i + 1}</div>
            </div>
          );
        })}
      </div>
      {/* conclusion */}
      <div style={{ ...col, top: 790, textAlign: "right" }}>
        <Words
          frame={frame}
          at={s(28)}
          out={EXIT}
          rtl
          stagger={2}
          text="فإن لم تتداركهُ بضدِّه صار عادةً، فيصعُبُ عليك الانتقالُ عنها"
          pad="0.3em"
          style={{ fontFamily: F.ar, fontWeight: 700, fontSize: 40, color: C.ink, lineHeight: 1.5 }}
        />
      </div>
      <div style={{ ...col, top: 870 }}>
        <Words
          frame={frame}
          at={s(29)}
          out={EXIT}
          stagger={1}
          text="“If you do not counter it with its opposite, it becomes a habit, and then it is hard for you to leave it.”"
          style={{ fontFamily: F.ui, fontSize: 28, color: C.ink2, lineHeight: 1.35 }}
        />
        <div style={{ height: 18 }} />
        <RefChip frame={frame} at={s(29.5)} out={EXIT} color={C.ink}>
          IBN AL-QAYYIM · AL-FAWĀʾID · P. 45
        </RefChip>
      </div>
      <Hud frame={frame} at={s(1)} out={EXIT} index={4} color={C.ink} />
    </AbsoluteFill>
  );
};
