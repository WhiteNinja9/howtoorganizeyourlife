import React from "react";
import { Audio, Sequence, staticFile } from "remotion";
import { Sfx as SfxEvent, SfxKind } from "./timeline";
import { OPEN_SFX, CLOSE_SFX } from "./scenes/Open";
import { BEST_SFX } from "./scenes/BestNation";
import { BENTO_SFX } from "./scenes/Bento";
import { WITHIN_SFX } from "./scenes/Within";
import { BOOK_SFX } from "./scenes/Book";
import { DAY_SFX } from "./scenes/Day";
import { HABIT_SFX } from "./scenes/Habit";
import { TIME_SFX } from "./scenes/Time";

export const SFX: SfxEvent[] = [
  ...OPEN_SFX,
  ...BEST_SFX,
  ...BENTO_SFX,
  ...WITHIN_SFX,
  ...BOOK_SFX,
  ...DAY_SFX,
  ...HABIT_SFX,
  ...TIME_SFX,
  ...CLOSE_SFX,
].sort((a, z) => a.f - z.f);

/**
 * Sound files per event kind, in public/sfx/. Each entry gives the file and the
 * offset (in frames) of its measured peak, so the peak lands exactly on the event.
 * Empty until the sounds are in place: the film renders silent without them.
 */
export const SFX_FILES: Partial<Record<SfxKind, { file: string; peak: number; volume: number }>> = {};

export const Sfx: React.FC = () => (
  <>
    {SFX.map((e, i) => {
      const s = SFX_FILES[e.kind];
      if (!s) return null;
      return (
        <Sequence key={i} from={Math.max(0, e.f - s.peak)} layout="none">
          <Audio src={staticFile(`sfx/${s.file}`)} volume={s.volume} />
        </Sequence>
      );
    })}
  </>
);
