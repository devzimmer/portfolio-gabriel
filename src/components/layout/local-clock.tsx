"use client";

import { useEffect, useState } from "react";

const format = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Sao_Paulo",
  hour: "2-digit",
  minute: "2-digit",
});

/**
 * Gabriel's local time (UTC−3), so remote teams see the overlap at a glance.
 * Rendered after mount to avoid a server/client time mismatch.
 */
export function LocalClock({ label }: { label: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(format.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span>
      <span className="sr-only">{label}: </span>
      <time className="tabular-nums" suppressHydrationWarning>
        {time ?? "--:--"}
      </time>{" "}
      UTC−3
    </span>
  );
}
