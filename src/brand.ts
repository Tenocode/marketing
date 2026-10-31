import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

/** Change these to your brand colors and the whole video follows. */
export const color = {
  background: "#0D0E12",
  surface: "#171920",
  line: "#2A2D37",
  text: "#F4F4F6",
  muted: "#9BA0AE",
  accent: "#7C5CFF",
  accentSoft: "rgba(124, 92, 255, 0.18)",
  mint: "#2EE6A6",
};

export const font = {
  heading: '"Lexend", sans-serif',
  body: '"Hanken Grotesk", system-ui, sans-serif',
  mono: 'ui-monospace, "Cascadia Code", "SF Mono", Menlo, Consolas, monospace',
};

const FONT_FILES: Array<[family: string, weight: string]> = [
  ["Lexend", "400"],
  ["Lexend", "600"],
  ["Lexend", "700"],
  ["HankenGrotesk", "400"],
  ["HankenGrotesk", "500"],
  ["HankenGrotesk", "600"],
  ["HankenGrotesk", "700"],
];

export const loadBrandFonts = () =>
  Promise.all(
    FONT_FILES.map(([file, weight]) =>
      loadFont({
        family: file === "HankenGrotesk" ? "Hanken Grotesk" : file,
        weight,
        url: staticFile(`fonts/${file}-${weight}.woff2`),
      }),
    ),
  );
