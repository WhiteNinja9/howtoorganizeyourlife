import React from "react";
import { C, F } from "../lib/theme";
import { cRect, flood, gl, lerp, POP, Rect, rectLerp, sp, SOFT, TINY, tq } from "../lib/motion";
import { Digits, Mono, Rise, Shape, Words } from "../ui/kit";
import { Cursor } from "../ui/Cursor";
import { T, TILES } from "../script";
import { MERGED } from "./Ask";

type Key = keyof typeof TILES;
const R = 34;
const rectOf = (k: Key): Rect => ({ ...TILES[k], r: R });
const BG: Record<Key, string> = {
  salah: C.ink,
  fajr: C.white,
  sawm: C.emerald,
  qiblah: C.white,
  zakat: C.gold,
  jumuah: C.paper2,
};
/** unfold order: [tile, delay, edge it unfolds from] */
const UNFOLD: [Key, number, "left" | "top"][] = [
  ["fajr", 0, "left"],
  ["qiblah", 0.08, "top"],
  ["zakat", 0.2, "top"],
  ["sawm", 0.22, "left"],
  ["jumuah", 0.36, "top"],
];
const VISIT: Record<Key, number> = {
  salah: T.bento + 0.9,
  fajr: T.tour[0],
  sawm: T.tour[1],
  qiblah: T.tour[2],
  zakat: T.tour[3],
  jumuah: T.tour[4],
};
export const FLOOD_DUR = 0.38;

const big = (color: string, size = 190): React.CSSProperties => ({
  fontFamily: F.word,
  fontWeight: 800,
  fontVariationSettings: "'wdth' 125, 'wght' 800",
  fontSize: size,
  lineHeight: 0.9,
  color,
  letterSpacing: "-0.02em",
});
const title = (color: string): React.CSSProperties => ({ fontFamily: F.ui, fontWeight: 600, fontSize: 42, color, lineHeight: 1.1, whiteSpace: "nowrap" });
const sub = (color: string): React.CSSProperties => ({ fontFamily: F.ui, fontSize: 27, color, lineHeight: 1.3, whiteSpace: "nowrap" });

const Tag: React.FC<{ t: number; at: number; color: string; children: string }> = ({ t, at, color, children }) => (
  <div style={{ position: "absolute", right: 34, top: 32 }}>
    <Rise t={t} at={at}>
      <Mono color={color} size={17}>{children}</Mono>
    </Rise>
  </div>
);
const Bottom: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", left: 36, bottom: 34, right: 36 }}>{children}</div>
);

