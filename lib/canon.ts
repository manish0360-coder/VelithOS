/**
 * CANON — the single registry of everything the interface is allowed to say.
 *
 * CDD Principle 1 ("Honesty is the special effect") as a mechanism, not a habit:
 * every user-visible claim is a `Fact` carrying the document it traces to.
 * Components render Facts; they do not author copy. A claim that cannot name
 * its source cannot be constructed, and attention on any fact in the interface
 * reveals its citation.
 *
 * Sources refer to the project record: HANDBOOK v1.1 (the Constitution),
 * DECISIONS.md (D1–D21), Noetica PROJECT_STATE.md (frozen state),
 * the Velith repo README (M0–M2), and the ratified Creative Direction
 * Document (VELITH_CREATIVE_DIRECTION.md) for the experience's own framing.
 */

export interface Fact {
  readonly text: string;
  readonly source: string;
}

const fact = (text: string, source: string): Fact => ({ text, source });

/* ── Identity ─────────────────────────────────────────────────────────── */

export const SITE = {
  name: "VELITH",
  descriptor: fact(
    "Public interface of the Velith ecosystem",
    "VELITH_CREATIVE_DIRECTION.md §1",
  ),
  clearance: fact(
    "PROVISIONAL — TIER-2 OBSERVER",
    "VELITH_CREATIVE_DIRECTION.md, Scene 0",
  ),
} as const;

export const MISSION = fact(
  "A stateful, grounded, self-improving system that takes a high-level statement of product intent and reasons it down to a design that is verified, explained, and manufacturable — and that measurably compounds in competence over a decade.",
  "HANDBOOK v1.1 §1.1 (Mission)",
);

export const OUTCOME = fact(
  "AI Manufacturing Intelligence is the mission the stack delivers — not a project, not a repository, not a fifth layer.",
  "HANDBOOK v1.1 §N.1",
);

/* ── The four projects (canonical taxonomy, frozen) ───────────────────── */

export type LayerId = "miniflywire" | "noetica" | "velith" | "prometheus";

export interface Project {
  readonly id: LayerId;
  readonly layer: number;
  readonly name: string;
  readonly identity: Fact;
}

export const PROJECTS: readonly Project[] = [
  {
    id: "miniflywire",
    layer: 1,
    name: "MiniFlyWire",
    identity: fact(
      "Cognitive research laboratory. Discovers and validates cognitive primitives. Output is knowledge, never production code.",
      "HANDBOOK v1.1 §N.1",
    ),
  },
  {
    id: "noetica",
    layer: 2,
    name: "Noetica",
    identity: fact(
      "Agent Intelligence Platform. Owns reusable mechanisms and interfaces. Never owns domain content.",
      "HANDBOOK v1.1 §N.1",
    ),
  },
  {
    id: "velith",
    layer: 3,
    name: "Velith",
    identity: fact(
      "Engineering Intelligence. Owns engineering content — knowledge, physics/world model, CAD, simulation, engineering verification. Consumes Noetica.",
      "HANDBOOK v1.1 §N.1",
    ),
  },
  {
    id: "prometheus",
    layer: 4,
    name: "Mini Prometheus",
    identity: fact(
      "Manufacturing Intelligence. Owns manufacturing planning, factory workflows, robotics, supply chain, MES, production. Consumes Velith.",
      "HANDBOOK v1.1 §N.1",
    ),
  },
] as const;

/* ── The three flows (the only legal movements) ───────────────────────── */

export interface Flow {
  readonly id: "knowledge" | "code" | "experience";
  readonly name: string;
  readonly statement: Fact;
}

export const FLOWS: readonly Flow[] = [
  {
    id: "knowledge",
    name: "Knowledge Flow",
    statement: fact(
      "Ideas flow down once, by re-implementation. MiniFlyWire hands Noetica specifications of validated mechanisms; research code is never imported.",
      "HANDBOOK v1.1 §4.1, §4.4",
    ),
  },
  {
    id: "code",
    name: "Code Flow",
    statement: fact(
      "Code flows down through versioned, typed interfaces — Noetica → Velith → Mini Prometheus — a strict acyclic graph, one direction only.",
      "HANDBOOK v1.1 §4.2, Law 9",
    ),
  },
  {
    id: "experience",
    name: "Experience Flow",
    statement: fact(
      "Experience flows up as contract-governed data — telemetry, verdicts, episodes, and the research questions distilled from them. Never code.",
      "HANDBOOK v1.1 §4.3, Law 12",
    ),
  },
] as const;

