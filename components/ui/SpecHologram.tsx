"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LAB, TOWER_HALLS, WORLD_COLORS, type WorldTargetId } from "@/lib/world";
import { EASE } from "@/lib/motion";

/**
 * SPEC HOLOGRAM — the Living Operator Layer's projection instrument.
 *
 * When the operator attends a structure, its designation panel projects a
 * small schematic of the object — and the schematic is not an icon: it is
 * DRAWN FROM THE WORLD SPEC ITSELF. Hall projections take their
 * proportions from the same HallSpec the WebGL world renders; flow
 * projections are the three grammars, each moving only in its legal
 * direction (dashes crossing once, solid standing, records rising).
 * The caption says so: PROJECTION — FROM WORLD SPEC. Even the hologram
 * has provenance.
 *
 * Presentation only (aria-hidden); the panel's text carries the meaning.
 * Reduced motion: the projection appears settled, grammar motion off.
 */

const ISO = 0.32; // pseudo-isometric depth ratio

function hallSpec(id: WorldTargetId) {
  return TOWER_HALLS.find((h) => h.id === id) ?? (LAB.id === id ? LAB : null);
}

export default function SpecHologram({ target }: { target: WorldTargetId }) {
  const reduced = useReducedMotion();
  const spec = hallSpec(target);
  const accent = WORLD_COLORS[target] ?? WORLD_COLORS.structure;

  const geometry = useMemo(() => {
    if (!spec) return null;
    // Proportional front face + isometric depth, normalized into 84×84.
    const [w, h, d] = spec.size;
    const scale = 52 / Math.max(w, h + d * ISO);
    const fw = w * scale;
    const fh = h * scale;
    const dx = d * scale * ISO;
    const dy = d * scale * ISO * 0.7;
    const x0 = (84 - fw - dx) / 2;
    const y0 = (84 - fh + dy) / 2;
    return { fw, fh, dx, dy, x0, y0 };
  }, [spec]);

  const build = reduced
    ? {}
    : {
        initial: { clipPath: "inset(0 0 100% 0)", opacity: 0.4 },
        animate: { clipPath: "inset(0 0 0% 0)", opacity: 1 },
        transition: {
          duration: 0.5,
          ease: [...EASE.session] as [number, number, number, number],
        },
      };

  return (
    <figure aria-hidden="true" className="w-[84px] shrink-0">
      <motion.svg key={target} viewBox="0 0 84 84" className="w-full" {...build}>
        {spec && geometry && (
          <g stroke={accent} fill="none" strokeWidth="1">
            {/* Front face */}
            <rect
              x={geometry.x0}
              y={geometry.y0}
              width={geometry.fw}
              height={geometry.fh}
              strokeOpacity="0.9"
            />
            {/* Depth edges */}
            <path
              d={`M ${geometry.x0} ${geometry.y0} l ${geometry.dx} ${-geometry.dy}
                  h ${geometry.fw} l ${-geometry.dx} ${geometry.dy}
                  M ${geometry.x0 + geometry.fw} ${geometry.y0} l ${geometry.dx} ${-geometry.dy}
                  v ${geometry.fh} l ${-geometry.dx} ${geometry.dy}`}
              strokeOpacity="0.45"
            />
            {/* The laboratory's real windows */}
            {target === "miniflywire" &&
              [0, 1, 2].map((i) => (
                <rect
                  key={i}
                  x={geometry.x0 + 7 + i * 14}
                  y={geometry.y0 + geometry.fh * 0.3}
                  width="8"
                  height="6"
                  fill={WORLD_COLORS.labWindow}
                  fillOpacity="0.6"
                  stroke="none"
                />
              ))}
          </g>
        )}

        {target === "knowledge" && (
          <g stroke={WORLD_COLORS.bridge}>
            <line x1="10" y1="42" x2="74" y2="42" strokeDasharray="5 4" strokeOpacity="0.8" />
            {!reduced && (
              <motion.circle
                r="2.5"
                cy="42"
                fill={WORLD_COLORS.bridge}
                stroke="none"
                animate={{ cx: [12, 72], opacity: [0, 1, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.4 }}
              />
            )}
          </g>
        )}

        {target === "code" && (
          <g stroke={WORLD_COLORS.spine}>
            <line x1="42" y1="12" x2="42" y2="72" strokeOpacity="0.9" />
            <path d="M 38 66 L 42 72 L 46 66" fill="none" strokeOpacity="0.9" />
            <line x1="30" y1="30" x2="54" y2="30" strokeOpacity="0.4" />
            <line x1="30" y1="50" x2="54" y2="50" strokeOpacity="0.4" />
          </g>
        )}

        {target === "experience" &&
          [0, 1, 2, 3].map((i) => (
            <motion.circle
              key={i}
              cx={30 + i * 8}
              r="2"
              fill={WORLD_COLORS.drift}
              animate={
                reduced
                  ? undefined
                  : { cy: [70, 14], opacity: [0, 0.9, 0] }
              }
              cy={reduced ? 42 - i * 8 : undefined}
              opacity={reduced ? 0.7 : undefined}
              transition={{
                duration: 3.2,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.8,
              }}
            />
          ))}
      </motion.svg>
      <figcaption className="microlabel mt-1.5 !text-[7.5px] !tracking-[0.16em] !text-[inherit] opacity-40">
        PROJECTION — FROM WORLD SPEC
      </figcaption>
    </figure>
  );
}
