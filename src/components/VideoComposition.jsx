import React from "react";
import {
  AbsoluteFill,
  Sequence,
  Video,
  useVideoConfig,
  useCurrentFrame,
  spring,
  interpolate,
} from "remotion";
import myVideo from "../assets/video.mp4";

const AnimatedText = ({ text, animation, font, color, fps }) => {
  const frame = useCurrentFrame();
  const opacity = spring({ frame, from: 0, to: 1, durationInFrames: fps, fps });

  let animatedStyle = { opacity, fontFamily: font, color };

  if (animation === "slideIn") {
    const translateX = interpolate(frame, [0, fps], [-100, 0], {
      extrapolateRight: "clamp",
    });
    animatedStyle = {
      ...animatedStyle,
      transform: `translateX(${translateX}px)`,
    };
  } else if (animation === "zoomIn") {
    const scale = spring({ frame, from: 0, to: 1, durationInFrames: fps, fps });
    animatedStyle = { ...animatedStyle, transform: `scale(${scale})` };
  } else if (animation === "bounce") {
    const y = Math.sin(frame * 0.2) * 10;
    animatedStyle = { ...animatedStyle, transform: `translateY(${y}px)` };
  }

  return (
    <h1
      className="text-3xl md:text-4xl lg:text-5xl font-bold text-center px-4"
      style={animatedStyle}
    >
      {text}
    </h1>
  );
};

export const VideoComposition = ({ overlays, fps }) => {
  const { width, height } = useVideoConfig();
  const videoHeight = height;
  const videoWidth = (videoHeight * 9) / 16; // Assuming 9:16 aspect ratio for vertical video

  return (
    <AbsoluteFill className="bg-black">
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          style={{
            width: videoWidth,
            height: videoHeight,
            position: "relative",
          }}
        >
          <Video
            src={myVideo}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </div>

      {overlays.map((overlay, index) => {
        const { text, time, animation, font, color } = overlay;
        return (
          <Sequence
            key={index}
            from={Math.floor(time * fps)}
            durationInFrames={fps * 3}
          >
            <AbsoluteFill className="flex items-center justify-center">
              <div style={{ width: videoWidth, textAlign: "center" }}>
                <AnimatedText
                  text={text}
                  animation={animation}
                  font={font}
                  color={color}
                  fps={fps}
                />
              </div>
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
