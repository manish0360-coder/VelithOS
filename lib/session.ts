/**
 * SESSION — "the visitor is an operator, and the session is an episode."
 * (CDD Principle 7.)
 *
 * A module-singleton store, deliberately outside React state:
 *  - `provision()` creates (or resumes) the bounded session exactly once;
 *  - `logEvent()` appends to an append-only event log, mirrored to
 *    sessionStorage so a reload resumes rather than restarts;
 *  - `seal()` freezes the log and computes a real SHA-256 over its
 *    canonical serialization — the hash shown at departure is the hash
 *    of what actually happened.
 *
 * Components subscribe through `useSession()` (useSyncExternalStore), so
 * high-frequency systems never re-render React and display surfaces update
 * only when the record actually changes.
 */

import { useSyncExternalStore } from "react";
import { canonicalSerialize, sha256Hex } from "./hash";

export interface SessionEvent {
  readonly at: string; // ISO timestamp
  readonly kind: "provision" | "scene" | "discovery" | "operate" | "seal";
  readonly detail: string;
}

export interface SessionState {
  readonly id: string;
  readonly startedAt: string;
  readonly clearance: string;
  readonly resumed: boolean;
  readonly events: readonly SessionEvent[];
  readonly sealedHash: string | null;
}

const STORAGE_KEY = "velith:session:v1";

const EMPTY: SessionState = {
  id: "",
  startedAt: "",
  clearance: "",
  resumed: false,
  events: [],
  sealedHash: null,
};

let state: SessionState = EMPTY;
const listeners = new Set<() => void>();

function emit(): void {
  for (const l of listeners) l();
}

function persist(): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage unavailable (private mode, quota): the session still works
    // in memory; it simply cannot survive a reload.
  }
}

function newId(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(4)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

/** Idempotent. Creates the session on first call; resumes a stored one. */
export function provision(clearance: string): SessionState {
  if (state.id !== "") return state;

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const stored = JSON.parse(raw) as SessionState;
      if (stored.id) {
        state = { ...stored, resumed: true };
        emit();
        return state;
      }
    }
  } catch {
    // Corrupt storage: fall through to a fresh session.
  }

  const now = new Date().toISOString();
  state = {
    id: newId(),
    startedAt: now,
    clearance,
    resumed: false,
    events: [{ at: now, kind: "provision", detail: "session provisioned" }],
    sealedHash: null,
  };
  persist();
  emit();
  return state;
}

/** Append-only. Ignored after sealing — a sealed record does not change. */
export function logEvent(kind: SessionEvent["kind"], detail: string): void {
  if (state.id === "" || state.sealedHash !== null) return;
  // Scene entries are logged once; repeat visits to a scene are not events.
  if (
    kind === "scene" &&
    state.events.some((e) => e.kind === "scene" && e.detail === detail)
  ) {
    return;
  }
  state = {
    ...state,
    events: [
      ...state.events,
      { at: new Date().toISOString(), kind, detail },
    ],
  };
  persist();
  emit();
}

/** Freezes the log and computes the record's SHA-256. Idempotent. */
export async function seal(): Promise<string> {
  if (state.sealedHash !== null) return state.sealedHash;
  const sealedAt = new Date().toISOString();
  const record = {
    id: state.id,
    startedAt: state.startedAt,
    clearance: state.clearance,
    sealedAt,
    events: state.events.concat({
      at: sealedAt,
      kind: "seal",
      detail: "session record sealed",
    }),
  };
  const hash = await sha256Hex(canonicalSerialize(record));
  state = { ...state, events: record.events, sealedHash: hash };
  persist();
  emit();
  return hash;
}

/* ── React binding ─────────────────────────────────────────────────────── */

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getSnapshot = (): SessionState => state;
const getServerSnapshot = (): SessionState => EMPTY;

export function useSession(): SessionState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
