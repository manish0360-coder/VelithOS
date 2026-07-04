"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CLEARANCE_LINES, RESUME_LINE, SITE } from "@/lib/canon";
import { logEvent, provision, useSession } from "@/lib/session";
import { EASE } from "@/lib/motion";

/**
 * SCENE 0 — CLEARANCE (CDD §3).
 *
 * Black, then one line of small instrument type appearing character by
 * character: a session being provisioned with its real id, timestamp, and
 * clearance. Any key or touch completes provisioning immediately — the
 * impatient are never punished. Under reduced motion, or on resume within
 * the same browser session, the sequence renders settled.
 *
 * Screen readers receive each completed line through a polite live region;
 * the character animation is presentation only (aria-hidden).
 */

const CHAR_INTERVAL_MS = 16;
const LINE_PAUSE_MS = 240;
const HOLD_AFTER_MS = 650;

type Phase = "typing" | "holding" | "done";

export default function Clearance({ onComplete }: { onComplete: () => void }) {
  const reduced = useReducedMotion();
  const session = useSession();
  const [phase, setPhase] = useState<Phase>("typing");
  // chars typed across the whole sequence
  const [typed, setTyped] = useState(0);
  const completedRef = useRef(false);

  // Provision exactly once, on the client.
  useEffect(() => {
    provision(SITE.clearance.text);
  }, []);

  const lines = useMemo(() => {
    if (session.id === "") return [];
    const stamp = session.startedAt.replace("T", " ").slice(0, 19) + " UTC";
    const source = session.resumed
      ? [RESUME_LINE, CLEARANCE_LINES[CLEARANCE_LINES.length - 1]]
      : CLEARANCE_LINES;
    return source.map((f) =>
      f.text.replace("{id}", session.id).replace("{time}", stamp),
    );
  }, [session.id, session.startedAt, session.resumed]);

  const totalChars = useMemo(
    () => lines.reduce((n, l) => n + l.length, 0),
    [lines],
  );

  const finish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setPhase("done");
    onComplete();
  }, [onComplete]);

  const skip = useCallback(() => {
    setTyped(totalChars);
    if (phase === "typing") setPhase("holding");
  }, [totalChars, phase]);

  // Typing engine.
  useEffect(() => {
    if (lines.length === 0 || phase !== "typing") return;
    if (reduced || session.resumed) {
      setTyped(totalChars);
      setPhase("holding");
      return;
    }
    if (typed >= totalChars) {
      setPhase("holding");
      return;
    }
    // Pause slightly longer at line boundaries.
    let consumed = 0;
    let atLineEnd = false;
    for (const l of lines) {
      consumed += l.length;
      if (typed === consumed) {
        atLineEnd = true;
        break;
      }
      if (typed < consumed) break;
    }
    const t = setTimeout(
      () => setTyped((n) => n + 1),
      atLineEnd ? LINE_PAUSE_MS : CHAR_INTERVAL_MS,
    );
    return () => clearTimeout(t);
  }, [lines, phase, typed, totalChars, reduced, session.resumed]);

  // Hold, then depart.
  useEffect(() => {
    if (phase !== "holding") return;
    const t = setTimeout(finish, reduced ? 0 : HOLD_AFTER_MS);
    return () => clearTimeout(t);
  }, [phase, finish, reduced]);

  // Any key or pointer completes immediately.
  useEffect(() => {
    if (phase === "done") return;
    const onInput = () => (phase === "typing" ? skip() : finish());
    window.addEventListener("keydown", onInput);
    window.addEventListener("pointerdown", onInput);
    return () => {
      window.removeEventListener("keydown", onInput);
      window.removeEventListener("pointerdown", onInput);
    };
  }, [phase, skip, finish]);

  useEffect(() => {
    if (phase === "done") logEvent("scene", "clearance complete");
  }, [phase]);

  // Visible slices per line, from the global typed counter.
  const rendered = useMemo(() => {
    let remaining = typed;
    return lines.map((l) => {
      const take = Math.max(0, Math.min(l.length, remaining));
      remaining -= take;
      return l.slice(0, take);
    });
  }, [lines, typed]);

  const completedLines = useMemo(() => {
    let remaining = typed;
    return lines.filter((l) => {
      const done = remaining >= l.length;
      remaining -= l.length;
      return done;
    });
  }, [lines, typed]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-void"
          role="status"
          aria-label="Session provisioning — press any key to continue"
          exit={{
            opacity: 0,
            transition: { duration: reduced ? 0 : 0.9, ease: [...EASE.session] },
          }}
        >
          <div className="w-[min(90vw,600px)] px-4">
            <ol
              aria-hidden="true"
              className="min-h-[11rem] space-y-2.5 font-mono text-[11px] leading-relaxed tracking-[0.08em] text-dim sm:text-xs"
            >
              {rendered.map(
                (text, i) =>
                  text.length > 0 && (
                    <li
                      key={i}
                      className={
                        i === lines.length - 1 ? "text-phosphor" : undefined
                      }
                    >
                      <span className="mr-2 text-faint">&gt;</span>
                      {text}
                      {i === rendered.findLastIndex((t) => t.length > 0) &&
                        phase === "typing" && (
                          <span className="ml-0.5 inline-block h-3 w-[6px] translate-y-0.5 bg-phosphor/80" />
                        )}
                    </li>
                  ),
              )}
            </ol>
            {/* Completed lines for assistive technology */}
            <div aria-live="polite" className="sr-only">
              {completedLines.join(". ")}
            </div>
            <p className="microlabel mt-8 text-faint">
              PRESS ANY KEY TO CONTINUE
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
