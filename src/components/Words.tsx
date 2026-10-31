import React from "react";
import { useVideoConfig } from "remotion";
import { springIn } from "../anim";
import { color } from "../brand";
import { usePacedFrame } from "../pace";

/**
 * Text that rises in word by word. `at` is the design frame where the first word starts;
 * words listed in `accent` are painted in the accent color.
 */
export const Words: React.FC<{
  text: string;
  at: number;
  stagger?: number;
  accent?: string[];
  style?: React.CSSProperties;
}> = ({ text, at, stagger = 4, accent = [], style }) => {
  const frame = usePacedFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={style}>
      {text.split(" ").map((word, i) => {
        const progress = springIn(frame, fps, at + i * stagger);
        return (
          <span
            key={`${word}-${i}`}
            style={{
              display: "inline-block",
              marginRight: "0.25em",
              opacity: progress,
              transform: `translateY(${(1 - progress) * 0.5}em)`,
              color: accent.includes(word) ? color.accent : undefined,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
