"use client";

import { useMemo } from "react";
import * as THREE from "three";

/**
 * ENERGY AURA — the spotlight-energy mechanism made volumetric.
 *
 * A soft additive sprite behind a structure whose opacity is driven each
 * frame by the SAME energy value that already drives the structure's edge
 * light (Hall/Laboratory own the value; they write this material's
 * opacity in their existing useFrame). Attention doesn't just outline the
 * attended object — it fills the air around it. No new state, no new
 * loop: one shared radial texture, one material per structure.
 */

let sharedTexture: THREE.CanvasTexture | null = null;

function auraTexture(): THREE.CanvasTexture {
  if (sharedTexture) return sharedTexture;
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size / 2,
  );
  g.addColorStop(0, "rgba(255,255,255,0.9)");
  g.addColorStop(0.4, "rgba(255,255,255,0.28)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  sharedTexture = new THREE.CanvasTexture(canvas);
  return sharedTexture;
}

export function useAuraMaterial(color: string): THREE.SpriteMaterial {
  return useMemo(
    () =>
      new THREE.SpriteMaterial({
        map: auraTexture(),
        color,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [color],
  );
}

export default function EnergyAura({
  material,
  position,
  scale,
}: {
  material: THREE.SpriteMaterial;
  position: readonly [number, number, number];
  scale: number;
}) {
  return (
    <sprite position={[...position]} scale={[scale, scale, 1]} material={material} />
  );
}
