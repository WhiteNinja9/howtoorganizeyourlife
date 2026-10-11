import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const C = {
  paper: "#F4EFE6",
  paper2: "#E9E1D2",
  white: "#FFFDF8",
  ink: "#0D1512",
  ink2: "#26302C",
  muted: "#7D7A72",
  line: "#D8D0C1",
  emerald: "#0E6B58",
  emeraldDeep: "#0A5244",
  mint: "#7FD1B9",
  gold: "#C9A24A",
  goldSoft: "#E3C987",
  bubble: "rgba(13,21,18,0.06)",
};

export const F = {
  word: "Archivo",
  ui: "Geist",
  mono: "Geist Mono",
  ar: "Plex",
  ayah: "AyahFont",
};

export const SHADOW = "0 22px 50px rgba(13,40,30,.12), 0 2px 6px rgba(13,40,30,.06)";

const fonts = [
  loadFont({ family: F.word, url: staticFile("fonts/archivo.woff2"), weight: "100 900", stretch: "62% 125%" }),
  loadFont({ family: F.ui, url: staticFile("fonts/geist.woff2"), weight: "100 900" }),
  loadFont({ family: F.mono, url: staticFile("fonts/geist-mono.woff2"), weight: "100 900" }),
  loadFont({ family: F.ar, url: staticFile("fonts/plex-400.woff2"), weight: "400" }),
  loadFont({ family: F.ar, url: staticFile("fonts/plex-600.woff2"), weight: "600" }),
  loadFont({ family: F.ar, url: staticFile("fonts/plex-700.woff2"), weight: "700" }),
  loadFont({ family: F.ayah, url: staticFile("fonts/ayah.woff2"), weight: "400" }),
];

export const fontsReady = Promise.all(fonts);
