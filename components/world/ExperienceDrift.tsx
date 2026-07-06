"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { energyTarget } from "@/lib/spotlight";
import { damp } from "@/lib/inputs";
import { DRIFT, WORLD_COLORS } from "@/lib/world";
import { DRIFT_FRAGMENT, DRIFT_VERTEX, mulberry32 } from "./driftShader";

/**
 * The Experience Flow (CDD Principle 3): luminous records rising past
 * every floor — slow, continuous, like dust in a sunbeam — bending toward
 * the laboratory near the top, because experience returns to research.
 *
 * Pure GPU: positions advance in the vertex shader from one time uniform;
 * the CPU touches nothing per-frame except two uniforms. Deterministic
 * seeding — the same drift for every visitor. Frozen (reduced motion):
 * time holds; the column stands as a still constellation.
 *
 * No 3D hover proxy (the column is diffuse); the DOM legend chip is this
 * flow's attention surface.
 */

export default function ExperienceDrift({ frozen }: { frozen: boolean }) {
  const energy = useRef(0.55);

  const points = useMemo(() => {
    const rng = mulberry32(0x0e11f4);
    const positions = new Float32Array(DRIFT.count * 3);
    const seeds = new Float32Array(DRIFT.count);
    const scales = new Float32Array(DRIFT.count);

    for (let i = 0; i < DRIFT.count; i++) {
      const angle = rng() * Math.PI * 2;
      const r = Math.sqrt(rng()) * DRIFT.radius;
      positions[i * 3] = DRIFT.centerX + Math.cos(angle) * r;
      positions[i * 3 + 1] = 0; // y comes from the shader
      positions[i * 3 + 2] = Math.sin(angle) * r;
      seeds[i] = rng();
      scales[i] = 0.5 + rng() * 1.1;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    // The shader moves points in y; give culling a generous static bound.
    geometry.boundingSphere = new THREE.Sphere(
      new THREE.Vector3(DRIFT.centerX, DRIFT.height / 2, 0),
      DRIFT.radius + DRIFT.height,
    );

    const material = new THREE.ShaderMaterial({
      vertexShader: DRIFT_VERTEX,
      fragmentShader: DRIFT_FRAGMENT,
      uniforms: {
        uTime: { value: 0 },
        uHeight: { value: DRIFT.height },
        uLabX: { value: DRIFT.labX },
        uColor: { value: new THREE.Color(WORLD_COLORS.drift) },
        uEnergy: { value: 0.55 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    return new THREE.Points(geometry, material);
  }, []);

  useFrame((_, dt) => {
    const mat = points.material as THREE.ShaderMaterial;
    if (!frozen) mat.uniforms.uTime.value += dt;
    const e = frozen
      ? energyTarget("experience")
      : (energy.current = damp(
          energy.current,
          energyTarget("experience"),
          5,
          dt,
        ));
    mat.uniforms.uEnergy.value = e;
  });

  return <primitive object={points} />;
}
