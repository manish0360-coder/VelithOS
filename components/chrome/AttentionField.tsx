"use client";

import { useEffect, useRef } from "react";
import { attachInputListeners, damp, pointer } from "@/lib/inputs";
import { WORLD_COLORS } from "@/lib/world";
import type { LayerId } from "@/lib/canon";

/**
 * ATTENTION FIELD v2 — the Living Operator Layer's illuminant.
 *
 * Still the same mechanism (Principle 4: attention is light), now spatial:
 *
 *  - TINT: the light takes the accent of the world the operator is
 *    currently inside. An 8 Hz probe finds the [data-layer] section under
 *    the viewport center and looks its accent up in WORLD_COLORS — the
 *    same table the WebGL world uses, so DOM light and world light agree.
 *  - PRESENCE: when the operator idles (>4 s without movement) the light
 *    breathes gently — the session is still attending, waiting. Movement
 *    collapses the breath instantly.
 *
 * Everything is CSS-variable mutation inside one rAF loop; React renders
 * exactly once. Hidden entirely under reduced motion (stylesheet).
 */

const HEX: Partial<Record<string, string>> = {
  miniflywire: WORLD_COLORS.miniflywire,
  noetica: WORLD_COLORS.noetica,
  velith: WORLD_COLORS.velith,
  prometheus: WORLD_COLORS.prometheus,
};
const DEFAULT_TINT = "226, 177, 105"; // phosphor — the session voice

function hexToRgb(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

export default function AttentionField() {
  const field = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const detach = attachInputListeners();
    const el = field.current;
    if (!el) return detach;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return detach;
    }

    let raf = 0;
    let last = performance.now();
    let lastProbe = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight * 0.4;
    let radius = 1;

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      if (pointer.active) {
        x = damp(x, pointer.x, 6, dt);
        y = damp(y, pointer.y, 6, dt);
        el.style.setProperty("--attention-on", "1");
      }

      // Presence: the light breathes while the operator is still.
      const idleFor = now - pointer.lastMove;
      const breathing = pointer.active && idleFor > 4000;
      const targetR = breathing
        ? 1 + 0.14 * Math.sin((now / 1000) * ((Math.PI * 2) / 5.5))
        : 1;
      radius = damp(radius, targetR, 3, dt);

      // World tint probe at 8 Hz — which atmosphere is the operator in?
      if (now - lastProbe > 125) {
        lastProbe = now;
        const at = document
          .elementFromPoint(window.innerWidth / 2, window.innerHeight / 2)
          ?.closest<HTMLElement>("[data-layer]");
        const layer = at?.dataset.layer as LayerId | undefined;
        const hex = layer ? HEX[layer] : undefined;
        el.style.setProperty(
          "--attention-tint",
          hex ? hexToRgb(hex) : DEFAULT_TINT,
        );
      }

      el.style.setProperty("--attention-x", `${x.toFixed(1)}px`);
      el.style.setProperty("--attention-y", `${y.toFixed(1)}px`);
      el.style.setProperty("--attention-r", radius.toFixed(3));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      detach();
    };
  }, []);

  return <div ref={field} className="attention-field" aria-hidden="true" />;
}
