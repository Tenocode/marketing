import { createContext, useContext } from "react";
import { useCurrentFrame } from "remotion";

/** Design frames the scene advances per real frame. */
export const PaceContext = createContext(1);

/**
 * Current frame in the scene's design scale. Each scene is animated for a fixed
 * design length; if it ends up shorter, every animation speeds up in proportion
 * (and slows down if longer), so the timing always fits the voice-over.
 */
export const usePacedFrame = () => useCurrentFrame() * useContext(PaceContext);
