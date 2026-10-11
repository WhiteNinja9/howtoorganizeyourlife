import { b } from "./lib/anim";

/** Scene start frames (120 BPM grid: b(n) = beat n). Every scene starts under full cover. */
export const T = {
  open: 0,
  bestNation: b(10),
  bento: b(25),
  within: b(40),
  book: b(51),
  day: b(84),
  habit: b(106),
  time: b(117),
  close: b(130),
  end: b(142),
};

export type SfxKind =
  | "squeeze"
  | "pop"
  | "tick"
  | "rise"
  | "swap"
  | "click"
  | "flood"
  | "contract"
  | "draw"
  | "chime"
  | "drag"
  | "check";

export type Sfx = { f: number; kind: SfxKind };
