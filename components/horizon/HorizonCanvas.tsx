"use client";

import type { MutableRefObject } from "react";
import { Canvas } from "@react-three/fiber";
import HorizonScene from "./HorizonScene";

/**
 * The Horizon's WebGL host. This file is the dynamic boundary: it is the
 * only place in the Horizon that touches @react-three/fiber, and it is
 * imported with next/dynamic (ssr: false) so three.js stays in the lazy
 * chunk — the captions and legend around it still server-render.
 */
export default function HorizonCanvas({
  progress,
  frozen,
  live,
}: {
  progress: MutableRefObject<number>;
  frozen: boolean;
  live: boolean;
}) {
  return (
    <Canvas
      dpr={frozen ? [1, 1.5] : [1, 1.6]}
      camera={{ position: [0, 2.2, 11], fov: 46 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={live && !frozen ? "always" : "demand"}
      aria-hidden="true"
    >
      <HorizonScene progress={progress} frozen={frozen} />
    </Canvas>
  );
}
