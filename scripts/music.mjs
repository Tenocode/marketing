// Instrumental background music with ElevenLabs Music, normalized to −16 LUFS in public/music.mp3.
// Usage: node scripts/music.mjs        normalizes audio/music-original.mp3 (generates it if missing)
//        node scripts/music.mjs --new  generates a new track from the prompt in script.json
import fs from "node:fs";
import path from "node:path";
import { api, creditsUsed, logCredits, ROOT } from "./elevenlabs.mjs";
import { durationOf, normalize } from "./ffmpeg.mjs";

const { music } = JSON.parse(
  fs.readFileSync(path.join(ROOT, "script.json"), "utf8"),
);
const ORIGINAL = path.join(ROOT, "audio/music-original.mp3");
const OUTPUT = path.join(ROOT, "public/music.mp3");

if (process.argv.includes("--new") || !fs.existsSync(ORIGINAL)) {
  console.log("Generando música con ElevenLabs (puede tardar un minuto)…");
  const before = await creditsUsed();
  const res = await api("/v1/music", {
    method: "POST",
    query: { output_format: "mp3_44100_128" },
    json: {
      prompt: music.prompt,
      music_length_ms: music.length_ms,
      model_id: music.model_id,
      force_instrumental: true,
    },
  });
  fs.mkdirSync(path.dirname(ORIGINAL), { recursive: true });
  fs.writeFileSync(ORIGINAL, Buffer.from(await res.arrayBuffer()));
  logCredits(before, await creditsUsed());
}

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
normalize(ORIGINAL, OUTPUT);
console.log(
  `public/music.mp3: ${durationOf(OUTPUT).toFixed(1)} s, normalizada a −16 LUFS.`,
);
