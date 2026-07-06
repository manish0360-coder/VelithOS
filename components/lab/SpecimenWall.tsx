"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SPECIMENS, type Specimen, type SpecimenStatus } from "@/lib/canon-lab";
import { logEvent } from "@/lib/session";
import { surfaceLight } from "@/lib/inputs";
import { EASE } from "@/lib/motion";
import { FactText, Reveal } from "@/components/ui/Reveal";

/**
 * THE SPECIMEN WALL (CDD Scene 2).
 *
 * Real hypotheses from the laboratory notebook, each with its true status.
 * The interaction verb is EXAMINE: attention opens a specimen's dossier —
 * the claim, the falsification note where one exists, the citation.
 * Status lamps are truthful state, not decoration: only hypotheses whose
 * status is genuinely in motion (under review, under falsification)
 * breathe; settled statuses hold steady.
 */

const LAMP: Record<SpecimenStatus, { className: string; live: boolean }> = {
  "FROZEN — REVISION UNDER REVIEW": { className: "bg-platform-steel", live: true },
  WORKING: { className: "bg-lab-stain", live: false },
  "FALSIFIED AS PRIMITIVE": { className: "bg-faint", live: false },
  "PARTIALLY FALSIFIED — REVISED": { className: "bg-lab-stain", live: false },
  "OPEN QUESTION": { className: "bg-lab-bone", live: true },
};

export default function SpecimenWall() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {SPECIMENS.map((s, i) => (
          <Reveal key={s.id} temperament="inquire" delay={(i % 2) * 0.06}>
            <SpecimenCard
              specimen={s}
              open={open === s.id}
              onToggle={() =>
                setOpen((cur) => {
                  const next = cur === s.id ? null : s.id;
                  if (next) logEvent("discovery", `examined: ${s.id} — ${s.name}`);
                  return next;
                })
              }
            />
          </Reveal>
        ))}
      </ul>
    </div>
  );
}

function SpecimenCard({
  specimen: s,
  open,
  onToggle,
}: {
  specimen: Specimen;
  open: boolean;
  onToggle: () => void;
}) {
  const reduced = useReducedMotion();
  const lamp = LAMP[s.status];

  return (
    <li className="h-full">
      <button
        type="button"
        onClick={onToggle}
        onPointerMove={surfaceLight}
        aria-expanded={open}
        className="lit op-target plate h-full w-full border border-[var(--world-line)] bg-[var(--world-bg)]/60 p-5 text-left transition-colors duration-300 hover:border-lab-stain/50 sm:p-6"
      >
        <div className="flex items-baseline justify-between gap-3">
          <span className="font-mono text-[11px] tracking-[0.28em] text-lab-stain">
            {s.id}
          </span>
          <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--world-text)]/60">
            <motion.span
              className={`h-1.5 w-1.5 rounded-full ${lamp.className}`}
              animate={
                lamp.live && !reduced ? { opacity: [1, 0.3, 1] } : undefined
              }
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            />
            {s.status}
          </span>
        </div>
        <h3 className="mt-4 font-mono text-sm tracking-[0.06em] text-[var(--world-text)]">
          {s.name}
        </h3>
        <motion.div
          initial={false}
          animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
          transition={{ duration: reduced ? 0 : 0.5, ease: [...EASE.inquire] }}
          className="overflow-hidden"
        >
          <p className="pt-4 text-sm leading-relaxed text-[var(--world-text)]/70">
            <FactText fact={s.claim} />
          </p>
          {s.note && (
            <p className="marginalia mt-4 border-l border-lab-stain/40 pl-4 text-xs leading-relaxed">
              <FactText fact={s.note} />
            </p>
          )}
        </motion.div>
        <p className="microlabel mt-4 !text-[9px] text-[var(--world-text)]/35">
          {open ? "CLOSE SPECIMEN" : "EXAMINE"}
        </p>
      </button>
    </li>
  );
}
