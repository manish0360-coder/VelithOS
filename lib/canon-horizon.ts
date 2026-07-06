/**
 * CANON — HORIZON MODULE (Scene 7 + the Return).
 *
 * The migration ladder verbatim from the Constitution's pre-committed
 * sequence; the Mini Prometheus charter from Part VIII; the ghost
 * machines named in §8.2, presented strictly in the FUTURE tense —
 * nothing on this floor runs, and the floor says so.
 */

import type { Fact } from "./canon";

const fact = (text: string, source: string): Fact => ({ text, source });

const HB = "HANDBOOK v1.1";

/* ── The migration ladder (pre-committed; the far wall's rungs) ───────── */

export interface Rung {
  readonly n: number;
  readonly name: string;
  readonly detail: string;
  readonly status: "CURRENT — AT M2" | "AHEAD";
  /** How wide/soft the verifier's lamp renders: the model-gap made visible. */
  readonly gap: number; // 0..3
}

export const LADDER: readonly Rung[] = [
  {
    n: 1,
    name: "Software (repo-level SWE)",
    detail: "prove the loop compounds; zero model-gap; external held-out benchmark",
    status: "CURRENT — AT M2",
    gap: 0,
  },
  {
    n: 2,
    name: "Electronics / PCB",
    detail: "first deliberate model-gap (approximate SPICE) and a literally manufacturable artifact (Gerbers)",
    status: "AHEAD",
    gap: 1,
  },
  {
    n: 3,
    name: "HDL / firmware",
    detail: "exhaustive formal verification; first contact with timing and physical constraints",
    status: "AHEAD",
    gap: 2,
  },
  {
    n: 4,
    name: "Mechanical / FEA → manufacturing",
    detail: "the north star — attempted only after the loop has survived progressively widening model-gaps",
    status: "AHEAD",
    gap: 3,
  },
] as const;

export const LADDER_SOURCE = `${HB} §7 (the migration ladder)`;

export const LADDER_RULE = fact(
  "Generality is reached by a pre-committed ladder, so software-first can never quietly become software-only. Each new vertical is a registration, not a rewrite; each widens the verification model-gap deliberately, and only after the prior rung is proven.",
  `${HB} §7`,
);

export const VERIFIER_GAP = fact(
  "The engineering verifier is deterministic where the model-gap is zero (SWE) and approximate-with-calibrated-uncertainty on higher rungs. Treating an approximate verifier as if it were exact — hiding the model-gap — is a named failure.",
  `${HB} §7.2, §7 (anti-patterns)`,
);

export const GATE_CLOSED = fact(
  "The gate to this floor is closed, and says why: manufacturing is attempted only after the loop has survived progressively widening model-gaps. Nothing here pretends to run.",
  `${HB} §7 (rung 4); VELITH_CREATIVE_DIRECTION.md, Scene 7`,
);

/* ── Mini Prometheus (Part VIII — the pre-dawn floor) ─────────────────── */

export const PROMETHEUS_IS = fact(
  "The top of the stack and the ecosystem's contact point with physical reality: it consumes Velith's verified engineering intelligence and turns it into manufacturable plans and running production.",
  `${HB} §8.1`,
);

export const PROBABILISTIC = fact(
  "Manufacturing is not a deterministic logic puzzle. Verdicts at this layer are distributions with calibrated uncertainty, not booleans — and Sim2Real divergence is tracked, never assumed away.",
  `${HB} §8.3`,
);

/** The ghost machines — everything in the future tense, per the record. */
export interface Machine {
  readonly id: string;
  readonly name: string;
  readonly will: Fact;
}

export const MACHINES: readonly Machine[] = [
  {
    id: "planner",
    name: "The manufacturing planner",
    will: fact(
      "Will be Mini Prometheus's heart: manufacturing planning and scheduling.",
      `${HB} §8.2`,
    ),
  },
  {
    id: "factory",
    name: "Factory workflows & robotics",
    will: fact(
      "Will run as wrapped industrial systems behind adapters — OPC UA and similar standard protocols.",
      `${HB} §8.2`,
    ),
  },
  {
    id: "supply",
    name: "Supply chain & MES",
    will: fact(
      "Will be owned here as manufacturing content — never re-implemented platform mechanism.",
      `${HB} §8.2, §8.7`,
    ),
  },
  {
    id: "twin",
    name: "The manufacturing twin",
    will: fact(
      "Will be twin CONTENT — this factory's physical world model — instantiated on Noetica's twin engine. That engine is PE-G1, whose gate (a real twin consumer) is not yet satisfied: this machine is why the bay is dark.",
      `${HB} §8.4; Noetica PROJECT_STATE.md §4`,
    ),
  },
  {
    id: "experience",
    name: "Experience collection",
    will: fact(
      "Will capture reality's verdicts — success, failure, drift — and emit the Experience Flow. This floor will be the ecosystem's primary generator of grounded physical experience.",
      `${HB} §8.2, §8.6`,
    ),
  },
] as const;

/* ── The Return (the loop closes in one upward gaze) ──────────────────── */

export const RETURN_RISE = fact(
  "Every production outcome is captured, provenance-tracked, and emitted up the stack as data — never code: to Velith as refined engineering constraints, to Noetica as inputs that refine mechanisms via extraction, to MiniFlyWire as new research questions and datasets.",
  `${HB} §8.6`,
);

export const RETURN_CLOSES = fact(
  "This is what closes the compounding loop for the whole ecosystem.",
  `${HB} §8.6`,
);
