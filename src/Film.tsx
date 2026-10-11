import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { T } from "./timeline";
import { Close, Open } from "./scenes/Open";
import { BestNation } from "./scenes/BestNation";
import { Bento } from "./scenes/Bento";
import { Within } from "./scenes/Within";
import { Book } from "./scenes/Book";
import { Day } from "./scenes/Day";
import { Habit } from "./scenes/Habit";
import { Time } from "./scenes/Time";
import { Sfx as SfxLayer } from "./Sfx";

const scenes: [number, React.FC<{ frame: number }>][] = [
  [T.open, Open],
  [T.bestNation, BestNation],
  [T.bento, Bento],
  [T.within, Within],
  [T.book, Book],
  [T.day, Day],
  [T.habit, Habit],
  [T.time, Time],
  [T.close, Close],
];

/** One continuous take: every scene starts under full cover left by the previous one. */
export const Film: React.FC = () => {
  const frame = useCurrentFrame();
  let Scene = scenes[0][1];
  for (const [start, S] of scenes) if (frame >= start) Scene = S;
  return (
    <AbsoluteFill style={{ background: "#F4EFE6" }}>
      <Scene frame={frame} />
      <SfxLayer />
    </AbsoluteFill>
  );
};
