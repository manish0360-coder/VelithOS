/**
 * CANON — PLATFORM MODULE (Scene 4 + Scene 5 content).
 *
 * The Noetica hall, transcribed from the frozen record: every bay is a
 * real PE-numbered subsystem from PROJECT_STATE §2.3, every figure on the
 * seal is from §3, every dark bay names its real gate from §4. Nothing
 * here is a capability claim — it is an inventory.
 */

import type { Fact } from "./canon";

const fact = (text: string, source: string): Fact => ({ text, source });

const PS = "Noetica PROJECT_STATE.md";

/* ── The 21 bays (dependency-depth order — the order is the information) ── */

export interface Bay {
  readonly pe: number;
  readonly subsystem: string;
  readonly contract: string;
  readonly ref: string;
  /** Law-17 immutable oversight gets sealed treatment. */
  readonly sealed?: boolean;
}

export const BAYS: readonly Bay[] = [
  { pe: 1, subsystem: "interfaces", contract: "Typed contract surface — 21 modules. The interface surface was frozen here, at PE-1.", ref: "Part VI" },
  { pe: 2, subsystem: "state", contract: "The State Substrate. The floor of the hall: every other mechanism is mounted on it.", ref: "§6.1" },
  { pe: 3, subsystem: "provenance", contract: "Provenance & Lineage — where every record's ancestry is kept.", ref: "§6.2" },
  { pe: 4, subsystem: "episodes", contract: "Episode & Episode Store — durable, provenance-complete records of grounded attempts.", ref: "§7.5" },
  { pe: 5, subsystem: "observability", contract: "Logging, metrics, traces. Nothing in the system is allowed to be invisible.", ref: "§6.17" },
  { pe: 6, subsystem: "budget", contract: "Budget & Meta-control with a hard cost guard.", ref: "§6.14" },
  { pe: 7, subsystem: "datacontracts", contract: "Data Contract & Versioning — the law of the Experience Flow, in code.", ref: "§4.3 / Law 21" },
  { pe: 8, subsystem: "verification", contract: "ReferenceVerifier — deliberately fake, by law. The platform may never own a real oracle; truth is domain property.", ref: "§6.11 / Law 20" },
  { pe: 9, subsystem: "guardrails", contract: "Safety engine — the immutable oversight boundary. The one thing the system may never modify. No walkway reaches it.", ref: "§6.16 / Law 17", sealed: true },
  { pe: 10, subsystem: "router", contract: "Model Router — deterministic, cost-guarded.", ref: "§6.15" },
  { pe: 11, subsystem: "compute", contract: "Compute Interface — vendor-neutral.", ref: "§6.21" },
  { pe: 12, subsystem: "tools", contract: "Tool Runtime — sandboxed, async.", ref: "§6.12" },
  { pe: 13, subsystem: "knowledge", contract: "Knowledge Store engine — the mechanism; never the knowledge itself.", ref: "§6.5" },
  { pe: 14, subsystem: "memory", contract: "Memory + Write-Filter — the A1/A2/A4 policies that decide what experience is retained.", ref: "§6.4 / D7" },
  { pe: 15, subsystem: "skills", contract: "Skill Runtime.", ref: "§6.13" },
  { pe: 16, subsystem: "context", contract: "Context Engine — explicit policy for what enters the window; never accident.", ref: "§6.6" },
  { pe: 17, subsystem: "evaluation", contract: "Evaluation Harness + the mechanically-enforced Held-out Lock; frozen evaluation.", ref: "§6.10" },
  { pe: 18, subsystem: "reasoning", contract: "Reasoning Runtime — form only, never mind. The platform provides the shape of thought; domains provide the content.", ref: "§6.7" },
  { pe: 19, subsystem: "planning", contract: "Planning Runtime — form only.", ref: "§6.8" },
  { pe: 20, subsystem: "reflection", contract: "Grounded self-critique — reflection against verdicts, not vibes.", ref: "§6.9" },
  { pe: 21, subsystem: "runtime + sdk", contract: "Runtime, Agent Lifecycle & SDK — the integrator, built last because it depends on everything beneath it.", ref: "§6.3 / §6.18" },
] as const;

