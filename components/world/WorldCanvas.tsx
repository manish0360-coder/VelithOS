"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { CAMERA, TOWER_HALLS } from "@/lib/world";
import { useSpotlight } from "@/lib/spotlight";
import Hall from "./Hall";
import Laboratory from "./Laboratory";
import Bridge from "./Bridge";
import Spine from "./Spine";
import ExperienceDrift from "./ExperienceDrift";
import Rig from "./Rig";

/**
 * WORLD CANVAS — the Overlook's dark volume (CDD Scene 1).
 *
 * Section-scoped by design: the canvas belongs to the scene that needs it.
 * The frameloop runs only while the section is actually on screen
 * (IntersectionObserver) and never runs continuously under reduced
 * motion — there, rendering is demand-driven and attention changes
 * invalidate a single frame, so spotlighting still works with zero
 * animation.
 */

function SpotlightInvalidator() {
  // Under demand-driven frameloops, an attention change must draw a frame.
  const invalidate = useThree((s) => s.invalidate);
  const target = useSpotlight();
  useEffect(() => {
    invalidate();
  }, [target, invalidate]);
  return null;
}

function Scene({ frozen }: { frozen: boolean }) {
  return (
    <>
      <Rig frozen={frozen} />
      {TOWER_HALLS.map((spec) => (
        <Hall key={spec.id} spec={spec} frozen={frozen} />
      ))}
      <Laboratory frozen={frozen} />
      <Bridge frozen={frozen} />
      <Spine frozen={frozen} />
      <ExperienceDrift frozen={frozen} />
      <SpotlightInvalidator />
    </>
  );
}

export default function WorldCanvas() {
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [frozen, setFrozen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setFrozen(mq.matches);
    update();
    mq.addEventListener("change", update);

    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.05 },
    );
    if (host.current) io.observe(host.current);

    return () => {
      mq.removeEventListener("change", update);
      io.disconnect();
    };
  }, []);

  const live = visible && !frozen;

  return (
    <div ref={host} className="absolute inset-0">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [...CAMERA.position], fov: CAMERA.fov }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop={live ? "always" : "demand"}
        aria-hidden="true"
      >
        <Scene frozen={frozen} />
      </Canvas>
    </div>
  );
}
