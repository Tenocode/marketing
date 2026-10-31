import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { between, countUp, formatNumber, springIn } from "../anim";
import { color, font } from "../brand";
import { PhoneFrame } from "../components/PhoneFrame";
import { Words } from "../components/Words";
import { usePacedFrame } from "../pace";
import type { Scene } from "./types";

export const PHONE_DESIGN = 150;

const PHONE_IN = 6;
const NOTIFICATION_IN = 92;
const INK = "#15161C";
const MUTED = "#6B6F7C";
const DONE = "#1FB57F";

const CHART = [12, 18, 15, 24, 21, 30, 38];

const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      background: "#FFFFFF",
      borderRadius: 22,
      padding: 18,
      boxShadow: "0 1px 2px rgba(0,0,0,.06), 0 6px 18px rgba(0,0,0,.05)",
    }}
  >
    {children}
  </div>
);

const RenderCard: React.FC<{ frame: number }> = ({ frame }) => {
  const progress = countUp(frame, 34, 84, 0, 100);
  const done = progress >= 99.5;
  return (
    <Card>
      <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: `linear-gradient(135deg, ${color.accent}, ${color.mint})`,
            flex: "none",
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ font: `600 18px ${font.heading}` }}>demo.mp4</div>
          <div style={{ color: MUTED, fontSize: 15 }}>
            {done ? "Listo · 1080p" : `Renderizando… ${Math.round(progress)} %`}
          </div>
          <div
            style={{
              height: 8,
              borderRadius: 4,
              background: "#E6E7EC",
              marginTop: 10,
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                borderRadius: 4,
                background: done ? DONE : color.accent,
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

const ChartCard: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const views = countUp(frame, 40, 90, 0, 12480);
  const maxBar = Math.max(...CHART);
  return (
    <Card>
      <div
        style={{
          color: MUTED,
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: "0.06em",
        }}
      >
        VISUALIZACIONES
      </div>
      <div
        style={{
          font: `600 40px ${font.heading}`,
          letterSpacing: "-0.02em",
          fontVariantNumeric: "tabular-nums",
          margin: "4px 0 14px",
        }}
      >
        {formatNumber(views)}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 10,
          height: 150,
        }}
      >
        {CHART.map((value, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              borderRadius: 8,
              background: i === CHART.length - 1 ? color.accent : "#D9DAF5",
              height: `${(value / maxBar) * 100 * springIn(frame, fps, 40 + i * 4)}%`,
            }}
          />
        ))}
      </div>
    </Card>
  );
};

const ChecklistCard: React.FC<{ frame: number }> = ({ frame }) => (
  <Card>
    {["Guion", "Voz", "Música"].map((label, i, all) => (
      <div
        key={label}
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "8px 0",
          borderBottom: i < all.length - 1 ? "1px solid #ECEDF1" : undefined,
          opacity: between(frame, 50 + i * 6, 60 + i * 6),
        }}
      >
        <span>{label}</span>
        <span style={{ color: DONE, fontWeight: 700 }}>✓</span>
      </div>
    ))}
  </Card>
);

const ShareButton: React.FC<{ frame: number }> = ({ frame }) => {
  const ready = between(frame, NOTIFICATION_IN, NOTIFICATION_IN + 12);
  return (
    <div
      style={{
        marginTop: "auto",
        height: 58,
        borderRadius: 18,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        font: `600 18px ${font.heading}`,
        color: "#FFFFFF",
        background: color.accent,
        opacity: 0.35 + ready * 0.65,
        transform: `scale(${1 + Math.sin(ready * Math.PI) * 0.04})`,
      }}
    >
      Compartir vídeo
    </div>
  );
};

const Notification: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const enter = springIn(frame, fps, NOTIFICATION_IN);
  return (
    <div
      style={{
        position: "absolute",
        top: 58,
        left: 12,
        right: 12,
        zIndex: 8,
        background: "rgba(255,255,255,.98)",
        borderRadius: 24,
        padding: "14px 16px",
        display: "flex",
        gap: 12,
        alignItems: "center",
        boxShadow: "0 14px 34px rgba(0,0,0,.25)",
        transform: `translateY(${(1 - enter) * -180}px)`,
        opacity: enter,
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          background: color.accent,
          flex: "none",
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ font: `600 16px ${font.heading}` }}>
          Tu vídeo está listo
        </span>
        <span style={{ color: MUTED, fontSize: 14 }}>
          demo.mp4 · 1920 × 1080 · 30 fps
        </span>
      </div>
    </div>
  );
};

export const Phone: Scene = () => {
  const frame = usePacedFrame();
  const { fps } = useVideoConfig();
  const enter = springIn(frame, fps, PHONE_IN);
  return (
    <AbsoluteFill
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 160,
      }}
    >
      <div style={{ width: 760 }}>
        <Words
          text="Pantallas que se animan solas"
          at={0}
          accent={["animan", "solas"]}
          style={{
            font: `700 96px/1.05 ${font.heading}`,
            letterSpacing: "-0.03em",
            color: color.text,
          }}
        />
        <div
          style={{
            marginTop: 36,
            font: `500 40px/1.3 ${font.body}`,
            color: color.muted,
            opacity: between(frame, 20, 34),
          }}
        >
          Son componentes de React, no capturas.
        </div>
      </div>
      <PhoneFrame
        style={{
          transform: `translateY(${(1 - enter) * 900}px) rotate(${(1 - enter) * 8}deg)`,
        }}
      >
        <div
          style={{
            height: "100%",
            boxSizing: "border-box",
            padding: "70px 20px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            font: `500 16px ${font.body}`,
            color: INK,
          }}
        >
          <div
            style={{
              font: `600 30px ${font.heading}`,
              letterSpacing: "-0.02em",
            }}
          >
            Tus vídeos
          </div>
          <RenderCard frame={frame} />
          <ChartCard frame={frame} fps={fps} />
          <ChecklistCard frame={frame} />
          <ShareButton frame={frame} />
          <Notification frame={frame} fps={fps} />
        </div>
      </PhoneFrame>
    </AbsoluteFill>
  );
};
