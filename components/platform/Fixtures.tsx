"use client";

import { useState } from "react";
import {
  CI_PLAQUE,
  PRIME_DIRECTIVE,
  REFERENCE_RULE,
  REFERENCE_WING,
  REGISTRY_CASE,
  SEAL,
} from "@/lib/canon-platform";
import { FACT_CERTIFIED, FACT_NOETICA_FROZEN } from "@/lib/canon";
import { logEvent } from "@/lib/session";
import { FactText, Reveal } from "@/components/ui/Reveal";

/**
 * Fixtures of the Platform Hall (CDD Scene 4):
 *
 * FreezeSeal — the hall's centerpiece: the freeze tag and the real
 *   certification figures, engraved plainly. Stillness is the point.
 *
 * RegistryCase — the experience's boldest act of honesty: a prominent,
 *   completely empty display case with a placard.
 *
 * ReferenceWing — three shelves behind glass: visible, beautiful,
 *   physically unreachable. The glass is CI.
 *
 * CiPlaque — a small discovery for the patient: the boundaries are
 *   machinery, not discipline.
 */

export function FreezeSeal() {
  return (
    <Reveal temperament="execute">
      <div className="plate border border-platform-steel/40 bg-[var(--world-bg)] p-8 sm:p-10">
        <p className="microlabel !text-[var(--world-text)]/55">THE FREEZE SEAL</p>
        <p className="mt-3 font-mono text-lg tracking-[0.14em] text-platform-steel sm:text-xl">
          {SEAL.tag}
        </p>
        <dl className="mt-8 grid grid-cols-2 gap-px border border-[var(--world-line)] bg-[var(--world-line)] sm:grid-cols-4">
          {SEAL.figures.map((f) => (
            <div key={f.label} className="bg-[var(--world-bg)] p-4">
              <dd className="font-mono text-xl text-[var(--world-text)]">{f.value}</dd>
              <dt className="microlabel mt-2 !text-[8.5px]">{f.label}</dt>
            </div>
          ))}
        </dl>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[var(--world-text)]/70">
          <FactText fact={SEAL.statement} />
        </p>
        <p className="mt-4 max-w-2xl text-xs italic leading-relaxed text-[var(--world-text)]/45">
          <FactText fact={SEAL.stillness} />
        </p>
        <p className="mt-4 text-xs leading-relaxed text-[var(--world-text)]/55">
          <FactText fact={FACT_NOETICA_FROZEN} /> <FactText fact={FACT_CERTIFIED} />
        </p>
      </div>
    </Reveal>
  );
}

export function RegistryCase() {
  const [seen, setSeen] = useState(false);
  const notice = () => {
    if (!seen) {
      setSeen(true);
      logEvent("discovery", "found: the empty Primitive Registry case");
    }
  };
  return (
    <Reveal temperament="execute">
      <div
        tabIndex={0}
        onMouseEnter={notice}
        onFocus={notice}
        className="glass-seal border border-[var(--world-line)] bg-[var(--world-bg)]"
      >
        {/* The case: deliberately, prominently empty. */}
        <div className="flex h-40 items-center justify-center sm:h-48">
          <span className="microlabel !text-[9px] !text-[var(--world-text)]/25">
            — NOTHING IS DISPLAYED HERE —
          </span>
        </div>
        <div className="border-t border-[var(--world-line)] p-4">
          <p className="text-xs leading-relaxed text-[var(--world-text)]/70">
            <FactText fact={REGISTRY_CASE} />
          </p>
        </div>
      </div>
    </Reveal>
  );
}

export function ReferenceWing() {
  const [seen, setSeen] = useState(false);
  const notice = () => {
    if (!seen) {
      setSeen(true);
      logEvent("discovery", "found: the reference wing behind glass");
    }
  };
  return (
    <Reveal temperament="execute">
      <div
        tabIndex={0}
        onMouseEnter={notice}
        onFocus={notice}
        className="glass-seal border border-[var(--world-line)] bg-[var(--world-bg)]"
      >
        <div className="p-5 sm:p-6">
          <p className="microlabel !text-[var(--world-text)]/55">
            THE REFERENCE WING — BEHIND GLASS
          </p>
          <ul className="mt-5 space-y-4">
            {REFERENCE_WING.map((shelf) => (
              <li key={shelf.path} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-mono text-[11px] tracking-[0.06em] text-[var(--world-text)]/80">
                  {shelf.path}
                </span>
                <span className="text-[11px] italic text-[var(--world-text)]/45">
                  {shelf.holds} · owner: {shelf.owner}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="border-t border-[var(--world-line)] p-4">
          <p className="text-xs leading-relaxed text-[var(--world-text)]/70">
            <FactText fact={REFERENCE_RULE} />
          </p>
        </div>
      </div>
    </Reveal>
  );
}

export function CiPlaque() {
  const [seen, setSeen] = useState(false);
  const notice = () => {
    if (!seen) {
      setSeen(true);
      logEvent("discovery", "read: the CI enforcement plaque");
    }
  };
  return (
    <Reveal temperament="execute">
      <div
        tabIndex={0}
        onMouseEnter={notice}
        onFocus={notice}
        className="mx-auto max-w-2xl border-l border-platform-steel/50 pl-5"
      >
        <p className="text-xs leading-relaxed text-[var(--world-text)]/60">
          <FactText fact={CI_PLAQUE} />
        </p>
        <p className="mt-3 text-xs italic leading-relaxed text-[var(--world-text)]/45">
          <FactText fact={PRIME_DIRECTIVE} />
        </p>
      </div>
    </Reveal>
  );
}