const TileBody: React.FC<{ k: Key; t: number; a: number }> = ({ k, t, a }) => {
  const v = VISIT[k];
  switch (k) {
    case "salah":
      return (
        <>
          <Tag t={t} at={a} color="#8E9792">Salah</Tag>
          <div style={{ position: "absolute", left: 36, top: 40, display: "flex", alignItems: "flex-end", gap: 26 }}>
            <Rise t={t} at={a}>
              <span style={big(C.white, 200)}>5</span>
            </Rise>
            <div style={{ paddingBottom: 14 }}>
              <Rise t={t} at={a + 0.06}>
                <div style={title(C.white)}>prayers.</div>
              </Rise>
              <br />
              <Rise t={t} at={a + 0.12}>
                <div style={sub("#A9B0AC")}>Every single day.</div>
              </Rise>
            </div>
          </div>
          <div style={{ position: "absolute", left: 36, bottom: 36, display: "flex", gap: 14 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} style={{ width: 30, height: 30, borderRadius: 15, border: "2px solid #4A5450", position: "relative", transform: `scale(${sp(t, a + 0.1 + i * 0.03, POP)})` }}>
                <div style={{ position: "absolute", inset: 3, borderRadius: 12, background: C.mint, transform: `scale(${sp(t, v + i * 0.15, POP)})` }} />
              </div>
            ))}
          </div>
        </>
      );
    case "fajr": {
      const sun = sp(t, v, { w: 7, z: 1 });
      return (
        <>
          <Tag t={t} at={a} color={C.muted}>Dawn</Tag>
          <div style={{ position: "absolute", left: 36, top: 44, width: 150, height: 80, overflow: "hidden" }}>
            <svg width={150} height={80} viewBox="0 0 150 80">
              <g transform={`translate(0 ${(1 - sun) * 46})`}>
                <circle cx={75} cy={74} r={30} fill={C.gold} />
              </g>
              {[-60, -30, 0, 30, 60].map((deg, i) => {
                const kk = sp(t, v + 0.25 + i * 0.05, POP);
                const rad = ((deg - 90) * Math.PI) / 180;
                return (
                  <line key={deg} x1={75 + 40 * Math.cos(rad)} y1={74 + 40 * Math.sin(rad)} x2={75 + (40 + 14 * kk) * Math.cos(rad)} y2={74 + (40 + 14 * kk) * Math.sin(rad)} stroke={C.gold} strokeWidth={4} strokeLinecap="round" opacity={kk > 0.01 ? 1 : 0} />
                );
              })}
            </svg>
          </div>
          <div style={{ position: "absolute", left: 36, top: 122, width: 150, height: 4, borderRadius: 2, background: C.ink }} />
          <Bottom>
            <Rise t={t} at={a + 0.05}><div style={title(C.ink)}>Fajr</div></Rise>
            <br />
            <Rise t={t} at={a + 0.1}><div style={sub(C.muted)}>You rise before the sun.</div></Rise>
          </Bottom>
        </>
      );
    }
    case "sawm": {
      const c = Math.round(lerp(1, 30, sp(tq(t), v, { w: 7.5, z: 1 })));
      return (
        <>
          <Tag t={t} at={a} color="rgba(255,253,248,0.6)">Sawm</Tag>
          <div style={{ position: "absolute", left: 36, top: 40 }}>
            {t >= v && <Digits value={String(c).padStart(2, " ")} slot={120} style={big(C.paper, 180)} />}
          </div>
          <Bottom>
            <Rise t={t} at={a + 0.05}><div style={title(C.white)}>days of fasting,</div></Rise>
            <br />
            <Rise t={t} at={a + 0.1}><div style={sub("rgba(255,253,248,0.75)")}>every single year.</div></Rise>
          </Bottom>
        </>
      );
    }
    case "qiblah": {
      const ang = lerp(-140, 38, sp(t, v, { w: 9, z: 0.55 }));
      return (
        <>
          <Tag t={t} at={a} color={C.muted}>Qiblah</Tag>
          <svg width={110} height={110} viewBox="-55 -55 110 110" style={{ position: "absolute", left: 36, top: 30 }}>
            <circle r={48} stroke={C.ink} strokeWidth={3} fill="none" />
            {[0, 90, 180, 270].map((d) => (
              <line key={d} x1={0} y1={-48} x2={0} y2={-40} stroke={C.ink} strokeWidth={3} transform={`rotate(${d})`} />
            ))}
            <g transform={`rotate(${ang})`}>
              <path d="M0 -36 L8 0 L0 7 L-8 0 Z" fill={C.emerald} />
              <path d="M0 36 L8 0 L0 -7 L-8 0 Z" fill={C.line} />
            </g>
            <circle r={4.5} fill={C.ink} />
          </svg>
          <Bottom>
            <Rise t={t} at={a + 0.05}><div style={title(C.ink)}>One Qiblah</div></Rise>
            <br />
            <Rise t={t} at={a + 0.1}><div style={sub(C.muted)}>Nearly 2 billion hearts,</div></Rise>
            <br />
            <Rise t={t} at={a + 0.14}><div style={sub(C.muted)}>one direction.</div></Rise>
          </Bottom>
        </>
      );
    }
    case "zakat": {
      const z = lerp(0, 2.5, sp(tq(t), v, { w: 7.5, z: 1 }));
      const bar = sp(t, v + 0.1, SOFT);
      return (
        <>
          <Tag t={t} at={a} color="rgba(13,21,18,0.55)">Zakat</Tag>
          <div style={{ position: "absolute", left: 36, top: 40 }}>
            {t >= v && <Digits value={`${z.toFixed(1)}%`} slot={104} style={big(C.ink, 160)} />}
          </div>
          <div style={{ position: "absolute", left: 36, top: 196, width: 300, height: 10, borderRadius: 7, background: "rgba(13,21,18,0.14)", overflow: "hidden" }}>
            <div style={{ width: `${2.5 * 4 * bar}%`, height: "100%", background: C.ink, borderRadius: 7 }} />
          </div>
          <Bottom>
            <Rise t={t} at={a + 0.05}><div style={title(C.ink)}>given every year,</div></Rise>
            <br />
            <Rise t={t} at={a + 0.1}><div style={sub("rgba(13,21,18,0.7)")}>because the poor have a right in your wealth.</div></Rise>
          </Bottom>
        </>
      );
    }
    case "jumuah": {
      const days = ["S", "M", "T", "W", "T", "F", "S"];
      return (
        <>
          <Tag t={t} at={a} color={C.muted}>Friday</Tag>
          <div style={{ position: "absolute", left: 36, top: 84, display: "flex", gap: 10 }}>
            {days.map((d, i) => {
              const kk = sp(t, v + i * 0.04, POP);
              const fri = i === 5 ? sp(t, v + 0.35, TINY) : 0;
              return (
                <div key={i} style={{ position: "relative", width: 46, height: 56, borderRadius: 12, border: `2px solid ${C.line}`, transform: `scale(${kk})`, overflow: "hidden" }}>
                  <div style={{ position: "absolute", inset: 0, background: C.ink, transform: `translateY(${(1 - fri) * 100}%)` }} />
                  <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontFamily: F.mono, fontSize: 20, color: fri > 0.5 ? C.white : C.muted }}>{d}</div>
                </div>
              );
            })}
          </div>
          <Bottom>
            <Rise t={t} at={a + 0.05}><div style={title(C.ink)}>Jumuʿah</div></Rise>
            <br />
            <Rise t={t} at={a + 0.1}><div style={sub(C.muted)}>Every week, the Ummah gathers.</div></Rise>
          </Bottom>
        </>
      );
    }
  }
};

