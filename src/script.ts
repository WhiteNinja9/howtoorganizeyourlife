/**
 * Pure data: beat times (seconds), camera keys, texts and sound cues.
 * scripts/cues.ts imports this so the sound mix shares the visuals' timeline.
 */
import type { CamKey } from "./lib/motion";
import widths from "./lib/widths.json";

export const DURATION = 81.5;

export const T = {
  // ---- open: wordmark → input pill → typed question → thinking dots
  squeeze: 0.5,
  pill: 1.3,
  focus: 2.85,
  typeFrom: 3.0,
  typeTo: 4.3,
  sendOn: 4.45,
  send: 4.7,
  dots: 4.8,
  merge1: 6.0,
  // ---- 3:110 panel → three chips → one container
  panel: 6.3,
  verseOut: 10.45,
  split: 10.9,
  checks: [11.9, 12.3, 12.7],
  merge2: 13.0,
  bento: 14.2,
  // ---- bento
  unfold: 15.9,
  tour: [16.9, 17.8, 18.7, 19.6, 20.5],
  overview: 21.3,
  bentoClick: 22.45,
  flood1: 22.5,
  // ---- 13:11 + people grid
  within: 22.9,
  withinOut: 26.4,
  grid: 27.0,
  spread: 27.9,
  gridOut: 29.5,
  contract1: 30.0,
  // ---- Ibn al-Qayyim
  cover: 30.6,
  readCure: 33.0,
  cureOut: 38.4,
  repaint: 38.6,
  chainHead: 39.8,
  stages: [40.4, 41.4, 42.4, 43.4, 44.4, 45.4],
  conclude: 46.6,
  bookOut: 49.8,
  // ---- day planner
  day: 50.4,
  pins: [51.4, 52.0, 52.6, 53.2, 53.8],
  dayOverview: 54.4,
  blocks: 55.4,
  dayClicks: [57.5, 58.1, 58.7],
  daySwap: 59.4,
  dayOut: 61.4,
  // ---- habit
  habit: 61.9,
  fills: 64.6,
  habitClick: 67.3,
  flood2: 67.45,
  // ---- time
  time: 67.9,
  timeOut: 74.6,
  contract2: 75.2,
  // ---- close
  labels: [75.7, 76.8, 77.9],
  toDot: 79.0,
  unfoldWord: 79.7,
};

/** Scene windows (each starts under full cover or on an exact handover state). */
export const SCENES = {
  ask: 0,
  bento: T.bento,
  within: T.within,
  book: T.contract1,
  day: T.day,
  habit: T.habit,
  time: T.time,
  close: T.contract2,
};

export const QUESTION = "How do I organize my life?";

/** The three chips of 3:110 (layout shared by the scene and the camera). */
export const CHIP_LABELS = ["Enjoin what is right", "Forbid what is wrong", "Believe in Allah"];
export const CHIP_H = 88;
const CHIP_GAP = 26;
export const chipW = (s: string) => 22 + 44 + 16 + (widths as Record<string, number>)[`Geist|600|30|${s}`] + 34;
export const CHIP_X: number[] = (() => {
  const ws = CHIP_LABELS.map(chipW);
  let x = 960 - (ws.reduce((a, b) => a + b, 0) + CHIP_GAP * 2) / 2;
  return ws.map((w) => {
    const left = x;
    x += w + CHIP_GAP;
    return left;
  });
})();
const leanX = (i: number) => 960 + (CHIP_X[i] + chipW(CHIP_LABELS[i]) / 2 - 960) * 0.4;

/** Camera: [t, focusX, focusY, scale, glideSeconds]. Holds are perfectly still. */
const tile = (x: number, y: number, w: number, h: number) => [x + w / 2, y + h / 2] as const;
export const TILES = {
  salah: { x: 160, y: 300, w: 640, h: 320 },
  fajr: { x: 824, y: 300, w: 420, h: 320 },
  sawm: { x: 1268, y: 300, w: 492, h: 320 },
  qiblah: { x: 160, y: 644, w: 420, h: 320 },
  zakat: { x: 604, y: 644, w: 640, h: 320 },
  jumuah: { x: 1268, y: 644, w: 492, h: 320 },
};
const tc = (k: keyof typeof TILES) => tile(TILES[k].x, TILES[k].y, TILES[k].w, TILES[k].h);
export const hx = (h: number) => 160 + ((h - 4) / 19) * 1600;
export const PRAYER_HOURS = [5, 12.5, 15.75, 18.5, 20];

