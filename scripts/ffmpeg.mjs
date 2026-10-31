// Uses the ffmpeg that ships with Remotion, so there is nothing else to install
// and it works the same on Windows, macOS and Linux.
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const remotionCli = path.join(
  path.dirname(require.resolve("@remotion/cli/package.json")),
  "remotion-cli.js",
);

const run = (tool, args) =>
  execFileSync(process.execPath, [remotionCli, tool, "-v", "error", ...args], {
    encoding: "utf8",
  });

/** Same perceived loudness for every track (−16 LUFS), with optional extra filters first. */
export const normalize = (input, output, filters = []) =>
  run("ffmpeg", [
    "-y",
    "-i",
    input,
    "-filter:a",
    [...filters, "loudnorm=I=-16:TP=-1.5:LRA=11"].join(","),
    "-ar",
    "44100",
    "-b:a",
    "192k",
    output,
  ]);

export const durationOf = (file) =>
  Number(
    run("ffprobe", [
      "-show_entries",
      "format=duration",
      "-of",
      "csv=p=0",
      file,
    ]).trim(),
  );
