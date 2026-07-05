"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { CROSSING } from "@/lib/canon-lab";
import { logEvent } from "@/lib/session";
import { FactText } from "@/components/ui/Reveal";

/**
 * SCENE 3 — THE CROSSING (CDD §3).
 *
 * The shortest scene, and the strictest — and, per the record, one that
 * has never yet occurred: the Primitive Registry is empty. So the scene
 * is staged honestly as PROTOCOL SHOWN IN ADVANCE, and says so first.
 *
 * Scroll drives the single cinematic beat (the visitor only witnesses;
 * there is no pointer interaction, because the law it depicts admits no
 * exceptions):
 *
 *   beat 1  the validated mechanism in its research-grade body (warm,
 *           irregular) on the laboratory side
 *   beat 2  reduction: it collapses to its specification — a single sheet
 *           of light that travels the dashed span alone; the research
 *           body stays behind and dims
 *   beat 3  re-implementation: on the platform side the same idea is
 *           rebuilt from nothing — grid-aligned, typed, versioned, cold
 *
 * Reduced motion renders the protocol as a static triptych with the same
 * three captions — full parity, no travel.
 */

const SPAN: { labX: number; platX: number; y: number } = {
  labX: 90,
  platX: 470,
  y: 150,
};

export default function Crossing() {
  const wrapper = useRef<HTMLDivElement>(null);
  const seen = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(seen, { once: true, margin: "-20% 0px" });

  useEffect(() => {
    if (inView) logEvent("scene", "the crossing witnessed");
  }, [inView]);

  const { scrollYProgress } = useScroll({
    target: wrapper,
    offset: ["start start", "end end"],
  });

  // Beat timings across the pinned scroll.
  const researchOpacity = useTransform(scrollYProgress, [0.18, 0.38], [1, 0.28]);
  const specX = useTransform(
    scrollYProgress,
    [0.22, 0.62],
    [SPAN.labX, SPAN.platX],
  );
  const specOpacity = useTransform(
    scrollYProgress,
    [0.16, 0.24, 0.6, 0.68],
    [0, 1, 1, 0],
  );
  const rebuildProgress = useTransform(scrollYProgress, [0.62, 0.86], [0, 1]);
  const cap0 = useTransform(scrollYProgress, [0.0, 0.06, 0.24, 0.32], [0, 1, 1, 0]);
  const cap1 = useTransform(scrollYProgress, [0.3, 0.38, 0.56, 0.64], [0, 1, 1, 0]);
  const cap2 = useTransform(scrollYProgress, [0.64, 0.72, 1, 1], [0, 1, 1, 1]);

  return (
    <section ref={seen} aria-label="The Crossing — the promotion protocol">
      {/* Honesty placard first */}
      <div className="bg-void px-4 py-20 sm:px-8">
        <p className="mx-auto max-w-2xl border-l border-phosphor/60 pl-5 text-sm leading-relaxed text-dim">
          <FactText fact={CROSSING.honesty} />
        </p>
      </div>

      {reduced ? (
        <CrossingTriptych />
      ) : (
        <div ref={wrapper} className="relative h-[280vh] bg-void">
          <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
            <svg viewBox="0 0 560 240" className="mx-auto w-full max-w-4xl px-4" aria-hidden="true">
              <CrossingDiagramAnimated
                researchOpacity={researchOpacity}
                specX={specX}
                specOpacity={specOpacity}
                rebuildProgress={rebuildProgress}
              />
            </svg>

            {/* Captions crossfade under the diagram */}
            <div className="relative mx-auto mt-6 min-h-[7rem] w-full max-w-2xl px-6">
              {[cap0, cap1, cap2].map((opacity, i) => (
                <motion.p
                  key={i}
                  style={{ opacity }}
                  className="absolute inset-x-6 top-0 text-sm leading-relaxed text-dim"
                >
                  <FactText fact={CROSSING.stages[i]} />
                </motion.p>
              ))}
            </div>
            <p className="mx-auto mt-4 w-full max-w-2xl px-6">
              <span className="microlabel text-faint">
                LAW 7 — <FactText fact={CROSSING.law} className="normal-case" />
              </span>
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

/* ── The diagram's three bodies ───────────────────────────────────────── */

/** The research-grade body: an irregular warm cluster graph, drawn at origin. */
function ClusterGlyph() {
  const nodes: [number, number][] = [
    [0, 0], [26, -18], [44, 8], [18, 26], [-16, 14], [36, -34],
  ];
  return (
    <>
      {nodes.map(([x, y], i) =>
        nodes.slice(i + 1, i + 3).map(([x2, y2], j) => (
          <line key={`${i}-${j}`} x1={x} y1={y} x2={x2} y2={y2}
            stroke="var(--color-lab-stain)" strokeOpacity="0.5" strokeWidth="1" />
        )),
      )}
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill="var(--color-lab-stain)" fillOpacity="0.85" />
      ))}
      <text x="-16" y="52" fontSize="8.5" fill="var(--color-lab-bone)" opacity="0.6"
        fontFamily="var(--font-mono)">
        validated mechanism · research-grade
      </text>
    </>
  );
}

function CrossingDiagramAnimated({
  researchOpacity,
  specX,
  specOpacity,
  rebuildProgress,
}: {
  researchOpacity: import("framer-motion").MotionValue<number>;
  specX: import("framer-motion").MotionValue<number>;
  specOpacity: import("framer-motion").MotionValue<number>;
  rebuildProgress: import("framer-motion").MotionValue<number>;
}) {
  const rebuildOpacity = rebuildProgress;
  const rebuildScale = useTransform(rebuildProgress, [0, 1], [0.92, 1]);
  return (
    <>
      <SpanAndGate />
      <motion.g style={{ opacity: researchOpacity }}>
        <g transform={`translate(${SPAN.labX} ${SPAN.y})`}>
          <ClusterGlyph />
        </g>
      </motion.g>
      {/* The specification: a single sheet of light */}
      <motion.g style={{ x: specX, opacity: specOpacity }}>
        <rect x="-14" y={SPAN.y - 20} width="28" height="40"
          fill="var(--color-lab-bone)" fillOpacity="0.9" />
        <text x="-14" y={SPAN.y + 34} fontSize="8.5" fill="var(--color-lab-bone)"
          opacity="0.7" fontFamily="var(--font-mono)">
          the spec
        </text>
      </motion.g>
      {/* The re-implementation: grid-aligned, typed, cold */}
      <motion.g
        style={{ opacity: rebuildOpacity, scale: rebuildScale }}
        transform={`translate(${SPAN.platX} ${SPAN.y})`}
      >
        <RebuiltBody />
      </motion.g>
    </>
  );
}

function RebuiltBody() {
  return (
    <>
      {[0, 1, 2].map((r) =>
        [0, 1, 2].map((c) => (
          <rect key={`${r}-${c}`} x={-33 + c * 24} y={-33 + r * 24}
            width="18" height="18" fill="none"
            stroke="var(--color-platform-steel)" strokeOpacity="0.8" />
        )),
      )}
      <text x="-33" y="52" fontSize="8.5" fill="var(--color-platform-steel)"
        opacity="0.8" fontFamily="var(--font-mono)">
        re-implemented · typed · versioned
      </text>
    </>
  );
}

function SpanAndGate() {
  return (
    <>
      {/* The dashed span — the knowledge grammar */}
      <line x1={SPAN.labX + 40} y1={SPAN.y} x2={SPAN.platX - 50} y2={SPAN.y}
        stroke="var(--color-lab-bone)" strokeOpacity="0.4"
        strokeWidth="1" strokeDasharray="6 5" />
      {/* The gate posts mid-span */}
      <line x1="278" y1={SPAN.y - 34} x2="278" y2={SPAN.y + 34}
        stroke="var(--color-lab-stain)" strokeOpacity="0.6" strokeWidth="1" />
      <line x1="284" y1={SPAN.y - 34} x2="284" y2={SPAN.y + 34}
        stroke="var(--color-lab-stain)" strokeOpacity="0.6" strokeWidth="1" />
      <text x="252" y={SPAN.y - 44} fontSize="8.5" fill="var(--color-lab-stain)"
        opacity="0.8" fontFamily="var(--font-mono)">
        the gate
      </text>
      {/* Side labels */}
      <text x={SPAN.labX - 24} y="34" fontSize="9" fill="var(--color-lab-bone)"
        opacity="0.55" fontFamily="var(--font-mono)">
        LABORATORY SIDE
      </text>
      <text x={SPAN.platX - 60} y="34" fontSize="9" fill="var(--color-platform-steel)"
        opacity="0.7" fontFamily="var(--font-mono)">
        PLATFORM SIDE
      </text>
    </>
  );
}

/* ── Reduced-motion edition: the protocol as a triptych ───────────────── */

function CrossingTriptych() {
  return (
    <div className="bg-void px-4 pb-24 sm:px-8">
      <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-3">
        {CROSSING.stages.map((stage, i) => (
          <figure key={i}>
            <svg viewBox="0 0 200 150" className="w-full" aria-hidden="true">
              {i === 0 && (
                <g transform="translate(90 70)">
                  <ClusterGlyph />
                </g>
              )}
              {i === 1 && (
                <g>
                  <line x1="20" y1="75" x2="180" y2="75"
                    stroke="var(--color-lab-bone)" strokeOpacity="0.4"
                    strokeDasharray="6 5" />
                  <rect x="86" y="55" width="28" height="40"
                    fill="var(--color-lab-bone)" fillOpacity="0.9" />
                </g>
              )}
              {i === 2 && (
                <g transform="translate(100 75)">
                  <RebuiltBody />
                </g>
              )}
            </svg>
            <figcaption className="mt-4 text-sm leading-relaxed text-dim">
              <FactText fact={stage} />
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="mx-auto mt-12 max-w-2xl">
        <span className="microlabel text-faint">
          LAW 7 — <FactText fact={CROSSING.law} className="normal-case" />
        </span>
      </p>
    </div>
  );
}
