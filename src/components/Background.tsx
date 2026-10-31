import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { color } from "../brand";

/** Dark base, a faint grid and a soft glow that drifts slowly for the whole video. */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const glowX = 30 + Math.sin(frame / 90) * 8;
  const glowY = 25 + Math.cos(frame / 110) * 6;
  return (
    <AbsoluteFill style={{ background: color.background }}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${color.line} 1px, transparent 1px), linear-gradient(90deg, ${color.line} 1px, transparent 1px)`,
          backgroundSize: "96px 96px",
          opacity: 0.35,
          maskImage:
            "radial-gradient(ellipse at 50% 50%, black 30%, transparent 75%)",
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${glowX}% ${glowY}%, ${color.accentSoft}, transparent 45%)`,
        }}
      />
    </AbsoluteFill>
  );
};
