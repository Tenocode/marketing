// Renders one still per scene into out/stills/ so you can review the video before rendering it.
// Usage: node scripts/stills.mjs              one still per scene
//        node scripts/stills.mjs phone outro  only those scenes
//        node scripts/stills.mjs 45 300       those exact frames
import { createRequire } from "node:module";
import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { ROOT } from "./elevenlabs.mjs";

const require = createRequire(import.meta.url);
const cliRequire = createRequire(require.resolve("@remotion/cli/package.json"));
const { bundle } = cliRequire("@remotion/bundler");
const { renderStill, selectComposition } = cliRequire("@remotion/renderer");

/** Moment of each scene (fraction of its length) that best sums it up. */
const MOMENT = { title: 0.8, pipeline: 0.85, phone: 0.9, terminal: 0.92 };

const config = readFileSync(path.join(ROOT, "src/config.ts"), "utf8");
const fps = Number(config.match(/FPS = (\d+)/)[1]);
const block = config.match(/DURATIONS = \{([\s\S]*?)\}/)[1];
let from = 0;
const scenes = [...block.matchAll(/(\w+):\s*([\d.]+)/g)].map(([, id, s]) => {
  const frames = Math.round(Number(s) * fps);
  const scene = { id, from, frames };
  from += frames;
  return scene;
});

const args = process.argv.slice(2);
const frames = args.filter((a) => /^\d+$/.test(a)).map(Number);
const wanted = args.filter((a) => !/^\d+$/.test(a));
const outDir = path.join(ROOT, "out/stills");
mkdirSync(outDir, { recursive: true });

const serveUrl = await bundle({
  entryPoint: path.join(ROOT, "src/index.ts"),
  rootDir: ROOT,
  publicDir: path.join(ROOT, "public"),
  rspack: true,
});
const composition = await selectComposition({
  serveUrl,
  id: "Demo",
  inputProps: {},
});

const still = (frame, name) =>
  renderStill({
    serveUrl,
    composition,
    output: path.join(outDir, name),
    frame,
    imageFormat: "jpeg",
    jpegQuality: 88,
  });

for (const frame of frames) {
  await still(frame, `f${String(frame).padStart(4, "0")}.jpg`);
  console.log(`fotograma ${frame}`);
}

if (!frames.length) {
  for (const [i, scene] of scenes.entries()) {
    if (wanted.length && !wanted.includes(scene.id)) continue;
    const frame =
      scene.from + Math.round(scene.frames * (MOMENT[scene.id] ?? 0.7));
    await still(frame, `${String(i + 1).padStart(2, "0")}-${scene.id}.jpg`);
    console.log(
      `${scene.id}: fotograma ${frame} (${(frame / fps).toFixed(1)} s)`,
    );
  }
}
