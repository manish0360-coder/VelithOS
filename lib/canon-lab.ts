/**
 * CANON — LABORATORY MODULE (Scene 2 + Scene 3 content).
 *
 * Additive canon: imports the Fact discipline from lib/canon.ts and adds
 * the MiniFlyWire record. Every hypothesis, rejection, theorem, and gate
 * criterion below is transcribed from the project record — statuses
 * included. Where the record disagrees with itself (H1/H2 are frozen in
 * the notebook while the 2026-06-27 papers propose their reduction), the
 * displayed status states BOTH truths, because that ambiguity is itself
 * the current state of the science (Documentation Consistency Report,
 * Finding 9).
 */

import type { Fact } from "./canon";

const fact = (text: string, source: string): Fact => ({ text, source });

/* ── Specimens: working hypotheses (the wall) ─────────────────────────── */

export type SpecimenStatus =
  | "FROZEN — REVISION UNDER REVIEW"
  | "WORKING"
  | "FALSIFIED AS PRIMITIVE"
  | "PARTIALLY FALSIFIED — REVISED"
  | "OPEN QUESTION";

export interface Specimen {
  readonly id: string;
  readonly name: string;
  readonly status: SpecimenStatus;
  readonly claim: Fact;
  readonly note?: Fact;
}

const NOTEBOOK = "10_research_notebook.md";

export const SPECIMENS: readonly Specimen[] = [
  {
    id: "H1",
    name: "Universal Computational Operators",
    status: "FROZEN — REVISION UNDER REVIEW",
    claim: fact(
      "Artificial cognition is completely described by five universal operators: Perception, Inference, Evaluation, Learning, Execution.",
      `${NOTEBOOK} — H1; frozen in Computational Theory (M2)`,
    ),
    note: fact(
      "The 2026-06-27 falsification proposes reduction to four operators — Evaluation demoted to typed Inference. Under council review.",
      "FALSIFICATION_TaskModel_2026-06-27, Abstract",
    ),
  },
  {
    id: "H2",
    name: "Three Representational Domains",
    status: "FROZEN — REVISION UNDER REVIEW",
    claim: fact(
      "Every representation exists in exactly one domain: Reality, Cognitive State, or the Structured Generative World Model.",
      `${NOTEBOOK} — H2; frozen in Computational Theory (M2)`,
    ),
    note: fact(
      "The minimal-ontology derivation finds the cardinality (3) correct but two specifications wrong: Reality is ground, not an internal object; the primitive behind 'World Model' is generalizing structure K.",
      "MINIMAL_ONTOLOGY_DERIVATION_2026-06-27, Abstract",
    ),
  },
  {
    id: "H3",
    name: "Engineering Equivalence",
    status: "WORKING",
    claim: fact(
      "Engineering introduces no additional fundamental computational operators. Engineering is universal cognition operating over an engineering world model.",
      `${NOTEBOOK} — H3`,
    ),
    note: fact(
      "The universal-cognition claim survives the 2026-06-27 falsification and is strengthened.",
      "FALSIFICATION_TaskModel_2026-06-27, Abstract",
    ),
  },
  {
    id: "H4",
    name: "Dynamic Expertise",
    status: "WORKING",
    claim: fact(
      "Domain expertise does not require separate expert agents. Expert behaviour emerges by activating the relevant portions of the World Model.",
      `${NOTEBOOK} — H4`,
    ),
  },
  {
    id: "H5",
    name: "Constraint-Driven Retrieval",
    status: "WORKING",
    claim: fact(
      "Knowledge retrieval is driven primarily by causal relevance and active constraints rather than semantic similarity alone.",
      `${NOTEBOOK} — H5`,
    ),
  },
  {
    id: "H6",
    name: "Cognitive Workspace",
    status: "WORKING",
    claim: fact(
      "The cognitive engine constructs a temporary task-specific workspace for reasoning.",
      `${NOTEBOOK} — H6`,
    ),
  },
  {
    id: "H7",
    name: "Task Model",
    status: "FALSIFIED AS PRIMITIVE",
    claim: fact(
      "For every active goal, the engine constructs a transient Task Model; Inference and Evaluation operate primarily on it.",
      `${NOTEBOOK} — H7`,
    ),
    note: fact(
      "Destroyed as a primitive (Theorem 1): definitionally identical to a goal-scoped frame of the Cognitive State. It survives only as a name for that frame.",
      "FALSIFICATION_TaskModel_2026-06-27 §3",
    ),
  },
  {
    id: "H9",
    name: "Evolving Realizable Representation",
    status: "PARTIALLY FALSIFIED — REVISED",
    claim: fact(
      "Engineering cognition operates on an evolving realizable representation — the object progressively transformed toward realization under constraints; a component, assembly, factory, or spacecraft alike.",
      `${NOTEBOOK} — H9`,
    ),
    note: fact(
      "Predecessor (artifact-centered cognition) partially falsified: engineering problems often involve interacting artifacts or whole systems, not a single artifact.",
      `${NOTEBOOK} — H9, falsification record`,
    ),
  },
  {
    id: "H31",
    name: "Representation Transformation",
    status: "WORKING",
    claim: fact(
      "Vertical realization may not be the universal principle: engineering maps abstract → concrete, but perception maps concrete → abstract. The deeper invariant may be representation transformation itself.",
      `${NOTEBOOK} — H31`,
    ),
  },
  {
    id: "H32",
    name: "Temporal Computation",
    status: "OPEN QUESTION",
    claim: fact(
      "Is time an independent computational primitive, or does it emerge from repeated application of the universal operators over changing representations?",
      `${NOTEBOOK} — H32`,
    ),
  },
] as const;

