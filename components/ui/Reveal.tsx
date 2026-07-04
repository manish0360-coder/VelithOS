"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { revealVariants, type Temperament } from "@/lib/motion";
import type { Fact } from "@/lib/canon";

/**
 * The single entrance mechanism. A component names a temperament; the
 * temperament defines the motion (CDD §5). Reduced motion renders content
 * settled — full parity, no travel.
 */
export function Reveal({
  children,
  temperament = "session",
  delay = 0,
  className,
}: {
  children: ReactNode;
  temperament?: Temperament;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={revealVariants(temperament)}
      custom={delay}
      initial={reduced ? "shown" : "hidden"}
      whileInView="shown"
      viewport={{ once: true, margin: "-10% 0px" }}
    >
      {children}
    </motion.div>
  );
}

/**
 * FactText — the only way prose reaches the screen (CDD Principle 1).
 * Renders a canon Fact; attention (hover or keyboard focus) reveals the
 * citation. `tabIndex=0` makes the citation reachable without a pointer.
 */
export function FactText({
  fact,
  className,
}: {
  fact: Fact;
  className?: string;
}) {
  return (
    <span className={`fact ${className ?? ""}`} tabIndex={0}>
      {fact.text}
      <span className="fact-source" aria-label={`Source: ${fact.source}`}>
        ⌁ {fact.source}
      </span>
    </span>
  );
}
