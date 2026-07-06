"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { damp, pointer } from "@/lib/inputs";
import { getTarget } from "@/lib/spotlight";
import { BRIDGE, CAMERA, LAB, TOWER_HALLS } from "@/lib/world";

/**
 * THE OVERLOOK RIG v2 — predictive, attentive, still a documentarian.
 *
 * Three motions, all bound to existing mechanisms:
 *  - micro-drift (the patient hand — unchanged);
 *  - VELOCITY LEAD: the camera leans a fraction of a second ahead of the
 *    pointer's motion (the input bus now carries velocity) — the world
 *    anticipates where attention is going;
 *  - SPOTLIGHT FRAMING: while a structure is attended, the look-at point
 *    eases a quarter of the way toward that structure's real center from
 *    the world spec — the camera regards what the operator regards.
 *
 * Frozen (reduced motion): the camera stands on its mark, exactly as v1.
 */

const FRAME_TARGETS: Record<string, readonly [number, number, number]> = {
  ...Object.fromEntries(TOWER_HALLS.map((h) => [h.id, h.center])),
  [LAB.id]: LAB.center,
  knowledge: [
    (BRIDGE.from[0] + BRIDGE.to[0]) / 2,
    BRIDGE.from[1],
    0,
  ] as const,
  code: [TOWER_HALLS[1].center[0], TOWER_HALLS[1].center[1], 0] as const,
  experience: [TOWER_HALLS[1].center[0], 3.4, 0] as const,
};

export default function Rig({ frozen }: { frozen: boolean }) {
  const t = useRef(0);
  const look = useRef(new THREE.Vector3(...CAMERA.lookAt));
  const lead = useRef({ x: 0, y: 0 });

  useFrame((state, dt) => {
    const cam = state.camera;
    if (frozen) {
      cam.position.set(...CAMERA.position);
      cam.lookAt(look.current);
      return;
    }
    t.current += dt;
    const driftX = Math.sin(t.current * 0.11) * 0.14;
    const driftY = Math.cos(t.current * 0.083) * 0.09;

    // Anticipation: damp the raw velocity, clamp the lean.
    lead.current.x = damp(
      lead.current.x,
      THREE.MathUtils.clamp(pointer.vx * 0.06, -0.22, 0.22),
      2.4,
      dt,
    );
    lead.current.y = damp(
      lead.current.y,
      THREE.MathUtils.clamp(pointer.vy * 0.04, -0.14, 0.14),
      2.4,
      dt,
    );

    const targetX = CAMERA.position[0] + driftX + pointer.nx * 0.4 + lead.current.x;
    const targetY = CAMERA.position[1] + driftY + pointer.ny * 0.22 + lead.current.y;

    cam.position.x = damp(cam.position.x, targetX, 1.6, dt);
    cam.position.y = damp(cam.position.y, targetY, 1.6, dt);
    cam.position.z = CAMERA.position[2];

    // Attentive framing: regard what the operator regards.
    const focus = getTarget();
    const frame = focus ? FRAME_TARGETS[focus] : null;
    const lookTarget = frame
      ? new THREE.Vector3(
          THREE.MathUtils.lerp(CAMERA.lookAt[0], frame[0], 0.25),
          THREE.MathUtils.lerp(CAMERA.lookAt[1], frame[1], 0.25),
          0,
        )
      : new THREE.Vector3(...CAMERA.lookAt);
    look.current.x = damp(look.current.x, lookTarget.x, 1.8, dt);
    look.current.y = damp(look.current.y, lookTarget.y, 1.8, dt);
    cam.lookAt(look.current);
  });

  return null;
}
