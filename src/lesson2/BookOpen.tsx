import React from "react";
import { Img, staticFile } from "remotion";
import { C, F } from "../lib/theme";
import { cRect, gl, rectLerp, sp, SOFT } from "../lib/motion";
import { Shape } from "../ui/kit";
import { HEART_C, HEART_R } from "./Heart";
import { P51, P52, P53, P54, P55 } from "./pages";
import { T } from "./script";
import { NIGHT } from "../ui/Lids";

/**
 * The book opens like an Arabic book: the spine is on the right, the cover swings over to the right,
 * then the leaves riffle from left to right until p. 54 lies on the right — the quote page.
 */
const PAGE = { w: 420, h: 608 };
const X0 = 750; // closed book (left edge); the spine is at X0 + PAGE.w
const Y0 = 236;
const PAPER = "#F6EFDF";
const PAPER_DARK = "#EDE3CD";
const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";
const arNum = (n: number) => String(n).replace(/\d/g, (d) => AR_DIGITS[+d]);

const PageFace: React.FC<{ num?: number; children?: React.ReactNode; side: "left" | "right"; shade: number; plain?: boolean }> = ({
  num,
  children,
  side,
  shade,
  plain,
}) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: plain ? PAPER_DARK : PAPER,
      borderRadius: side === "left" ? "10px 2px 2px 10px" : "2px 10px 10px 2px",
      overflow: "hidden",
    }}
  >
    {/* gutter shadow toward the spine */}
    <div
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        width: 46,
        [side === "left" ? "right" : "left"]: 0,
        background: `linear-gradient(to ${side === "left" ? "left" : "right"}, rgba(80,60,30,0.22), rgba(80,60,30,0))`,
      }}
    />
    {!plain && (
      <>
        <div style={{ position: "absolute", left: 36, right: 36, top: 20, display: "flex", justifyContent: "center", fontFamily: F.ar, fontSize: 13, color: "#8A7B62", borderBottom: "1px solid #D9CDB3", paddingBottom: 4, direction: "rtl" }}>
          الداء والدواء
        </div>
        <div
          style={{
            position: "absolute",
            left: 36,
            right: 36,
            top: 52,
            bottom: 44,
            overflow: "hidden",
            direction: "rtl",
            textAlign: "justify",
            fontFamily: F.ar,
            fontSize: 15,
            lineHeight: 1.95,
            color: "#2A2419",
          }}
        >
          {children}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 14, textAlign: "center", fontFamily: F.ar, fontSize: 14, color: "#8A7B62" }}>
          {num !== undefined ? arNum(num) : ""}
        </div>
      </>
    )}
    {shade > 0.001 && (
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(to ${side === "left" ? "left" : "right"}, rgba(30,20,5,${shade * 0.45}), rgba(30,20,5,${shade}) 85%, rgba(30,20,5,${shade * 0.8}))`,
        }}
      />
    )}
  </div>
);

const Paras: React.FC<{ paras: string[] }> = ({ paras }) => (
  <>
    {paras.map((p, i) => (
      <p key={i} style={{ margin: "0 0 4px 0", textIndent: 14 }}>
        {p}
      </p>
    ))}
  </>
);

const mark = (k: number): React.CSSProperties => ({
  backgroundImage: "linear-gradient(rgba(227,201,135,0.85), rgba(227,201,135,0.85))",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right center",
  backgroundSize: `${k * 100}% 82%`,
  WebkitBoxDecorationBreak: "clone",
  boxDecorationBreak: "clone",
  borderRadius: 3,
  padding: "0 2px",
});

const P54Body: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Paras paras={P54.before} />
    <p style={{ margin: "0 0 4px 0", textIndent: 14 }}>
      {P54.lead}
      <span style={mark(gl(t, T.mark1, 1.1))}>{P54.q1}</span>
      {P54.mid}
      <span style={mark(gl(t, T.mark2, 0.7))}>{P54.q2}</span>
      {P54.tail}
    </p>
    <Paras paras={P54.after} />
  </>
);

/**
 * A leaf hinged at the spine; angle 0 = lying on the left, 180 = turned over to the right.
 * A settled leaf is drawn flat with only its visible face (Chrome occasionally shows the hidden face of a
 * 3D leaf for one frame during a long render; flat leaves cannot).
 */
const Leaf: React.FC<{ angle: number; x: number; z: number; front: React.ReactNode; back: React.ReactNode }> = ({ angle, x, z, front, back }) => {
  if (angle <= 0 || angle >= 180) {
    return (
      <div style={{ position: "absolute", left: angle >= 180 ? x + PAGE.w : x, top: Y0, width: PAGE.w, height: PAGE.h, zIndex: z }}>
        {angle >= 180 ? back : front}
      </div>
    );
  }
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: Y0,
        width: PAGE.w,
        height: PAGE.h,
        transformOrigin: "100% 50%",
        transform: `rotateY(${angle}deg)`,
        transformStyle: "preserve-3d",
        zIndex: z,
      }}
    >
      <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden" }}>{front}</div>
      <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>{back}</div>
    </div>
  );
};

export const BookOpen: React.FC<{ t: number }> = ({ t }) => {
  const morph = gl(t, T.book, 0.8);
  const closed = { x: X0, y: Y0, w: PAGE.w, h: PAGE.h, r: 10 };
  const shape = rectLerp(cRect(HEART_C.x, HEART_C.y, HEART_R * 2, HEART_R * 2), closed, morph);
  const reveal = gl(t, T.book + 0.45, 0.8); // cover photo dissolves out of the ink
  // the room floods with paper from the heart outward (eased by area), the source rides the morph
  const bgReveal = gl(t, T.book - 0.05, 0.9);
  const fx = shape.x + shape.w / 2;
  const fy = shape.y + shape.h / 2;
  const floodR = Math.sqrt(bgReveal) * 1900 + HEART_R * (1 - bgReveal);
  const shift = -(PAGE.w / 2) * gl(t, T.coverOpen, 1.0); // recentre the open spread
  const ang = (t0: number, d = 0.8) => 180 * gl(t, t0, d);
  const coverA = ang(T.coverOpen, 1.0);
  const leafA = ang(T.riffle, 0.75);
  const leafB = ang(T.riffle + 0.55, 0.75);
  const zOf = (a: number, i: number) => (a < 90 ? 500 - 10 * i : 500 + 10 * i);
  const shadeOf = (a: number) => 0.26 * Math.sin((a * Math.PI) / 180);
  const spine = X0 + shift + PAGE.w;
  /** the soft shadow a lifted leaf casts just past its edge, on the page it is over */
  const castShadow = (a: number, i: number) => {
    const s = Math.sin((a * Math.PI) / 180);
    if (s < 0.01 || a >= 179.5) return null;
    const right = a > 90;
    if (right && i === 0) return null; // nothing under the cover on the right but the table
    const edge = PAGE.w * Math.abs(Math.cos((a * Math.PI) / 180));
    const spread = 40 + 150 * s;
    return (
      <div
        key={`sh${i}`}
        style={{
          position: "absolute",
          left: right ? spine : spine - PAGE.w,
          top: Y0,
          width: PAGE.w,
          height: PAGE.h,
          zIndex: zOf(a, i) - 5,
          overflow: "hidden",
          borderRadius: right ? "2px 10px 10px 2px" : "10px 2px 2px 10px",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: right ? 0 : PAGE.w - edge - spread,
            width: edge + spread,
            background: `linear-gradient(to ${right ? "right" : "left"}, rgba(40,25,5,${0.3 * s}) ${(edge / (edge + spread)) * 100}%, rgba(40,25,5,0))`,
          }}
        />
      </div>
    );
  };
  const opened = t >= T.coverOpen;

  return (
    <>
      <div style={{ position: "absolute", left: -600, top: -600, right: -600, bottom: -600, background: C.paper }} />
      {bgReveal < 1 && (
        <div
          style={{
            position: "absolute",
            left: -600,
            top: -600,
            right: -600,
            bottom: -600,
            background: NIGHT,
            WebkitMaskImage: `radial-gradient(circle at ${fx + 600}px ${fy + 600}px, transparent ${floodR - 160}px, black ${floodR}px)`,
            maskImage: `radial-gradient(circle at ${fx + 600}px ${fy + 600}px, transparent ${floodR - 160}px, black ${floodR}px)`,
          }}
        />
      )}

      {!opened ? (
        // the black heart contracts into the closed cover; the photo dissolves outward from its centre
        <Shape rect={shape} color={C.ink} style={{ boxShadow: morph > 0.6 ? "0 30px 60px rgba(40,25,5,0.3)" : undefined }}>
          <Img
            src={staticFile("img/al-jawab-al-kafi.jpg")}
            style={{
              position: "absolute",
              left: X0 - shape.x,
              top: Y0 - shape.y,
              width: PAGE.w,
              height: PAGE.h,
              objectFit: "cover",
              WebkitMaskImage: `radial-gradient(circle at 50% 45%, black ${reveal * 520 - 80}px, transparent ${reveal * 520}px)`,
              maskImage: `radial-gradient(circle at 50% 45%, black ${reveal * 520 - 80}px, transparent ${reveal * 520}px)`,
            }}
          />
        </Shape>
      ) : (
        <div style={{ position: "absolute", inset: 0, perspective: 2600, perspectiveOrigin: `${960}px 540px` }}>
          {/* page-block edges and soft shadow under the open book */}
          {/* the same drop shadow as the closed cover, widening with the spread (no pop when 3D starts) */}
          <div style={{ position: "absolute", left: X0 + shift, top: Y0, width: PAGE.w * (1 + gl(t, T.coverOpen, 1.0)), height: PAGE.h, borderRadius: 10, boxShadow: "0 30px 60px rgba(40,25,5,0.3)" }} />
          <div style={{ position: "absolute", left: X0 + shift - 6, top: Y0 + 6, width: PAGE.w * (1 + gl(t, T.coverOpen, 1.0)) + 12, height: PAGE.h + 4, borderRadius: 12, background: "#DDD0B4", opacity: sp(t, T.coverOpen + 0.3, SOFT) }} />
          {castShadow(coverA, 0)}
          {castShadow(leafA, 1)}
          {castShadow(leafB, 2)}
          {/* base left page: p. 55 */}
          <div style={{ position: "absolute", left: X0 + shift, top: Y0, width: PAGE.w, height: PAGE.h, zIndex: 10 }}>
            <PageFace side="left" num={55} shade={0}>
              <Paras paras={P55} />
            </PageFace>
          </div>
          <Leaf
            angle={leafB}
            x={X0 + shift}
            z={zOf(leafB, 2)}
            front={<PageFace side="left" num={53} shade={shadeOf(leafB)}><Paras paras={P53} /></PageFace>}
            back={<PageFace side="right" num={54} shade={shadeOf(leafB)}><P54Body t={t} /></PageFace>}
          />
          <Leaf
            angle={leafA}
            x={X0 + shift}
            z={zOf(leafA, 1)}
            front={<PageFace side="left" num={51} shade={shadeOf(leafA)}><Paras paras={P51} /></PageFace>}
            back={<PageFace side="right" num={52} shade={shadeOf(leafA)}><Paras paras={P52} /></PageFace>}
          />
          <Leaf
            angle={coverA}
            x={X0 + shift}
            z={zOf(coverA, 0)}
            front={
              <div style={{ position: "absolute", inset: 0, borderRadius: 10, overflow: "hidden" }}>
                <Img src={staticFile("img/al-jawab-al-kafi.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${shadeOf(coverA)})` }} />
              </div>
            }
            back={<PageFace side="right" shade={shadeOf(coverA)} plain />}
          />
        </div>
      )}
    </>
  );
};
