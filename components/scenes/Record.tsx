"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { DEPARTURE, RECORD_EPIGRAPH } from "@/lib/canon";
import { logEvent, seal, useSession } from "@/lib/session";
import { EASE } from "@/lib/motion";
import { FactText, Reveal } from "@/components/ui/Reveal";

/**
 * SCENE 8 — THE RECORD (CDD §3, Phase-1 form).
 *
 * The session ends the way it began — in type. The visitor watches their
 * own visit as an append-only record, then seals it: the log freezes and a
 * real SHA-256 over its canonical serialization renders character by
 * character. "You were an episode." The hash is honest: it is computed
 * over exactly the events shown.
 */

const HASH_REVEAL_MS = 14;

export default function Record() {
  const session = useSession();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-25% 0px" });
  const [revealed, setRevealed] = useState(0);
  const [sealing, setSealing] = useState(false);

  useEffect(() => {
    if (inView) logEvent("scene", "record entered");
  }, [inView]);

  // Character-by-character hash reveal after sealing.
  useEffect(() => {
    if (!session.sealedHash) return;
    if (reduced) {
      setRevealed(session.sealedHash.length);
      return;
    }
    if (revealed >= session.sealedHash.length) return;
    const t = setTimeout(() => setRevealed((n) => n + 1), HASH_REVEAL_MS);
    return () => clearTimeout(t);
  }, [session.sealedHash, revealed, reduced]);

  const onSeal = async () => {
    if (sealing || session.sealedHash) return;
    setSealing(true);
    logEvent("operate", "seal requested by operator");
    await seal();
    setSealing(false);
  };

  const sealed = session.sealedHash !== null;

  return (
    <section
      id="record"
      ref={ref}
      className="mx-auto max-w-3xl px-4 pb-40 pt-12 sm:px-8"
      aria-label="Session record"
    >
      <Reveal temperament="session">
        <p className="microlabel mb-6 text-phosphor">
          SESSION RECORD — {session.id || "····"}
        </p>
        <p className="max-w-xl text-sm leading-relaxed text-dim">
          <FactText fact={RECORD_EPIGRAPH} />
        </p>
      </Reveal>

      {/* The live log */}
      <Reveal temperament="session" delay={0.08}>
        <ol
          className="mt-12 space-y-2 border-l border-line pl-6 font-mono text-[11px] leading-relaxed tracking-wide text-dim"
          aria-label="Session events"
        >
          {session.events.map((e, i) => (
            <li key={`${e.at}-${i}`} className="grid grid-cols-[7.5rem_5.5rem_1fr] gap-x-3">
              <span className="text-faint" suppressHydrationWarning>
                {e.at.slice(11, 19)} UTC
              </span>
              <span className="uppercase tracking-[0.18em] text-phosphor/80">
                {e.kind}
              </span>
              <span>{e.detail}</span>
            </li>
          ))}
        </ol>
      </Reveal>

      {/* Seal / sealed */}
      <div className="mt-14 min-h-[9rem]">
        <AnimatePresence mode="wait">
          {!sealed ? (
            <motion.button
              key="seal"
              type="button"
              onClick={onSeal}
              disabled={sealing}
              exit={{
                opacity: 0,
                transition: { duration: reduced ? 0 : 0.4, ease: [...EASE.session] },
              }}
              className="group relative border border-phosphor/70 px-9 py-3.5 font-mono text-[11px] uppercase tracking-[0.24em] text-phosphor transition-colors duration-300 hover:bg-phosphor hover:text-void"
            >
              {sealing ? "SEALING…" : "SEAL SESSION RECORD"}
            </motion.button>
          ) : (
            <motion.div
              key="sealed"
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [...EASE.session] }}
            >
              <p className="microlabel text-phosphor">RECORD HASH — SHA-256</p>
              <p className="mt-3 break-all font-mono text-xs leading-relaxed tracking-[0.06em] text-text">
                {session.sealedHash?.slice(0, revealed)}
                {revealed < (session.sealedHash?.length ?? 0) && (
                  <span className="ml-0.5 inline-block h-3 w-[6px] translate-y-0.5 bg-phosphor/80" />
                )}
              </p>
              <p className="microlabel mt-6 text-phosphor">
                {DEPARTURE.sealed.text}
              </p>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-text/85">
                <FactText fact={DEPARTURE.episode} />
              </p>
              <div className="mt-10 border-t border-line pt-8">
                <p className="text-xs leading-relaxed text-faint">
                  <FactText fact={DEPARTURE.exit} />
                </p>
                <a
                  href="https://github.com/manish0360-coder/Noetica-agent-lab"
                  className="microlabel mt-4 inline-block text-dim underline decoration-line underline-offset-4 transition-colors hover:text-phosphor"
                >
                  OPEN THE REPOSITORY OF RECORD ↗
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <p aria-live="polite" className="sr-only">
          {sealed
            ? `Session record sealed. Hash ${session.sealedHash}. Clearance expired.`
            : undefined}
        </p>
      </div>
    </section>
  );
}
