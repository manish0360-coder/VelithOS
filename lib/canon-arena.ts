/**
 * CANON — ARENA MODULE (Scene 6 content + The Second Verdict).
 *
 * The Velith engineering floor, transcribed from the record: the M0–M2
 * milestones, the loop as actually run, the closed verdict taxonomy
 * (D16.7), the five experiment arms (D12), the M2 verifier discipline
 * (D17–D21, README), and the replay record that powers the signature
 * interaction. The D16 provenance note is reproduced VERBATIM — it is
 * the ledger's repaired page.
 */

import type { Fact } from "./canon";

const fact = (text: string, source: string): Fact => ({ text, source });

const RM = "Velith README";
const DEC = "DECISIONS.md";

/* ── Milestones (what has actually been built) ────────────────────────── */

export interface Milestone {
  readonly id: string;
  readonly name: string;
  readonly proof: Fact;
}

export const MILESTONES: readonly Milestone[] = [
  {
    id: "M0",
    name: "The runnable skeleton",
    proof: fact(
      "Containerized from the first commit: the loop runs inside the container and the verdict is never produced on the host.",
      `${RM} (M0/M1); ${DEC} D13, D16.2`,
    ),
  },
  {
    id: "M1",
    name: "One reproducible episode",
    proof: fact(
      "One propose → verify → log episode, reproducible on the verify→log path: given a recorded proposal, re-running yields the same verdict and the same content_hash. Determinism is located in the verifier.",
      `${DEC} D16.1; ${RM} (record/replay)`,
    ),
  },
  {
    id: "M2",
    name: "The hardened verifier",
    proof: fact(
      "The verdict is produced under a pinned, network-isolated, two-phase execution; flaky tests are detected and flagged; a held-out secondary suite surfaces the model gap. Determinism Level 4.",
      `${RM} (M2); ${DEC} D17–D21`,
    ),
  },
] as const;

/* ── The loop (the room's center) ─────────────────────────────────────── */

export interface LoopStage {
  readonly id: "propose" | "verify" | "log";
  readonly name: string;
  readonly detail: Fact;
}

export const LOOP: readonly LoopStage[] = [
  {
    id: "propose",
    name: "PROPOSE",
    detail: fact(
      "A thin LLM adapter — generate plus call metadata — so the proposer depends on a model capability, not a vendor. The model and version are recorded in every episode.",
      `${DEC} D16.4, D16.5`,
    ),
  },
  {
    id: "verify",
    name: "VERIFY",
    detail: fact(
      "In-container, two-phase: phase 1 prepares with the network ON; phase 2 runs the hidden tests with the network OFF (unshare -n). Isolation is mandatory — if unavailable, the verifier raises INFRA_ERROR rather than running untrusted code with network access.",
      `${RM} (M2 two-phase execution)`,
    ),
  },
  {
    id: "log",
    name: "LOG",
    detail: fact(
      "The episode is appended to an append-only JSONL store and survives the container: the task, exact prompt, candidate patch, verdict and raw test output, token/latency provenance, and the content_hash re-verified whenever episodes are read back.",
      `${RM} (inspecting logged episodes); ${DEC} D16.6`,
    ),
  },
] as const;

/* ── The verdict taxonomy (the room's alphabet — closed by law) ───────── */

export interface Verdict {
  readonly name: string;
  readonly meaning: string;
  readonly kind: "grounded" | "error";
}

export const VERDICTS: readonly Verdict[] = [
  { name: "PASSED", meaning: "patch applied, hidden tests passed", kind: "grounded" },
  { name: "FAILED", meaning: "patch applied, tests ran and did not pass — a valid outcome, not an error", kind: "grounded" },
  { name: "PATCH_APPLY_FAILED", meaning: "the candidate patch did not apply cleanly", kind: "grounded" },
  { name: "NO_PATCH", meaning: "the model produced no usable patch", kind: "grounded" },
  { name: "INFRA_ERROR", meaning: "infrastructure fault — the only error state; aborts loudly, no episode written", kind: "error" },
] as const;

export const VERDICT_PLAQUE = fact(
  "A test failure is a valid grounded outcome and first-class learning data, never an error. No model judges any verdict.",
  `${DEC} D16.7`,
);

export const VERDICT_SOURCE = `${DEC} D16.7; ${RM} (verdict taxonomy)`;

/* ── The five rigs (identical in every part except one) ───────────────── */

export interface Arm {
  readonly id: string;
  readonly name: string;
  readonly filter: string;
}

export const ARMS: readonly Arm[] = [
  { id: "A0", name: "Cold", filter: "no memory (baseline + variance)" },
  { id: "A1", name: "Unfiltered memory", filter: "all attempts retained regardless of correctness — the RAG/null control" },
  { id: "A2", name: "Verified memory", filter: "only verification-passing solutions and verified failure signatures retained — the treatment" },
  { id: "A3", name: "Anti-grounding", filter: "retains solutions the model believed correct, without running the verifier — the self-confidence control" },
  { id: "A4", name: "Verified-success-only", filter: "isolates the contribution of grounded failure learning — the ablation" },
] as const;

