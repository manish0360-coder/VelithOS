"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { damp, pointer } from "@/lib/inputs";
import { DRIFT_FRAGMENT, DRIFT_VERTEX, mulberry32 } from "@/components/world/driftShader";

/**
 * THE HORIZON — the 3D interior of Scene 7 and the Return (CDD §3).
 *
 * Two movements, driven by one scroll-progress ref (never React state):
 *
 *   Phase A (p 0 → 0.55): a slow dolly across the pre-dawn factory floor.
 *     Machines are present only as unlit wireframe volumes — intent, not
 *     claim — breathing on an ~11 s period. The only warmth is a dawn
 *     band held at the far horizon.
 *
 *   Phase B (p 0.55 → 1): the camera pitches UPWARD for the first time in
 *     the journey. The rising records (the shared drift mechanism) climb
 *     past three hairlines — the floors above — and bend toward a small
 *     warm glow high to the left: the laboratory. The Experience Flow,
 *     closing the loop in one gaze.
 *
 * `frozen` (reduced motion): time holds, the camera stands mid-floor,
 * machines rest at their base opacity; captions outside carry parity.
 */

const DAWN = "#5c7fa0";
const DRIFT_COLOR = "#d9e2ee";
const LAB_GLOW = "#e8ce9e";

interface MachineSpec {
  pos: [number, number, number];
  size: [number, number, number];
  cylinder?: boolean;
}

const MACHINE_SPECS: MachineSpec[] = [
  { pos: [-6.5, 1.1, -6], size: [2.6, 2.2, 2.2] },
  { pos: [-2.2, 0.9, -10], size: [3.4, 1.8, 2.4] },
  { pos: [3.2, 1.4, -8], size: [2.2, 2.8, 2.2], cylinder: true },
  { pos: [7.4, 0.8, -13], size: [3.0, 1.6, 2.6] },
  { pos: [0.4, 1.0, -16], size: [4.6, 2.0, 2.0] },
  { pos: [-7.8, 1.2, -18], size: [2.0, 2.4, 2.0], cylinder: true },
  { pos: [5.6, 1.1, -20], size: [2.8, 2.2, 3.2] },
];

function GhostMachines({ frozen }: { frozen: boolean }) {
  const mats = useRef<THREE.LineBasicMaterial[]>([]);

  const machines = useMemo(
    () =>
      MACHINE_SPECS.map((m) => ({
        ...m,
        edges: new THREE.EdgesGeometry(
          m.cylinder
            ? new THREE.CylinderGeometry(m.size[0] / 2, m.size[0] / 2, m.size[1], 10)
            : new THREE.BoxGeometry(...m.size),
        ),
      })),
    [],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    mats.current.forEach((mat, i) => {
      if (!mat) return;
      const breathe = frozen
        ? 0.5
        : 0.5 + 0.5 * Math.sin((t * Math.PI * 2) / 11 + i * 1.3);
      mat.opacity = 0.09 + 0.07 * breathe;
    });
  });

  return (
    <group>
      {machines.map((m, i) => (
        <lineSegments key={i} geometry={m.edges} position={m.pos}>
          <lineBasicMaterial
            ref={(mat) => {
              if (mat) mats.current[i] = mat;
            }}
            color={DAWN}
            transparent
            opacity={0.12}
          />
        </lineSegments>
      ))}
    </group>
  );
}

/** The rising records of the Return — the shared drift mechanism, at its
 *  strongest here, because this floor will one day generate the richest
 *  experience of all. Brightens as the camera pitches up. */
