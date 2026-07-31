"use client";

import type { DemoLot } from "@/lib/demo-data";

export function ScoreBadge({ snapshot }: { snapshot: DemoLot["nebula_score_snapshot"] }) {
  const score = typeof snapshot.nebula_score === "number" ? snapshot.nebula_score.toFixed(1) : "—";
  return (
    <div className="inline-flex flex-col rounded-2xl border border-primary/20 bg-card p-4 text-center">
      <span className="text-xs font-semibold uppercase tracking-wide text-foreground/60">Nebula Score®</span>
      <span className="text-3xl font-bold text-primary">{score}</span>
      <span className="text-xs text-foreground/60">Confianza {snapshot.confidence_level}/5</span>
      {snapshot.mock && <span className="mt-1 text-[10px] text-gold uppercase">Demo</span>}
    </div>
  );
}
