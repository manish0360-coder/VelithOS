"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BAYS, BAY_SOURCE, GATED_BAYS, GATE_REVIEW, type Bay } from "@/lib/canon-platform";
import { logEvent } from "@/lib/session";
import { surfaceLight } from "@/lib/inputs";
import { EASE } from "@/lib/motion";
import { FactText, Reveal } from "@/components/ui/Reveal";

/**
 * THE BAY GRID (CDD Scene 4).
 *
 * Twenty-one bays in exact rhythm, ordered by dependency depth — the
 * order is the information (PE-1 was built first because everything
 * stands on it). The interaction verb is INSPECT THE CONTRACT: attention
 * on a bay reveals its interface and its Constitution reference, never
 * its internals. Selection is click/enter (not hover-dependent), so the
 * inspection panel is stable for reading and reachable by keyboard.
 *
 * The five gated bays stand dark at the end of the hall, each naming its
 * real gate. They render unlit by design: deferral is law, not neglect.
 *
 * Motion is the `execute` temperament: no rise, no blur, no overshoot —
 * arrival as fact.
 */

export default function BayGrid() {
  const reduced = useReducedMotion();
  const [inspected, setInspected] = useState<number>(2); // the substrate, by default

  const bay = BAYS.find((b) => b.pe === inspected) ?? BAYS[1];

  const inspect = (b: Bay) => {
    setInspected(b.pe);
    logEvent("discovery", `inspected: PE-${b.pe} ${b.subsystem}`);
  };

  return (
    <div>
      {/* The grid */}
      <ol
        className="grid grid-cols-2 gap-px border border-[var(--world-line)] bg-[var(--world-line)] sm:grid-cols-4 lg:grid-cols-7"
        aria-label="The twenty-one platform bays, in dependency order"
      >
        {BAYS.map((b, i) => (
          <Reveal key={b.pe} temperament="execute" delay={Math.floor(i / 7) * 0.06}>
            <li className="h-full">
              <button
                type="button"
                onClick={() => inspect(b)}
                onPointerMove={surfaceLight}
                aria-pressed={inspected === b.pe}
                className={`lit op-target flex h-full w-full flex-col justify-between gap-4 p-3.5 text-left transition-colors duration-200 sm:p-4 ${
                  inspected === b.pe
                    ? "bg-platform-steel/15"
                    : "bg-[var(--world-bg)] hover:bg-platform-steel/[0.06]"
                } ${b.sealed ? "outline outline-1 -outline-offset-4 outline-platform-steel/40" : ""}`}
              >
                <span className="font-mono text-[9px] tracking-[0.24em] text-platform-steel">
                  PE-{String(b.pe).padStart(2, "0")}
                  {b.sealed && <span className="ml-2 text-[var(--world-text)]/50">■ SEALED</span>}
                </span>
                <span className="font-mono text-[11px] tracking-[0.08em] text-[var(--world-text)]/90">
                  {b.subsystem}
                </span>
              </button>
            </li>
          </Reveal>
        ))}
      </ol>

      {/* The inspection panel — the contract, never the internals */}
      <div
        className="plate mt-px min-h-[7.5rem] border border-[var(--world-line)] bg-[var(--world-bg)] p-5 sm:p-6"
        aria-live="polite"
      >
        <motion.div
          key={bay.pe}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: [...EASE.execute] }}
          className="flex items-start gap-5"
        >
          <BayLocator pe={bay.pe} />
          <div>
          <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="font-mono text-xs tracking-[0.2em] text-platform-steel">
              PE-{String(bay.pe).padStart(2, "0")} · {bay.subsystem}
            </span>
            <span className="microlabel !text-[9px]">{bay.ref}</span>
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--world-text)]/75">
            <FactText fact={{ text: bay.contract, source: BAY_SOURCE }} />
          </p>
          <p className="microlabel mt-4 !text-[9px] text-[var(--world-text)]/35">
            INSPECT THE CONTRACT — INTERFACES ONLY, NEVER INTERNALS
          </p>
          </div>
        </motion.div>
      </div>

      {/* The five dark bays */}
      <div className="mt-14">
        <Reveal temperament="execute">
          <h3 className="microlabel mb-4 !text-[var(--world-text)]/55">
            FIVE DARK BAYS — GATED BY LAW, EACH NAMING ITS GATE
          </h3>
        </Reveal>
        <ol className="grid gap-px border border-[var(--world-line)] bg-[var(--world-line)] sm:grid-cols-5">
          {GATED_BAYS.map((g, i) => (
            <Reveal key={g.id} temperament="execute" delay={i * 0.05}>
              <li className="flex h-full flex-col gap-3 bg-void/80 p-4">
                <span className="font-mono text-[9px] tracking-[0.24em] text-faint">
                  {g.id} — UNLIT
                </span>
                <span className="font-mono text-[11px] leading-snug tracking-[0.06em] text-[var(--world-text)]/55">
                  {g.name}
                </span>
                <span className="mt-auto text-[11px] italic leading-snug text-[var(--world-text)]/40">
                  gate: {g.gate}
                </span>
              </li>
            </Reveal>
          ))}
        </ol>
        <Reveal temperament="execute" delay={0.1}>
          <p className="mt-4 max-w-3xl text-xs leading-relaxed text-[var(--world-text)]/55">
            <FactText fact={GATE_REVIEW} />
          </p>
        </Reveal>
      </div>
    </div>
  );
}

/**
 * BAY LOCATOR — a projection of the inspected bay's real position in the
 * dependency order. The 3×7 grid IS the hall; the lit cell is this bay;
 * the faint cells beneath it are everything it stands on (built first).
 * Drawn from the same BAYS order the grid renders — data, not an icon.
 */
function BayLocator({ pe }: { pe: number }) {
  return (
    <figure aria-hidden="true" className="hidden shrink-0 sm:block">
      <div className="grid grid-cols-7 gap-[3px]">
        {BAYS.map((b) => (
          <span
            key={b.pe}
            className={`h-2.5 w-2.5 border ${
              b.pe === pe
                ? "border-platform-steel bg-platform-steel/70"
                : b.pe < pe
                  ? "border-platform-steel/35 bg-platform-steel/15"
                  : "border-[var(--world-line)]"
            }`}
          />
        ))}
      </div>
      <figcaption className="microlabel mt-2 !text-[7px] !text-[var(--world-text)]/35">
        DEPTH — WHAT IT STANDS ON
      </figcaption>
    </figure>
  );
}
