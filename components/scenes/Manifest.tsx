"use client";

import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import {
  FLOWS,
  MISSION,
  OUTCOME,
  PROJECTS,
  STATE_OF_RECORD,
  type LayerId,
} from "@/lib/canon";
import { logEvent } from "@/lib/session";
import { FactText, Reveal } from "@/components/ui/Reveal";

/**
 * THE MANIFEST — Phase-1 interim form of Scene 1 (The Overlook).
 *
 * Until the world structure exists (Phase 2), the ecosystem is presented
 * as an honest typographic index: the mission, the four projects (each row
 * already speaking in its layer's accent — the atmospheres foreshadowed),
 * the three flows in their three grammars (dashed / solid / dotted-rising,
 * CDD Principle 3), and the state of record. Every line is a canon Fact;
 * attention reveals its citation.
 *
 * Phase-2 note: the project rows become the tower and the laboratory;
 * this component's content mapping transfers, its layout is superseded.
 */

const LAYER_ACCENT: Record<LayerId, string> = {
  miniflywire: "text-lab-stain",
  noetica: "text-platform-steel",
  velith: "text-velith-amber",
  prometheus: "text-dawn",
};

export default function Manifest() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  useEffect(() => {
    if (inView) logEvent("scene", "manifest entered");
  }, [inView]);

  return (
    <section
      id="manifest"
      ref={ref}
      className="mx-auto max-w-3xl px-4 pb-28 pt-40 sm:px-8"
      aria-label="The ecosystem"
    >
      {/* Mission */}
      <Reveal temperament="session">
        <p className="microlabel mb-6 text-phosphor">THE ECOSYSTEM — INDEX</p>
        <h1 className="text-balance text-xl font-medium leading-relaxed tracking-tight text-text sm:text-2xl">
          <FactText fact={MISSION} />
        </h1>
      </Reveal>

      {/* The four projects */}
      <ol className="mt-20 border-t border-line" aria-label="The four projects">
        {PROJECTS.map((p, i) => (
          <Reveal key={p.id} temperament="session" delay={i * 0.06}>
            <li
              data-layer={p.id}
              className="grid grid-cols-[3.5rem_1fr] gap-x-4 border-b border-line py-7 sm:grid-cols-[5rem_11rem_1fr]"
            >
              <span
                className={`font-mono text-[11px] tracking-[0.3em] ${LAYER_ACCENT[p.id]}`}
              >
                L{p.layer}
              </span>
              <h2 className="font-mono text-sm tracking-[0.12em] text-text">
                {p.name}
              </h2>
              <p className="col-span-2 mt-3 text-sm leading-relaxed text-dim sm:col-span-1 sm:mt-0">
                <FactText fact={p.identity} />
              </p>
            </li>
          </Reveal>
        ))}
      </ol>

      <Reveal temperament="session" delay={0.1}>
        <p className="mt-6 text-xs leading-relaxed text-faint">
          <FactText fact={OUTCOME} />
        </p>
      </Reveal>

      {/* The three flows — three grammars */}
      <div className="mt-24" aria-label="The three flows">
        <Reveal temperament="session">
          <p className="microlabel mb-8 text-phosphor">
            THE THREE FLOWS — THE ONLY LEGAL MOVEMENTS
          </p>
        </Reveal>
        <ul className="space-y-9">
          {FLOWS.map((flow, i) => (
            <Reveal key={flow.id} temperament="session" delay={i * 0.07}>
              <li className="grid grid-cols-[3.5rem_1fr] items-baseline gap-x-4 sm:grid-cols-[5rem_11rem_1fr]">
                <span
                  className="flow-rule translate-y-[-0.2em]"
                  data-flow={flow.id}
                  aria-hidden="true"
                />
                <h3 className="font-mono text-xs tracking-[0.14em] text-text">
                  {flow.name}
                </h3>
                <p className="col-span-2 mt-2 text-sm leading-relaxed text-dim sm:col-span-1 sm:mt-0">
                  <FactText fact={flow.statement} />
                </p>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>

      {/* State of record */}
      <div className="mt-24" aria-label="State of record">
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
      </div>
    </section>
  );
}
