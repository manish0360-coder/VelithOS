"use client";

import { useEffect, useRef } from "react";
import { attachInputListeners, damp, pointer } from "@/lib/inputs";

/**
 * Installs the global input listeners once and drives the attention field —
 * the illumination that follows the operator's attention (CDD Principle 4).
 *
 * The light's position is written as CSS custom properties from a rAF loop
 * with exponential smoothing; React renders exactly once. Under reduced
 * motion the field is hidden by the stylesheet and the loop never starts.
 */
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
    let x = window.innerWidth / 2;
    let y = window.innerHeight * 0.4;

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (pointer.active) {
        x = damp(x, pointer.x, 6, dt);
        y = damp(y, pointer.y, 6, dt);
        el.style.setProperty("--attention-on", "1");
      }
      el.style.setProperty("--attention-x", `${x.toFixed(1)}px`);
      el.style.setProperty("--attention-y", `${y.toFixed(1)}px`);
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
