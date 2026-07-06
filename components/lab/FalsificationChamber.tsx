"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  DISSECTION,
  DISSECTION_STANDARD,
  DISSECTION_STATUS,
} from "@/lib/canon-lab";
import { logEvent } from "@/lib/session";
import { EASE } from "@/lib/motion";
import { FactText } from "@/components/ui/Reveal";

/**
 * THE FALSIFICATION CHAMBER (CDD Scene 2).
 *
 * The Task-Model hypothesis displayed at the moment of its death — the
 * real 2026-06-27 adversarial review, theorem by theorem. Each step of
 * the dissection moves the ontology diagram itself:
 *
 *   step 0  the declared ontology: R, C, W internal; T beside C; 5 operators
 *   step 1  Theorem 1: T collapses INTO C (a goal-scoped frame, not an object)
 *   step 2  Theorem 2: C shows its nested frames — scoped C is sufficient
 *   step 3  Theorem 3: R sinks below the ground line — it was the ground
 *   step 4  Evaluation (and implicit Retrieval) merge into Inference — 4 remain
 *   step 5  the survivors: C (situation state), K (generalizing structure), R
 *
 * The diagram is presentation (aria-hidden); the caption — a real, cited
 * claim — carries the meaning and is announced politely. The interaction
 * is a stepper: fully keyboard operable, no hover dependency. Reduced
 * motion: positions jump, nothing tweens; parity is total.
 */

interface NodeState {
  x: number;
  y: number;
  w: number;
  label: string;
  sub?: string;
  opacity: number;
  dashed?: boolean;
}

/** Per-step layout of the ontology diagram (viewBox 0 0 560 300). */
function layout(step: number): Record<string, NodeState> {
  const GROUND_Y = 246;
  return {
    C: {
      x: 150,
      y: 96,
      w: 128,
      label: "C",
      sub:
        step >= 5
          ? "situation state"
          : step >= 2
            ? "cognitive state — nested frames"
            : "cognitive state",
      opacity: 1,
    },
    W: {
      x: 340,
      y: 96,
      w: 128,
      label: step >= 5 ? "K" : "W",
      sub: step >= 5 ? "generalizing structure" : "world model",
      opacity: 1,
    },
    T: {
      // Beside C at first; collapses into C's interior at Theorem 1.
      x: step >= 1 ? 166 : 190,
      y: step >= 1 ? 118 : 178,
      w: step >= 1 ? 96 : 110,
      label: "T",
      sub: step >= 1 ? "goal-scoped frame" : "task model",
      opacity: step >= 2 ? 0 : 1,
      dashed: step >= 1,
    },
    R: {
      // An "internal object" at first; re-typed to the ground at Theorem 3.
      x: 60,
      y: step >= 3 ? GROUND_Y + 10 : 96,
      w: step >= 3 ? 440 : 96,
      label: "R",
      sub:
        step >= 3
          ? "reality — the ground (incl. CAD, twins, verifiers)"
          : "reality (as internal object)",
      opacity: 1,
    },
  };
}

const OPERATORS = ["Perception", "Inference", "Evaluation", "Learning", "Execution"];

