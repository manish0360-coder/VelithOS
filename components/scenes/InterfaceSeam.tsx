"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { SEAM } from "@/lib/canon-platform";
import { logEvent, useSession } from "@/lib/session";
import { FactText } from "@/components/ui/Reveal";

/**
 * SCENE 5 — THE INTERFACE SEAM (CDD §3).
 *
 * The passage between platform and engineering floor is a contract made
 * spatial: for two viewport-heights of travel the visitor is INSIDE the
 * API boundary — the walls are the typed interface surface, sliding past
 * in opposite directions; light crossfades from clean-room steel to
 * work-light amber; and at the midpoint the crossing is STAMPED with the
 * real frozen interface version and the visitor's own session time.
 *
 * The stamp is truthful twice over: the version is the actual freeze tag
 * (the interface surface was frozen at PE-1), and the timestamp is this
 * session's clock — the seam records passages, like everything else here.
 *
 * Reduced motion: a static seam panel — walls, stamp, law — full parity.
 */

const WALL_LINES = [
  ...SEAM.signatures.map((s) => `interface ${s} — typed public contract`),
  "…and seventeen more modules",
];

export default function InterfaceSeam() {
  const wrapper = useRef<HTMLDivElement>(null);
  const seen = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const session = useSession();
  const inView = useInView(seen, { once: true, margin: "-30% 0px" });
  const [stampTime, setStampTime] = useState<string | null>(null);

  const { scrollYProgress } = useScroll({
    target: wrapper,
    offset: ["start start", "end end"],
  });

  const leftY = useTransform(scrollYProgress, [0, 1], ["6%", "-26%"]);
  const rightY = useTransform(scrollYProgress, [0, 1], ["-26%", "6%"]);
  const amber = useTransform(scrollYProgress, [0.25, 0.85], [0, 1]);
  const stampOpacity = useTransform(scrollYProgress, [0.42, 0.52], [0, 1]);
  const stampScale = useTransform(scrollYProgress, [0.42, 0.52], [1.06, 1]);

  // Stamp the crossing exactly once, at the midpoint.
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v > 0.5 && stampTime === null) {
      const t = new Date().toISOString().slice(11, 19) + " UTC";
      setStampTime(t);
      logEvent("scene", "interface seam crossed");
    }
  });

  // Reduced motion: the seam is a place, not a ride — stamp on arrival.
  useEffect(() => {
    if (reduced && inView && stampTime === null) {
      setStampTime(new Date().toISOString().slice(11, 19) + " UTC");
      logEvent("scene", "interface seam crossed");
    }
  }, [reduced, inView, stampTime]);

  const stamp = (
    <div className="border border-velith-amber/60 px-6 py-5 text-center">
      <p className="microlabel !text-[9px] text-velith-amber">
        {SEAM.stampLabel}
      </p>
      <p className="mt-2 font-mono text-sm tracking-[0.12em] text-text">
        {SEAM.stampVersion}
      </p>
      <p className="microlabel mt-2 !text-[9px] text-dim">
        SESSION {session.id || "····"} · {stampTime ?? "— APPROACHING —"}
      </p>
    </div>
  );

  const law = (
    <p className="mx-auto max-w-xl text-center text-xs leading-relaxed text-dim">
      <FactText fact={SEAM.law} />{" "}
      <FactText fact={SEAM.moduleCount} />
    </p>
  );

  if (reduced) {
    return (
      <section ref={seen} aria-label="The interface seam" className="bg-void px-4 py-24 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <Walls static />
          <div className="mx-auto mt-10 max-w-sm">{stamp}</div>
          <div className="mt-8">{law}</div>
        </div>
      </section>
    );
  }

  return (
    <section ref={seen} aria-label="The interface seam">
      <div ref={wrapper} className="relative h-[220vh]">
        <div className="sticky top-0 flex h-svh items-center overflow-hidden bg-[#171b21]">
          {/* Light crossfade: clean-room → work light */}
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 bg-[#0c0a07]"
            style={{ opacity: amber }}
          />
          <div className="relative mx-auto grid w-full max-w-4xl grid-cols-[1fr_auto_1fr] items-center gap-6 px-4 sm:px-8">
            <motion.div style={{ y: leftY }} aria-hidden="true">
              <Walls side="left" />
            </motion.div>

            <motion.div
              style={{ opacity: stampOpacity, scale: stampScale }}
              className="w-[min(78vw,20rem)]"
              aria-live="polite"
            >
              {stamp}
            </motion.div>

            <motion.div style={{ y: rightY }} aria-hidden="true">
              <Walls side="right" />
            </motion.div>
          </div>
          <div className="absolute inset-x-0 bottom-10">{law}</div>
        </div>
      </div>
    </section>
  );
}

/** The seam's walls: the typed interface surface, legible and repeated. */
function Walls({ side, static: isStatic }: { side?: "left" | "right"; static?: boolean }) {
  const lines = isStatic ? WALL_LINES : [...WALL_LINES, ...WALL_LINES, ...WALL_LINES];
  return (
    <ul
      className={`space-y-5 font-mono text-[10px] tracking-[0.14em] ${
        isStatic
          ? "text-dim"
          : side === "left"
            ? "text-right text-platform-steel/70"
            : "text-velith-amber/60"
      }`}
    >
      {lines.map((l, i) => (
        <li key={i} className={isStatic ? "" : "whitespace-nowrap"}>
          {l}
        </li>
      ))}
    </ul>
  );
}
