// Prints a film's timeline data as JSON for scripts/sfx.py:  npx tsx scripts/cues.ts [rise|lesson2]
import * as rise from "../src/script";
import * as lesson2 from "../src/lesson2/script";

const films = { rise, lesson2 } as const;
const name = (process.argv[2] ?? "rise") as keyof typeof films;
const f = films[name];
console.log(JSON.stringify({ duration: f.DURATION, cues: f.CUES, cam: f.CAM }));
