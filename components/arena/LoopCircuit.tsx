"use client";

import { motion, useReducedMotion } from "framer-motion";
import { LOOP } from "@/lib/canon-arena";
import { FactText, Reveal } from "@/components/ui/Reveal";

/**
 * THE LOOP CIRCUIT (CDD Scene 6) — the room's center.
 *
 * Propose → verify → log rendered as a physical circuit. The verify
 * station is drawn as what it is: a container whose test phase is
 * network-dark (the hatched interior). A single pulse travels the
 * circuit on the `cycle` rhythm — a depiction of the mechanism's shape,
 * labeled as the loop the record ran at M1/M2, not as live work.
 *
 * The three station dossiers below the diagram carry the meaning
 * (screen-reader-real); the SVG is presentation.
 */

const STATION_X = [80, 300, 520];
const Y = 86;

export default function LoopCircuit({ frozen = false }: { frozen?: boolean }) {
  const reduced = useReducedMotion() || frozen;

  return (
    <figure>
      <svg viewBox="0 0 600 190" className="w-full" aria-hidden="true">
        {/* The circuit path: forward along the top, return along the bottom */}
        <path
          d={`M ${STATION_X[0]} ${Y} H ${STATION_X[2]} M ${STATION_X[2]} ${Y + 26} C ${STATION_X[2]} ${Y + 74}, ${STATION_X[0]} ${Y + 74}, ${STATION_X[0]} ${Y + 26}`}
          fill="none"
          stroke="var(--color-velith-amber)"
          strokeOpacity="0.3"
          strokeWidth="1"
        />
        <text x={295} y={Y + 66} fontSize="8" fill="var(--color-velith-amber)"
          opacity="0.55" textAnchor="middle" fontFamily="var(--font-mono)">
          the next task enters with the last episode retained
        </text>

        {/* Stations */}
        {LOOP.map((stage, i) => (
          <g key={stage.id} transform={`translate(${STATION_X[i]} ${Y})`}>
            {stage.id === "verify" ? (
              <>
                {/* The container: sealed walls, network-dark interior */}
                <rect x="-46" y="-30" width="92" height="56" fill="var(--world-bg)"
                  stroke="var(--color-velith-amber)" strokeOpacity="0.85" />
                <pattern id="dark" width="6" height="6" patternUnits="userSpaceOnUse"
                  patternTransform="rotate(45)">
                  <line x1="0" y1="0" x2="0" y2="6"
                    stroke="var(--color-velith-amber)" strokeOpacity="0.14" />
                </pattern>
                <rect x="-40" y="-12" width="80" height="32" fill="url(#dark)" />
                <text x="0" y="-17" fontSize="9.5" textAnchor="middle"
                  fill="var(--world-text)" fontFamily="var(--font-mono)">
                  {stage.name}
                </text>
                <text x="0" y="14" fontSize="6.5" textAnchor="middle"
                  fill="var(--world-text)" opacity="0.55" fontFamily="var(--font-mono)">
                  network-dark test phase
                </text>
              </>
            ) : (
              <>
                <rect x="-40" y="-22" width="80" height="44" fill="var(--world-bg)"
                  stroke="var(--color-velith-amber)" strokeOpacity="0.55" />
                <text x="0" y="4" fontSize="9.5" textAnchor="middle"
                  fill="var(--world-text)" fontFamily="var(--font-mono)">
                  {stage.name}
                </text>
              </>
            )}
          </g>
        ))}

        {/* The pulse: one unit of work on the cycle rhythm */}
        {!reduced && (
          <motion.circle
            r="3.5"
            fill="var(--color-velith-amber)"
            initial={false}
            animate={{
              cx: [STATION_X[0], STATION_X[1], STATION_X[1], STATION_X[2], STATION_X[0]],
              cy: [Y, Y, Y, Y, Y],
              opacity: [0.9, 0.9, 0.25, 0.9, 0],
            }}
            transition={{
              duration: 4.2,
              times: [0, 0.3, 0.55, 0.8, 1],
              repeat: Infinity,
              ease: "linear",
            }}
          />
        )}
      </svg>

      {/* Station dossiers — the meaning lives here */}
      <figcaption className="mt-2 grid gap-4 md:grid-cols-3">
        {LOOP.map((stage, i) => (
          <Reveal key={stage.id} temperament="cycle" delay={i * 0.06}>
            <div className="border-t border-velith-amber/40 pt-3">
              <p className="font-mono text-[10px] tracking-[0.24em] text-velith-amber">
                {stage.name}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-[var(--world-text)]/70">
                <FactText fact={stage.detail} />
              </p>
            </div>
          </Reveal>
        ))}
      </figcaption>
    </figure>
  );
}
