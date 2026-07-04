"use client";

import { useEffect, useState } from "react";
import { scroll } from "@/lib/inputs";
import { useSession } from "@/lib/session";

/**
 * Bottom chrome. Samples the input bus at 8 Hz (never per-frame) for
 * descent depth, and reflects the live length of the session record —
 * a quiet, truthful reminder that the visit is being written down.
 */
export default function DepthRail() {
  const session = useSession();
  const [depth, setDepth] = useState("000");

  useEffect(() => {
    const id = setInterval(() => {
      setDepth(String(Math.round(scroll.progress * 100)).padStart(3, "0"));
    }, 125);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 hidden border-t border-line bg-void/60 backdrop-blur-md md:block"
      aria-hidden="true"
    >
      <div className="mx-auto flex h-8 max-w-6xl items-center justify-between px-8">
        <span className="microlabel">
          RECORD{" "}
          <span className="text-phosphor">
            {String(session.events.length).padStart(2, "0")}
          </span>{" "}
          EVENTS{session.sealedHash ? " — SEALED" : ""}
        </span>
        <span className="microlabel text-faint">
          ONE OPERATOR SESSION — BOUNDED, RECORDED
        </span>
        <span className="microlabel">
          DEPTH <span className="text-phosphor">{depth}%</span>
        </span>
      </div>
    </div>
  );
}
