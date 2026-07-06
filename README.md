# VELITH — Public Interface

The public interface of the Velith ecosystem (MiniFlyWire → Noetica →
Velith → Mini Prometheus). One authenticated operator session: the visitor
is provisioned, descends through the real architecture, operates the
Second Verdict, looks up through the Return, and departs with the sealed
SHA-256 record of their own visit.

Governed by the ratified **Creative Direction Document** and, above it,
**HANDBOOK v1.1** (the Constitution). The interface's first law:
**nothing fictional** — every displayed claim is a `Fact { text, source }`
traced to the project record.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (static prerender, strict types)
npm start
```

## The journey (scene order)

Clearance → The Overlook → The Laboratory (MiniFlyWire) → The Crossing →
The Platform Hall (Noetica) → The Interface Seam → The Arena (Velith,
with The Second Verdict) → The Horizon (Mini Prometheus) and The Return →
The Record.

## Architecture

```
lib/
  canon.ts               Core fact registry — the ONLY way prose reaches the screen
  canon-lab.ts           Laboratory record (hypotheses, falsification, gate)
  canon-platform.ts      Platform record (21 bays, seal, gated bays, seam)
  canon-arena.ts         Arena record (loop, verdicts, arms, D16, replay record)
  canon-horizon.ts       Horizon record (ladder, charter, machines, return)
  session.ts             The session-as-episode mechanism (provision/log/seal)
  inputs.ts              Zero-re-render input bus (pointer/scroll/attention)
  spotlight.ts           Shared attention target (DOM legend ↔ 3D world)
  motion.ts              The four temperaments — the only easing in the project
  hash.ts                Canonical serialization + SHA-256 (Web Crypto)
  world.ts               The Overlook's structure as data (derived from canon)
components/
  chrome/                Session rails, attention field, input tracker
  ui/                    Reveal (temperament-aware), FactText (citation-on-attention)
  world/                 WebGL Overlook (halls, lab, bridge, spine, drift, shader)
  lab/ platform/ arena/ horizon/   Scene instruments
  scenes/                The journey's scenes + the Journey shell
```

## Mechanisms worth knowing

- **Canon discipline** — components render `Fact`s; hovering or focusing
  any fact reveals its citation. Untraceable claims are unconstructible.
- **The session** — module-singleton, append-only, mirrored to
  sessionStorage; sealing computes a real SHA-256 over the canonical
  serialization of exactly the events shown.
- **The Second Verdict** — replays the recorded M1 fixture episode and
  re-runs the verifier's own hashing discipline in the browser; identical
  hash every run, verified independently in CI-style Node check.
- **Temperaments** — inquire (lab), execute (platform), cycle (arena),
  breathe (horizon), session (chrome). No component declares its own curve.
- **Reduced motion is an edition, not a fallback** — every scene ships a
  composed still/static form with full content parity.
- **Performance** — both WebGL canvases are lazy, section-scoped,
  IntersectionObserver-gated, and read scroll/pointer through mutable
  refs (zero React renders at 60 fps). DPR capped.

## Verification

```bash
npm run build                          # strict types + static prerender
npm start & curl -I localhost:3000     # HTTP 200
```

Manual checks: complete Clearance with any key; Tab through the Overlook
legend, the bay grid, the falsification stepper, and the Second Verdict;
run the station twice and compare the hashes; seal the session and read
your own record; repeat everything with prefers-reduced-motion on.
