"use client";

import Link from "next/link";
import type { DemoLot } from "@/lib/demo-data";
import { ScoreBadge } from "./ScoreBadge";

export function LotCard({
  lot,
  onDelete,
}: {
  lot: DemoLot;
  onDelete?: (publicId: string) => void;
}) {
  return (
    <div className="group relative flex flex-col rounded-3xl border border-primary/10 bg-card p-6 transition hover:border-primary/30">
      <Link href={`/lotes/?lot=${lot.public_id}`} className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-semibold text-foreground group-hover:text-primary">
              {lot.lot_name}
            </h3>
            <p className="text-sm text-foreground/70">
              {lot.farm_name} · {lot.region}
            </p>
          </div>
          <ScoreBadge snapshot={lot.nebula_score_snapshot} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-sm text-foreground/80">
          {lot.variety && (
            <span className="rounded-full bg-surface px-3 py-1">{lot.variety}</span>
          )}
          {lot.process_method && (
            <span className="rounded-full bg-surface px-3 py-1">{lot.process_method}</span>
          )}
          {lot.altitude_m != null && (
            <span className="rounded-full bg-surface px-3 py-1">{lot.altitude_m} msnm</span>
          )}
        </div>
        <p className="mt-4 line-clamp-2 text-sm text-foreground/70">{lot.description}</p>
      </Link>
      {onDelete && !lot.is_demo && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(lot.public_id);
          }}
          className="absolute bottom-4 right-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10 text-red-400 transition hover:bg-red-500/20"
          aria-label="Eliminar lote"
          title="Eliminar lote"
        >
          ×
        </button>
      )}
    </div>
  );
}
