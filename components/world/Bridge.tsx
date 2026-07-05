"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { energyTarget, setTarget } from "@/lib/spotlight";
import { logEvent } from "@/lib/session";
import { damp } from "@/lib/inputs";
import { BRIDGE, WORLD_COLORS } from "@/lib/world";

/**
 * The Knowledge Flow (CDD Principle 3): a DASHED bridge of light from the
 * laboratory to the platform hall — the only dashed element in the world.
 *
 * The dashes do not animate; instead, every few seconds a single small
 * light crosses lab → tower and extinguishes at the wall: a specification
 * crossing. Ideas travel; code never does. Direction is one-way by
 * construction. Frozen (reduced motion): the traveler rests unlit.
 */
export default function Bridge({ frozen }: { frozen: boolean }) {
  const traveler = useRef<THREE.Mesh>(null!);
  const travelerMat = useRef<THREE.MeshBasicMaterial>(null!);
  const lineMat = useRef<THREE.LineDashedMaterial>(null!);
  const energy = useRef(0.55);

  const from = useMemo(() => new THREE.Vector3(...BRIDGE.from), []);
  const to = useMemo(() => new THREE.Vector3(...BRIDGE.to), []);

  const line = useMemo(() => {
    const g = new THREE.BufferGeometry().setFromPoints([from, to]);
    const mat = new THREE.LineDashedMaterial({
      color: WORLD_COLORS.bridge,
      dashSize: 0.11,
      gapSize: 0.09,
      transparent: true,
      opacity: 0.5,
    });
    const l = new THREE.Line(g, mat);
    l.computeLineDistances();
    return { l, mat };
  }, [from, to]);

  // Hover proxy: a fat invisible cylinder along the span.
  const proxy = useMemo(() => {
    const dir = new THREE.Vector3().subVectors(to, from);
    const length = dir.length();
    const mid = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
    return { length, mid };
  }, [from, to]);

  useFrame((state, dt) => {
    const e = frozen
      ? energyTarget("knowledge")
      : (energy.current = damp(
          energy.current,
          energyTarget("knowledge"),
          5,
          dt,
        ));
    lineMat.current = line.mat;
    line.mat.opacity = 0.2 + 0.6 * e;

    if (frozen) {
      travelerMat.current.opacity = 0;
      return;
    }
    // One crossing per period, lab → tower, easing through the span.
    const t = state.clock.elapsedTime % BRIDGE.period;
    const p = Math.min(1, Math.max(0, t / BRIDGE.travel));
    const eased = p * p * (3 - 2 * p); // smoothstep
    traveler.current.position.lerpVectors(from, to, eased);
    // Visible only while in transit; brightens with attention.
    const inTransit = t < BRIDGE.travel ? 1 : 0;
    travelerMat.current.opacity =
      inTransit * (0.35 + 0.65 * e) * Math.sin(Math.PI * Math.min(1, p));
  });

  return (
    <group>
      <primitive object={line.l} />
      <mesh ref={traveler} position={[...BRIDGE.from]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshBasicMaterial
          ref={travelerMat}
          color={WORLD_COLORS.bridge}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>
      <mesh
        visible={false}
        position={[proxy.mid.x, proxy.mid.y, proxy.mid.z]}
        rotation={[0, 0, Math.PI / 2]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setTarget("knowledge");
          logEvent("discovery", "attended: the knowledge flow");
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setTarget(null);
          document.body.style.cursor = "";
        }}
      >
        <cylinderGeometry args={[0.22, 0.22, proxy.length, 6]} />
      </mesh>
    </group>
  );
}
