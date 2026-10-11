import React from "react";
import { C, F, SHADOW } from "../lib/theme";
import { contract, exitK, gl, multi, POP, Rect, sp, SOFT } from "../lib/motion";
import { Mono, RefChip, Rise, Shape, tw, Words } from "../ui/kit";
import { T } from "../script";

/** Designed cover (a stand-in, not a photo). Plain double frame + arch outline — no star shapes. */
export const BOOK: Rect = { x: 236, y: 170, w: 500, h: 740, r: 14 };

export const CHAIN = [
  { ar: "خَطْرَة", en: "a passing thought" },
  { ar: "فِكْرَة", en: "a thought you dwell on" },
  { ar: "شَهْوَة", en: "a desire" },
  { ar: "عَزِيمَة", en: "resolve" },
  { ar: "فِعْل", en: "an action" },
  { ar: "عَادَة", en: "a habit" },
];
export const CHAIN_C = { x: 1310, y: 520 };
export const CHAIN_H = 132;
const chainW = (i: number) => tw("Plex", 700, 58, CHAIN[i].ar) + 30 + tw("Geist", 500, 32, CHAIN[i].en) + 120;
export const CHAIN_LAST_W = chainW(CHAIN.length - 1);

const ARCH = "M -62 70 V -6 C -62 -48 -24 -66 0 -96 C 24 -66 62 -48 62 -6 V 70";

