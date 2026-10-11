import { Composition } from "remotion";
import { Film, TOTAL_FRAMES } from "./Film";
import { FPS, H, W } from "./lib/motion";
import "./lib/theme";

export const RemotionRoot: React.FC = () => (
  <Composition id="Rise" component={Film} durationInFrames={TOTAL_FRAMES} fps={FPS} width={W} height={H} defaultProps={{ sfx: false }} />
);