export const Bento: React.FC<{ t: number }> = ({ t }) => {
  const SAWM = rectOf("sawm");
  const press = sp(t, T.bentoClick - 0.06, { w: 60, z: 1 }) - sp(t, T.bentoClick + 0.05, { w: 26, z: 0.8 });

  const tiles = (Object.keys(TILES) as Key[]).map((k) => {
    const full = rectOf(k);
    let r: Rect;
    let a: number; // content enter time
    if (k === "salah") {
      r = rectLerp(MERGED, full, gl(t, T.bento, 0.8));
      a = T.bento + 0.55;
    } else {
      const [, delay, edge] = UNFOLD.find((u) => u[0] === k)!;
      const u = gl(t, T.unfold + delay, 0.6);
      r = edge === "left" ? { ...full, w: full.w * u, r: R * Math.min(1, u * 3) } : { ...full, h: full.h * u, r: R * Math.min(1, u * 3) };
      a = T.unfold + delay + 0.3;
    }
    if (k === "sawm") {
      const c = cRect(SAWM.x + SAWM.w / 2, SAWM.y + SAWM.h / 2, SAWM.w * (1 - 0.03 * press), SAWM.h * (1 - 0.03 * press), R);
      r = t >= T.bentoClick - 0.1 ? c : r;
      if (t >= T.flood1) r = flood(t, T.flood1, c, FLOOD_DUR);
    }
    return { k, r, a, full };
  });

  return (
    <>
      <div style={{ position: "absolute", left: 160, top: 150, width: 1600, height: 90 }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <Words t={t} at={T.unfold + 0.35} out={T.overview} per={0.05} text="Look at what you already do." style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 60, color: C.ink, letterSpacing: "-0.02em" }} />
        </div>
        <div style={{ position: "absolute", inset: 0 }}>
          <Words t={t} at={T.overview + 0.3} out={T.flood1 - 0.1} per={0.05} text="You were made for discipline." style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 60, color: C.ink, letterSpacing: "-0.02em" }} />
        </div>
      </div>
      {tiles.map(({ k, r, a, full }) => {
        if (r.w < 0.5 || r.h < 0.5) return null;
        const flooding = k === "sawm" && t >= T.flood1;
        return (
          <Shape key={k} rect={r} color={BG[k]} style={{ zIndex: flooding ? 10 : 1, boxShadow: BG[k] === C.white ? "0 10px 30px rgba(13,40,30,.06)" : undefined }}>
            {!flooding && (
              <div style={{ position: "absolute", left: full.x - r.x, top: full.y - r.y, width: full.w, height: full.h }}>
                <TileBody k={k} t={t} a={a} />
              </div>
            )}
          </Shape>
        );
      })}
      <Cursor
        t={t}
        show={[T.overview + 0.45, T.bentoClick + 0.2]}
        keys={[
          [T.overview + 0.45, 1720, 1020],
          [T.overview + 0.47, 1540, 480, 0.55],
        ]}
        clicks={[T.bentoClick]}
        hovers={[[T.bentoClick - 0.3, T.bentoClick + 0.2]]}
      />
    </>
  );
};
