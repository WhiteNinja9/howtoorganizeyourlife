import React from "react";
import { AbsoluteFill } from "remotion";
import { b, cRect, FLOOD, floodRect, FULL, multi, POP, Rect, rectLerp, sp, SOFT } from "../lib/anim";
import { C, F } from "../lib/theme";
import { Mono, Rise, Shape, tw } from "../ui/primitives";
import { Cursor } from "../ui/Cursor";
import { Hud } from "../ui/Hud";
import { Sfx, T } from "../timeline";

const s = (beats: number) => T.bento + b(beats);

const H1 = "Look at what you already do.";
const H2 = "You were made for discipline.";
const HEAD_Y = 168;

type Tile = { key: string; rect: Rect; bg: string; at: number };
const R = 34;
const tiles: Tile[] = [
  { key: "salah", rect: { x: 160, y: 300, w: 640, h: 320, r: R }, bg: C.ink, at: s(2) },
  { key: "fajr", rect: { x: 824, y: 300, w: 420, h: 320, r: R }, bg: C.white, at: s(3) },
  { key: "sawm", rect: { x: 1268, y: 300, w: 492, h: 320, r: R }, bg: C.emerald, at: s(4) },
  { key: "qiblah", rect: { x: 160, y: 644, w: 420, h: 320, r: R }, bg: C.white, at: s(5) },
  { key: "zakat", rect: { x: 604, y: 644, w: 640, h: 320, r: R }, bg: C.gold, at: s(6) },
  { key: "jumuah", rect: { x: 1268, y: 644, w: 492, h: 320, r: R }, bg: C.paper2, at: s(7) },
];
const SAWM = tiles[2].rect;
const SAWM_C = { x: SAWM.x + SAWM.w / 2, y: SAWM.y + SAWM.h / 2 };
const CLICK = s(13.5);
const FLOOD_AT = s(14);

export const BENTO_SFX: Sfx[] = [
  { f: s(0), kind: "contract" },
  { f: s(1), kind: "rise" },
  ...tiles.map((t) => ({ f: t.at, kind: "pop" as const })),
  { f: s(10), kind: "swap" },
  { f: CLICK, kind: "click" },
  { f: FLOOD_AT, kind: "flood" },
];

const big = (color: string, size = 190): React.CSSProperties => ({
  fontFamily: F.word,
  fontWeight: 800,
  fontVariationSettings: "'wdth' 125, 'wght' 800",
  fontSize: size,
  lineHeight: 0.9,
  color,
  letterSpacing: "-0.02em",
});
const title = (color: string): React.CSSProperties => ({ fontFamily: F.ui, fontWeight: 600, fontSize: 42, color, lineHeight: 1.1 });
const sub = (color: string): React.CSSProperties => ({ fontFamily: F.ui, fontWeight: 400, fontSize: 27, color, lineHeight: 1.3 });

