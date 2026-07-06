"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  MACHINES,
  PROBABILISTIC,
  PROMETHEUS_IS,
  RETURN_CLOSES,
  RETURN_RISE,
  type Machine,
} from "@/lib/canon-horizon";
import { logEvent } from "@/lib/session";
import { EASE } from "@/lib/motion";
import { FactText } from "@/components/ui/Reveal";

/**
 * THE HORIZON RIDE — the journey's final camera choreography.
 *
 * A 320vh scroll drives one continuous move (the camera never cuts):
 * across the pre-dawn floor among the ghost machines, then pitching
 * upward into the Return. Scroll progress reaches the WebGL rig through
 * a mutable ref — zero React renders on the scroll path. The frameloop
 * runs only while the section is on screen.
 *
 * The BEHOLD legend is the scene's accessible surface: five future
 * systems, revealed strictly in the future tense. Captions are keyed to
 * scroll ranges; under reduced motion the ride collapses to one still
 * frame with the captions and legend stacked — full parity, no travel.
 */

const HorizonCanvas = dynamic(() => import("./HorizonCanvas"), {
  ssr: false,
  loading: () => <div className="h-full w-full" aria-hidden="true" />,
});

export default function HorizonRide() {
  const wrapper = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [beheld, setBeheld] = useState<Machine | null>(null);
  const returnLogged = useRef(false);

  const { scrollYProgress } = useScroll({
    target: wrapper,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progress.current = v;
    if (v > 0.6 && !returnLogged.current) {
      returnLogged.current = true;
      logEvent("scene", "the return — looked up");
    }
  });

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      { threshold: 0.05 },
    );
    if (host.current) io.observe(host.current);
    return () => io.disconnect();
  }, []);

  const cap0 = useTransform(scrollYProgress, [0.02, 0.1, 0.24, 0.32], [0, 1, 1, 0]);
  const cap1 = useTransform(scrollYProgress, [0.3, 0.38, 0.5, 0.58], [0, 1, 1, 0]);
  const cap2 = useTransform(scrollYProgress, [0.6, 0.68, 0.82, 0.88], [0, 1, 1, 0]);
  const cap3 = useTransform(scrollYProgress, [0.88, 0.94, 1, 1], [0, 1, 1, 1]);
  const legendOpacity = useTransform(scrollYProgress, [0.08, 0.16, 0.52, 0.6], [0, 1, 1, 0]);

  const behold = (m: Machine) => {
    setBeheld(m);
    logEvent("discovery", `beheld: ${m.name}`);
  };

  const legend = (
    <nav aria-label="The future systems of this floor" className="flex flex-wrap gap-x-4 gap-y-1.5">
      {MACHINES.map((m) => (
        <button
          key={m.id}
          type="button"
          onMouseEnter={() => behold(m)}
          onFocus={() => behold(m)}
          onClick={() => behold(m)}
          className={`font-mono text-[9.5px] uppercase tracking-[0.18em] transition-colors duration-300 ${
            beheld?.id === m.id ? "text-[var(--world-text)]" : "text-[var(--world-text)]/40 hover:text-[var(--world-text)]/70"
          }`}
          aria-pressed={beheld?.id === m.id}
        >
          {m.name}
        </button>
      ))}
    </nav>
  );

  const panel = (
    <div className="min-h-[5rem]" aria-live="polite">
      {beheld && (
        <p className="max-w-xl text-sm leading-relaxed text-[var(--world-text)]/70">
          <span className="font-mono text-xs text-dawn">{beheld.name}</span>{" "}
          — <FactText fact={beheld.will} />
        </p>
      )}
      {!beheld && (
        <p className="microlabel !text-[var(--world-text)]/30">
          BEHOLD — EVERYTHING HERE ANSWERS IN THE FUTURE TENSE
        </p>
      )}
    </div>
  );

  if (reduced) {
    return (
      <div className="px-4 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="h-[56svh] min-h-[380px]">
            <HorizonCanvas progress={progress} frozen live={false} />
          </div>
          <div className="mt-8 space-y-5">
            <p className="text-sm leading-relaxed text-[var(--world-text)]/70"><FactText fact={PROMETHEUS_IS} /></p>
            <p className="text-sm leading-relaxed text-[var(--world-text)]/70"><FactText fact={PROBABILISTIC} /></p>
            {legend}
            {panel}
            <p className="text-sm leading-relaxed text-[var(--world-text)]/70"><FactText fact={RETURN_RISE} /></p>
            <p className="text-sm leading-relaxed text-[var(--world-text)]/85"><FactText fact={RETURN_CLOSES} /></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={wrapper} className="relative h-[320vh]">
      <div ref={host} className="sticky top-0 h-svh overflow-hidden">
        <div className="absolute inset-0" aria-hidden="true">
          <HorizonCanvas progress={progress} frozen={false} live={visible} />
        </div>

        {/* Captions — one continuous voice through the move */}
        <div className="pointer-events-none absolute inset-x-0 bottom-24 px-4 sm:px-8 md:bottom-28">
          <div className="relative mx-auto min-h-[6rem] max-w-2xl">
            {(
              [
                [cap0, PROMETHEUS_IS],
                [cap1, PROBABILISTIC],
                [cap2, RETURN_RISE],
                [cap3, RETURN_CLOSES],
              ] as const
            ).map(([opacity, fact], i) => (
              <motion.p
                key={i}
                style={{ opacity }}
                className={`pointer-events-auto absolute inset-x-0 top-0 text-sm leading-relaxed ${
                  i === 3 ? "text-[var(--world-text)]/90" : "text-[var(--world-text)]/70"
                }`}
              >
                <FactText fact={fact} />
              </motion.p>
            ))}
          </div>
        </div>

        {/* The behold legend, present while the floor is in view */}
        <motion.div
          style={{ opacity: legendOpacity }}
          className="absolute inset-x-0 top-20 px-4 sm:px-8 md:top-24"
          transition={{ ease: [...EASE.breathe] }}
        >
          <div className="mx-auto max-w-2xl space-y-3">
            {legend}
            {panel}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
