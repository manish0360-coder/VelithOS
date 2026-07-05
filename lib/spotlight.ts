/**
 * SPOTLIGHT — the shared attention target (CDD Principle 4, Scene 1).
 *
 * One module-singleton store holds "what the operator is attending to":
 * a project layer, a flow, or nothing. Both worlds read and write it —
 * hovering the 3D structure names it in the DOM designation panel;
 * focusing a DOM legend chip illuminates the 3D structure. Keyboard and
 * pointer are the same operator.
 *
 * Same pattern as lib/session.ts: React subscribes via
 * useSyncExternalStore; the render loop reads getTarget() directly inside
 * useFrame with zero React involvement.
 */

import { useSyncExternalStore } from "react";
import type { WorldTargetId } from "./world";

let target: WorldTargetId | null = null;
const listeners = new Set<() => void>();

export function setTarget(next: WorldTargetId | null): void {
  if (target === next) return;
  target = next;
  for (const l of listeners) l();
}

export function getTarget(): WorldTargetId | null {
  return target;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getSnapshot = (): WorldTargetId | null => target;
const getServerSnapshot = (): WorldTargetId | null => null;

export function useSpotlight(): WorldTargetId | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Shared energy easing for world elements: full light when targeted,
 * dimmed when something else is targeted, resting glow when nothing is.
 */
export function energyTarget(id: WorldTargetId): number {
  if (target === id) return 1;
  if (target !== null) return 0.22;
  return 0.55;
}
