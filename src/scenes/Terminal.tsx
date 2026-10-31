import React from "react";
import { AbsoluteFill, Easing } from "remotion";
import { between, countUp } from "../anim";
import { color, font } from "../brand";
import { TOTAL_FRAMES } from "../config";
import { Words } from "../components/Words";
import { usePacedFrame } from "../pace";
import type { Scene } from "./types";

export const TERMINAL_DESIGN = 135;

const COMMAND = "npm run render";
const TYPE_FROM = 10;
const TYPE_TO = 32;
const BUNDLE_AT = 36;
const RENDER_FROM = 46;
const RENDER_TO = 104;

const Line: React.FC<{
  show: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ show, children, style }) => (
  <div
    style={{
      opacity: show,
      transform: `translateY(${(1 - show) * 12}px)`,
      display: "flex",
      alignItems: "center",
      gap: 24,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Terminal: Scene = () => {
  const frame = usePacedFrame();
  const typed = Math.round(
    between(frame, TYPE_FROM, TYPE_TO, 0, COMMAND.length, Easing.linear),
  );
  const rendered = countUp(frame, RENDER_FROM, RENDER_TO, 0, TOTAL_FRAMES);
  const caretOn = Math.floor(frame / 10) % 2 === 0 && frame < TYPE_TO + 8;
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 130 }}>
      <Words
        text="Cambias una frase. Renderizas. Listo."
        at={0}
        stagger={3}
        accent={["Listo."]}
        style={{
          font: `700 84px/1 ${font.heading}`,
          letterSpacing: "-0.03em",
          color: color.text,
        }}
      />
      <div
        style={{
          marginTop: 90,
          width: 1240,
          height: 450,
          boxSizing: "border-box",
          borderRadius: 28,
          background: color.surface,
          border: `2px solid ${color.line}`,
          overflow: "hidden",
          opacity: between(frame, 0, 10),
        }}
      >
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "0 28px",
            borderBottom: `2px solid ${color.line}`,
          }}
        >
          {["#FF5F57", "#FEBC2E", "#28C840"].map((dot) => (
            <div
              key={dot}
              style={{
                width: 18,
                height: 18,
                borderRadius: 9,
                background: dot,
              }}
            />
          ))}
        </div>
        <div
          style={{
            padding: "40px 48px",
            display: "flex",
            flexDirection: "column",
            gap: 30,
            font: `500 38px/1.2 ${font.mono}`,
            color: color.text,
          }}
        >
          <Line show={1}>
            <span style={{ color: color.mint }}>$</span>
            <span>
              {COMMAND.slice(0, typed)}
              <span style={{ opacity: caretOn ? 1 : 0, color: color.accent }}>
                ▍
              </span>
            </span>
          </Line>
          <Line
            show={between(frame, BUNDLE_AT, BUNDLE_AT + 8)}
            style={{ color: color.muted }}
          >
            Bundling… ✓
          </Line>
          <Line show={between(frame, RENDER_FROM - 4, RENDER_FROM + 4)}>
            <span style={{ color: color.muted }}>Rendering</span>
            <div
              style={{
                width: 420,
                height: 20,
                borderRadius: 10,
                background: color.line,
              }}
            >
              <div
                style={{
                  width: `${(rendered / TOTAL_FRAMES) * 100}%`,
                  height: "100%",
                  borderRadius: 10,
                  background: color.accent,
                }}
              />
            </div>
            <span style={{ fontVariantNumeric: "tabular-nums" }}>
              {Math.round(rendered)}/{TOTAL_FRAMES}
            </span>
          </Line>
          <Line
            show={between(frame, RENDER_TO + 2, RENDER_TO + 10)}
            style={{ color: color.mint }}
          >
            ✓ out/demo.mp4 · 1920×1080 · 30 fps
          </Line>
        </div>
      </div>
    </AbsoluteFill>
  );
};
