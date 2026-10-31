import React from "react";

export const PHONE_WIDTH = 414;
export const PHONE_HEIGHT = 868;

/** A phone drawn in CSS: put any React screen inside and animate it like the rest of the video. */
export const PhoneFrame: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      width: PHONE_WIDTH,
      height: PHONE_HEIGHT,
      borderRadius: 66,
      background: "#0A0B0E",
      padding: 12,
      boxSizing: "border-box",
      position: "relative",
      boxShadow:
        "inset 0 0 0 2px #2E313A, inset 0 0 0 6px #0A0B0E, 0 40px 90px rgba(0,0,0,.55)",
      ...style,
    }}
  >
    <div
      style={{
        position: "absolute",
        top: 24,
        left: "50%",
        transform: "translateX(-50%)",
        width: 120,
        height: 35,
        borderRadius: 20,
        background: "#000",
        zIndex: 10,
      }}
    />
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 54,
        overflow: "hidden",
        position: "relative",
        background: "#F5F5F8",
      }}
    >
      {children}
    </div>
  </div>
);
