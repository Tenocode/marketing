import React from "react";
import { Composition } from "remotion";
import { loadBrandFonts } from "./brand";
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from "./config";
import { Demo } from "./Demo";

loadBrandFonts();

export const Root: React.FC = () => (
  <Composition
    id="Demo"
    component={Demo}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
);