/* ── The rejected wall (rejections are evidence) ──────────────────────── */

export interface Rejection {
  readonly id: string;
  readonly idea: string;
  readonly verdict: Fact;
}

export const REJECTIONS: readonly Rejection[] = [
  {
    id: "R1",
    idea: "Engineering requires its own computational operators.",
    verdict: fact("Rejected.", `${NOTEBOOK} — R1`),
  },
  {
    id: "R2",
    idea: "Engineering requires separate engineering agents.",
    verdict: fact("Rejected.", `${NOTEBOOK} — R2`),
  },
  {
    id: "R3",
    idea: "Each engineering discipline requires a separate cognitive engine.",
    verdict: fact("Rejected.", `${NOTEBOOK} — R3`),
  },
  {
    id: "R4",
    idea: "Expertise is stored as separate experts inside memory.",
    verdict: fact("Rejected.", `${NOTEBOOK} — R4`),
  },
  {
    id: "R5",
    idea: "Engineering behaviour is produced only by engineering knowledge.",
    verdict: fact(
      "Rejected. Intent and universal cognition are also required.",
      `${NOTEBOOK} — R5`,
    ),
  },
  {
    id: "R6",
    idea: "Knowledge retrieval is based only on semantic similarity.",
    verdict: fact(
      "Currently rejected in favour of causal, constraint-driven retrieval.",
      `${NOTEBOOK} — R6`,
    ),
  },
  {
    id: "R7",
    idea: "The engine reasons directly over the entire World Model.",
    verdict: fact(
      "Currently rejected. Reasoning appears to occur over a temporary workspace.",
      `${NOTEBOOK} — R7`,
    ),
  },
] as const;

export const REJECTED_EPIGRAPH = fact(
  "These ideas are intentionally preserved because rejected hypotheses are valuable scientific evidence.",
  `${NOTEBOOK} — Rejected or Reduced Ideas`,
);

/* ── The falsification chamber (the Task-Model dissection) ────────────── */

export interface DissectionStep {
  readonly title: string;
  readonly caption: Fact;
}

const FALS = "FALSIFICATION_TaskModel_2026-06-27";
const ONT = "MINIMAL_ONTOLOGY_DERIVATION_2026-06-27";

export const DISSECTION: readonly DissectionStep[] = [
  {
    title: "The hypothesis as stated",
    caption: fact(
      "A universal cognitive engine solves engineering tasks by constructing a transient internal Task Model — over the declared ontology {Reality, Cognitive State, World Model} and five operators.",
      `${FALS} §1`,
    ),
  },
  {
    title: "Theorem 1 — no distinct type, operator, or capability",
    caption: fact(
      "Every field of the Task Model is already a permitted inhabitant of the Cognitive State; no operator is private to it; it supports no operation C cannot. It is not an object — it is a goal-scoped frame of C.",
      `${FALS} §3.1, Theorem 1`,
    ),
  },
  {
    title: "Theorem 2 — scoped C is sufficient",
    caption: fact(
      "A Cognitive State structured as nested goal-scoped frames reproduces every computation the Task Model performs. The T-free theory dominates: fewer primitives, no loss of power.",
      `${FALS} §3.3, Theorem 2`,
    ),
  },
  {
    title: "Theorem 3 — Reality is ground, and artifacts live in it",
    caption: fact(
      "CAD kernels, digital twins, and containerized verifiers reduce to Reality — including Reality's active, computational processes — reachable by Perception and Execution alone. Reality was mis-typed as an internal object; it is the ground.",
      `${FALS} Abstract; ${ONT} Abstract`,
    ),
  },
  {
    title: "The operators reduce",
    caption: fact(
      "Evaluation and Retrieval are demoted to typed special cases of Inference. Four operators remain: Perception, Inference, Execution, Learning.",
      `${FALS} Abstract`,
    ),
  },
  {
    title: "The survivors",
    caption: fact(
      "Two representational objects over one ground: C, the situation state; K, the generalizing structure; R, Reality. The universal-cognition claim survives and is strengthened. The Task Model and the engineering-specific object both die.",
      `${ONT} Abstract; ${FALS} Abstract`,
    ),
  },
] as const;

