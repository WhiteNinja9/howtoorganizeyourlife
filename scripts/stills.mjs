// Batch stills from one bundle: node scripts/stills.mjs <outDir> <scale> <t1> <t2> ...  (times in seconds)
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { mkdirSync } from "node:fs";
import { globSync } from "node:fs";
import path from "node:path";

const [outDir, scaleArg, ...times] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
const browserExecutable = globSync("/opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell")[0] ?? null;
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id: process.env.COMP ?? "Rise", browserExecutable });
for (const ts of times) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(parseFloat(ts) * 60));
  await renderStill({
    composition,
    serveUrl,
    frame,
    output: path.join(outDir, `t${ts.padStart(5, "0")}.png`),
    scale: parseFloat(scaleArg),
    browserExecutable,
  });
  process.stdout.write(".");
}
console.log(" done");
