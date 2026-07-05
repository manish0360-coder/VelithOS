"use client";

import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { OUTCOME, STATE_OF_RECORD } from "@/lib/canon";
import { logEvent } from "@/lib/session";
import { FactText, Reveal } from "@/components/ui/Reveal";

/**
 * STATE OF RECORD — interim placement (Phase 2).
 *
 * The frozen-state facts extracted from the superseded Manifest. Their
 * permanent home is inside the layer scenes (the freeze seal in the
 * Platform Hall, Phase 4; the M-milestones in the Arena, Phase 5); until
 * those scenes exist, the record stays visible here rather than
 * regressing out of the experience.
 */
export default function StateOfRecord() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  useEffect(() => {
    if (inView) logEvent("scene", "state of record entered");
  }, [inView]);

  return (
    <section
      ref={ref}
      className="mx-auto max-w-3xl px-4 pb-24 pt-28 sm:px-8"
      aria-label="State of record"
    >
      <Reveal temperament="session">
        <p className="microlabel mb-8 text-phosphor">
          STATE OF RECORD — NOTHING INVENTED
        </p>
      </Reveal>
      <ul className="space-y-6 border-l border-line pl-6">
        {STATE_OF_RECORD.map((f, i) => (
          <Reveal key={f.source + i} temperament="session" delay={i * 0.05}>
            <li className="text-sm leading-relaxed text-dim">
              <FactText fact={f} />
            </li>
          </Reveal>
        ))}
      </ul>
      <Reveal temperament="session" delay={0.1}>
        <p className="mt-10 text-xs leading-relaxed text-faint">
          <FactText fact={OUTCOME} />
        </p>
      </Reveal>
    </section>
  );
}