export const ARMS_SOURCE = `${DEC} D12 (experiment arms)`;

export const A3_LABEL = fact(
  "The A3 arm — built to disprove our own premise — is the design's strongest credibility signal.",
  `${DEC} D12, rationale`,
);

export const DECISIVE = fact(
  "The decisive criterion is A2 strictly beats A1. A2≈A1 is the RAG verdict; A2≈A3 is the self-assessment verdict and would put the entire verification-first premise in question.",
  `${DEC} D12`,
);

export const RETRIEVER_INVARIANT = fact(
  "A1 and A2 must share the identical retriever, embedder, and top-k; the only legal difference is the write-filter. If their retrievers ever differ, the experiment is void — enforced as a permanent test.",
  `${DEC} D12, consequences`,
);

/* ── Fixtures ─────────────────────────────────────────────────────────── */

export const VAULT = {
  title: "THE HELD-OUT VAULT",
  body: fact(
    "After the primary verdict, a held-out secondary suite runs — extra cases never shown to the model. A patch that games the visible test passes the primary but fails the secondary: the model gap, recorded as secondary_passed=False. The suite is re-materialized from the pristine fixture after the patch is applied, so a candidate patch cannot tamper with the check.",
    `${RM} (M2 held-out secondary suite)`,
  ),
  identity: fact(
    "Unlike flaky, secondary_passed is part of episode identity — inside the content_hash.",
    `${RM} (M2); ${DEC} D21`,
  ),
} as const;

export const FLAKE = {
  title: "THE FLAKE INSTRUMENT",
  body: fact(
    "The primary test runs several times (default 3). If the runs disagree, the measurement is untrustworthy: the episode is flagged flaky=True with a loud log. Flakiness is provenance, not a verdict — and it is excluded from the content_hash, because hashing it would break reproducibility.",
    `${RM} (M2 flake detection); ${DEC} D21`,
  ),
  reading: fact(
    "An instrument that reports its own unreliability instead of hiding it.",
    "VELITH_CREATIVE_DIRECTION.md §7",
  ),
} as const;

/** The ledger's repaired page — reproduced VERBATIM from the record. */
export const LEDGER_D16 = {
  title: "THE LEDGER — OPEN TO THE REPAIRED PAGE",
  verbatim:
    "Provenance note (2026-06-25): D16 above is restored verbatim from commit b8d458e (\u201cdocs: ratify M1 engineering clarifications (D16)\u201d), which originally recorded it. It was inadvertently removed by commit cc4a1b4 (\u201cdocs: finalize M1 implementation contracts\u201d) and was absent from the record until this restoration. No wording was changed.",
  source: `${DEC}, D16 provenance note`,
  reading: fact(
    "Records are never silently lost. When one was, the repair itself became part of the record.",
    "VELITH_CREATIVE_DIRECTION.md §7",
  ),
} as const;

/* ── The Second Verdict (the signature station) ───────────────────────── */

/**
 * The replay record: the M1 fixture episode as the record describes it.
 * Only content fields — volatile timing is excluded, exactly as the
 * verifier's content_hash discipline requires. This object is what gets
 * canonically serialized and SHA-256-hashed in the visitor's browser.
 */
export const REPLAY_RECORD = {
  record: "velith.m1.fixture-episode.replay",
  task: "calc_add_bug",
  seed: 0,
  proposer: "qwen2.5-coder via thin LLM adapter (llm/client.py)",
  execution: "in-container; two-phase; hidden tests under unshare -n (network OFF)",
  environment: "pinned image · PYTHONHASHSEED=0 · TZ=UTC · LC_ALL=C",
  determinism_level: 4,
  flake_reruns: 3,
  verdict: "PASSED",
  note: "content fields only — timestamp, latency_seconds, verify_seconds excluded from hash",
} as const;

export const SECOND_VERDICT = {
  invitation: fact(
    "A replay of the M1 fixture episode — the one the record calls reproducible: given a recorded proposal, the verify→log path yields the same verdict and the same content_hash, every time.",
    `${DEC} D16.1; ${RM}`,
  ),
  method: fact(
    "Verification here re-runs the record's own discipline in your browser: the replay record's content fields are canonically serialized and SHA-256-hashed, volatile timing excluded — the same computation the verifier performs on every episode.",
    `${RM} (record/replay reproducibility)`,
  ),
  stages: [
    "workspace reset to clean baseline",
    "phase 1 — network ON: preparation",
    "phase 2 — network OFF (unshare -n): hidden tests",
    "flake reruns 3/3 — agreement",
    "verdict: PASSED",
  ],
  stagesSource: `${RM} (M1 run, M2 hardening)`,
  groundedLine: fact(
    "Same task, same patch, same environment — same verdict, same hash. This is what grounded means.",
    "VELITH_CREATIVE_DIRECTION.md §8",
  ),
  corollary:
    "Running it a third, fourth, fifth time changes nothing — except the session record, which faithfully logs every press.",
} as const;
