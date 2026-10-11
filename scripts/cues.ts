// Prints the film's timeline data as JSON for scripts/sfx.py (npx tsx scripts/cues.ts)
import { CAM, CUES, DURATION } from "../src/script";
console.log(JSON.stringify({ duration: DURATION, cues: CUES, cam: CAM }));
