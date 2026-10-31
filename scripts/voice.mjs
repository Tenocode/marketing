// Voice-over with ElevenLabs from script.json: one single take with the timing of every word.
// Then it syncs the video to it: writes src/voice-timing.ts (which slice plays in each scene)
// and the DURATIONS block of src/config.ts, and switches the voice on.
// Usage: node scripts/voice.mjs         generates a new take if the text or the voice changed, then syncs
//        node scripts/voice.mjs --sync  only syncs with the take you already have (free)
//        node scripts/voice.mjs --new   always generates a new take (same text, another reading)
import fs from "node:fs";
import path from "node:path";
import { api, creditsUsed, logCredits, ROOT } from "./elevenlabs.mjs";
import { normalize } from "./ffmpeg.mjs";

const { voice, scenes } = JSON.parse(
  fs.readFileSync(path.join(ROOT, "script.json"), "utf8"),
);
const ORIGINAL = path.join(ROOT, "audio/voice-original.mp3");
const ALIGNMENT = path.join(ROOT, "audio/voice-alignment.json");
const OUTPUT = path.join(ROOT, "public/voice/narration.mp3");
const CONFIG = path.join(ROOT, "src/config.ts");
const TIMING = path.join(ROOT, "src/voice-timing.ts");

/** Seconds the image changes before its sentence starts. */
const LEAD = 0.12;
/** Seconds of air after the last word. */
const TAIL = 0.35;
const DEFAULT_MIN = 2;
const ENDS_SENTENCE = /[.?!…]$/;
const AUDIO_TAG = /\[[^\]]*\]/g;

/** Words that are actually spoken: audio tags like [excited] or [very calm] are not. */
const spokenWords = (text) =>
  text.replace(AUDIO_TAG, " ").trim().split(/\s+/).filter(Boolean);

const voiced = scenes.filter((s) => spokenWords(s.text ?? "").length);
const text = [voice.tag, ...voiced.map((s) => s.text.trim())]
  .filter(Boolean)
  .join(" ");
const request = {
  text,
  voice_id: voice.voice_id,
  model_id: voice.model_id,
  voice_settings: voice.voice_settings,
};
const tempo = voice.tempo ?? 1;
const args = process.argv.slice(2);

// ---------- Check the scenes before spending any credits ----------
const config = fs.readFileSync(CONFIG, "utf8");
const fps = Number(config.match(/FPS = (\d+)/)[1]);
const configIds = [
  ...config.match(/DURATIONS = \{([\s\S]*?)\}/)[1].matchAll(/(\w+):/g),
].map((m) => m[1]);
const scriptIds = scenes.map((s) => s.scene);
if (configIds.join() !== scriptIds.join()) {
  throw new Error(
    `Las escenas de script.json (${scriptIds.join(", ")}) no coinciden con DURATIONS ` +
      `en src/config.ts (${configIds.join(", ")}). Deben ser las mismas y en el mismo orden.`,
  );
}
if (!voiced.length)
  throw new Error("Ninguna escena de script.json tiene texto.");

// ---------- Generate the take if needed ----------
/** Groups the timed characters into words, skipping audio tags. */
const wordsFrom = (alignment) => {
  const words = [];
  let current = null;
  let inTag = false;
  alignment.characters.forEach((char, i) => {
    if (char === "[") inTag = true;
    if (inTag || /\s/.test(char)) {
      if (char === "]") inTag = false;
      current = null;
      return;
    }
    if (!current) {
      current = {
        word: "",
        start: alignment.character_start_times_seconds[i],
      };
      words.push(current);
    }
    current.word += char;
    current.end = alignment.character_end_times_seconds[i];
  });
  return words;
};

const generate = async () => {
  console.log(`Generando la voz de ${voice.name} con ElevenLabs…`);
  const before = await creditsUsed();
  const res = await api(
    `/v1/text-to-speech/${voice.voice_id}/with-timestamps`,
    {
      method: "POST",
      query: { output_format: "mp3_44100_128" },
      json: {
        text,
        model_id: voice.model_id,
        voice_settings: voice.voice_settings,
      },
    },
  );
  const data = await res.json();
  const words = wordsFrom(data.alignment);
  fs.mkdirSync(path.dirname(ORIGINAL), { recursive: true });
  fs.writeFileSync(ORIGINAL, Buffer.from(data.audio_base64, "base64"));
  fs.writeFileSync(
    ALIGNMENT,
    JSON.stringify({ request, words }, null, 1) + "\n",
  );
  console.log(`${words.length} palabras, ${words.at(-1).end.toFixed(2)} s.`);
  logCredits(before, await creditsUsed());
};

const stored = fs.existsSync(ALIGNMENT)
  ? JSON.parse(fs.readFileSync(ALIGNMENT, "utf8"))
  : null;
