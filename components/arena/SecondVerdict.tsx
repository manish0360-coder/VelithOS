"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { REPLAY_RECORD, SECOND_VERDICT } from "@/lib/canon-arena";
import { canonicalSerialize, sha256Hex } from "@/lib/hash";
import { logEvent } from "@/lib/session";
import { EASE } from "@/lib/motion";
import { FactText } from "@/components/ui/Reveal";

/**
 * THE SECOND VERDICT (CDD §8) — the signature interaction.
 *
 * The one operable station in the arena. The visitor runs verification on
 * the replayed M1 fixture episode: the chamber seals, goes network-dark,
 * reruns, returns the recorded verdict — and a REAL SHA-256 is computed
 * in their browser over the replay record's canonical serialization
 * (volatile timing excluded, per the verifier's own hashing discipline).
 *
 * Then the station makes its only request: RUN IT AGAIN. The second hash
 * renders character by character beside the first — identical, 64/64.
 * No fireworks. The quiet line lands: this is what grounded means.
 *
 * Honesty notes, enforced in code:
 *  - the verdict shown is the RECORDED verdict (a replay, not a claim);
 *  - the hash is labeled as computed now, in this browser, over this
 *    replay record — the same computation, which is exactly the point;
 *  - every press is an `operate` event in the visitor's session record
 *    (the corollary discovery: nothing changes except the record).
 *
 * Accessibility: one button drives everything; stages and results are
 * announced politely; reduced motion collapses staging to immediate
 * results with identical content.
 */

const STAGE_MS = 420;
const HASH_CHAR_MS = 12;

interface Run {
  hash: string;
  revealed: number;
}

