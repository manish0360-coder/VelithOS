"use client";

import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { GATE_CLOSED } from "@/lib/canon-horizon";
import { PROJECTS } from "@/lib/canon";
import { logEvent } from "@/lib/session";
import { FactText, Reveal } from "@/components/ui/Reveal";
import LadderWall from "@/components/horizon/LadderWall";
import HorizonRide from "@/components/horizon/HorizonRide";

/**
 * SCENE 7 — THE LADDER AND THE HORIZON (CDD §3).
 *
 * The `prometheus` atmosphere and the `breathe` temperament: near-
 * stillness, sparse type, a few words in a large volume. Order is the
 * scene's argument: first the ladder (how this floor is reached), then
 * the gate that is closed and says why, then the floor itself — and,
 * without a cut, the upward gaze of the Return.
 */

const PROMETHEUS_IDENTITY = PROJECTS.find((p) => p.id === "prometheus")!;

export default function Horizon() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  useEffect(() => {
    if (inView) logEvent("scene", "horizon entered");
  }, [inView]);

  return (
    <section
      id="horizon"
      ref={ref}
      data-layer="prometheus"
      className="relative bg-[var(--world-bg)] text-[var(--world-text)]"
      aria-label="Mini Prometheus — the horizon"
    >
      {/* The ladder at the arena's far wall */}
      <div className="mx-auto max-w-4xl px-4 pt-24 sm:px-8">
        <Reveal temperament="breathe">
          <p className="microlabel mb-6 text-dawn">
            THE MIGRATION LADDER — PRE-COMMITTED
          </p>
        </Reveal>
        <LadderWall />
      </div>

      {/* The gate: closed, and it says why */}
      <div className="mx-auto max-w-4xl px-4 pt-24 sm:px-8">
        <Reveal temperament="breathe">
          <div className="plate border border-[var(--world-line)] p-6 text-center sm:p-8">
            <p className="microlabel !text-[var(--world-text)]/50">
              THE GATE TO THE FOUNDATION —{" "}
              <span className="text-dawn">CLOSED</span>
            </p>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[var(--world-text)]/65">
              <FactText fact={GATE_CLOSED} />
            </p>
          </div>
        </Reveal>
      </div>

      {/* Arrival at the floor */}
      <div className="mx-auto max-w-4xl px-4 pb-14 pt-24 sm:px-8">
        <Reveal temperament="breathe">
          <p className="microlabel mb-5 text-dawn">
            L4 — MINI PROMETHEUS · THE PRE-DAWN FLOOR
          </p>
          <h2 className="max-w-2xl text-2xl font-medium leading-snug tracking-tight sm:text-3xl">
            <FactText fact={PROMETHEUS_IDENTITY.identity} />
          </h2>
        </Reveal>
      </div>

      {/* The ride: the floor, then the upward gaze */}
      <HorizonRide />
    </section>
  );
}
