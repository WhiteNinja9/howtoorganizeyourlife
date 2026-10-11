import { Composition, Still } from "remotion";
import { Thumbnail } from "./Thumbnail";
import { Banner } from "./Banner";
import { Pfp } from "./Pfp";
import { Film, TOTAL_FRAMES } from "./Film";
import { FPS, H, W } from "./lib/motion";
import "./lib/theme";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Rise" component={Film} durationInFrames={TOTAL_FRAMES} fps={FPS} width={W} height={H} defaultProps={{ sfx: false }} />
    <Still id="Thumbnail" component={Thumbnail} width={1280} height={720} />
    <Still id="Banner" component={Banner} width={2560} height={1440} />
    <Still id="Pfp-ink" component={Pfp} width={800} height={800} defaultProps={{ variant: "ink" as const }} />
    <Still id="Pfp-emerald" component={Pfp} width={800} height={800} defaultProps={{ variant: "emerald" as const }} />
  </>
);
