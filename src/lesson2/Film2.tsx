import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { C, F } from "../lib/theme";
import { camAt, camTransform, exitK, FPS, H, sp, W } from "../lib/motion";
import { RefChip, Words } from "../ui/kit";
import { Lids, lidOpenness } from "../ui/Lids";
import { BILAL } from "./pages";
import { CAM, DURATION, LIDS, SCENES, T } from "./script";
import { Night } from "./Night";
import { Heart } from "./Heart";
import { BookOpen } from "./BookOpen";
import { Dawn } from "./Dawn";
import { Close2 } from "./Close2";

const ORDER: [number, React.FC<{ t: number }>][] = [
  [SCENES.night, Night],
  [SCENES.heart, Heart],
  [SCENES.book, BookOpen],
  [SCENES.dawn, Dawn],
  [SCENES.close, Close2],
];

/** Screen-space captions for the book page (so the camera can hold the page while you read). */
const Caption: React.FC<{ t: number; at: number; out: number; text: string; refText?: string }> = ({ t, at, out, text, refText }) => (
  <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
    <div
      style={{
        maxWidth: 1400,
        padding: "18px 40px",
        textAlign: "center",
        background: "rgba(255,253,248,0.94)",
        borderRadius: 26,
        boxShadow: "0 18px 40px rgba(40,25,5,0.16)",
        transform: `scale(${sp(t, at - 0.1, { w: 16, z: 0.9 }) * (1 - exitK(t, out + 0.15, 0.25).off)})`,
      }}
    >
      <Words t={t} at={at} out={out} per={0.018} text={text} style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 38, color: C.ink, lineHeight: 1.35, justifyContent: "center" }} />
    </div>
    {refText && (
      <RefChip t={t} at={at + 0.6} out={out} color={C.ink}>
        {refText}
      </RefChip>
    )}
  </div>
);

const World: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let Scene = ORDER[0][1];
  for (const [start, S] of ORDER) if (t >= start) Scene = S;
  const cam = camAt(t, CAM);
  const o = lidOpenness(t, LIDS);
  const defocus = (1 - o) * 7; // eyes half-closed = the world goes soft
  const scrim = sp(t, T.bilal - 0.3, { w: 8, z: 1 }) * (1 - exitK(t, T.bilalOut, 0.35).off) * (t < T.heart ? 1 : 0);
  const cap = t >= T.mark1 - 0.5 && t < T.bookOut + 0.6;
  return (
    <AbsoluteFill style={{ background: C.paper, overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: defocus > 0.05 ? `blur(${defocus}px)` : undefined }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: "0 0", transform: camTransform(cam) }}>
          <Scene t={t} />
        </div>
      </AbsoluteFill>

      {/* "Look at Whom you disobeyed" — over the dimmed phone */}
      {scrim > 0.001 && <AbsoluteFill style={{ background: `rgba(2,3,4,${0.72 * scrim})` }} />}
      {t >= T.bilal && t < T.heart && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 18 }}>
          <Words t={t} at={T.bilal} out={T.bilalOut} per={0.08} rtl text={BILAL} pad="0.3em" style={{ fontFamily: F.ar, fontWeight: 700, fontSize: 66, color: C.white, lineHeight: 1.6, justifyContent: "center", maxWidth: 1500 }} />
          <Words t={t} at={T.bilal + 1.0} out={T.bilalOut} per={0.03} text="“Do not look at how small the sin is. Look at Whom you disobeyed.”" style={{ fontFamily: F.ui, fontSize: 38, color: "#D9D4CA", justifyContent: "center" }} />
          <div style={{ height: 8 }} />
          <RefChip t={t} at={T.bilal + 1.7} out={T.bilalOut} color={C.goldSoft}>
            BILĀL IBN SAʿD · AL-DĀʾ WA AL-DAWĀʾ, P. 51
          </RefChip>
        </AbsoluteFill>
      )}

      {/* the book page, translated */}
      {cap && (
        <>
          <Caption t={t} at={T.mark1 + 0.5} out={T.mark2 - 0.15} text="“…a darkness he finds in his heart, real, felt the way one feels the darkness of a pitch-black night.”" />
          <Caption t={t} at={T.mark2 + 0.35} out={T.bookOut} text="“For obedience is light, and sin is darkness.”" refText="IBN AL-QAYYIM · AL-DĀʾ WA AL-DAWĀʾ, P. 54" />
        </>
      )}

      <Lids t={t} keys={LIDS} id={`lid${Math.round(t * 6000)}`} />

      {/* in the dark, behind closed eyes */}
      {t >= T.doorText - 0.1 && t < T.dawn + 0.4 && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <Words t={t} at={T.doorText} out={T.doorOut} per={0.07} text="But the door is still open." style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 60, color: C.white, letterSpacing: "-0.015em", justifyContent: "center" }} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export const TOTAL_FRAMES_2 = Math.round(DURATION * FPS);
const SINGLE_FROM = Math.round((T.unfoldWord + 0.35) * FPS);

export const Film2: React.FC<{ sfx: boolean }> = ({ sfx }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <CameraMotionBlur shutterAngle={180} samples={frame >= SINGLE_FROM ? 1 : 4}>
        <World />
      </CameraMotionBlur>
      {sfx && <Audio src={staticFile("sfx-lesson2.wav")} />}
    </AbsoluteFill>
  );
};
