import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { between, countUp, springIn } from "../anim";
import { color, font } from "../brand";
import { Words } from "../components/Words";
import { usePacedFrame } from "../pace";
import type { Scene } from "./types";

export const PIPELINE_DESIGN = 150;

const CARD_WIDTH = 440;
const CARD_GAP = 110;
const FIRST_CARD = 18;
const CARD_STAGGER = 26;

const ScriptLines: React.FC<{ frame: number; at: number }> = ({
  frame,
  at,
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    {[0.9, 0.7, 0.82, 0.5].map((width, i) => (
      <div
        key={i}
        style={{
          height: 14,
          borderRadius: 7,
          background: i === 0 ? color.accent : color.line,
          width: `${between(frame, at + i * 6, at + i * 6 + 14) * width * 100}%`,
        }}
      />
    ))}
  </div>
);

const Waveform: React.FC<{ frame: number; at: number }> = ({ frame, at }) => {
  const energy = between(frame, at, at + 12);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, height: 90 }}>
      {Array.from({ length: 22 }, (_, i) => {
        const wave = Math.abs(Math.sin(frame * 0.28 + i * 0.9)) * 0.7 + 0.3;
        return (
          <div
            key={i}
            style={{
              width: 8,
              borderRadius: 4,
              background: color.mint,
              height: 8 + wave * 80 * energy,
            }}
          />
        );
      })}
    </div>
  );
};

const RenderProgress: React.FC<{ frame: number; at: number }> = ({
  frame,
  at,
}) => {
  const percent = countUp(frame, at, at + 50, 0, 100);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div
        style={{
          font: `700 64px/1 ${font.heading}`,
          color: color.text,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {Math.round(percent)} %
      </div>
      <div style={{ height: 14, borderRadius: 7, background: color.line }}>
        <div
          style={{
            height: "100%",
            width: `${percent}%`,
            borderRadius: 7,
            background: color.accent,
          }}
        />
      </div>
    </div>
  );
};

const STEPS = [
  { number: "01", name: "Guion", tool: "script.json", Body: ScriptLines },
  { number: "02", name: "Voz", tool: "ElevenLabs", Body: Waveform },
  { number: "03", name: "Vídeo", tool: "Remotion", Body: RenderProgress },
];

export const Pipeline: Scene = () => {
  const frame = usePacedFrame();
  const { fps } = useVideoConfig();
  const rowWidth = STEPS.length * CARD_WIDTH + (STEPS.length - 1) * CARD_GAP;
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 150 }}>
      <Words
        text="Del guion al vídeo"
        at={0}
        accent={["vídeo"]}
        style={{
          font: `700 96px/1 ${font.heading}`,
          letterSpacing: "-0.03em",
          color: color.text,
        }}
      />
      <div
        style={{
          position: "relative",
          width: rowWidth,
          marginTop: 130,
          display: "flex",
          gap: CARD_GAP,
        }}
      >
        {STEPS.map(({ number, name, tool, Body }, i) => {
          const at = FIRST_CARD + i * CARD_STAGGER;
          const enter = springIn(frame, fps, at);
          const lineGrow = between(frame, at + 8, at + 22);
          return (
            <React.Fragment key={name}>
              {i < STEPS.length - 1 ? (
                <div
                  style={{
                    position: "absolute",
                    top: 170,
                    left: (i + 1) * CARD_WIDTH + i * CARD_GAP,
                    width: CARD_GAP * lineGrow,
                    height: 4,
                    borderRadius: 2,
                    background: color.accent,
                  }}
                />
              ) : null}
              <div
                style={{
                  width: CARD_WIDTH,
                  height: 340,
                  boxSizing: "border-box",
                  padding: 40,
                  borderRadius: 32,
                  background: color.surface,
                  border: `2px solid ${color.line}`,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  opacity: enter,
                  transform: `translateY(${(1 - enter) * 60}px) scale(${0.92 + enter * 0.08})`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <span
                    style={{
                      font: `600 52px ${font.heading}`,
                      color: color.text,
                    }}
                  >
                    {name}
                  </span>
                  <span
                    style={{
                      font: `600 30px ${font.mono}`,
                      color: color.muted,
                    }}
                  >
                    {number}
                  </span>
                </div>
                <Body frame={frame} at={at + 10} />
                <span
                  style={{ font: `500 30px ${font.mono}`, color: color.muted }}
                >
                  {tool}
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