export const CAM: CamKey[] = [
  [0, 960, 540, 1],
  [T.pill, 960, 540, 1.45, 0.8],
  [T.dots, 960, 520, 1, 0.9],
  [T.split + 0.1, 960, 560, 1.3, 0.8],
  [T.checks[0] - 0.25, leanX(0), 560, 1.34, 0.4],
  [T.checks[1] - 0.25, leanX(1), 560, 1.34, 0.4],
  [T.checks[2] - 0.25, leanX(2), 560, 1.34, 0.4],
  [T.merge2, 960, 560, 1.5, 0.7],
  // bento: zoom on the first tile, pull back while the grid unfolds, then tour each tile
  [T.bento, ...tc("salah"), 1.6, 0.8],
  [T.unfold - 0.1, 960, 560, 1, 0.8],
  [T.tour[0] - 0.55, ...tc("fajr"), 1.75, 0.6],
  [T.tour[1] - 0.55, ...tc("sawm"), 1.7, 0.6],
  [T.tour[2] - 0.55, ...tc("qiblah"), 1.75, 0.6],
  [T.tour[3] - 0.55, ...tc("zakat"), 1.55, 0.6],
  [T.tour[4] - 0.55, ...tc("jumuah"), 1.7, 0.6],
  [T.overview, 960, 540, 1, 0.8],
  // 13:11 holds still; the book scene leans in on the cover, then reads still
  [T.contract1 + 0.4, 486, 540, 1.12, 0.8], // the cover photo is low-res: lean in only a little
  [T.readCure - 0.6, 960, 540, 1, 0.8],
  [T.repaint, 486, 540, 1.3, 0.8],
  [T.chainHead - 0.4, 1290, 520, 1.5, 0.8],
  [T.conclude - 0.4, 960, 540, 1, 0.8],
  // day: track along the timeline as the prayers pin in
  [T.day + 0.2, hx(5.6), 540, 1.7, 0.8],
  [T.pins[1] - 0.3, hx(PRAYER_HOURS[1]), 540, 1.7, 0.55],
  [T.pins[2] - 0.3, hx(PRAYER_HOURS[2]), 540, 1.7, 0.55],
  [T.pins[3] - 0.3, hx(PRAYER_HOURS[3]), 540, 1.7, 0.55],
  [T.pins[4] - 0.3, hx(PRAYER_HOURS[4]), 540, 1.7, 0.55],
  [T.dayOverview, 960, 540, 1, 0.9],
  [T.dayClicks[0] - 0.35, 700, 620, 1.18, 0.45],
  [T.dayClicks[1] - 0.35, 1180, 620, 1.18, 0.45],
  [T.dayClicks[2] - 0.35, 1460, 620, 1.18, 0.45],
  [T.daySwap - 0.3, 960, 540, 1, 0.7],
  // time: push on the ring as it draws, then still for reading
  [T.time + 0.05, 500, 540, 1.45, 0.01],
  [T.time + 1.0, 960, 540, 1, 0.9],
  // close
  [T.contract2 + 0.2, 960, 540, 1.3, 0.8],
  [T.toDot - 0.1, 960, 540, 1, 0.8],
];

/** Sound cues: [t, kind, gain dB]. Camera moves add air whooshes automatically (scripts/sfx.py). */
export type CueKind = "whoosh" | "air" | "tick" | "key" | "click" | "pop" | "thud" | "soft" | "shimmer" | "swish" | "paper";
export type Cue = [number, CueKind, number?];

/** One time per typed character, with a deterministic human jitter (shared by visuals and sound). */
export const TYPE_TIMES = (() => {
  const n = Array.from(QUESTION).length;
  const dt = (T.typeTo - T.typeFrom) / n;
  return Array.from({ length: n }, (_, i) => {
    const h = Math.sin((i + 1) * 127.1 + 311.7) * 43758.5453;
    return T.typeFrom + i * dt + (h - Math.floor(h) - 0.5) * dt * 0.6;
  });
})();

export const CUES: Cue[] = [
  [T.squeeze, "swish", -4],
  [T.pill, "soft", -2],
  [T.focus, "click", 0],
  ...TYPE_TIMES.filter((_, i) => QUESTION[i] !== " ").map((t) => [t, "key", -6] as Cue),
  [T.send, "click", 0],
  [T.dots, "whoosh", -4],
  [T.merge1, "pop", -4],
  [T.panel, "soft", 0],
  [T.panel + 0.9, "tick", -8],
  [T.verseOut, "swish", -6],
  [T.split, "pop", -2],
  ...T.checks.map((t) => [t, "pop", -2] as Cue),
  [T.merge2, "soft", -2],
  [T.bento, "soft", -3],
  [T.unfold, "paper", -2],
  ...T.tour.map((t) => [t, "tick", -6] as Cue),
  [T.bentoClick, "click", 0],
  [T.flood1, "thud", 0],
  [T.within + 0.3, "shimmer", -10],
  [T.withinOut, "swish", -6],
  [T.grid, "pop", -4],
  [T.spread, "shimmer", -6],
  [T.contract1, "thud", -3],
  [T.cover, "paper", -3],
  [T.cureOut, "swish", -6],
  [T.repaint, "paper", -2],
  ...T.stages.map((t, i) => [t, i === 0 ? "pop" : "tick", -3] as Cue),
  [T.bookOut, "whoosh", -2],
  [T.day, "soft", -3],
  ...T.pins.map((t) => [t, "pop", -4] as Cue),
  ...[0, 1, 2, 3, 4, 5].map((i) => [T.blocks + i * 0.25, "swish", -10] as Cue),
  ...T.dayClicks.map((t) => [t, "click", -1] as Cue),
  [T.daySwap, "swish", -8],
  [T.dayOut, "whoosh", -4],
  [T.habit, "soft", -4],
  ...Array.from({ length: 26 }, (_, i) => [T.fills + i * 0.077, "tick", -12] as Cue),
  [T.habitClick, "click", 0],
  [T.flood2, "thud", 0],
  [T.time + 0.2, "paper", -6],
  [T.timeOut, "swish", -6],
  [T.contract2, "thud", -3],
  ...T.labels.map((t) => [t, "tick", -6] as Cue),
  [T.toDot, "pop", -4],
  [T.unfoldWord, "swish", -3],
];
