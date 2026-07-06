"use client";

import { LADDER, LADDER_RULE, LADDER_SOURCE, VERIFIER_GAP } from "@/lib/canon-horizon";
import { FactText, Reveal } from "@/components/ui/Reveal";

/**
 * THE LADDER WALL (CDD Scene 7) — the migration ladder as literal rungs,
 * and beside each rung the same verifier lamp shown with progressively
 * wider, softer light: exact light becoming honest approximation. The
 * model-gap made visible without a paragraph.
 *
 * Rung 1 is CURRENT (Velith stands at M2 on the SWE rung); everything
 * below it is AHEAD — pre-committed, not promised.
 */

/** The lamp: glow radius and softness grow with the declared model-gap. */
function GapLamp({ gap }: { gap: number }) {
  const blur = 3 + gap * 5;
  const spread = 1 + gap * 2.5;
  const alpha = 0.75 - gap * 0.13;
  return (
    <span
      aria-hidden="true"
      className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-dawn"
      style={{
        boxShadow: `0 0 ${blur}px ${spread}px rgba(92,127,160,${alpha})`,
        opacity: 0.55 + (3 - gap) * 0.15,
      }}
    />
  );
}

export default function LadderWall() {
  return (
    <div>
      <ol className="border-t border-[var(--world-line)]">
        {LADDER.map((rung, i) => (
          <Reveal key={rung.n} temperament="breathe" delay={i * 0.07}>
            <li className="grid grid-cols-[2rem_1.5rem_1fr] items-start gap-4 border-b border-[var(--world-line)] py-6 sm:grid-cols-[3rem_2rem_16rem_1fr]">
              <span className="font-mono text-[10px] tracking-[0.24em] text-dawn">
                R{rung.n}
              </span>
              <GapLamp gap={rung.gap} />
              <span className="col-span-1">
                <span className="block font-mono text-sm tracking-[0.04em] text-[var(--world-text)]">
                  {rung.name}
                </span>
                <span
                  className={`microlabel mt-1.5 block !text-[8.5px] ${
                    rung.status.startsWith("CURRENT")
                      ? "!text-velith-amber"
                      : "!text-[var(--world-text)]/35"
                  }`}
                >
                  {rung.status}
                </span>
              </span>
              <span className="col-span-3 mt-2 text-sm leading-relaxed text-[var(--world-text)]/60 sm:col-span-1 sm:mt-0">
                <FactText fact={{ text: rung.detail, source: LADDER_SOURCE }} />
              </span>
            </li>
          </Reveal>
        ))}
      </ol>
      <Reveal temperament="breathe" delay={0.1}>
        <div className="mt-6 space-y-3">
          <p className="max-w-3xl text-xs leading-relaxed text-[var(--world-text)]/55">
            <FactText fact={LADDER_RULE} />
          </p>
          <p className="max-w-3xl text-xs leading-relaxed text-[var(--world-text)]/45">
            <FactText fact={VERIFIER_GAP} />
          </p>
        </div>
      </Reveal>
    </div>
  );
}
