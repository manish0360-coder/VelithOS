"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { energyTarget, setTarget } from "@/lib/spotlight";
import { logEvent } from "@/lib/session";
import { damp } from "@/lib/inputs";
import { LAB, WORLD_COLORS } from "@/lib/world";
import EnergyAura, { useAuraMaterial } from "./EnergyAura";

/**
 * MiniFlyWire — the laboratory (CDD Scene 1): a smaller building standing
 * APART from the tower, its windows flickering with instrument light.
 * Hypotheses are alive in there. A hairline drops to the ground plane so
 * the building reads as founded, not floating.
 *
 * Flicker is two incommensurate sines per window — organic, non-looping
 * to the eye, and cheap. Frozen (reduced motion): windows hold steady.
 */

const WINDOWS = [
  [-0.38, 0.22],
  [0, 0.22],
  [0.38, 0.22],
  [-0.38, -0.18],
  [0, -0.18],
  [0.38, -0.18],
] as const;

export default function Laboratory({ frozen }: { frozen: boolean }) {
  const edgeMat = useRef<THREE.LineBasicMaterial>(null!);
  const faceMat = useRef<THREE.MeshBasicMaterial>(null!);
  const windowMats = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const energy = useRef(0.55);
  const aura = useAuraMaterial(WORLD_COLORS.miniflywire);

  const edges = useMemo(
    () =>
      new THREE.EdgesGeometry(
        new THREE.BoxGeometry(LAB.size[0], LAB.size[1], LAB.size[2]),
      ),
    [],
  );

  const groundLine = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setFromPoints([
      new THREE.Vector3(LAB.center[0], LAB.center[1] - LAB.size[1] / 2, 0),
      new THREE.Vector3(LAB.center[0], 0, 0),
    ]);
    return g;
  }, []);

  useFrame((state, dt) => {
    const e = frozen
      ? energyTarget(LAB.id)
      : (energy.current = damp(energy.current, energyTarget(LAB.id), 5, dt));

    edgeMat.current.opacity = 0.16 + 0.62 * e;
    faceMat.current.opacity = 0.018 + 0.05 * e;
    aura.opacity = Math.max(0, e - 0.35) * 0.24;

    const t = state.clock.elapsedTime;
    windowMats.current.forEach((m, i) => {
      if (!m) return;
      const phase = i * 1.7;
      const flicker = frozen
        ? 0.7
        : 0.42 +
          0.58 *
            (0.5 + 0.5 * Math.sin(t * 0.9 + phase) * Math.sin(t * 2.3 + phase * 2));
      m.opacity = (0.25 + 0.75 * flicker) * (0.35 + 0.65 * e);
    });
  });

  const face = LAB.center[2] + LAB.size[2] / 2 + 0.001;

  return (
    <group>
      <group position={[...LAB.center]}>
        <EnergyAura material={aura} position={[0, 0, 0]} scale={LAB.size[0] * 2.4} />
        <lineSegments geometry={edges}>
          <lineBasicMaterial
            ref={edgeMat}
            color={WORLD_COLORS.miniflywire}
            transparent
            opacity={0.4}
          />
        </lineSegments>
        <mesh>
          <boxGeometry args={[...LAB.size]} />
          <meshBasicMaterial
            ref={faceMat}
            color={WORLD_COLORS.miniflywire}
            transparent
            opacity={0.03}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* Instrument windows on the front face */}
      {WINDOWS.map(([wx, wy], i) => (
        <mesh
          key={i}
          position={[LAB.center[0] + wx, LAB.center[1] + wy, face]}
        >
          <planeGeometry args={[0.16, 0.11]} />
          <meshBasicMaterial
            ref={(m) => {
              windowMats.current[i] = m;
            }}
            color={WORLD_COLORS.labWindow}
            transparent
            opacity={0.5}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Grounding hairline */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <primitive
        object={
          new THREE.Line(
            groundLine,
            new THREE.LineBasicMaterial({
              color: WORLD_COLORS.structure,
              transparent: true,
              opacity: 0.12,
            }),
          )
        }
      />

      {/* Attention proxy */}
      <mesh
        visible={false}
        position={[...LAB.center]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setTarget(LAB.id);
          logEvent("discovery", `attended: ${LAB.name}`);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setTarget(null);
          document.body.style.cursor = "";
        }}
      >
        <boxGeometry
          args={[LAB.size[0] + 0.3, LAB.size[1] + 0.3, LAB.size[2] + 0.3]}
        />
      </mesh>
    </group>
  );
}
