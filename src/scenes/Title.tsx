import { AbsoluteFill } from "remotion";
import { between } from "../anim";
import { color, font } from "../brand";
import { Words } from "../components/Words";
import { usePacedFrame } from "../pace";
import type { Scene } from "./types";

export const TITLE_DESIGN = 75;

export const Title: Scene = () => {
  const frame = usePacedFrame();
  const caretOn = Math.floor(frame / 12) % 2 === 0;
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        gap: 28,
      }}
    >
      <div
        style={{
          font: `600 34px ${font.body}`,
          letterSpacing: "0.3em",
          color: color.muted,
          opacity: between(frame, 0, 12),
        }}
      >
        REMOTION + ELEVENLABS
      </div>
      <Words
        text="Este vídeo"
        at={4}
        style={{
          font: `700 150px/1 ${font.heading}`,
          letterSpacing: "-0.04em",
          color: color.text,
        }}
      />
      <div style={{ display: "flex", alignItems: "center" }}>
        <Words
          text="es código."
          at={14}
          accent={["código."]}
          style={{
            font: `700 150px/1 ${font.heading}`,
            letterSpacing: "-0.04em",
            color: color.text,
          }}
        />
        <div
          style={{
            width: 14,
            height: 130,
            marginLeft: 6,
            borderRadius: 4,
            background: color.accent,
            opacity: frame > 22 && caretOn ? 1 : 0,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
