"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Clearance from "@/components/scenes/Clearance";
import Manifest from "@/components/scenes/Manifest";
import Record from "@/components/scenes/Record";
import SessionRail from "@/components/chrome/SessionRail";
import DepthRail from "@/components/chrome/DepthRail";
import AttentionField from "@/components/chrome/AttentionField";
import { EASE } from "@/lib/motion";

/**
 * THE JOURNEY SHELL.
 *
 * Scene 0 (Clearance) overlays a world that already exists beneath it;
 * when provisioning completes, the overlay lifts and "the darkness turns
 * out not to be empty" — the world scales down from 1.02 into place, the
 * void acquiring depth (CDD Scene 0 → Scene 1 transition, Phase-1 form).
 *
 * Phase-2 insertion point: the Overlook and the layer scenes mount between
 * Manifest and Record inside <main>. The shell itself will not change.
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
          cleared
            ? { opacity: 1, scale: 1 }
            : { opacity: 0, scale: 1.02 }
        }
        transition={{ duration: reduced ? 0 : 1.4, ease: [...EASE.session] }}
        style={{ transformOrigin: "50% 30%" }}
      >
        <SessionRail />
        <DepthRail />
        <main className="relative z-10">
          <Manifest />
          <Record />
        </main>
      </motion.div>
    </>
  );
}
