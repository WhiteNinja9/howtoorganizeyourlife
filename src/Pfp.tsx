import React from "react";
import { AbsoluteFill } from "remotion";
import { C, F } from "./lib/theme";

/** Channel profile picture, 800×800: the "R." from the wordmark, centred for YouTube's circular crop. */
const VARIANTS = {
  ink: { bg: C.ink, letter: C.paper, dot: "#2FB58F" },
  emerald: { bg: C.emerald, letter: C.white, dot: C.goldSoft },
};

export const Pfp: React.FC<{ variant: keyof typeof VARIANTS }> = ({ variant }) => {
  const v = VARIANTS[variant];
  return (
    <AbsoluteFill style={{ background: v.bg, alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          fontFamily: F.word,
          fontWeight: 800,
          fontVariationSettings: "'wdth' 125, 'wght' 800",
          fontSize: 470,
          lineHeight: 1,
          color: v.letter,
          // optical centring: the period makes the glyph pair sit right-heavy
          transform: "translate(-6px, -14px)",
        }}
      >
        R<span style={{ color: v.dot }}>.</span>
      </div>
    </AbsoluteFill>
  );
};
