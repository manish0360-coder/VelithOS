"use client";

import { useState } from "react";
import { FLAKE, LEDGER_D16, VAULT } from "@/lib/canon-arena";
import { logEvent } from "@/lib/session";
import { FactText, Reveal } from "@/components/ui/Reveal";

/**
 * Fixtures of the Arena (CDD Scene 6):
 *
 * Vault — the held-out secondary suite, mechanically beyond tampering:
 *   its mechanism proudly explained, its contents (by definition) unseen.
 *
 * FlakeInstrument — the instrument that reports its own unreliability
 *   instead of hiding it. Provenance, not a verdict.
 *
 * LedgerPage — the ledger open to the repaired page: the D16 provenance
 *   note reproduced verbatim, with its visible repair seam. Records are
 *   never silently lost; when one was, the repair joined the record.
 */

function useDiscovery(detail: string) {
  const [seen, setSeen] = useState(false);
  return () => {
    if (!seen) {
      setSeen(true);
      logEvent("discovery", detail);
    }
  };
}

export function Vault() {
  const notice = useDiscovery("found: the held-out vault");
  return (
    <Reveal temperament="cycle">
      <div
        tabIndex={0}
        onMouseEnter={notice}
        onFocus={notice}
        className="h-full border border-[var(--world-line)] bg-[var(--world-bg)] p-5 sm:p-6"
      >
        <p className="flex items-center justify-between gap-3">
          <span className="microlabel !text-[var(--world-text)]/55">{VAULT.title}</span>
          {/* The lock: mechanical, closed */}
          <span aria-hidden="true" className="flex items-center gap-1">
            <span className="h-3 w-2.5 border border-velith-amber/70 border-b-0" />
            <span className="microlabel !text-[8px] text-velith-amber/80">LOCKED</span>
          </span>
        </p>
        <p className="mt-4 text-xs leading-relaxed text-[var(--world-text)]/70">
          <FactText fact={VAULT.body} />
        </p>
        <p className="mt-3 text-xs leading-relaxed text-[var(--world-text)]/50">
          <FactText fact={VAULT.identity} />
        </p>
        <p className="microlabel mt-4 !text-[8.5px] !text-[var(--world-text)]/30">
          CONTENTS UNSEEN BY DEFINITION — THE MECHANISM IS THE EXHIBIT
        </p>
      </div>
    </Reveal>
  );
}

export function FlakeInstrument() {
  const notice = useDiscovery("found: the flake instrument");
  return (
    <Reveal temperament="cycle" delay={0.06}>
      <div
        tabIndex={0}
        onMouseEnter={notice}
        onFocus={notice}
        className="h-full border border-[var(--world-line)] bg-[var(--world-bg)] p-5 sm:p-6"
      >
        <p className="microlabel !text-[var(--world-text)]/55">{FLAKE.title}</p>
        {/* Three reruns; agreement is the reading */}
        <p aria-hidden="true" className="mt-4 flex items-center gap-2 font-mono text-[10px] text-velith-amber/80">
          <span>RUN 1 ✓</span><span>RUN 2 ✓</span><span>RUN 3 ✓</span>
          <span className="text-[var(--world-text)]/45">→ AGREEMENT</span>
        </p>
        <p className="mt-4 text-xs leading-relaxed text-[var(--world-text)]/70">
          <FactText fact={FLAKE.body} />
        </p>
        <p className="marginalia mt-3 text-xs">
          <FactText fact={FLAKE.reading} />
        </p>
      </div>
    </Reveal>
  );
}

export function LedgerPage() {
  const notice = useDiscovery("read: the ledger's repaired page (D16)");
  return (
    <Reveal temperament="cycle">
      <div
        tabIndex={0}
        onMouseEnter={notice}
        onFocus={notice}
        className="relative mx-auto max-w-2xl border border-[var(--world-line)] bg-[var(--world-bg)] p-6 sm:p-8"
      >
        {/* The repair seam: a visible mend across the page */}
        <span
          aria-hidden="true"
          className="absolute inset-y-4 left-8 w-px bg-velith-amber/35"
          style={{
            maskImage:
              "repeating-linear-gradient(to bottom, black 0 7px, transparent 7px 12px)",
          }}
        />
        <p className="microlabel !text-[var(--world-text)]/55">{LEDGER_D16.title}</p>
        <blockquote className="mt-5 border-l-2 border-velith-amber/50 pl-5">
          <p className="fact text-sm italic leading-relaxed text-[var(--world-text)]/80" tabIndex={0}>
            {LEDGER_D16.verbatim}
            <span className="fact-source">⌁ {LEDGER_D16.source} — reproduced verbatim</span>
          </p>
        </blockquote>
        <p className="mt-5 text-xs leading-relaxed text-[var(--world-text)]/55">
          <FactText fact={LEDGER_D16.reading} />
        </p>
      </div>
    </Reveal>
  );
}
