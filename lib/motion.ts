/**
 * MOTION — the four temperaments (CDD §5).
 *
 * One law: motion states purpose. Each layer owns an easing personality,
 * defined here once. No component declares its own curve; it names a
 * temperament. This is what keeps "four worlds, one physics" true in motion.
 *
 *  inquire — the laboratory. Approach, slight overshoot, settle:
 *            the curve of a hand adjusting an instrument.
 *  execute — the platform. Critically damped, no overshoot ever:
 *            arrival as fact.
 *  cycle   — the workshop. Momentum carried through, confident.
 *  breathe — the horizon. Long, subliminal periods.
 *
 * `session` is the chrome's voice (clearance, rails, the record): it speaks
 * in the flagship's instrument cadence, so it shares `cycle`'s family at a
 * quieter amplitude.
 */

import type { Variants } from "framer-motion";

export type Temperament =
  | "inquire"
  | "execute"
  | "cycle"
  | "breathe"
  | "session";

export const EASE: Record<Temperament, readonly [number, number, number, number]> = {
  inquire: [0.34, 1.28, 0.44, 1],
  execute: [0.3, 0, 0.12, 1],
  cycle: [0.45, 0, 0.25, 1],
  breathe: [0.42, 0, 0.58, 1],
  session: [0.4, 0, 0.2, 1],
};

export const DURATION: Record<Temperament, number> = {
  inquire: 0.7,
  execute: 0.55,
  cycle: 0.6,
  breathe: 2.4,
  session: 0.5,
};

/**
 * The single entrance-variant factory. Rise distance and blur are part of
 * the temperament: the platform arrives with no drift at all; the horizon
 * barely rises but takes its time.
 */
export function revealVariants(t: Temperament): Variants {
  const rise: Record<Temperament, number> = {
    inquire: 18,
    execute: 0,
    cycle: 22,
    breathe: 8,
    session: 12,
  };
  return {
    hidden: {
      opacity: 0,
      y: rise[t],
      filter: t === "execute" ? "none" : "blur(5px)",
    },
    shown: (delay: number = 0) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: DURATION[t],
        delay,
        ease: [...EASE[t]],
      },
    }),
  };
}
