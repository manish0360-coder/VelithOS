"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Clearance from "@/components/scenes/Clearance";
import Overlook from "@/components/scenes/Overlook";
import Laboratory from "@/components/scenes/Laboratory";
import Crossing from "@/components/scenes/Crossing";
import PlatformHall from "@/components/scenes/PlatformHall";
import InterfaceSeam from "@/components/scenes/InterfaceSeam";
import Arena from "@/components/scenes/Arena";
import Horizon from "@/components/scenes/Horizon";
import Record from "@/components/scenes/Record";
import SessionRail from "@/components/chrome/SessionRail";
import DepthRail from "@/components/chrome/DepthRail";
import AttentionField from "@/components/chrome/AttentionField";
import { EASE } from "@/lib/motion";

/**
 * THE JOURNEY SHELL.
 *
 * Scene 0 (Clearance) overlays a world that already exists beneath it;
 * when provisioning completes, the overlay lifts and the darkness turns
 * out not to be empty — the Overlook's structure stands in it.
 *
 * Current order: Clearance → Overlook → Laboratory → Crossing →
 * Platform Hall → Interface Seam → Arena → Horizon (incl. the Return) →
 * Record. The journey is complete.
 * Phase-3+ insertion point: the layer scenes mount between Overlook and
 * Record inside <main>. The shell itself does not change.
 */
export default function Journey() {
  const reduced = useReducedMotion();
  const [cleared, setCleared] = useState(false);

  return (
    <>
      <AttentionField />
      <Clearance onComplete={() => setCleared(true)} />

      <motion.div
        initial={reduced ? false : { opacity: 0, scale: 1.02 }}
        animate={
          cleared ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.02 }
        }
        transition={{ duration: reduced ? 0 : 1.4, ease: [...EASE.session] }}
        style={{ transformOrigin: "50% 30%" }}
      >
        <SessionRail />
        <DepthRail />
        <main className="relative z-10">
          <h1 className="sr-only">
            VELITH — public interface of the Velith ecosystem
          </h1>
          <Overlook />
          <Laboratory />
          <Crossing />
          <PlatformHall />
          <InterfaceSeam />
          <Arena />
          <Horizon />
          <Record />
        </main>
      </motion.div>
    </>
  );
}
