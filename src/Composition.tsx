import {
  AbsoluteFill,
  CalculateMetadataFunction,
  Composition,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Landscape 1080p at 60 fps
const FPS = 60;
const WIDTH = 1920;
const HEIGHT = 1080;
const DURATION_IN_SECONDS = 5;

type Props = {};

const calculateMetadata: CalculateMetadataFunction<Props> = () => {
  return {};
};

export const MyComposition = () => {
  return (
    <Composition
      id="MyComp"
      component={MyComponent}
      durationInFrames={DURATION_IN_SECONDS * FPS}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      calculateMetadata={calculateMetadata}
    />
  );
};

export const MyComponent: React.FC<Props> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade in over the first half second
  const opacity = interpolate(frame, [0, fps / 2], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0b0b0f",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1
        style={{
          opacity,
          color: "white",
          fontFamily: "sans-serif",
          fontSize: 120,
        }}
      >
        How to Organize Your Life
      </h1>
    </AbsoluteFill>
  );
};
