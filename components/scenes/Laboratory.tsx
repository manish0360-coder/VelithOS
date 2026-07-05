"use client";

import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { logEvent } from "@/lib/session";
import { FactText, Reveal } from "@/components/ui/Reveal";
import { PROJECTS } from "@/lib/canon";
import SpecimenWall from "@/components/lab/SpecimenWall";
import FalsificationChamber from "@/components/lab/FalsificationChamber";
import {
  PromotionGate,
  RejectedWall,
  SealedExhibit,
} from "@/components/lab/Fixtures";

/**
 * SCENE 2 — THE LABORATORY (CDD §3).
 *
 * Crossing the bridge, the world changes temperature: the miniflywire
 * atmosphere scope (warm dark, bone type, specimen stain) and the
 * `inquire` motion temperament take over. The scene is the working
 * cognition laboratory at night, arranged as its four real fixtures:
 * the specimen wall, the falsification chamber, the rejected alcove
 * (with the sealed anti-pattern nearby), and the promotion gate at the
 * exit — which hands the visitor to Scene 3, the Crossing.
 *
 * Entry is the bridge itself: the dashed grammar, and the truth that
 * only the visitor crosses.
 */

const LAB_IDENTITY = PROJECTS.find((p) => p.id === "miniflywire")!;

export default function Laboratory() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  useEffect(() => {
    if (inView) logEvent("scene", "laboratory entered");
  }, [inView]);

  return (
    <section
      id="laboratory"
      ref={ref}
      data-layer="miniflywire"
      className="relative bg-[var(--world-bg)] text-[var(--world-text)]"
      aria-label="MiniFlyWire — the laboratory"
    >
      {/* The bridge entry: dashed grammar, warming gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-void to-transparent"
      />
      <div className="mx-auto max-w-4xl px-4 pt-20 sm:px-8">
        <Reveal temperament="inquire">
          <div className="flex items-center gap-4">
            <span className="flow-rule !w-16" data-flow="knowledge" />
            <p className="microlabel !text-[var(--world-text)]/50">
              THE BRIDGE — ONLY THE VISITOR CROSSES
            </p>
          </div>
        </Reveal>

        {/* Arrival */}
        <Reveal temperament="inquire" delay={0.08} className="mt-16">
          <p className="microlabel mb-5 text-lab-stain">
            L1 — MINIFLYWIRE · THE LABORATORY
          </p>
          <h2 className="max-w-2xl text-2xl font-medium leading-snug tracking-tight sm:text-3xl">
            <FactText fact={LAB_IDENTITY.identity} />
          </h2>
          <p className="marginalia mt-5 max-w-xl text-xs leading-relaxed">
            nothing written here is scientifically accepted — every
            hypothesis begins here, and must survive attempts to destroy it
          </p>
        </Reveal>
      </div>

      {/* The specimen wall */}
      <div className="mx-auto max-w-4xl px-4 pt-24 sm:px-8">
        <Reveal temperament="inquire">
          <h3 className="microlabel mb-8 !text-[var(--world-text)]/60">
            THE SPECIMEN WALL — WORKING HYPOTHESES, TRUE STATUSES
          </h3>
        </Reveal>
        <SpecimenWall />
      </div>

      {/* The falsification chamber */}
      <div className="mx-auto max-w-4xl px-4 pt-28 sm:px-8">
        <Reveal temperament="inquire">
          <FalsificationChamber />
        </Reveal>
      </div>

      {/* The rejected alcove + sealed exhibit */}
      <div className="mx-auto max-w-4xl px-4 pt-28 sm:px-8">
        <Reveal temperament="inquire">
          <h3 className="microlabel mb-8 !text-[var(--world-text)]/60">
            THE REJECTED WALL — PRESERVED WITH DIGNITY
          </h3>
        </Reveal>
        <RejectedWall />
        <div className="pt-20">
          <SealedExhibit />
        </div>
      </div>

      {/* The promotion gate at the exit */}
      <div className="mx-auto max-w-4xl px-4 pb-28 pt-28 sm:px-8">
        <Reveal temperament="inquire">
          <h3 className="microlabel mb-2 !text-[var(--world-text)]/60">
            THE PROMOTION GATE — SEVEN CONJUNCTIVE CRITERIA
          </h3>
          <p className="marginalia mb-8 text-xs">
            etched at the exit · nothing leaves as code
          </p>
        </Reveal>
        <PromotionGate />
      </div>
    </section>
  );
}
