import React from "react";
import { C, F, SHADOW } from "../lib/theme";
import { contract, exitK, gl, multi, POP, Rect, sp, SOFT } from "../lib/motion";
import { Mono, RefChip, Rise, Shape, tw, Words } from "../ui/kit";
import { Img, staticFile } from "remotion";
import { T } from "../script";

/** Real cover photos supplied by the owner: al-Jawāb al-Kāfī (al-Dāʾ wa al-Dawāʾ), then al-Fawāʾid. */
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

const Cover: React.FC<{ t: number }> = ({ t }) => {
  const reveal = gl(t, T.cover - 0.1, 0.8);
  const paint = gl(t, T.repaint, 0.7);
  return (
    <>
      {/* the real cover (photo the owner supplied); the emerald dissolves outward from its centre */}
      <Img src={staticFile("img/al-jawab-al-kafi.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      {reveal < 1 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: C.emerald,
            WebkitMaskImage: `radial-gradient(circle at 50% 42%, transparent ${reveal * 710 - 90}px, black ${reveal * 710}px)`,
            maskImage: `radial-gradient(circle at 50% 42%, transparent ${reveal * 710 - 90}px, black ${reveal * 710}px)`,
          }}
        />
      )}
      {/* the al-Fawāʾid cover sweeps across from the right edge (Arabic books open from the right) */}
      <Img
        src={staticFile("img/al-fawaid.jpg")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          WebkitMaskImage: `linear-gradient(to left, black ${paint * 120 - 20}%, transparent ${paint * 120}%)`,
          maskImage: `linear-gradient(to left, black ${paint * 120 - 20}%, transparent ${paint * 120}%)`,
          visibility: paint > 0 ? "inherit" : "hidden",
        }}
      />
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 22 * sp(t, T.cover, SOFT), background: "linear-gradient(to right, rgba(0,0,0,0.3), rgba(0,0,0,0))" }} />
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
