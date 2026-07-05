"use client";

import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { FACT_VELITH_M2, OUTCOME, PROJECTS } from "@/lib/canon";
import { MILESTONES } from "@/lib/canon-arena";
import { logEvent } from "@/lib/session";
import { FactText, Reveal } from "@/components/ui/Reveal";
import LoopCircuit from "@/components/arena/LoopCircuit";
import { Rigs, VerdictBoard } from "@/components/arena/Boards";
import { FlakeInstrument, LedgerPage, Vault } from "@/components/arena/Fixtures";
import SecondVerdict from "@/components/arena/SecondVerdict";

/**
 * SCENE 6 — THE ARENA (CDD §3).
 *
 * Warmth, density, rhythm: the `velith` atmosphere and the `cycle`
 * temperament. The first place in the journey where the visitor's hands
 * change the world — the interaction verb is OPERATE, and it is honored
 * exactly once, at the Second Verdict station.
 *
 * Composition follows the room's logic: what was built (M0–M2, absorbing
 * the last interim fact) → the loop at the center → the room's alphabet
 * (verdicts) → the five rigs → the instruments of trust (vault, flake) →
 * the ledger's repaired page → the station → the far wall, where the
 * mission line waits for the ladder (Batch 3).
 */

const ARENA_IDENTITY = PROJECTS.find((p) => p.id === "velith")!;

export default function Arena() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  useEffect(() => {
    if (inView) logEvent("scene", "arena entered");
  }, [inView]);

  return (
    <section
      id="arena"
      ref={ref}
      data-layer="velith"
      className="relative bg-[var(--world-bg)] text-[var(--world-text)]"
      aria-label="Velith — the arena"
    >
      {/* Arrival */}
      <div className="mx-auto max-w-5xl px-4 pt-24 sm:px-8">
        <Reveal temperament="cycle">
          <p className="microlabel mb-5 text-velith-amber">
            L3 — VELITH · THE ARENA
          </p>
          <h2 className="max-w-2xl text-2xl font-medium leading-snug tracking-tight sm:text-3xl">
            <FactText fact={ARENA_IDENTITY.identity} />
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[var(--world-text)]/60">
            <FactText fact={FACT_VELITH_M2} />
          </p>
        </Reveal>

        {/* The milestones: what has actually been built */}
        <ol className="mt-12 grid gap-px border border-[var(--world-line)] bg-[var(--world-line)] md:grid-cols-3">
          {MILESTONES.map((m, i) => (
            <Reveal key={m.id} temperament="cycle" delay={i * 0.06}>
              <li className="h-full bg-[var(--world-bg)] p-5">
                <p className="font-mono text-[10px] tracking-[0.24em] text-velith-amber">
                  {m.id} — COMPLETE
                </p>
                <p className="mt-2 font-mono text-[12px] tracking-[0.04em] text-[var(--world-text)]/90">
                  {m.name}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-[var(--world-text)]/60">
                  <FactText fact={m.proof} />
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>

      {/* The loop at the room's center */}
      <div className="mx-auto max-w-4xl px-4 pt-24 sm:px-8">
        <Reveal temperament="cycle">
          <h3 className="microlabel mb-6 !text-[var(--world-text)]/60">
            THE LOOP — PROPOSE → VERIFY → LOG, AS RUN AT M1/M2
          </h3>
        </Reveal>
        <Reveal temperament="cycle" delay={0.05}>
          <LoopCircuit />
        </Reveal>
      </div>

      {/* The room's alphabet */}
      <div className="mx-auto max-w-5xl px-4 pt-24 sm:px-8">
        <Reveal temperament="cycle">
          <h3 className="microlabel mb-6 !text-[var(--world-text)]/60">
            THE VERDICT LAMP — EXACTLY FIVE STATES, CLOSED BY LAW
          </h3>
        </Reveal>
        <VerdictBoard />
      </div>

      {/* The five rigs */}
      <div className="mx-auto max-w-5xl px-4 pt-24 sm:px-8">
        <Reveal temperament="cycle">
          <h3 className="microlabel mb-6 !text-[var(--world-text)]/60">
            THE FIVE RIGS — IDENTICAL IN EVERY PART EXCEPT ONE
          </h3>
        </Reveal>
        <Rigs />
      </div>

      {/* Instruments of trust */}
      <div className="mx-auto max-w-5xl px-4 pt-24 sm:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          <Vault />
          <FlakeInstrument />
        </div>
      </div>

      {/* The ledger's repaired page */}
      <div className="mx-auto max-w-5xl px-4 pt-20 sm:px-8">
        <LedgerPage />
      </div>

      {/* The station */}
      <div className="mx-auto max-w-4xl px-4 pt-24 sm:px-8">
        <Reveal temperament="cycle">
          <SecondVerdict />
        </Reveal>
      </div>

      {/* The far wall — the mission line waits for the ladder (Batch 3) */}
      <div className="mx-auto max-w-4xl px-4 pb-28 pt-24 text-center sm:px-8">
        <Reveal temperament="cycle">
          <p className="microlabel !text-[var(--world-text)]/45">
            AT THE FAR WALL — A LADDER
          </p>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[var(--world-text)]/60">
            <FactText fact={OUTCOME} />
          </p>
        </Reveal>
      </div>
    </section>
  );
}