export const DISSECTION_STANDARD = fact(
  "A concept is retained only if its removal causes a computational impossibility, not merely reduced efficiency.",
  `${FALS} §1, adversarial standard`,
);

export const DISSECTION_STATUS = fact(
  "Theoretical result, implementation-independent — under Scientific Council review; not yet accepted into frozen theory.",
  `${FALS} header; Documentation Consistency Report, Finding 9`,
);

/* ── The sealed exhibit ───────────────────────────────────────────────── */

export const ANTI_PATTERN = {
  name: "LLM-as-judge",
  placard: fact(
    "The precise anti-pattern the ecosystem exists to eliminate. It may exist inside MiniFlyWire as a studied negative result, but it is permanently barred from promotion regardless of apparent performance.",
    "HANDBOOK v1.1 §2 (repo audit) and §5.5",
  ),
} as const;

/* ── The promotion gate ───────────────────────────────────────────────── */

export interface GateCriterion {
  readonly name: string;
  readonly test: Fact;
}

export const GATE_CRITERIA: readonly GateCriterion[] = [
  {
    name: "Hypothesis-defined",
    test: fact(
      "It expresses a clearly stated cognitive hypothesis, not a vague capability.",
      "HANDBOOK v1.1 §5.5",
    ),
  },
  {
    name: "Causally isolated",
    test: fact(
      "Its contribution is measured with the mechanism as the single manipulated variable, not inferred from an architecture's overall score.",
      "HANDBOOK v1.1 §5.5",
    ),
  },
  {
    name: "Quantitatively measured",
    test: fact(
      "Effect size and its variability are reported; an underpowered or noisy positive is treated as uninterpretable, not a weak win.",
      "HANDBOOK v1.1 §5.5",
    ),
  },
  {
    name: "Falsification-tested",
    test: fact(
      "The experiment could have shown the mechanism useless — and did not. A mechanism that cannot fail its test has not been tested.",
      "HANDBOOK v1.1 §5.5",
    ),
  },
  {
    name: "Domain-agnostic",
    test: fact(
      "The mechanism is a form of cognition, not domain content; content belongs in a domain layer.",
      "HANDBOOK v1.1 §5.5",
    ),
  },
  {
    name: "Re-implementable",
    test: fact(
      "Specified cleanly enough for Noetica to rebuild without inheriting research scaffolding.",
      "HANDBOOK v1.1 §5.5",
    ),
  },
  {
    name: "Not a known anti-pattern",
    test: fact(
      "LLM-as-judge and any mechanism that corrupts the grounding signal are permanently barred, regardless of apparent performance.",
      "HANDBOOK v1.1 §5.5",
    ),
  },
] as const;

export const GATE_RULE = fact(
  "The gate is conjunctive: failing any criterion returns the mechanism to the notebook. Passing all of them makes it a validated mechanism, eligible for the Knowledge Flow.",
  "HANDBOOK v1.1 §5.5",
);

/* ── The crossing (Scene 3 — protocol, shown in advance) ──────────────── */

export const CROSSING = {
  honesty: fact(
    "The Primitive Registry is empty — nothing has yet crossed this gate. What follows is the law of the crossing, shown in advance.",
    "Noetica PROJECT_STATE.md §6; HANDBOOK v1.1 §5.4",
  ),
  stages: [
    fact(
      "On the laboratory side: a validated mechanism — hypothesis-defined, causally isolated, falsification-tested — still in its research-grade body.",
      "HANDBOOK v1.1 §5.4 step 5",
    ),
    fact(
      "At the gate it is reduced to its written specification. Only the specification crosses. The research object is set down and left behind — no research code is imported, ever.",
      "HANDBOOK v1.1 §5.4 step 6; §4.1",
    ),
    fact(
      "On the platform side, Noetica re-implements the idea from nothing: typed, versioned, platform-grade. The same idea; none of the same code.",
      "HANDBOOK v1.1 §4.1; Law 7",
    ),
  ],
  law: fact(
    "Promotion requires validation and re-implementation. A cognitive primitive enters Noetica only after passing MiniFlyWire's promotion gate, and only by re-implementation.",
    "HANDBOOK v1.1, Law 7",
  ),
} as const;