const TileBody: React.FC<{ t: Tile; frame: number }> = ({ t, frame }) => {
  const a = t.at + 8;
  const pad: React.CSSProperties = { position: "absolute", inset: 0, padding: 36 };
  const tag = (txt: string, color: string) => (
    <div style={{ position: "absolute", right: 34, top: 34 }}>
      <Rise frame={frame} at={a}>
        <Mono color={color} size={17}>{txt}</Mono>
      </Rise>
    </div>
  );
  switch (t.key) {
    case "salah": {
      return (
        <div style={pad}>
          {tag("Salah", "#8E9792")}
          <div style={{ display: "flex", alignItems: "flex-end", gap: 26 }}>
            <Rise frame={frame} at={a}>
              <span style={big(C.white, 200)}>5</span>
            </Rise>
            <div style={{ paddingBottom: 12 }}>
              <Rise frame={frame} at={a + 3}>
                <div style={title(C.white)}>prayers.</div>
              </Rise>
              <br />
              <Rise frame={frame} at={a + 5}>
                <div style={sub("#A9B0AC")}>Every single day.</div>
              </Rise>
            </div>
          </div>
          <div style={{ position: "absolute", left: 36, bottom: 36, display: "flex", gap: 14 }}>
            {[0, 1, 2, 3, 4].map((i) => {
              const fill = sp(frame, a + 10 + i * 5, POP);
              return (
                <div key={i} style={{ width: 30, height: 30, borderRadius: 15, border: "2px solid #4A5450", position: "relative" }}>
                  <div
                    style={{
                      position: "absolute",
                      inset: 3,
                      borderRadius: 12,
                      background: C.mint,
                      transform: `scale(${fill})`,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    case "fajr": {
      const k = sp(frame, a, SOFT);
      return (
        <div style={pad}>
          {tag("Dawn", C.muted)}
          <svg width={120} height={70} viewBox="0 0 120 70" style={{ overflow: "visible" }}>
            <line x1={0} y1={60} x2={120 * k} y2={60} stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
            <path d={`M 28 60 A 32 32 0 0 1 92 60`} stroke={C.gold} strokeWidth={4} fill="none" strokeDasharray={101} strokeDashoffset={101 * (1 - k)} />
            {[-60, -30, 0, 30, 60].map((deg, i) => {
              const kk = sp(frame, a + 6 + i * 2, POP);
              const r1 = 42, r2 = 42 + 12 * kk;
              const rad = ((deg - 90) * Math.PI) / 180;
              return (
                <line key={deg} x1={60 + r1 * Math.cos(rad)} y1={60 + r1 * Math.sin(rad)} x2={60 + r2 * Math.cos(rad)} y2={60 + r2 * Math.sin(rad)} stroke={C.gold} strokeWidth={4} strokeLinecap="round" />
              );
            })}
          </svg>
          <div style={{ position: "absolute", left: 36, bottom: 36 }}>
            <Rise frame={frame} at={a + 2}>
              <div style={title(C.ink)}>Fajr</div>
            </Rise>
            <br />
            <Rise frame={frame} at={a + 4}>
              <div style={sub(C.muted)}>You rise before the sun.</div>
            </Rise>
          </div>
        </div>
      );
    }
    case "sawm":
      return (
        <div style={pad}>
          {tag("Sawm", "rgba(255,253,248,0.6)")}
          <Rise frame={frame} at={a}>
            <span style={big(C.paper, 190)}>30</span>
          </Rise>
          <div style={{ position: "absolute", left: 36, bottom: 36 }}>
            <Rise frame={frame} at={a + 3}>
              <div style={title(C.white)}>days of fasting,</div>
            </Rise>
            <br />
            <Rise frame={frame} at={a + 5}>
              <div style={sub("rgba(255,253,248,0.75)")}>every single year.</div>
            </Rise>
          </div>
        </div>
      );
    case "qiblah": {
      const ang = multi(frame, -120, [[a + 4, 38]], { damping: 12, stiffness: 90 });
      const ring = sp(frame, a, SOFT);
      return (
        <div style={pad}>
          {tag("Qiblah", C.muted)}
          <svg width={96} height={96} viewBox="-48 -48 96 96">
            <circle r={42} stroke={C.ink} strokeWidth={3} fill="none" strokeDasharray={264} strokeDashoffset={264 * (1 - ring)} />
            <g transform={`rotate(${ang})`}>
              <path d="M0 -32 L7 0 L0 6 L-7 0 Z" fill={C.emerald} />
              <path d="M0 32 L7 0 L0 -6 L-7 0 Z" fill={C.line} />
            </g>
            <circle r={4} fill={C.ink} />
          </svg>
          <div style={{ position: "absolute", left: 36, bottom: 36, right: 36 }}>
            <Rise frame={frame} at={a + 2}>
              <div style={title(C.ink)}>One Qiblah</div>
            </Rise>
            <br />
            <Rise frame={frame} at={a + 4}>
              <div style={sub(C.muted)}>Nearly 2 billion hearts,</div>
            </Rise>
            <br />
            <Rise frame={frame} at={a + 5}>
              <div style={sub(C.muted)}>one direction.</div>
            </Rise>
          </div>
        </div>
      );
    }
    case "zakat":
      return (
        <div style={pad}>
          {tag("Zakat", "rgba(13,21,18,0.55)")}
          <Rise frame={frame} at={a}>
            <span style={big(C.ink, 170)}>2.5%</span>
          </Rise>
          <div style={{ position: "absolute", left: 36, bottom: 36 }}>
            <Rise frame={frame} at={a + 3}>
              <div style={title(C.ink)}>given every year,</div>
            </Rise>
            <br />
            <Rise frame={frame} at={a + 5}>
              <div style={sub("rgba(13,21,18,0.7)")}>because the poor have a right in your wealth.</div>
            </Rise>
          </div>
        </div>
      );
    case "jumuah": {
      const days = ["S", "M", "T", "W", "T", "F", "S"];
      return (
        <div style={pad}>
          {tag("Friday", C.muted)}
          <div style={{ display: "flex", gap: 10, marginTop: 40 }}>
            {days.map((d, i) => {
              const k = sp(frame, a + i * 2, POP);
              const fri = i === 5;
              return (
                <div
                  key={i}
                  style={{
                    width: 46,
                    height: 56,
                    borderRadius: 12,
                    background: fri ? C.ink : "transparent",
                    border: fri ? "none" : `2px solid ${C.line}`,
                    color: fri ? C.white : C.muted,
                    display: "grid",
                    placeItems: "center",
                    fontFamily: F.mono,
                    fontSize: 20,
                    transform: `scale(${k})`,
                  }}
                >
                  {d}
                </div>
              );
            })}
          </div>
          <div style={{ position: "absolute", left: 36, bottom: 36 }}>
            <Rise frame={frame} at={a + 2}>
              <div style={title(C.ink)}>Jumuʿah</div>
            </Rise>
            <br />
            <Rise frame={frame} at={a + 4}>
              <div style={sub(C.muted)}>Every week, the Ummah gathers.</div>
            </Rise>
          </div>
        </div>
      );
    }
  }
  return null;
};

export const Bento: React.FC<{ frame: number }> = ({ frame }) => {
  const w1 = tw("Geist", 600, 46, H1) + 120;
  const w2 = tw("Geist", 600, 46, H2) + 120;
  const headW = multi(frame, w1, [[s(10), w2]]);
  const headOut = 1 - sp(frame, s(13.7), FLOOD);
  const head = rectLerp(FULL, cRect(960, HEAD_Y, headW * headOut, 104 * headOut), sp(frame, s(0), FLOOD));

  // Camera leans toward the tile the cursor is about to press.
  const zk = sp(frame, s(12), { damping: 26, stiffness: 60 });
  const zoom = 1 + 0.14 * zk;

  const floodK = sp(frame, FLOOD_AT, FLOOD);

  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: `${SAWM_C.x}px ${SAWM_C.y}px` }}>
        {tiles.map((t) => {
          const k = sp(frame, t.at, POP);
          if (k < 0.001) return null;
          const cx = t.rect.x + t.rect.w / 2;
          const cy = t.rect.y + t.rect.h / 2;
          const isSawm = t.key === "sawm";
          const pressK = isSawm
            ? sp(frame, CLICK - 4, { damping: 30, stiffness: 600 }) - sp(frame, CLICK + 3, { damping: 18, stiffness: 300 })
            : 0;
          let r = cRect(cx, cy, t.rect.w * k * (1 - 0.03 * pressK), t.rect.h * k * (1 - 0.03 * pressK), R * k);
          if (isSawm) r = rectLerp(r, floodRect(cx, cy), floodK);
          return (
            <Shape key={t.key} rect={r} color={t.bg} style={{ zIndex: isSawm ? 5 : 1 }}>
              <div
                style={{
                  position: "absolute",
                  left: t.rect.x - r.x,
                  top: t.rect.y - r.y,
                  width: t.rect.w,
                  height: t.rect.h,
                  visibility: isSawm && floodK > 0.02 ? "hidden" : "inherit",
                }}
              >
                <TileBody t={t} frame={frame} />
              </div>
            </Shape>
          );
        })}
        <Cursor
          frame={frame}
          show={[s(11.5), s(14.4)]}
          keys={[
            { f: s(11.5), x: 1700, y: 1040 },
            { f: s(11.7), x: 1560, y: 500 },
          ]}
          clicks={[CLICK]}
        />
      </AbsoluteFill>
      <Shape rect={head} color={C.ink} />
      <div style={{ position: "absolute", top: HEAD_Y, left: 0, right: 0, transform: "translateY(-50%)", textAlign: "center" }}>
        {[
          [H1, s(1), s(10)],
          [H2, s(10) + 4, s(13.6)],
        ].map(([txt, at, out]) => (
          <div key={txt as string} style={{ position: "absolute", left: 0, right: 0, top: 0, transform: "translateY(-50%)" }}>
            <Rise frame={frame} at={at as number} out={out as number}>
              <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 46, color: C.white, letterSpacing: "-0.01em" }}>{txt}</span>
            </Rise>
          </div>
        ))}
      </div>
      <Hud frame={frame} at={s(1)} out={s(13.8)} index={2} color={C.ink} />
    </AbsoluteFill>
  );
};
