"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { damp, pointer } from "@/lib/inputs";
import { CAMERA } from "@/lib/world";

/**
 * The camera never cuts; it is held by a patient documentarian
 * (CDD Scene 1): slow noise-free micro-drift from two incommensurate
 * sines, plus gentle parallax toward the operator's attention. The
 * look-at point is fixed — the world is regarded, not toured, in this
 * scene. Frozen (reduced motion): the camera stands on its mark.
 */
export default function Rig({ frozen }: { frozen: boolean }) {
  const t = useRef(0);
  const look = useRef(new THREE.Vector3(...CAMERA.lookAt));

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

    const targetX = CAMERA.position[0] + driftX + pointer.nx * 0.4;
    const targetY = CAMERA.position[1] + driftY + pointer.ny * 0.22;

    cam.position.x = damp(cam.position.x, targetX, 1.6, dt);
    cam.position.y = damp(cam.position.y, targetY, 1.6, dt);
    cam.position.z = CAMERA.position[2];
    cam.lookAt(look.current);
  });

  return null;
}
