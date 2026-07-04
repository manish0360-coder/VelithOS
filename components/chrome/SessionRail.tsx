"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/lib/canon";
import { useSession } from "@/lib/session";

/**
 * Top chrome — the session's persistent voice. Displays only session truth:
 * the interface name, the real session id, the clearance, live UTC.
 * Clock is set post-mount to avoid hydration drift.
 */
export default function SessionRail() {
  const session = useSession();
  const [clock, setClock] = useState("--:--:--");

  useEffect(() => {
    const tick = () =>
      setClock(new Date().toISOString().slice(11, 19) + " UTC");
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-void/70 backdrop-blur-md">
      <div className="mx-auto flex h-10 max-w-6xl items-center justify-between gap-4 px-4 sm:px-8">
        <a href="#manifest" className="flex items-baseline gap-3">
          <span className="font-mono text-[11px] font-medium tracking-[0.34em] text-text">
            VELITH
          </span>
          <span className="microlabel hidden text-faint md:inline">
            PUBLIC INTERFACE
          </span>
        </a>
        <div className="flex items-center gap-4 sm:gap-6">
          <span className="microlabel hidden sm:inline">
            SESSION{" "}
            <span className="text-phosphor">{session.id || "····"}</span>
          </span>
          <span className="microlabel hidden md:inline">
            {session.sealedHash ? "CLEARANCE EXPIRED" : SITE.clearance.text}
          </span>
          <time className="microlabel text-text/80" suppressHydrationWarning>
            {clock}
          </time>
        </div>
      </div>
    </header>
  );
}
