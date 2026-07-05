"use client";

import { useState } from "react";
import {
  A3_LABEL,
  ARMS,
  ARMS_SOURCE,
  DECISIVE,
  RETRIEVER_INVARIANT,
  VERDICTS,
  VERDICT_PLAQUE,
  VERDICT_SOURCE,
} from "@/lib/canon-arena";
import { logEvent } from "@/lib/session";
import { FactText, Reveal } from "@/components/ui/Reveal";

/**
 * VerdictBoard — the room's alphabet: exactly five states, closed by law.
 * FAILED is lit as warmly as PASSED (a grounded outcome is a grounded
 * outcome); INFRA_ERROR stands apart as the only error, cold and unlit.
 *
 * Rigs — the five experiment arms as five identical silhouettes that
 * differ in exactly one part: the write-filter, which is therefore the
 * only spot-lit component on each. A3 carries the record's own label:
 * built to disprove our own premise.
 */

export function VerdictBoard() {
  return (
    <div>
      <ol className="grid gap-px border border-[var(--world-line)] bg-[var(--world-line)] sm:grid-cols-5">
        {VERDICTS.map((v, i) => (
          <Reveal key={v.name} temperament="cycle" delay={i * 0.05}>
            <li
              className={`flex h-full flex-col gap-3 p-4 ${
                v.kind === "grounded" ? "bg-[var(--world-bg)]" : "bg-void/70"
              }`}
            >
              <span className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className={`h-2 w-2 rounded-full ${
                    v.kind === "grounded"
                      ? "bg-velith-amber shadow-[0_0_10px_rgba(226,162,76,0.6)]"
                      : "bg-faint"
                  }`}
                />
                <span
                  className={`font-mono text-[10px] tracking-[0.14em] ${
                    v.kind === "grounded"
                      ? "text-[var(--world-text)]"
                      : "text-[var(--world-text)]/45"
                  }`}
                >
                  {v.name}
                </span>
              </span>
              <span className="text-[11px] leading-snug text-[var(--world-text)]/55">
                {v.meaning}
              </span>
              <span className="microlabel mt-auto !text-[8px] !text-[var(--world-text)]/30">
                {v.kind === "grounded" ? "GROUNDED OUTCOME · EXIT 0" : "THE ONLY ERROR · EXIT ≠ 0"}
              </span>
            </li>
          </Reveal>
        ))}
      </ol>
      <Reveal temperament="cycle" delay={0.1}>
        <p className="mt-4 max-w-2xl text-xs leading-relaxed text-[var(--world-text)]/60">
          <FactText fact={VERDICT_PLAQUE} />{" "}
          <span className="fact-source-inline microlabel !text-[8.5px] !normal-case !tracking-normal !text-[var(--world-text)]/30">
            ({VERDICT_SOURCE})
          </span>
        </p>
      </Reveal>
    </div>
  );
}

export function Rigs() {
  const [lit, setLit] = useState<string | null>(null);

  return (
    <div>
      <ol className="grid grid-cols-2 gap-3 sm:grid-cols-5" aria-label="The five experiment arms">
        {ARMS.map((arm, i) => {
          const active = lit === arm.id;
          return (
            <Reveal key={arm.id} temperament="cycle" delay={i * 0.05}>
              <li className="h-full">
                <button
                  type="button"
                  onClick={() => {
                    setLit((c) => (c === arm.id ? null : arm.id));
                    logEvent("discovery", `examined rig: ${arm.id} — ${arm.name}`);
                  }}
                  aria-pressed={active}
                  className="flex h-full w-full flex-col border border-[var(--world-line)] bg-[var(--world-bg)] p-4 text-left transition-colors hover:border-velith-amber/40"
                >
                  {/* Identical silhouette: frame, retriever, memory, loop mount */}
                  <span className="font-mono text-[10px] tracking-[0.24em] text-velith-amber">
                    {arm.id}
                  </span>
                  <span className="mt-2 font-mono text-[11px] leading-snug tracking-[0.04em] text-[var(--world-text)]/85">
                    {arm.name}
                  </span>
                  <span aria-hidden="true" className="mt-4 space-y-1.5">
                    <span className="block h-px w-full bg-[var(--world-line)]" />
                    <span className="block h-px w-full bg-[var(--world-line)]" />
                    {/* The one different part: the write-filter, spot-lit */}
                    <span
                      className={`block h-[3px] w-full transition-all duration-300 ${
                        active
                          ? "bg-velith-amber shadow-[0_0_12px_rgba(226,162,76,0.7)]"
                          : "bg-velith-amber/45"
                      }`}
                    />
                    <span className="block h-px w-full bg-[var(--world-line)]" />
                  </span>
                  <span className="microlabel mt-2 !text-[8px] !text-velith-amber/70">
                    WRITE-FILTER — THE ONLY DIFFERENT PART
                  </span>
                  <span
                    className={`mt-3 text-[11px] italic leading-snug text-[var(--world-text)]/55 transition-opacity duration-300 ${
                      active ? "opacity-100" : "opacity-0 sm:opacity-0"
                    }`}
                  >
                    {arm.filter}
                  </span>
                </button>
              </li>
            </Reveal>
          );
        })}
      </ol>

      {/* Selected rig's filter for small screens / persistent reading */}
      <div className="mt-3 min-h-[2.5rem]" aria-live="polite">
        {lit && (
          <p className="text-sm leading-relaxed text-[var(--world-text)]/70">
            <span className="font-mono text-xs text-velith-amber">{lit}</span>{" "}
            —{" "}
            <FactText
              fact={{
                text: ARMS.find((a) => a.id === lit)!.filter,
                source: ARMS_SOURCE,
              }}
            />
          </p>
        )}
      </div>

      <Reveal temperament="cycle" delay={0.08}>
        <div className="mt-6 space-y-3 border-l border-velith-amber/40 pl-5">
          <p className="text-xs leading-relaxed text-[var(--world-text)]/65">
            <FactText fact={A3_LABEL} />
          </p>
          <p className="text-xs leading-relaxed text-[var(--world-text)]/65">
            <FactText fact={DECISIVE} />
          </p>
          <p className="text-xs leading-relaxed text-[var(--world-text)]/50">
            <FactText fact={RETRIEVER_INVARIANT} />
          </p>
        </div>
      </Reveal>
    </div>
  );
}