const Cover: React.FC<{ t: number }> = ({ t }) => {
  const border = gl(t, T.cover, 1.1);
  const arch = gl(t, T.cover + 0.2, 1.0);
  const paint = gl(t, T.repaint, 0.7);
  const ctr: React.CSSProperties = { position: "absolute", left: 0, right: 0, textAlign: "center", direction: "rtl" };
  return (
    <>
      {/* ink paints across from the right edge (Arabic books open from the right) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: C.ink,
          WebkitMaskImage: `linear-gradient(to left, black ${paint * 120 - 20}%, transparent ${paint * 120}%)`,
          maskImage: `linear-gradient(to left, black ${paint * 120 - 20}%, transparent ${paint * 120}%)`,
        }}
      />
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 22 * sp(t, T.cover, SOFT), background: "rgba(0,0,0,0.25)" }} />
      <svg width={BOOK.w} height={BOOK.h} style={{ position: "absolute", inset: 0 }}>
        <rect x={34} y={34} width={BOOK.w - 68} height={BOOK.h - 68} rx={6} fill="none" stroke={C.gold} strokeWidth={2.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - border} />
        <rect x={46} y={46} width={BOOK.w - 92} height={BOOK.h - 92} rx={4} fill="none" stroke={C.gold} strokeWidth={1.2} opacity={0.7} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - border} />
        <g transform={`translate(${BOOK.w / 2} 196)`}>
          <path d={ARCH} fill="none" stroke={C.gold} strokeWidth={2.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - arch} />
          <path d="M -40 70 V 4 C -40 -26 -14 -40 0 -62 C 14 -40 40 -26 40 4 V 70" fill="none" stroke={C.gold} strokeWidth={1.2} opacity={0.7} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - arch} />
        </g>
      </svg>
      <div style={{ ...ctr, top: 300, fontFamily: F.ar, fontWeight: 700, fontSize: 70, color: C.goldSoft, lineHeight: 1.5 }}>
        <Rise t={t} at={T.cover + 0.4} out={T.repaint} pad="0.3em">الداء والدواء</Rise>
      </div>
      <div style={{ ...ctr, top: 300, fontFamily: F.ar, fontWeight: 700, fontSize: 80, color: C.goldSoft, lineHeight: 1.5 }}>
        <Rise t={t} at={T.repaint + 0.3} pad="0.3em">الفوائد</Rise>
      </div>
      <div style={{ ...ctr, top: 430, fontFamily: F.ar, fontSize: 27, color: "rgba(255,253,248,0.8)", lineHeight: 1.6 }}>
        <Rise t={t} at={T.cover + 0.6} out={T.repaint} pad="0.3em">الجواب الكافي</Rise>
        <br />
        <Rise t={t} at={T.cover + 0.66} out={T.repaint} pad="0.3em">لمن سأل عن الدواء الشافي</Rise>
      </div>
      <div style={{ position: "absolute", left: BOOK.w / 2 - 90, top: 556, width: 180, height: 2, background: C.gold, transform: `scaleX(${sp(t, T.cover + 0.8, SOFT)})` }} />
      <div style={{ ...ctr, top: 580, fontFamily: F.ar, fontWeight: 600, fontSize: 38, color: C.white, lineHeight: 1.6 }}>
        <Rise t={t} at={T.cover + 0.9} pad="0.3em">ابن قيم الجوزية</Rise>
      </div>
      <div style={{ ...ctr, top: 646, fontFamily: F.ar, fontSize: 25, color: C.gold, lineHeight: 1.6 }}>
        <Rise t={t} at={T.cover + 1.0} pad="0.3em">ت ٧٥١ هـ</Rise>
      </div>
    </>
  );
};

export const Book: React.FC<{ t: number }> = ({ t }) => {
  const out = exitK(t, T.bookOut, 0.45);
  const shiftX = -out.off * 1000;
  const book = contract(t, T.contract1, BOOK, 0.5);
  const col: React.CSSProperties = { position: "absolute", left: 860, width: 900 };

  const pillW = multi(
    t,
    chainW(0),
    CHAIN.slice(1).map((_, i) => [T.stages[i + 1], chainW(i + 1), { w: 13, z: 0.86 }] as [number, number, { w: number; z: number }]),
  );
  const pillK = sp(t, T.stages[0], POP);

  return (
    <>
      <div style={{ position: "absolute", left: -400, top: -400, right: -400, bottom: -400, background: C.paper }} />
      {/* the emerald contracts into the cover; the cover pushes out left at the end */}
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${shiftX}px)`, filter: out.blur > 0.05 ? `blur(${out.blur * 1.5}px)` : undefined }}>
        <Shape rect={book} color={C.emerald} style={{ boxShadow: t > T.cover ? SHADOW : undefined }}>
          <div style={{ position: "absolute", left: BOOK.x - book.x, top: BOOK.y - book.y, width: BOOK.w, height: BOOK.h }}>
            <Cover t={t} />
          </div>
        </Shape>
      </div>

      {/* ---- part 1: al-Dāʾ wa al-Dawāʾ ---- */}
      <div style={{ ...col, top: 140 }}>
        <Rise t={t} at={T.readCure} out={T.cureOut}>
          <Mono>03 — The cure</Mono>
        </Rise>
        <div style={{ height: 26 }} />
        <Rise t={t} at={T.readCure + 0.1} out={T.cureOut}>
          <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 64, color: C.ink, letterSpacing: "-0.02em" }}>Ibn al-Qayyim</span>
        </Rise>
        <br />
        <Rise t={t} at={T.readCure + 0.2} out={T.cureOut}>
          <span style={{ fontFamily: F.ui, fontSize: 30, color: C.muted }}>Damascus · died 751 AH</span>
        </Rise>
        <div style={{ height: 30 }} />
        <Words t={t} at={T.readCure + 0.6} out={T.cureOut} per={0.03} text="opened his book al-Dāʾ wa al-Dawāʾ with this hadith:" style={{ fontFamily: F.ui, fontSize: 34, color: C.ink2 }} />
        <div style={{ height: 18 }} />
        <Words
          t={t}
          at={T.readCure + 1.2}
          out={T.cureOut}
          per={0.07}
          rtl
          text="مَا أَنْزَلَ اللَّهُ دَاءً إِلَّا أَنْزَلَ لَهُ شِفَاءً"
          pad="0.3em"
          style={{ fontFamily: F.ar, fontWeight: 700, fontSize: 62, color: C.emerald, lineHeight: 1.6 }}
        />
        <div style={{ height: 12 }} />
        <Words
          t={t}
          at={T.readCure + 2.0}
          out={T.cureOut}
          per={0.025}
          text="“Allah has not sent down any disease except that He also sent down its cure.”"
          style={{ fontFamily: F.ui, fontSize: 36, color: C.ink, lineHeight: 1.35 }}
        />
        <div style={{ height: 24 }} />
        <RefChip t={t} at={T.readCure + 2.6} out={T.cureOut} color={C.ink}>
          ṢAḤĪḤ AL-BUKHĀRĪ · 5678
        </RefChip>
        <div style={{ height: 36 }} />
        <Words
          t={t}
          at={T.readCure + 3.2}
          out={T.cureOut}
          per={0.04}
          text="The heart has its illnesses too, and every one has a cure."
          style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 38, color: C.emerald, lineHeight: 1.3 }}
        />
      </div>

      {/* ---- part 2: al-Fawāʾid — how a habit is born ---- */}
      <div style={{ ...col, top: 236 }}>
        <Rise t={t} at={T.chainHead - 0.1} out={T.bookOut}>
          <Mono>04 — How a habit is born</Mono>
        </Rise>
        <div style={{ height: 18 }} />
        <Words
          t={t}
          at={T.chainHead}
          out={T.bookOut}
          per={0.04}
          text="In al-Fawāʾid, he traces it step by step."
          style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 44, color: C.ink, letterSpacing: "-0.015em" }}
        />
      </div>

      {pillK > 0.002 && (
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
      {CHAIN.map((c, i) => {
        const at = T.stages[i] + 0.12;
        const end = i < CHAIN.length - 1 ? T.stages[i + 1] - 0.05 : T.bookOut - 0.15;
        return (
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
            <Rise t={t} at={at} out={end} pad="0.3em">
              <span style={{ fontFamily: F.ar, fontWeight: 700, fontSize: 58, color: C.goldSoft, lineHeight: 1.6 }}>{c.ar}</span>
            </Rise>
            <Rise t={t} at={at + 0.05} out={end}>
              <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 32, color: C.white, whiteSpace: "nowrap" }}>{c.en}</span>
            </Rise>
          </div>
        );
      })}
      {/* step track */}
      <div style={{ position: "absolute", left: CHAIN_C.x - 330, top: CHAIN_C.y + 116, width: 660, height: 60 }}>
        <div style={{ position: "absolute", left: 15, top: 14, height: 2, background: C.line, width: 630 * sp(t, T.stages[0], SOFT) * (1 - exitK(t, T.bookOut - 0.2).off) }} />
        {CHAIN.map((_, i) => {
          const on = sp(t, T.stages[i], POP);
          const k = sp(t, T.stages[0] + i * 0.05, POP) * (1 - exitK(t, T.bookOut - 0.2 + i * 0.02, 0.28).off);
          return (
            <div key={i} style={{ position: "absolute", left: i * 126, top: 0, width: 30, transform: `scale(${k})` }}>
              <div style={{ width: 30, height: 30, borderRadius: 15, background: C.paper, border: `2px solid ${C.ink}`, boxSizing: "border-box", display: "grid", placeItems: "center" }}>
                <div style={{ width: 16, height: 16, borderRadius: 8, background: C.ink, transform: `scale(${on})` }} />
              </div>
              <div style={{ fontFamily: F.mono, fontSize: 16, color: C.muted, marginTop: 8, textAlign: "center" }}>0{i + 1}</div>
            </div>
          );
        })}
      </div>
      {/* conclusion */}
      <div style={{ ...col, top: 760, textAlign: "right" }}>
        <Words
          t={t}
          at={T.conclude}
          out={T.bookOut}
          per={0.05}
          rtl
          text="فإن لم تتداركهُ بضدِّه صار عادةً، فيصعُبُ عليك الانتقالُ عنها"
          pad="0.3em"
          style={{ fontFamily: F.ar, fontWeight: 600, fontSize: 38, color: C.ink, lineHeight: 1.6 }}
        />
      </div>
      <div style={{ ...col, top: 846 }}>
        <Words
          t={t}
          at={T.conclude + 0.6}
          out={T.bookOut}
          per={0.02}
          text="“If you do not counter it with its opposite, it becomes a habit, and then it is hard for you to leave it.”"
          style={{ fontFamily: F.ui, fontSize: 28, color: C.ink2, lineHeight: 1.35 }}
        />
        <div style={{ height: 16 }} />
        <RefChip t={t} at={T.conclude + 1.0} out={T.bookOut} color={C.ink}>
          IBN AL-QAYYIM · AL-FAWĀʾID · P. 45
        </RefChip>
      </div>
    </>
  );
};
