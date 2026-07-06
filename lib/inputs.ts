/**
 * INPUT BUS — zero-re-render shared input state.
 *
 * Pointer and scroll are written into module-level mutable state by one
 * tracker component; consumers (the attention field, later the WebGL world)
 * read them inside their own rAF loops. Nothing here ever triggers a React
 * render — the 60 fps path stays out of the reconciler entirely.
 *
 * "Attention" is the canonical name for the operator's pointer/focus
 * coordinate (CDD Principle 4: attention is light). Keyboard focus writes
 * the same coordinate as the pointer, so both operators are lit identically.
 */

export interface PointerState {
  /** viewport px */
  x: number;
  y: number;
  /** normalized −1..1 (+y up), for world-space consumers */
  nx: number;
  ny: number;
  /** normalized velocity (units/s) — consumers damp it themselves */
  vx: number;
  vy: number;
  /** performance.now() of the last movement (presence/idle detection) */
  lastMove: number;
  /** true once any pointer/focus input has arrived */
  active: boolean;
}

export interface ScrollState {
  y: number;
  /** 0..1 across the whole document */
  progress: number;
}

export const pointer: PointerState = {
  x: 0, y: 0, nx: 0, ny: 0, vx: 0, vy: 0, lastMove: 0, active: false,
};
export const scroll: ScrollState = { y: 0, progress: 0 };

function setAttention(x: number, y: number): void {
  const now = performance.now();
  const dt = Math.min(0.1, Math.max(0.008, (now - pointer.lastMove) / 1000));
  const nx = (x / window.innerWidth) * 2 - 1;
  const ny = -((y / window.innerHeight) * 2 - 1);
  if (pointer.active) {
    pointer.vx = (nx - pointer.nx) / dt;
    pointer.vy = (ny - pointer.ny) / dt;
  }
  pointer.x = x;
  pointer.y = y;
  pointer.nx = nx;
  pointer.ny = ny;
  pointer.lastMove = now;
  pointer.active = true;
}

/**
 * Surface light: writes the pointer's element-local position as CSS vars
 * consumed by the `.lit` utility. One shared writer, zero React renders —
 * the operator's attention lighting every operable surface it touches.
 */
export function surfaceLight(e: { currentTarget: HTMLElement; clientX: number; clientY: number }): void {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--sx", `${(e.clientX - r.left).toFixed(1)}px`);
  el.style.setProperty("--sy", `${(e.clientY - r.top).toFixed(1)}px`);
}

export function attachInputListeners(): () => void {
  const onPointer = (e: PointerEvent) => setAttention(e.clientX, e.clientY);

  // Keyboard focus is the same attention, differently instrumented:
  // the focused element's center becomes the attention coordinate.
  const onFocus = (e: FocusEvent) => {
    const el = e.target;
    if (el instanceof HTMLElement) {
      const r = el.getBoundingClientRect();
      setAttention(r.left + r.width / 2, r.top + r.height / 2);
    }
  };

  const onScroll = () => {
    const max = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight,
    );
    scroll.y = window.scrollY;
    scroll.progress = Math.min(1, scroll.y / max);
    // Contextual reflections: the .plate sheen is positioned by descent
    // depth, so panel materials respond to where the operator is in the
    // journey — a reflection of the world, not an animation.
    document.documentElement.style.setProperty(
      "--journey-depth",
      scroll.progress.toFixed(4),
    );
  };

  window.addEventListener("pointermove", onPointer, { passive: true });
  window.addEventListener("focusin", onFocus);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  return () => {
    window.removeEventListener("pointermove", onPointer);
    window.removeEventListener("focusin", onFocus);
    window.removeEventListener("scroll", onScroll);
  };
}

/** Frame-rate independent exponential smoothing. */
export function damp(
  current: number,
  target: number,
  lambda: number,
  dt: number,
): number {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}
