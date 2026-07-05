"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ANTI_PATTERN,
  GATE_CRITERIA,
  GATE_RULE,
  REJECTED_EPIGRAPH,
  REJECTIONS,
} from "@/lib/canon-lab";
import { logEvent } from "@/lib/session";
import { EASE } from "@/lib/motion";
import { FactText, Reveal } from "@/components/ui/Reveal";

/**
 * Three laboratory fixtures (CDD Scene 2):
 *
 * RejectedWall — the alcove of preserved rejections, lit with dignity.
 *   Rejections are evidence; each idea keeps the reason for its death.
 *
 * SealedExhibit — LLM-as-judge under glass: a studied negative result,
 *   permanently barred from promotion. A discovery, not a headline.
 *
 * PromotionGate — the seven conjunctive criteria as gate bars at the
 *   laboratory's exit. Attention lights each bar; the rule is stated
 *   plainly: fail any one, return to the notebook.
 */

export function RejectedWall() {
  return (
    <div>
      <p className="marginalia max-w-md text-xs leading-relaxed">
        <FactText fact={REJECTED_EPIGRAPH} />
      </p>
      <ul className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2">
        {REJECTIONS.map((r, i) => (
          <Reveal key={r.id} temperament="inquire" delay={(i % 2) * 0.05}>
            <li className="border-l border-[var(--world-line)] pl-4">
              <p className="flex items-baseline gap-3">
                <span className="font-mono text-[10px] tracking-[0.24em] text-[var(--world-text)]/40">
                  {r.id}
                </span>
                <span className="text-sm leading-snug text-[var(--world-text)]/80 line-through decoration-[var(--world-text)]/25 decoration-1">
                  {r.idea}
                </span>
              </p>
              <p className="mt-2 text-xs leading-relaxed text-lab-stain/90">
                <FactText fact={r.verdict} />
              </p>
            </li>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}

export function SealedExhibit() {
  const [seen, setSeen] = useState(false);
  return (
    <Reveal temperament="inquire">
      <div
        className="glass-seal relative mx-auto max-w-md border border-[var(--world-line)] bg-[var(--world-bg)]/80 p-6 text-center"
        onMouseEnter={() => {
          if (!seen) {
            setSeen(true);
            logEvent("discovery", "found: the sealed anti-pattern exhibit");
          }
        }}
        onFocus={() => {
          if (!seen) {
            setSeen(true);
            logEvent("discovery", "found: the sealed anti-pattern exhibit");
          }
        }}
        tabIndex={0}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--world-text)]/45">
          Sealed exhibit — do not promote
        </p>
        <p className="mt-4 font-mono text-lg tracking-[0.1em] text-[var(--world-text)]/85">
          {ANTI_PATTERN.name}
        </p>
        <p className="mt-4 text-xs leading-relaxed text-[var(--world-text)]/60">
          <FactText fact={ANTI_PATTERN.placard} />
        </p>
      </div>
    </Reveal>
  );
}

export function PromotionGate() {
  const reduced = useReducedMotion();
  const [lit, setLit] = useState<number | null>(null);

  return (
    <div>
      <ol className="border-t border-[var(--world-line)]">
        {GATE_CRITERIA.map((c, i) => (
          <Reveal key={c.name} temperament="inquire" delay={i * 0.04}>
            <li
              className="group border-b border-[var(--world-line)]"
              onMouseEnter={() => setLit(i)}
              onMouseLeave={() => setLit(null)}
            >
              <button
                type="button"
                onFocus={() => setLit(i)}
                onBlur={() => setLit(null)}
                onClick={() => setLit((cur) => (cur === i ? null : i))}
                aria-expanded={lit === i}
                className="grid w-full grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 py-4 text-left"
              >
                <span className="font-mono text-[10px] tracking-[0.24em] text-lab-stain">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-mono text-sm tracking-[0.06em] text-[var(--world-text)]">
                  {c.name}
                </span>
                {/* The gate bar: solid when this criterion holds attention */}
                <motion.span
                  aria-hidden="true"
                  className="hidden h-px w-16 origin-right bg-lab-stain sm:block"
                  initial={false}
                  animate={{ scaleX: lit === i ? 1 : 0.25, opacity: lit === i ? 1 : 0.35 }}
                  transition={{ duration: reduced ? 0 : 0.4, ease: [...EASE.inquire] }}
                />
              </button>
              <motion.div
                initial={false}
                animate={{ height: lit === i ? "auto" : 0, opacity: lit === i ? 1 : 0 }}
                transition={{ duration: reduced ? 0 : 0.45, ease: [...EASE.inquire] }}
                className="overflow-hidden"
              >
                <p className="max-w-2xl pb-5 pl-[3.5rem] text-sm leading-relaxed text-[var(--world-text)]/70">
                  <FactText fact={c.test} />
                </p>
              </motion.div>
            </li>
          </Reveal>
        ))}
      </ol>
      <Reveal temperament="inquire" delay={0.1}>
        <p className="mt-6 max-w-2xl text-xs leading-relaxed text-[var(--world-text)]/55">
          <FactText fact={GATE_RULE} />
        </p>
      </Reveal>
    </div>
  );
}
