"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { energyTarget, setTarget } from "@/lib/spotlight";
import { logEvent } from "@/lib/session";
import { damp } from "@/lib/inputs";
import { TOWER_HALLS, TOWER_X, WORLD_COLORS } from "@/lib/world";

/**
 * The Code Flow (CDD Principle 3): SOLID structural members down the
 * tower's spine — one continuous line down the front face, and short
 * corner posts spanning each inter-hall gap (the interface seams).
 *
 * Deliberately unanimated: solidity is the grammar. The only response is
 * to attention, which raises its light. One material instance is shared
 * by every member so the whole flow lights as one element.
 */
export default function Spine({ frozen }: { frozen: boolean }) {
  const energy = useRef(0.55);

  const halls = useMemo(() => {
    const byId = (id: string) => {
      const h = TOWER_HALLS.find((h) => h.id === id);
      if (!h) throw new Error(`Spine references unknown hall: ${id}`);
      return h;
    };
    return {
      noetica: byId("noetica"),
      velith: byId("velith"),
      prometheus: byId("prometheus"),
    };
  }, []);

  const lineMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: WORLD_COLORS.spine,
        transparent: true,
        opacity: 0.5,
      }),
    [],
  );
  const postMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: WORLD_COLORS.spine,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
      }),
    [],
  );

  const spineTop = halls.noetica.center[1] + halls.noetica.size[1] / 2;

  const spineObject = useMemo(() => {
    const zFront = halls.prometheus.size[2] / 2 + 0.06;
    const g = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(TOWER_X, spineTop, zFront),
      new THREE.Vector3(TOWER_X, 0, zFront),
    ]);
    return new THREE.Line(g, lineMat);
  }, [halls.prometheus, spineTop, lineMat]);

  const posts = useMemo(() => {
    type H = (typeof TOWER_HALLS)[number];
    const gap = (lower: H, upper: H) => {
      const y0 = lower.center[1] + lower.size[1] / 2;
      const y1 = upper.center[1] - upper.size[1] / 2;
      const half = Math.min(lower.size[0], upper.size[0]) / 2 - 0.12;
      const h = y1 - y0;
      const cy = (y0 + y1) / 2;
      return [
        [TOWER_X - half, cy, -half, h],
        [TOWER_X + half, cy, -half, h],
        [TOWER_X - half, cy, half, h],
        [TOWER_X + half, cy, half, h],
      ] as const;
    };
    return [
      ...gap(halls.prometheus, halls.velith),
      ...gap(halls.velith, halls.noetica),
    ];
  }, [halls]);

  useFrame((_, dt) => {
    const e = frozen
      ? energyTarget("code")
      : (energy.current = damp(energy.current, energyTarget("code"), 5, dt));
    lineMat.opacity = 0.22 + 0.6 * e;
    postMat.opacity = 0.28 + 0.55 * e;
  });

  return (
    <group>
      <primitive object={spineObject} />
      {posts.map(([x, y, z, h], i) => (
        <mesh key={i} position={[x, y, z]} material={postMat}>
          <boxGeometry args={[0.045, h, 0.045]} />
        </mesh>
      ))}
      {/* Attention proxy along the spine */}
      <mesh
        visible={false}
        position={[TOWER_X, spineTop / 2, halls.prometheus.size[2] / 2 + 0.06]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setTarget("code");
          logEvent("discovery", "attended: the code flow");
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setTarget(null);
          document.body.style.cursor = "";
        }}
      >
        <boxGeometry args={[0.5, spineTop, 0.4]} />
      </mesh>
    </group>
  );
}
