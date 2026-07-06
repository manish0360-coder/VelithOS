"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { energyTarget, setTarget } from "@/lib/spotlight";
import { logEvent } from "@/lib/session";
import { damp } from "@/lib/inputs";
import { WORLD_COLORS, type HallSpec } from "@/lib/world";
import EnergyAura, { useAuraMaterial } from "./EnergyAura";

/**
 * A hall of the tower (CDD Scene 1): wireframe edges over a barely-there
 * volume, behaving according to its layer's temperament —
 *   still    (Noetica: utterly still; certainty needs no motion)
 *   pulse    (Velith: a work rhythm, fast rise / slow fall)
 *   breathe  (Mini Prometheus: a 9-second subliminal breath)
 * Attention raises its light; attention elsewhere dims it. An invisible,
 * slightly larger proxy box receives pointer events so thin edges are
 * easy to attend to.
 */
export default function Hall({
  spec,
  frozen,
}: {
  spec: HallSpec;
  frozen: boolean;
}) {
  const group = useRef<THREE.Group>(null!);
  const edgeMat = useRef<THREE.LineBasicMaterial>(null!);
  const faceMat = useRef<THREE.MeshBasicMaterial>(null!);
  const energy = useRef(0.55);

  const edges = useMemo(
    () =>
      new THREE.EdgesGeometry(
        new THREE.BoxGeometry(spec.size[0], spec.size[1], spec.size[2]),
      ),
    [spec.size],
  );

  const accent = WORLD_COLORS[spec.id] ?? WORLD_COLORS.structure;
  const aura = useAuraMaterial(accent);

  useFrame((state, dt) => {
    const e = frozen
      ? energyTarget(spec.id)
      : (energy.current = damp(energy.current, energyTarget(spec.id), 5, dt));

    const t = state.clock.elapsedTime;
    let behave = 1;
    if (!frozen) {
      if (spec.behavior === "pulse") {
        // Work rhythm: fast rise, slow fall.
        const phase = (t % 2.4) / 2.4;
        behave = 0.78 + 0.22 * Math.pow(Math.sin(Math.PI * phase), 3);
      } else if (spec.behavior === "breathe") {
        const b = Math.sin((t * Math.PI * 2) / 9);
        behave = 0.92 + 0.08 * (0.5 + 0.5 * b);
        group.current.scale.y = 1 + b * 0.004;
      }
    }

    edgeMat.current.opacity = (0.16 + 0.62 * e) * behave;
    faceMat.current.opacity = 0.018 + 0.05 * e;
    // Volumetric attention: the aura shares the same energy value.
    aura.opacity = Math.max(0, e - 0.35) * 0.24 * behave;
  });

  return (
    <group ref={group} position={[...spec.center]}>
      <lineSegments geometry={edges}>
        <lineBasicMaterial
          ref={edgeMat}
          color={accent}
          transparent
          opacity={0.4}
        />
      </lineSegments>
      <EnergyAura
        material={aura}
        position={[0, 0, 0]}
        scale={Math.max(spec.size[0], spec.size[1]) * 2.1}
      />
      <mesh>
        <boxGeometry args={[...spec.size]} />
        <meshBasicMaterial
          ref={faceMat}
          color={accent}
          transparent
          opacity={0.03}
          depthWrite={false}
        />
      </mesh>
      {/* Attention proxy — invisible, generous, raycastable. */}
      <mesh
        visible={false}
        onPointerOver={(e) => {
          e.stopPropagation();
          setTarget(spec.id);
          logEvent("discovery", `attended: ${spec.name}`);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setTarget(null);
          document.body.style.cursor = "";
        }}
      >
        <boxGeometry
          args={[spec.size[0] + 0.25, spec.size[1] + 0.25, spec.size[2] + 0.25]}
        />
      </mesh>
    </group>
  );
}
