export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

/**
 * Seconds per scene, in order. `npm run voice` rewrites this block so each scene
 * lasts as long as its sentence. Edit by hand only if you are not using a voice-over.
 */
export const DURATIONS = {
  title: 2.5,
  pipeline: 5.3,
  phone: 3.5,
  terminal: 3.5,
  outro: 3.5,
} as const;

export type SceneId = keyof typeof DURATIONS;

/** Frames of each crossfade between two scenes. */
export const FADE = 8;

/** Text shown on the last scene. Put the link to your repo or website here. */
export const CTA_TEXT = "Plantilla abierta en GitHub";

/** Background music: lower under the voice (`volume`), higher without it (`withoutVoice`). */
export const MUSIC = {
  active: true,
  file: "music.mp3",
  /** Seconds skipped at the start of the track. */
  skip: 1,
  volume: 0.18,
  withoutVoice: 0.3,
  fadeIn: 0.5,
  fadeOut: 2,
};

/** Voice-over. `npm run voice` generates it, switches it on and syncs the scenes. */
export const VOICE = {
  active: true,
  file: "voice/narration.mp3",
  volume: 1,
};

export type Segment = { id: SceneId; from: number; frames: number };

export const SEGMENTS: Segment[] = (() => {
  let from = 0;
  return (Object.keys(DURATIONS) as SceneId[]).map((id) => {
    const frames = Math.round(DURATIONS[id] * FPS);
    const segment = { id, from, frames };
    from += frames;
    return segment;
  });
})();

export const TOTAL_FRAMES = SEGMENTS.reduce((sum, s) => sum + s.frames, 0);
