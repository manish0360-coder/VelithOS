/**
 * WORLD — the Overlook's structure as data (CDD Scene 1).
 *
 * The world's shape is a model, not hardcoded geometry: halls, the
 * laboratory, the bridge, and the drift column are specified here and
 * rendered by components that read the spec. Names are derived from the
 * canon PROJECTS list — if a project were renamed in canon, the world
 * would rename with it; if a spec referenced a project canon doesn't
 * know, the build fails loudly.
 *
 * Layout (world units, y up):
 *   - The tower stands at x = TOWER_X: Noetica hall on top, the Velith
 *     engineering hall beneath it, the Mini Prometheus foundation at the
 *     base — code flows down.
 *   - The laboratory stands APART from the tower (never imported),
 *     level with the platform hall, joined only by the dashed bridge.
 *
 * Colors mirror the layer accents in globals.css. CSS custom properties
 * are not readable at module scope inside the WebGL renderer, so the hex
 * values are duplicated here deliberately; globals.css remains the source
 * of truth for the DOM, this table for the world. Change both together.
 */

import { PROJECTS, type LayerId } from "./canon";

export type FlowId = "knowledge" | "code" | "experience";
export type WorldTargetId = LayerId | FlowId;

export interface HallSpec {
  readonly id: LayerId;
  readonly name: string;
  readonly center: readonly [number, number, number];
  readonly size: readonly [number, number, number];
  readonly behavior: "flicker" | "still" | "pulse" | "breathe";
}

function projectName(id: LayerId): string {
  const p = PROJECTS.find((p) => p.id === id);
  if (!p) throw new Error(`World spec references unknown project: ${id}`);
  return p.name;
}

export const TOWER_X = 0.9;

/** Foundation → engineering → platform, bottom to top. */
export const TOWER_HALLS: readonly HallSpec[] = [
  {
    id: "prometheus",
    name: projectName("prometheus"),
    center: [TOWER_X, 0.7, 0],
    size: [4.2, 1.4, 4.2],
    behavior: "breathe",
  },
  {
    id: "velith",
    name: projectName("velith"),
    center: [TOWER_X, 2.45, 0],
    size: [2.6, 1.5, 2.6],
    behavior: "pulse",
  },
  {
    id: "noetica",
    name: projectName("noetica"),
    center: [TOWER_X, 4.2, 0],
    size: [2.2, 1.4, 2.2],
    behavior: "still",
  },
] as const;

export const LAB: HallSpec = {
  id: "miniflywire",
  name: projectName("miniflywire"),
  center: [-3.1, 4.2, 0],
  size: [1.5, 1.1, 1.5],
  behavior: "flicker",
};

/** Dashed light from the laboratory to the platform hall — the only arrow
 *  of its kind. Slightly above hall center, like a footbridge. */
export const BRIDGE = {
  from: [LAB.center[0] + LAB.size[0] / 2, 4.42, 0] as const,
  to: [TOWER_X - TOWER_HALLS[2].size[0] / 2, 4.42, 0] as const,
  /** seconds between spec crossings, and the crossing's duration */
  period: 7,
  travel: 2.2,
};

/** Rising records: a loose column around the tower that bends toward the
 *  laboratory near the top — experience returning to research. */
export const DRIFT = {
  count: 240,
  radius: 2.6,
  height: 6.4,
  labX: LAB.center[0],
  centerX: TOWER_X,
};

export const CAMERA = {
  position: [-0.4, 3.4, 10.2] as const,
  lookAt: [-0.5, 2.7, 0] as const,
  fov: 40,
};

export const WORLD_COLORS: Record<string, string> = {
  structure: "#aeb6c4",
  miniflywire: "#c06844",
  labWindow: "#e8ce9e",
  noetica: "#7fa8ba",
  velith: "#e2a24c",
  prometheus: "#5c7fa0",
  bridge: "#d9c9a8",
  spine: "#8f99a9",
  drift: "#d9e2ee",
};
