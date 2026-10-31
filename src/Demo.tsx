import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { between } from "./anim";
import { Background } from "./components/Background";
import {
  FADE,
  FPS,
  MUSIC,
  type SceneId,
  SEGMENTS,
  TOTAL_FRAMES,
  VOICE,
} from "./config";
import { PaceContext } from "./pace";
import { Outro } from "./scenes/Outro";
import { Phone, PHONE_DESIGN } from "./scenes/Phone";
import { Pipeline, PIPELINE_DESIGN } from "./scenes/Pipeline";
import { Terminal, TERMINAL_DESIGN } from "./scenes/Terminal";
import { Title, TITLE_DESIGN } from "./scenes/Title";
import type { Scene } from "./scenes/types";
import { VOICE_SLICES } from "./voice-timing";

const SCENES: Record<SceneId, { component: Scene; design?: number }> = {
  title: { component: Title, design: TITLE_DESIGN },
  pipeline: { component: Pipeline, design: PIPELINE_DESIGN },
  phone: { component: Phone, design: PHONE_DESIGN },
  terminal: { component: Terminal, design: TERMINAL_DESIGN },
  // The outro plays in real time and simply holds if it lasts longer.
  outro: { component: Outro, design: undefined },
};

const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const FadeLayer: React.FC<{
  frames: number;
  fadeIn: boolean;
  fadeOut: boolean;
  children: React.ReactNode;
}> = ({ frames, fadeIn, fadeOut, children }) => {
  const frame = useCurrentFrame();
  const opacity =
    (fadeIn ? between(frame, 0, FADE, 0, 1, Easing.linear) : 1) *
    (fadeOut
      ? 1 - between(frame, frames, frames + FADE, 0, 1, Easing.in(Easing.quad))
      : 1);
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

/** Frames where the voice is speaking: from the first sentence to the end of the last. */
const voiceRange = (): [number, number] | null => {
  const voiced = SEGMENTS.filter((s) => VOICE_SLICES[s.id]);
  const first = voiced[0];
  const last = voiced[voiced.length - 1];
  if (!VOICE.active || !first || !last) return null;
  const firstSlice = VOICE_SLICES[first.id]!;
  const lastSlice = VOICE_SLICES[last.id]!;
  return [
    first.from + Math.round(firstSlice.delay * FPS),
    last.from +
      Math.round((lastSlice.delay + lastSlice.end - lastSlice.start) * FPS),
  ];
};

const Music: React.FC = () => {
  const voice = voiceRange();
  // interpolate needs strictly increasing frames, so a fade of 0 s becomes one frame.
  const fadeInEnd = Math.max(1, MUSIC.fadeIn * FPS);
  const fadeOutStart = Math.min(
    TOTAL_FRAMES - 1,
    Math.max(fadeInEnd + 1, TOTAL_FRAMES - MUSIC.fadeOut * FPS),
  );
  return (
    <Audio
      src={staticFile(MUSIC.file)}
      trimBefore={Math.round(MUSIC.skip * FPS)}
      volume={(f) => {
        const fade = interpolate(
          f,
          [0, fadeInEnd, fadeOutStart, TOTAL_FRAMES],
          [0, 1, 1, 0],
          CLAMP,
        );
        const level = voice
          ? interpolate(
              f,
              [voice[0] - 8, voice[0], voice[1], voice[1] + 15],
              [
                MUSIC.withoutVoice,
                MUSIC.volume,
                MUSIC.volume,
                MUSIC.withoutVoice,
              ],
              CLAMP,
            )
          : MUSIC.withoutVoice;
        return fade * level;
      }}
    />
  );
};

const VoiceOver: React.FC = () => (
  <>
    {SEGMENTS.map((segment) => {
      const slice = VOICE_SLICES[segment.id];
      if (!slice) return null;
      return (
        <Sequence
          key={`voice-${segment.id}`}
          name={`voice ${segment.id}`}
          from={segment.from + Math.round(slice.delay * FPS)}
        >
          <Audio
            src={staticFile(VOICE.file)}
            volume={VOICE.volume}
            trimBefore={Math.round(slice.start * FPS)}
            trimAfter={Math.round(slice.end * FPS)}
          />
        </Sequence>
      );
    })}
  </>
);

export const Demo: React.FC = () => (
  <AbsoluteFill>
    <Background />
    {SEGMENTS.map((segment, i) => {
      const { component: SceneComponent, design } = SCENES[segment.id];
      const isFirst = i === 0;
      const isLast = i === SEGMENTS.length - 1;
      return (
        <Sequence
          key={segment.id}
          name={segment.id}
          from={segment.from}
          durationInFrames={segment.frames + (isLast ? 0 : FADE)}
        >
          <FadeLayer
            frames={segment.frames}
            fadeIn={!isFirst}
            fadeOut={!isLast}
          >
            <PaceContext.Provider
              value={(design ?? segment.frames) / segment.frames}
            >
              <SceneComponent duration={segment.frames} />
            </PaceContext.Provider>
          </FadeLayer>
        </Sequence>
      );
    })}
    {MUSIC.active ? <Music /> : null}
    {VOICE.active ? <VoiceOver /> : null}
  </AbsoluteFill>
);
