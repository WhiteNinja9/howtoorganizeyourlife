import { Composition } from "remotion";
import { Film } from "./Film";
import { FPS, H, W } from "./lib/anim";
import { T } from "./timeline";
import "./lib/theme";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition id="Rise" component={Film} durationInFrames={T.end} fps={FPS} width={W} height={H} />
  );
};
