import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { C } from "./lib/theme";
import { camAt, camTransform, FPS, H, W } from "./lib/motion";
import { CAM, DURATION, SCENES, T } from "./script";
import { Ask } from "./scenes/Ask";
import { Bento } from "./scenes/Bento";
import { Within } from "./scenes/Within";
import { Book } from "./scenes/Book";
import { Day } from "./scenes/Day";
import { Habit } from "./scenes/Habit";
import { Time } from "./scenes/Time";
import { Close } from "./scenes/Close";

const ORDER: [number, React.FC<{ t: number }>][] = [
  [SCENES.ask, Ask],
  [SCENES.bento, Bento],
  [SCENES.within, Within],
  [SCENES.book, Book],
  [SCENES.day, Day],
  [SCENES.habit, Habit],
  [SCENES.time, Time],
  [SCENES.close, Close],
];

/** One continuous take: each scene starts on the exact state the previous one left. */
const World: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let Scene = ORDER[0][1];
  for (const [start, S] of ORDER) if (t >= start) Scene = S;
  const cam = camAt(t, CAM);
  return (
    <AbsoluteFill style={{ background: C.paper, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: "0 0", transform: camTransform(cam) }}>
        <div style={{ position: "absolute", left: -600, top: -600, width: W + 1200, height: H + 1200, background: C.paper }} />
        <Scene t={t} />
      </div>
    </AbsoluteFill>
  );
};

export const TOTAL_FRAMES = Math.round(DURATION * FPS);

/** From here on 1 blur sample: Remotion renders frame 0 with 1 sample, so the last frames must too
 *  for the loop seam to match. The switch happens while the wordmark is still unfolding (masked). */
const SINGLE_FROM = Math.round((T.unfoldWord + 0.35) * FPS);

export const Film: React.FC<{ sfx: boolean }> = ({ sfx }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <CameraMotionBlur shutterAngle={180} samples={frame >= SINGLE_FROM ? 1 : 4}>
        <World />
      </CameraMotionBlur>
      {sfx && <Audio src={staticFile("sfx.wav")} />}
    </AbsoluteFill>
  );
};
