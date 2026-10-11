/**
 * Lesson 2 — "What sins do to your heart (and the way back)". Pure data: beat times (s), eyelid keys,
 * camera keys and sound cues. scripts/cues.ts imports this for the sound mix.
 */
import type { CamKey } from "../lib/motion";

export const DURATION = 64.2;

export const T = {
  // open: wordmark → dot → black → the eyes open on a phone at night
  squeeze: 0.5,
  dotFlood: 1.5,
  eyesOpen: 2.4,
  swipes: [4.0, 5.0, 6.0],
  lines: [4.2, 5.2],
  theCard: 6.3,
  heavyBlink: 7.2,
  bilal: 8.6,
  bilalOut: 12.0,
  eyesClose: 12.4,
  // the heart (hadith of the black spot)
  heart: 13.0,
  heartOpen: 13.4,
  hadith1: 14.2,
  firstSpot: 15.6,
  hadith2: 16.6,
  spread: 17.6,
  covered: 20.2,
  heartTextOut: 21.0,
  ran: 21.4,
  ranOut: 25.4,
  // the book: the black heart becomes the cover, it opens, pages riffle, the quote page
  book: 26.0,
  coverOpen: 27.6,
  riffle: 28.8,
  zoomPage: 31.0,
  mark1: 32.2,
  mark2: 35.4,
  bookOut: 38.6,
  // a blink into dawn
  dark: 38.8,
  doorText: 39.8,
  doorOut: 41.0,
  dawn: 41.2,
  ayahA: 42.4,
  ayahB: 43.4,
  ayahOut: 48.6,
  // the way back: istighfār polishes the heart
  polish: 49.0,
  clicks: [50.8, 51.4, 51.9, 52.3, 52.6, 52.9, 53.15, 53.35],
  hold: [53.5, 54.6] as [number, number],
  clean: 55.0,
  polishOut: 57.2,
  // close
  toPill: 57.6,
  labels: [58.4, 59.5, 60.6],
  toDot: 61.8,
  unfoldWord: 62.5,
};

export const SCENES = { night: 0, heart: T.heart, book: T.book, dawn: T.dark + 0.6, close: T.toPill };

/** Eyelid openness keys [t, openness 0..1, glide s]. 1 = no lids. */
export const LIDS: [number, number, number?][] = [
  [0, 1, 0],
  [T.dotFlood + 0.45, 0, 0.01],
  [T.eyesOpen, 0.35, 0.3],
  [T.eyesOpen + 0.35, 0.18, 0.18],
  [T.eyesOpen + 0.55, 1, 0.75],
  // quick natural blinks while scrolling
  [5.55, 0, 0.09],
  [5.66, 1, 0.22],
  // the guilty, heavy blink on "that" card
  [T.heavyBlink, 0.22, 0.45],
  [T.heavyBlink + 0.75, 1, 0.6],
  // slow close after the quote; open onto the heart (both black, so the switch is invisible)
  [T.eyesClose, 0, 0.55],
  [T.heart, 1, 0.01],
  // the book page fades to darkness: close again
  [T.dark, 0, 0.6],
  // open slowly onto dawn, with one flutter
  [T.dawn, 0.4, 0.5],
  [T.dawn + 0.6, 0.25, 0.25],
  [T.dawn + 0.9, 1, 0.9],
];

export const CAM: CamKey[] = [
  [0, 960, 540, 1],
  [3.0, 960, 520, 1.25, 1.2],
  [T.theCard + 0.1, 960, 470, 1.6, 0.8],
  [T.bilal - 0.4, 960, 500, 1.35, 0.8],
  [T.heart, 960, 540, 1, 0.01],
  [T.ran - 0.3, 960, 540, 1, 0.5],
  [T.book, 960, 540, 1.08, 0.8],
  [T.coverOpen, 960, 540, 1.0, 1.0],
  [T.zoomPage, 1170, 630, 2.1, 1.0],
  [T.bookOut, 960, 540, 1.15, 0.9],
  [T.dark + 0.6, 960, 540, 1, 0.01],
  [T.polish - 0.2, 960, 540, 1, 0.5],
  [T.clicks[0] - 0.4, 960, 500, 1.1, 0.7],
  [T.clean, 960, 520, 1.0, 0.8],
  [T.toPill + 0.2, 960, 540, 1.25, 0.8],
  [T.toDot - 0.1, 960, 540, 1, 0.8],
];

export type CueKind = "whoosh" | "air" | "tick" | "key" | "click" | "pop" | "thud" | "soft" | "shimmer" | "swish" | "paper";
export type Cue = [number, CueKind, number?];

export const CUES: Cue[] = [
  [T.squeeze, "swish", -4],
  [T.dotFlood, "thud", -4],
  [T.eyesOpen, "soft", -2],
  ...T.swipes.map((t) => [t, "swish", -6] as Cue),
  [5.55, "soft", -12],
  [T.theCard, "soft", -4],
  [T.heavyBlink, "air", -2],
  [T.bilal, "shimmer", -8],
  [T.eyesClose, "air", -2],
  [T.heartOpen, "pop", -4],
  [T.firstSpot, "thud", 0],
  ...Array.from({ length: 12 }, (_, i) => [T.spread + i * 0.2, "thud", -8 - i * 0.3] as Cue),
  [T.covered, "thud", 2],
  [T.ran, "shimmer", -8],
  [T.book, "thud", -3],
  [T.coverOpen, "paper", 0],
  ...[0, 1, 2, 3].map((i) => [T.riffle + i * 0.32, "paper", -3] as Cue),
  [T.mark1, "swish", -10],
  [T.mark2, "swish", -10],
  [T.dark, "air", -2],
  [T.doorText, "shimmer", -8],
  [T.dawn, "soft", 0],
  [T.polish, "pop", -3],
  ...T.clicks.map((t) => [t, "click", -1] as Cue),
  ...Array.from({ length: 9 }, (_, i) => [T.hold[0] + i * 0.12, "tick", -10] as Cue),
  [T.clean, "shimmer", -4],
  [T.toPill, "soft", -3],
  ...T.labels.map((t) => [t, "tick", -6] as Cue),
  [T.toDot, "pop", -4],
  [T.unfoldWord, "swish", -3],
];
