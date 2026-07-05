"use client";

import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { PROJECTS } from "@/lib/canon";
import { logEvent } from "@/lib/session";
import { FactText, Reveal } from "@/components/ui/Reveal";
import BayGrid from "@/components/platform/BayGrid";
import {
  CiPlaque,
  FreezeSeal,
  ReferenceWing,
  RegistryCase,
} from "@/components/platform/Fixtures";

/**
 * SCENE 4 — THE PLATFORM HALL (CDD §3).
 *
 * The opposite of the laboratory in every register: even, shadowless
 * light (the only layer with no darkness); the `execute` temperament
 * (arrival as fact, no overshoot); strict grid rhythm; every visible
 * word a contract term. The floor is literally the state substrate —
 * the bays are mounted on it, and the grid says so.
 *
 * Composition order is the hall's own logic: identity → the seal (what
 * is certified) → the substrate and its 21 bays (what exists) → the
 * honest fixtures (what does not: the empty registry; what may never be
 * touched: the reference wing) → the machinery of the boundaries.
 */

const PLATFORM_IDENTITY = PROJECTS.find((p) => p.id === "noetica")!;

export default function PlatformHall() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  useEffect(() => {
    if (inView) logEvent("scene", "platform hall entered");
  }, [inView]);

  return (
    <section
      id="platform"
      ref={ref}
      data-layer="noetica"
      className="relative border-t border-[var(--world-line)] bg-[var(--world-bg)] text-[var(--world-text)]"
      aria-label="Noetica — the platform hall"
    >
      {/* Arrival: the re-implemented side of the Crossing */}
      <div className="mx-auto max-w-5xl px-4 pt-24 sm:px-8">
        <Reveal temperament="execute">
          <p className="microlabel mb-5 text-platform-steel">
            L2 — NOETICA · THE PLATFORM HALL
          </p>
          <h2 className="max-w-2xl text-2xl font-medium leading-snug tracking-tight sm:text-3xl">
            <FactText fact={PLATFORM_IDENTITY.identity} />
          </h2>
        </Reveal>
      </div>

      {/* The seal */}
      <div className="mx-auto max-w-5xl px-4 pt-16 sm:px-8">
        <FreezeSeal />
      </div>

      {/* The substrate and its bays */}
      <div className="mx-auto max-w-5xl px-4 pt-24 sm:px-8">
        <Reveal temperament="execute">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="microlabel !text-[var(--world-text)]/60">
              TWENTY-ONE BAYS — DEPENDENCY-DEPTH ORDER
            </h3>
            <p className="microlabel !text-[9px] !text-[var(--world-text)]/40">
              THE FLOOR IS THE STATE SUBSTRATE (§6.1 / PE-02) — EVERY BAY IS MOUNTED ON IT
            </p>
          </div>
        </Reveal>
        <div className="substrate-floor mt-4 p-3 sm:p-5">
          <BayGrid />
        </div>
      </div>

      {/* The honest fixtures */}
      <div className="mx-auto max-w-5xl px-4 pt-20 sm:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          <RegistryCase />
          <ReferenceWing />
        </div>
      </div>

      {/* The machinery of the boundaries */}
      <div className="mx-auto max-w-5xl px-4 pb-28 pt-20 sm:px-8">
        <CiPlaque />
      </div>
    </section>
  );
}