export default function FalsificationChamber() {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const last = DISSECTION.length - 1;

  const nodes = useMemo(() => layout(step), [step]);
  const spring = { duration: reduced ? 0 : 0.7, ease: [...EASE.inquire] } as const;

  const go = (next: number) => {
    const clamped = Math.max(0, Math.min(last, next));
    setStep(clamped);
    if (clamped === last)
      logEvent("discovery", "witnessed: the task-model falsification");
  };

  return (
    <figure className="plate border border-[var(--world-line)] bg-[var(--world-bg)]/70 p-5 sm:p-8">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-mono text-xs tracking-[0.16em] text-[var(--world-text)]">
          THE FALSIFICATION CHAMBER
        </span>
        <span className="microlabel !text-[9px]">
          ADVERSARIAL REVIEW — 2026-06-27
        </span>
      </figcaption>

      <p className="marginalia mt-3 text-xs leading-relaxed">
        <FactText fact={DISSECTION_STANDARD} />
      </p>

      {/* The diagram */}
      <svg
        viewBox="0 0 560 300"
        className="mt-6 w-full"
        aria-hidden="true"
        role="presentation"
      >
        {/* Ground line appears when R is re-typed */}
        <motion.line
          x1="30"
          x2="530"
          y1="246"
          y2="246"
          stroke="var(--color-lab-bone)"
          strokeWidth="1"
          initial={false}
          animate={{ opacity: step >= 3 ? 0.5 : 0 }}
          transition={spring}
        />
        <motion.text
          x="30"
          y="238"
          className="fill-[var(--world-text)]"
          fontSize="9"
          initial={false}
          animate={{ opacity: step >= 3 ? 0.5 : 0 }}
          transition={spring}
        >
          THE GROUND
        </motion.text>

        {Object.entries(nodes).map(([key, n]) => (
          <motion.g
            key={key}
            initial={false}
            animate={{ x: n.x, y: n.y, opacity: n.opacity }}
            transition={spring}
          >
            <rect
              width={n.w}
              height="52"
              fill="var(--world-bg)"
              stroke={key === "T" ? "var(--color-faint)" : "var(--color-lab-stain)"}
              strokeOpacity={key === "T" ? 0.9 : 0.65}
              strokeDasharray={n.dashed ? "4 4" : undefined}
            />
            <text
              x="12"
              y="22"
              fontSize="15"
              className="fill-[var(--world-text)]"
              fontFamily="var(--font-mono)"
            >
              {n.label}
            </text>
            {n.sub && (
              <text
                x="12"
                y="40"
                fontSize="8.5"
                className="fill-[var(--world-text)]"
                opacity="0.6"
                fontFamily="var(--font-mono)"
              >
                {n.sub}
              </text>
            )}
            {/* Nested frames inside C at Theorem 2 */}
            {key === "C" && step >= 2 && step < 5 && (
              <>
                <rect x="10" y="26" width={n.w - 20} height="18" fill="none"
                  stroke="var(--color-lab-bone)" strokeOpacity="0.35" strokeDasharray="3 3" />
                <rect x="16" y="30" width={n.w - 32} height="10" fill="none"
                  stroke="var(--color-lab-bone)" strokeOpacity="0.25" strokeDasharray="3 3" />
              </>
            )}
          </motion.g>
        ))}

        {/* Operator chips */}
        {OPERATORS.map((op, i) => {
          const mergedAway = op === "Evaluation" && step >= 4;
          const x = mergedAway ? 118 : 36 + i * 100;
          return (
            <motion.g
              key={op}
              initial={false}
              animate={{ x, y: 196, opacity: mergedAway ? 0 : 1 }}
              transition={spring}
            >
              <rect width="88" height="20" fill="none"
                stroke="var(--color-lab-bone)" strokeOpacity="0.3" />
              <text x="8" y="13.5" fontSize="8.5"
                className="fill-[var(--world-text)]" opacity="0.75"
                fontFamily="var(--font-mono)">
                {op === "Inference" && step >= 4 ? "Inference (typed)" : op}
              </text>
            </motion.g>
          );
        })}
      </svg>

      {/* Caption: the real claim for this step */}
      <div className="mt-5 min-h-[7.5rem] border-t border-[var(--world-line)] pt-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-lab-stain">
          {step + 1} / {DISSECTION.length} — {DISSECTION[step].title}
        </p>
        <p aria-live="polite" className="mt-3 text-sm leading-relaxed text-[var(--world-text)]/75">
          <FactText fact={DISSECTION[step].caption} />
        </p>
      </div>

      {/* Stepper */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => go(step - 1)}
            disabled={step === 0}
            className="border border-[var(--world-line)] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--world-text)]/70 transition-colors hover:border-lab-stain/60 disabled:opacity-30"
          >
            ← Prior
          </button>
          <button
            type="button"
            onClick={() => go(step + 1)}
            disabled={step === last}
            className="border border-lab-stain/60 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-lab-stain transition-colors hover:bg-lab-stain hover:text-[var(--world-bg)] disabled:opacity-30"
          >
            Next theorem →
          </button>
        </div>
        <p className="marginalia hidden text-right text-[10px] sm:block">
          <FactText fact={DISSECTION_STATUS} />
        </p>
      </div>
    </figure>
  );
}
