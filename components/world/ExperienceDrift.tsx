"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { energyTarget } from "@/lib/spotlight";
import { damp } from "@/lib/inputs";
import { DRIFT, WORLD_COLORS } from "@/lib/world";

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

const VERTEX = /* glsl */ `
attribute float aSeed;
attribute float aScale;
uniform float uTime;
uniform float uHeight;
uniform float uLabX;
varying float vFade;

void main() {
  float speed = 0.022 * (0.6 + 0.8 * fract(aSeed * 7.31));
  float h = fract(aSeed + uTime * speed);

  vec3 p = position;
  p.y = h * uHeight;

  // Near the top, records bend toward the laboratory.
  float toLab = smoothstep(0.72, 0.98, h);
  p.x = mix(p.x, uLabX, toLab * 0.85);
  p.z = mix(p.z, 0.0, toLab * 0.6);

  vFade = smoothstep(0.0, 0.08, h) * (1.0 - smoothstep(0.9, 1.0, h));

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = aScale * (80.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}
`;

const FRAGMENT = /* glsl */ `
uniform vec3 uColor;
uniform float uEnergy;
varying float vFade;

void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.05, d) * vFade * (0.28 + 0.72 * uEnergy);
  if (a < 0.01) discard;
  gl_FragColor = vec4(uColor, a);
}
`;

/** Deterministic PRNG — same drift for every visitor, no hydration drift. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

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
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
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
