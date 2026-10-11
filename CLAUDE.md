# Rise — Remotion film (landscape 1920×1080, 60 fps)

Composition `Rise` in `src/Film.tsx`. All timing, texts, camera keys and sound cues live in `src/script.ts`
(pure data, imported by `scripts/sfx.py` through `scripts/cues.ts`).

## House rules (from the owner's standing feedback — always apply)

- **No music.** No drums, no pitched/tonal SFX (bells, chimes). Noise-based foley only: whooshes, ticks,
  thuds, air, paper, soft pops, noise shimmer. Recorded non-tonal foley (e.g. Mixkit) is allowed when reachable.
- Landscape 1920×1080 @ 60 fps by default. Smooth, continuous, cinematic: never hard cuts, flashes or crossfades.
- **Never** decorate with stars built from overlapping polygons (two squares / hexagram lattices) and never
  use click rings, ripples or glow halos. Presses = small squash on the shape + cursor scale 0.85.
- **Never** let a logo, icon or symbol stand for Allah. Name Him in text.
- Arabic UI/copy in IBM Plex Sans Arabic; ayat in a mushaf font (QCF V2 from quran.com when reachable,
  otherwise Amiri Quran). Write Arabic copy in Fusha.
- Quote only from verified text (the Shamela MCP is available): Quran text, hadith wording, book + page.
- Check the provenance/tags of any audio file before using it.
- Show work for review before a final render (preview / stills), then render.

## Motion playbook

- Every value is a pure function of the frame (fractional frames too — motion blur samples them).
  No timers, no CSS transitions, no state between frames.
- Springs are closed-form step responses (`step(t, ω, ζ)` in `src/lib/motion.ts`); ζ≈0.86 for a tiny
  overshoot, ζ=1 for "soft". A value that retargets is the sum of one step per change. Snap settled values
  to exact targets (loops must match pixel for pixel).
- Morphs and camera moves glide 0.8 s on cubic-bezier(.45,0,.15,1) (`GLIDE`). Camera = screen-studio rig:
  `translate(960 - fx·s, 540 - fy·s) scale(s)`, origin 0 0, zoom interpolated in log space. Zoom so each
  micro-interaction fills the frame. **Hold the camera perfectly still while text is being read** (Chrome
  re-rasters text in 1 px steps under slow drift). Never zoom into a tiny dot — open the dot instead.
- One shape carries the story; content inside it has its own enter/exit windows and is clipped by the shape.
- Floods: a circle from the cause to past the farthest corner in 0.3–0.45 s, eased **by area**
  (r = √lerp(r0², r1², u)). Contractions are eased by area too.
- Text rises/rolls through a mask line. Exits accelerate (k²) with a blur ramp. Nothing fades in.
- Dark → light colour changes: never lerp (muddy grey); dissolve an overlay of the old colour outward from
  the focal point with a radial mask.
- Goo (blur + alpha threshold `0 0 0 22 -9`) only during splits/merges; labels on a separate layer.
- Cursor drives every change: glide paths that arrive just before the beat, faces its direction of travel,
  grows on hover, presses at 0.85.
- Counters swap whole values with every digit in a fixed-width slot.
- Whole-frame motion blur via `CameraMotionBlur` (4 samples, 180°), 1 sample in the first and last 30
  frames so the loop seam matches. Audio stays outside the blur.
- Verify: contact sheets of stills (one per beat / transition), frame-difference pop scan (spikes ≈3× their
  neighbours; confirm on full-res stills), first-vs-last frame diff for loops. Remotion writes full-range
  yuvj420p: re-encode with `scale=in_range=pc:out_range=tv,format=yuv420p`.
- Sound: cues come from the same timeline as the visuals; camera moves get air whooshes sized by the move.
  Master to −14 LUFS with gain + limiter (linear loudnorm fails on sparse cues).

## Commands

- Measure label widths after editing `scripts/labels.json`: `python3 scripts/measure.py`
- Sound: `python3 scripts/fetch_sfx.py` (once; Mixkit takes → `sfx/mixkit/`, git-ignored because the licence
  forbids redistributing the raw files), then `python3 scripts/sfx.py` → `public/sfx.wav`. Takes per cue kind
  live in `scripts/sfx_library.py`; every take was screened non-tonal (spectral peak prominence ≤ 12 dB).
- Preview: `npx remotion render Rise out/rise-preview.mp4 --scale=0.5 --browser-executable=<headless_shell>`
  (in cloud sessions the headless shell is `/opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell`)
