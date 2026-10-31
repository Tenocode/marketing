import type React from "react";

/** Every scene gets its length in frames (not counting the crossfade into the next one). */
export type Scene = React.FC<{ duration: number }>;