export const BAY_SOURCE = `${PS} §2.3 (PE-1 … PE-21)`;

/* ── The five dark bays (gated by law, not by neglect) ────────────────── */

export interface GatedBay {
  readonly id: string;
  readonly name: string;
  readonly gate: string;
}

export const GATED_BAYS: readonly GatedBay[] = [
  { id: "PE-G1", name: "World-Model / Twin Engine", gate: "a real world-model or twin consumer" },
  { id: "PE-G2", name: "Data Lifecycle Governance", gate: "a store approaching its bound" },
  { id: "PE-G3", name: "Experience Aggregation", gate: "a credible second consumer" },
  { id: "PE-G4", name: "Belief / Probabilistic State", gate: "the first approximate (PCB / FEA) rung" },
  { id: "PE-G5", name: "Learned Meta-control", gate: "the compounding result" },
] as const;

export const GATE_REVIEW = fact(
  "Gate Review: the PE-G1 gate is NOT satisfied — work stopped; no gated mechanism has been opened. Deferral is Law 8: the platform grows only by extraction, never speculation.",
  `${PS} §4; HANDBOOK v1.1 Law 8`,
);

/* ── The freeze seal (certification, engraved plainly) ────────────────── */

export const SEAL = {
  tag: "platform-engineering-v1",
  figures: [
    { value: "21 / 21", label: "PART VI MECHANISMS IMPLEMENTED" },
    { value: "181", label: "TESTS" },
    { value: "15", label: "ARCHITECTURE TESTS" },
    { value: "89", label: "FILES, MYPY --STRICT CLEAN" },
  ],
  statement: fact(
    "Platform engineering is complete and frozen. Boundary and intra-platform dependency DAG clean; main pristine.",
    `${PS} §3`,
  ),
  stillness: fact(
    "Almost nothing moves in this hall, and that stillness is the atmosphere: frozen is a state of dignity, not death.",
    "VELITH_CREATIVE_DIRECTION.md §4 (Noetica)",
  ),
} as const;

/* ── Fixtures ─────────────────────────────────────────────────────────── */

export const REGISTRY_CASE = fact(
  "Primitive Registry — empty. Nothing has been promoted yet.",
  `${PS} §6`,
);

export const PRIME_DIRECTIVE = fact(
  "No engineering or manufacturing content, no domain oracle, no central mind — the Prime Directive of the platform.",
  "HANDBOOK v1.1 §6; Noetica README",
);

export interface ReferenceShelf {
  readonly path: string;
  readonly owner: string;
  readonly holds: string;
}

export const REFERENCE_WING: readonly ReferenceShelf[] = [
  { path: "reference/miniflywire/", owner: "MiniFlyWire", holds: "the research corpus" },
  { path: "reference/mininoetica/", owner: "MiniNoetica (D11)", holds: "the education code, archived" },
  { path: "reference/velith/", owner: "Velith (separate repo)", holds: "the engineering docs" },
] as const;

export const REFERENCE_RULE = fact(
  "Read-only, zero coupling. Never imported by src/ — CI fails the build if this glass is ever breached.",
  "Noetica README (Law 4, D11; .github/workflows/constitution.yml)",
);

export const CI_PLAQUE = fact(
  "The boundaries are not discipline; they are machinery. CI fails the build if the platform imports reference or domain code, or if the dependency DAG acquires a cycle. Run locally: python tools/check_boundaries.py.",
  "Noetica README — constitutional boundaries",
);

/* ── The Interface Seam (Scene 5) ─────────────────────────────────────── */

export const SEAM = {
  /** Real named contracts from the record; 21 modules exist in total. */
  signatures: ["Verifier", "MemoryStore", "Plan", "Tool"],
  moduleCount: fact(
    "Twenty-one typed interface modules — the whole surface through which any layer may touch the platform. Frozen at PE-1.",
    `Noetica README; ${PS} §2.3`,
  ),
  law: fact(
    "Code flows down through versioned, typed interfaces — a strict acyclic graph, one direction only. Layers touch only here.",
    "HANDBOOK v1.1 §4.2, Law 9",
  ),
  stampLabel: "CROSSING STAMPED — INTERFACE SURFACE",
  stampVersion: "platform-engineering-v1",
} as const;
