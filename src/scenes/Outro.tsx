import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { between, springIn } from "../anim";
import { color, font } from "../brand";
import { Words } from "../components/Words";
import { CTA_TEXT } from "../config";
import type { Scene } from "./types";

const OUTLINE = 4 * 150;

/** A placeholder mark: swap it for your own logo (an SVG or an <Img> from public/). */
const Mark: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const draw = between(frame, 0, 24);
  const play = springIn(frame, fps, 16);
  return (
    <svg width={180} height={180} viewBox="0 0 180 180">
      <rect
        x={15}
        y={15}
        width={150}
        height={150}
        rx={42}
        fill="none"
        stroke={color.accent}
        strokeWidth={10}
        strokeDasharray={OUTLINE}
        strokeDashoffset={OUTLINE * (1 - draw)}
      />
      <path
        d="M74 58 L124 90 L74 122 Z"
        fill={color.text}
        style={{ transform: `scale(${play})`, transformOrigin: "96px 90px" }}
      />
    </svg>
  );
};

/**
 * Plays in real time, not paced: it builds up in about a second and a half and then
 * holds for as long as the scene lasts.
 */
export const Outro: Scene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", gap: 48 }}
    >
      <Mark frame={frame} fps={fps} />
      <Words
        text="La plantilla es tuya."
        at={12}
        accent={["tuya."]}
        style={{
          font: `700 110px/1 ${font.heading}`,
          letterSpacing: "-0.03em",
          color: color.text,
        }}
      />
      <div
        style={{
          font: `500 44px ${font.mono}`,
          color: color.muted,
          padding: "18px 36px",
          borderRadius: 999,
          border: `2px solid ${color.line}`,
          opacity: between(frame, 30, 44),
        }}
      >
        {CTA_TEXT}
      </div>
    </AbsoluteFill>
  );
};