/* ── Frozen state (what is actually true right now) ─────────────────────
   Named facts so scenes can absorb them as they gain permanent homes:
   the Noetica facts live in the Platform Hall's seal from Batch 1 on;
   the Velith fact moves into the Arena in Batch 2. STATE_OF_RECORD keeps
   the interim list for whatever has no home yet. */

export const FACT_NOETICA_FROZEN = fact(
  "Noetica platform engineering is complete and frozen: PE-1 … PE-21, every Constitution Part VI mechanism with a default implementation. Freeze tag platform-engineering-v1.",
  "Noetica PROJECT_STATE.md §2.3, §3",
);

export const FACT_CERTIFIED = fact(
  "Certified: mypy --strict clean across 89 files; 181 tests; 15 architecture tests; boundary and intra-platform dependency DAG clean.",
  "Noetica PROJECT_STATE.md §3",
);

export const FACT_GATED = fact(
  "Gated mechanisms PE-G1 … PE-G5 are deferred by law. No gate is satisfied; no gated work has been opened.",
  "Noetica PROJECT_STATE.md §4, Law 8",
);

export const FACT_REGISTRY_EMPTY = fact(
  "The Primitive Registry is empty — nothing has been promoted yet.",
  "Noetica PROJECT_STATE.md §6",
);

export const FACT_VELITH_M2 = fact(
  "Velith milestones M0–M2 are complete: a runnable skeleton; one reproducible propose → verify → log episode; a hardened deterministic verifier at Determinism Level 4.",
  "DECISIONS.md D12, D16–D21; Velith README",
);

export const STATE_OF_RECORD: readonly Fact[] = [FACT_VELITH_M2] as const;

/* ── Clearance sequence (Scene 0) ─────────────────────────────────────── */

/**
 * Lines typed during session provisioning. `{id}` and `{time}` are replaced
 * with the real session values at runtime. The fourth line echoes the actual
 * M1 boot log line, verbatim.
 */
export const CLEARANCE_LINES: readonly Fact[] = [
  fact("VELITH — public interface of the Velith ecosystem", "VELITH_CREATIVE_DIRECTION.md §1"),
  fact("session {id} provisioned {time}", "VELITH_CREATIVE_DIRECTION.md, Scene 0"),
  fact("clearance: PROVISIONAL — TIER-2 OBSERVER", "VELITH_CREATIVE_DIRECTION.md, Scene 0"),
  fact("operator detected — provisional clearance", "Velith README, M1 run log"),
  fact("this interface displays only facts traced to the project record", "VELITH_CREATIVE_DIRECTION.md, Principle 1"),
  fact("INTERFACE READY", "Velith README, M0 boot sequence"),
] as const;

export const RESUME_LINE = fact(
  "session {id} resumed — clearance unchanged",
  "VELITH_CREATIVE_DIRECTION.md, Principle 7",
);

/* ── Departure (Scene 8) ──────────────────────────────────────────────── */

export const RECORD_EPIGRAPH = fact(
  "An episode is a provenance-complete, content-hashed record of one grounded attempt. It survives process exit and is first-class learning data.",
  "HANDBOOK v1.1 §1.10 (Core definitions)",
);

export const DEPARTURE = {
  sealed: fact("SESSION COMPLETE — CLEARANCE EXPIRED", "VELITH_CREATIVE_DIRECTION.md, Scene 8"),
  exit: fact(
    "The ecosystem's reachable repository of record: Noetica-agent-lab (github.com/manish0360-coder/Noetica-agent-lab).",
    "ARCHITECTURE_DECISION.md, STEP 1",
  ),
} as const;