export default function SecondVerdict() {
  const reduced = useReducedMotion();
  const [runs, setRuns] = useState<Run[]>([]);
  const [stage, setStage] = useState<number>(-1); // -1 idle; 0..n staging
  const [busy, setBusy] = useState(false);
  const runCount = useRef(0);

  const staging = stage >= 0;
  const stages = SECOND_VERDICT.stages;

  const run = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    runCount.current += 1;
    const n = runCount.current;
    logEvent(
      "operate",
      `ran verification — replay of ${REPLAY_RECORD.task} (run ${n})`,
    );

    if (!reduced) {
      for (let i = 0; i < stages.length; i++) {
        setStage(i);
        // Second run onward moves a touch quicker: familiarity, not haste.
        await new Promise((r) => setTimeout(r, n === 1 ? STAGE_MS : STAGE_MS * 0.7));
      }
    }

    const hash = await sha256Hex(canonicalSerialize(REPLAY_RECORD));
    setStage(-1);
    setRuns((prev) => [...prev, { hash, revealed: reduced ? hash.length : 0 }]);
    setBusy(false);

    if (n === 2) logEvent("discovery", "performed: the second verdict");
  }, [busy, reduced, stages.length]);

  // Character-by-character reveal for the newest run.
  useEffect(() => {
    const last = runs[runs.length - 1];
    if (!last || last.revealed >= last.hash.length) return;
    const t = setTimeout(() => {
      setRuns((prev) =>
        prev.map((r, i) =>
          i === prev.length - 1 ? { ...r, revealed: r.revealed + 1 } : r,
        ),
      );
    }, HASH_CHAR_MS);
    return () => clearTimeout(t);
  }, [runs]);

  const complete = runs.filter((r) => r.revealed >= r.hash.length);
  const identical =
    complete.length >= 2 &&
    complete.every((r) => r.hash === complete[0].hash);

  return (
    <div className="plate border border-velith-amber/50 bg-[var(--world-bg)] p-6 sm:p-10">
      <p className="microlabel text-velith-amber">
        THE SECOND VERDICT — THE ONE OPERABLE STATION
      </p>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--world-text)]/75">
        <FactText fact={SECOND_VERDICT.invitation} />
      </p>
      <p className="mt-3 max-w-2xl text-xs leading-relaxed text-[var(--world-text)]/55">
        <FactText fact={SECOND_VERDICT.method} />
      </p>

      {/* The replay record, in plain sight — what gets hashed.
          During phase 2 the chamber's isolation becomes visible: the
          record sits behind the network-dark veil while hidden tests run
          (the real two-phase mechanism, D19/README M2). */}
      <div className="relative">
        {stage === 2 && (
          <div className="network-veil z-10 flex items-center justify-center">
            <span className="microlabel bg-[var(--world-bg)]/80 px-3 py-1 !text-[9px] text-velith-amber">
              NETWORK-DARK — HIDDEN TESTS RUNNING
            </span>
          </div>
        )}
      <dl className="mt-8 grid gap-x-8 gap-y-2 border-y border-[var(--world-line)] py-4 font-mono text-[10px] tracking-wide text-[var(--world-text)]/60 sm:grid-cols-2">
        <div className="flex gap-3"><dt className="text-velith-amber/80">task</dt><dd>{REPLAY_RECORD.task} · seed {REPLAY_RECORD.seed}</dd></div>
        <div className="flex gap-3"><dt className="text-velith-amber/80">proposer</dt><dd>{REPLAY_RECORD.proposer}</dd></div>
        <div className="flex gap-3"><dt className="text-velith-amber/80">execution</dt><dd>{REPLAY_RECORD.execution}</dd></div>
        <div className="flex gap-3"><dt className="text-velith-amber/80">environment</dt><dd>{REPLAY_RECORD.environment}</dd></div>
        <div className="flex gap-3"><dt className="text-velith-amber/80">determinism</dt><dd>Level {REPLAY_RECORD.determinism_level}</dd></div>
        <div className="flex gap-3"><dt className="text-velith-amber/80">hash covers</dt><dd>{REPLAY_RECORD.note}</dd></div>
      </dl>
      </div>

      {/* Chamber status: the two phases, truthfully indicated */}
      <p className="microlabel mt-3 !text-[8.5px] !text-[var(--world-text)]/40" aria-hidden="true">
        CHAMBER NETWORK:{" "}
        <span className={stage === 1 ? "text-velith-amber" : stage === 2 ? "text-faint" : ""}>
          {stage === 1 ? "ON — PREPARATION" : stage === 2 ? "OFF (unshare -n)" : "—"}
        </span>
      </p>

      {/* The button — and, after the first verdict, the request */}
      <div className="mt-8">
        <button
          type="button"
          onClick={run}
          disabled={busy}
          className="op-target group relative border border-velith-amber px-10 py-4 font-mono text-[11px] uppercase tracking-[0.26em] text-velith-amber transition-colors duration-300 hover:bg-velith-amber hover:text-[var(--world-bg)] disabled:opacity-40"
        >
          {busy
            ? "VERIFYING…"
            : runs.length === 0
              ? "RUN VERIFICATION"
              : runs.length === 1
                ? "RUN IT AGAIN"
                : "RUN IT AGAIN — NOTHING WILL CHANGE"}
        </button>
      </div>

      {/* Staging readout */}
      <div className="mt-6 min-h-[6.5rem]" aria-live="polite">
        {staging && (
          <ol className="space-y-1.5 font-mono text-[10px] tracking-[0.1em] text-[var(--world-text)]/60">
            {stages.slice(0, stage + 1).map((s, i) => (
              <motion.li
                key={s}
                initial={reduced ? false : { opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className={i === stage ? "text-velith-amber" : undefined}
              >
                <span className="mr-2 text-[var(--world-text)]/30">&gt;</span>
                {s}
              </motion.li>
            ))}
          </ol>
        )}

        {/* Results: verdict once, hashes stacked */}
        {!staging && runs.length > 0 && (
          <div>
            <p className="font-mono text-[11px] tracking-[0.18em] text-[var(--world-text)]">
              VERDICT:{" "}
              <span className="text-velith-amber">{REPLAY_RECORD.verdict}</span>
              <span className="microlabel ml-3 !text-[8.5px] !text-[var(--world-text)]/35">
                RECORDED — THIS IS A REPLAY
              </span>
            </p>
            <ol className="mt-4 space-y-2">
              {runs.map((r, i) => (
                <li key={i} className="flex flex-wrap items-baseline gap-x-3">
                  <span className="microlabel !text-[8.5px] text-velith-amber/70">
                    RUN {i + 1}
                  </span>
                  <span className="break-all font-mono text-[11px] leading-relaxed tracking-[0.04em] text-[var(--world-text)]/85">
                    {r.hash.slice(0, r.revealed)}
                    {r.revealed < r.hash.length && (
                      <span className="ml-0.5 inline-block h-3 w-[5px] translate-y-0.5 bg-velith-amber/80" />
                    )}
                  </span>
                </li>
              ))}
            </ol>

            {identical && (
              <motion.div
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [...EASE.cycle] }}
                className="mt-6 border-t border-velith-amber/40 pt-5"
              >
                <p className="microlabel !text-[9px] text-velith-amber">
                  IDENTICAL — 64/64 CHARACTERS · {complete.length} RUNS
                </p>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--world-text)]/85">
                  <FactText fact={SECOND_VERDICT.groundedLine} />
                </p>
                {complete.length >= 3 && (
                  <p className="marginalia mt-3 text-xs">
                    {SECOND_VERDICT.corollary}
                  </p>
                )}
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
