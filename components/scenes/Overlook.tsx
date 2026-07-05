"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { FLOWS, MISSION, PROJECTS, type Fact } from "@/lib/canon";
import { setTarget, useSpotlight } from "@/lib/spotlight";
import type { WorldTargetId } from "@/lib/world";
import { logEvent } from "@/lib/session";
import { EASE } from "@/lib/motion";
import { FactText, Reveal } from "@/components/ui/Reveal";

/**
 * SCENE 1 — THE OVERLOOK (CDD §3).
 *
 * The whole ecosystem in one dark volume: the tower, the laboratory
 * standing apart, the dashed bridge, the solid spine, the rising records.
 * One sentence of type — the mission. Attention names things truthfully:
 * hovering the structure, or focusing a legend chip, lights the element
 * and reveals its designation with its citation. Nothing navigates.
 *
 * The legend chips are the scene's keyboard surface: pointer and focus
 * write the same spotlight, so both operators see the same world respond.
 */

const WorldCanvas = dynamic(() => import("@/components/world/WorldCanvas"), {
  ssr: false,
  loading: () => <div className="absolute inset-0" aria-hidden="true" />,
});

interface Designation {
  id: WorldTargetId;
  chip: string;
  name: string;
  fact: Fact;
}

export default function Overlook() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const reduced = useReducedMotion();
  const target = useSpotlight();

  useEffect(() => {
    if (inView) logEvent("scene", "overlook entered");
  }, [inView]);

  const designations = useMemo<Designation[]>(
    () => [
      ...PROJECTS.map((p) => ({
        id: p.id as WorldTargetId,
        chip: `L${p.layer}`,
        name: p.name,
        fact: p.identity,
      })),
      ...FLOWS.map((f) => ({
        id: f.id as WorldTargetId,
        chip: f.id === "knowledge" ? "⌇" : f.id === "code" ? "—" : "···",
        name: f.name,
        fact: f.statement,
      })),
    ],
    [],
  );

  const active = designations.find((d) => d.id === target) ?? null;

  return (
    <section
      id="overlook"
      ref={ref}
      className="relative h-[100svh] min-h-[640px]"
      aria-label="The Overlook — the ecosystem's structure"
    >
      <WorldCanvas />

      {/* The one sentence in the scene */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 px-4 pt-24 sm:px-8">
        <Reveal temperament="session" className="mx-auto max-w-3xl">
          <p className="microlabel mb-4 text-phosphor">
            THE OVERLOOK — FOUR PROJECTS, ONE OUTCOME
          </p>
          <p className="pointer-events-auto max-w-2xl text-balance text-sm leading-relaxed text-dim sm:text-base">
            <FactText fact={MISSION} />
          </p>
        </Reveal>
      </div>

      {/* Designation panel: what attention has named */}
      <div
        className="absolute bottom-24 left-4 z-10 w-[min(88vw,26rem)] sm:left-8"
        aria-live="polite"
      >
        <motion.div
          initial={false}
          animate={{
            opacity: active ? 1 : 0,
            y: active ? 0 : 8,
          }}
          transition={{ duration: reduced ? 0 : 0.35, ease: [...EASE.session] }}
          className="border-l border-phosphor/60 bg-void/70 py-3 pl-5 pr-4 backdrop-blur-sm"
        >
          {active && (
            <>
              <p className="font-mono text-xs tracking-[0.16em] text-text">
                {active.name}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-dim">
                <FactText fact={active.fact} />
              </p>
            </>
          )}
        </motion.div>
        {!active && (
          <p className="microlabel text-faint">
            ATTEND TO THE STRUCTURE — IT WILL NAME ITSELF
          </p>
        )}
      </div>

      {/* Legend: the keyboard's surface into the world */}
      <nav
        className="absolute bottom-24 right-4 z-10 flex flex-col items-end gap-1.5 sm:right-8"
        aria-label="Structure legend"
      >
        {designations.map((d) => (
          <button
            key={d.id}
            type="button"
            onMouseEnter={() => {
              setTarget(d.id);
              logEvent("discovery", `attended: ${d.name}`);
            }}
            onMouseLeave={() => setTarget(null)}
            onFocus={() => {
              setTarget(d.id);
              logEvent("discovery", `attended: ${d.name}`);
            }}
            onBlur={() => setTarget(null)}
            className={`flex items-center gap-3 px-2 py-1 font-mono text-[10px] tracking-[0.2em] transition-colors duration-300 ${
              target === d.id ? "text-text" : "text-faint hover:text-dim"
            }`}
            aria-pressed={target === d.id}
          >
            <span className="w-6 text-right">{d.chip}</span>
            <span className="uppercase">{d.name}</span>
          </button>
        ))}
      </nav>

      {/* Descent cue */}
      <div
        className="absolute inset-x-0 bottom-10 z-10 flex flex-col items-center gap-2 md:bottom-12"
        aria-hidden="true"
      >
        <span className="microlabel text-faint">DESCEND</span>
        <motion.span
          className="block h-7 w-px bg-gradient-to-b from-phosphor/80 to-transparent"
          animate={reduced ? undefined : { scaleY: [0.3, 1, 0.3] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "top" }}
        />
      </div>
    </section>
  );
}