const upToDate =
  stored &&
  fs.existsSync(ORIGINAL) &&
  JSON.stringify(stored.request) === JSON.stringify(request);

if (args.includes("--new") || !upToDate) {
  if (args.includes("--sync")) {
    throw new Error(
      stored
        ? "El texto o la voz de script.json han cambiado desde la última toma. Quita --sync para generar otra."
        : "Todavía no hay voz generada. Quita --sync para generarla.",
    );
  }
  await generate();
}

// ---------- Tempo and loudness ----------
fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
normalize(ORIGINAL, OUTPUT, tempo === 1 ? [] : [`atempo=${tempo}`]);

// ---------- Split the take into scenes ----------
const { words } = JSON.parse(fs.readFileSync(ALIGNMENT, "utf8"));
const spoken = words
  .filter((w) => !/^\[.*\]$/.test(w.word))
  .map((w) => ({ start: w.start / tempo, end: w.end / tempo }));

const counts = voiced.map((scene) => spokenWords(scene.text).length);
const expected = counts.reduce((sum, n) => sum + n, 0);
if (expected !== spoken.length) {
  throw new Error(
    `La voz tiene ${spoken.length} palabras y el guion ${expected}. ` +
      "Revisa que las etiquetas vayan entre corchetes y genera otra toma con --new.",
  );
}

let next = 0;
const sentences = voiced.map((scene, i) => {
  const own = spoken.slice(next, next + counts[i]);
  next += counts[i];
  return { scene, start: own[0].start, end: own.at(-1).end };
});

const toFrames = (s) => Math.round(s * fps);
const toSeconds = (f) => Number((f / fps).toFixed(3));

// The narration plays continuously: each scene plays from its first word to the first word
// of the next one, and the picture changes just before its sentence starts.
const cuts = sentences.map((s, i) =>
  toFrames(i === 0 ? Math.max(0, s.start - 0.05) : s.start - LEAD),
);
cuts.push(toFrames(sentences.at(-1).end + TAIL));

const durations = {};
const slices = {};
const warnings = [];
sentences.forEach(({ scene }, i) => {
  const delay = toFrames(scene.delay ?? 0);
  const minSeconds = scene.min ?? DEFAULT_MIN;
  let frames = delay + cuts[i + 1] - cuts[i];
  if (frames < toFrames(minSeconds)) {
    // Only pad with silence when the sentence ends here; otherwise the voice would stop mid-phrase.
    if (ENDS_SENTENCE.test(scene.text.trim())) frames = toFrames(minSeconds);
    else
      warnings.push(
        `${scene.scene} dura ${toSeconds(frames)} s (mínimo ${minSeconds} s) y su frase sigue ` +
          "en la escena siguiente: alarga su texto en script.json.",
      );
  }
  durations[scene.scene] = toSeconds(frames);
  slices[scene.scene] = {
    start: toSeconds(cuts[i]),
    end: toSeconds(cuts[i + 1]),
    delay: toSeconds(delay),
  };
});
// Scenes without a sentence last their `min`.
for (const scene of scenes) durations[scene.scene] ??= scene.min ?? DEFAULT_MIN;

// ---------- Write the timings into the project ----------
const updated = config
  .replace(
    /DURATIONS = \{[\s\S]*?\}/,
    `DURATIONS = {\n${scriptIds.map((id) => `  ${id}: ${durations[id]},`).join("\n")}\n}`,
  )
  .replace(/(export const VOICE = \{\s*active: )false/, "$1true");
fs.writeFileSync(CONFIG, updated);

const sliceLines = scriptIds
  .filter((id) => slices[id])
  .map(
    (id) =>
      `  ${id}: { start: ${slices[id].start}, end: ${slices[id].end}, delay: ${slices[id].delay} },`,
  );
fs.writeFileSync(
  TIMING,
  `// Generated by scripts/voice.mjs: slice of narration.mp3 (seconds) played in each scene
// and how long the scene waits before it starts.
import type { SceneId } from "./config";

export type VoiceSlice = { start: number; end: number; delay: number };

export const VOICE_SLICES: Partial<Record<SceneId, VoiceSlice>> = {
${sliceLines.join("\n")}
};
`,
);

const total = scriptIds.reduce((sum, id) => sum + durations[id], 0);
console.table(
  scriptIds.map((id) => ({
    escena: id,
    segundos: durations[id],
    voz: slices[id]
      ? Number((slices[id].end - slices[id].start).toFixed(2))
      : "sin voz",
  })),
);
console.log(`Velocidad ${tempo}×. Total: ${total.toFixed(1)} s.`);
for (const warning of warnings) console.warn(warning);