function ReturnDrift({
  progress,
  frozen,
}: {
  progress: MutableRefObject<number>;
  frozen: boolean;
}) {
  const points = useMemo(() => {
    const COUNT = 320;
    const rng = mulberry32(0x8e70);
    const positions = new Float32Array(COUNT * 3);
    const seeds = new Float32Array(COUNT);
    const scales = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      const angle = rng() * Math.PI * 2;
      const r = Math.sqrt(rng()) * 5.5;
      positions[i * 3] = Math.cos(angle) * r;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = -6 + Math.sin(angle) * r;
      seeds[i] = rng();
      scales[i] = 0.6 + rng() * 1.3;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 17, -6), 45);

    const material = new THREE.ShaderMaterial({
      vertexShader: DRIFT_VERTEX,
      fragmentShader: DRIFT_FRAGMENT,
      uniforms: {
        uTime: { value: 0 },
        uHeight: { value: 34 },
        uLabX: { value: -6 },
        uColor: { value: new THREE.Color(DRIFT_COLOR) },
        uEnergy: { value: 0.4 },
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
    const lift = THREE.MathUtils.smoothstep(progress.current, 0.5, 0.85);
    mat.uniforms.uEnergy.value = 0.35 + 0.65 * lift;
  });

  return <primitive object={points} />;
}

/** The floors above and the laboratory's warm window — what the records
 *  rise past, and where they bend to. Legible only once the camera looks up. */
function FloorsAbove({ frozen }: { frozen: boolean }) {
  const labMat = useRef<THREE.MeshBasicMaterial>(null!);
  const lines = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pts: number[] = [];
    for (const y of [12, 18, 24]) pts.push(-4, y, -6, 4, y, -6);
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pts), 3));
    return g;
  }, []);

  useFrame((state) => {
    if (!labMat.current) return;
    const t = state.clock.elapsedTime;
    labMat.current.opacity = frozen ? 0.7 : 0.55 + 0.25 * (0.5 + 0.5 * Math.sin(t * 0.9));
  });

  return (
    <group>
      <lineSegments geometry={lines}>
        <lineBasicMaterial color={DAWN} transparent opacity={0.22} />
      </lineSegments>
      {/* The laboratory, far above and apart — the records bend toward it */}
      <mesh position={[-6, 30, -6]}>
        <planeGeometry args={[1.4, 0.9]} />
        <meshBasicMaterial ref={labMat} color={LAB_GLOW} transparent opacity={0.6} depthWrite={false} />
      </mesh>
    </group>
  );
}

/** Camera choreography: dolly across the floor, then pitch up into the Return. */
function Rig({
  progress,
  frozen,
}: {
  progress: MutableRefObject<number>;
  frozen: boolean;
}) {
  const look = useRef(new THREE.Vector3(0, 1.4, -14));

  useFrame((state, dt) => {
    const cam = state.camera;
    const p = frozen ? 0.3 : progress.current;

    // Phase A: dolly. Phase B: pitch up.
    const dolly = THREE.MathUtils.smoothstep(p, 0, 0.55);
    const lift = THREE.MathUtils.smoothstep(p, 0.55, 1);

    const leanX = frozen
      ? 0
      : THREE.MathUtils.clamp(pointer.vx * 0.05, -0.18, 0.18);
    const targetPos = new THREE.Vector3(
      0 + (frozen ? 0 : pointer.nx * 0.25 + leanX),
      THREE.MathUtils.lerp(2.2, 1.9, dolly) - lift * 0.5 + (frozen ? 0 : pointer.ny * 0.12),
      THREE.MathUtils.lerp(11, 7, dolly),
    );
    const targetLook = new THREE.Vector3(
      THREE.MathUtils.lerp(0, -1.5, lift),
      THREE.MathUtils.lerp(1.4, 30, lift),
      THREE.MathUtils.lerp(-14, -6, lift),
    );

    if (frozen) {
      cam.position.copy(targetPos);
      look.current.copy(targetLook);
    } else {
      cam.position.x = damp(cam.position.x, targetPos.x, 2.2, dt);
      cam.position.y = damp(cam.position.y, targetPos.y, 2.2, dt);
      cam.position.z = damp(cam.position.z, targetPos.z, 2.2, dt);
      look.current.x = damp(look.current.x, targetLook.x, 2.2, dt);
      look.current.y = damp(look.current.y, targetLook.y, 2.2, dt);
      look.current.z = damp(look.current.z, targetLook.z, 2.2, dt);
    }
    cam.lookAt(look.current);
  });

  return null;
}

export default function HorizonScene({
  progress,
  frozen,
}: {
  progress: MutableRefObject<number>;
  frozen: boolean;
}) {
  return (
    <>
      <fog attach="fog" args={["#0a1220", 9, 36]} />
      <Rig progress={progress} frozen={frozen} />
      {/* The floor: blueprint grid, pre-dawn */}
      <gridHelper args={[70, 46, "#20304a", "#131d30"]} position={[0, 0, -8]} />
      <GhostMachines frozen={frozen} />
      {/* The dawn, held at the horizon — aspiration, not achievement */}
      <mesh position={[0, 3.4, -34]}>
        <planeGeometry args={[90, 7]} />
        <meshBasicMaterial color={DAWN} transparent opacity={0.1} depthWrite={false} />
      </mesh>
      <mesh position={[0, 1.2, -34]}>
        <planeGeometry args={[90, 2.4]} />
        <meshBasicMaterial color={DAWN} transparent opacity={0.16} depthWrite={false} />
      </mesh>
      <ReturnDrift progress={progress} frozen={frozen} />
      <FloorsAbove frozen={frozen} />
    </>
  );
}
