/**
 * The rising-records shader (the Experience Flow's grammar), shared by the
 * Overlook's drift and the Horizon's Return. Fully parameterized by
 * uniforms — uHeight, uLabX, uColor, uEnergy — so both scenes tune the
 * same mechanism instead of owning copies. Extracted from
 * components/world/ExperienceDrift.tsx in Batch 3 (no behavioral change).
 */

export const DRIFT_VERTEX = /* glsl */ `
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

export const DRIFT_FRAGMENT = /* glsl */ `
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

/** Deterministic PRNG — same drift for every visitor, shared by both scenes. */
export function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
