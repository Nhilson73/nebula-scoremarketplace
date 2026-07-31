"use client";

import type { DemoLot } from "@/lib/demo-data";
import { ScoreBadge } from "./ScoreBadge";

export function LotDetail({
  lot,
  onDelete,
}: {
  lot: DemoLot;
  onDelete?: (publicId: string) => void;
}) {
  const snapshot = lot.nebula_score_snapshot;

  return (
    <div className="rounded-3xl border border-primary/10 bg-card p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold md:text-5xl">{lot.lot_name}</h1>
          <p className="mt-2 text-lg text-foreground/80">
            {lot.farm_name} · {lot.region}
            {lot.altitude_m != null && ` · ${lot.altitude_m} msnm`}
          </p>
        </div>
        <ScoreBadge snapshot={snapshot} />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-surface p-4 text-center">
          <span className="text-xs uppercase text-foreground/60">Sensory</span>
          <div className="text-2xl font-bold text-foreground">{snapshot.quality_score.toFixed(1)}</div>
        </div>
        <div className="rounded-2xl bg-surface p-4 text-center">
          <span className="text-xs uppercase text-foreground/60">Process</span>
          <div className="text-2xl font-bold text-foreground">{snapshot.process_score.toFixed(1)}</div>
        </div>
        <div className="rounded-2xl bg-surface p-4 text-center">
          <span className="text-xs uppercase text-foreground/60">Integrity</span>
          <div className="text-2xl font-bold text-foreground">{snapshot.integrity_score.toFixed(1)}</div>
        </div>
        <div className="rounded-2xl bg-surface p-4 text-center">
          <span className="text-xs uppercase text-foreground/60">Penalties</span>
          <div className="text-2xl font-bold text-foreground">{snapshot.total_penalties.toFixed(1)}</div>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <h2 className="text-2xl font-bold">Detalles del lote</h2>
        <p className="text-foreground/80">{lot.description}</p>
        <ul className="grid gap-2 text-sm text-foreground/80 sm:grid-cols-2">
          <li><strong>Variedad:</strong> {lot.variety || "—"}</li>
          <li><strong>Proceso:</strong> {lot.process_method}</li>
          <li><strong>Cosecha:</strong> {lot.harvest_year}</li>
          <li><strong>Cantidad disponible:</strong> {lot.quantity_available} {lot.unit}</li>
          <li>
            <strong>Precio referencia:</strong>{" "}
            {lot.reference_price ? `${lot.currency} ${lot.reference_price}` : "A convenir"}
          </li>
          <li>
            <strong>Trazabilidad NOB®:</strong>{" "}
            {lot.nob_traceability_ref?.status === "pending" ? "Pendiente de vincular" : lot.nob_traceability_ref?.status}
          </li>
          <li>
            <strong>Metodología:</strong> {snapshot.methodology_id} {snapshot.methodology_version}
          </li>
          <li>
            <strong>Confianza:</strong> {snapshot.confidence_level}/5
          </li>
        </ul>
      </div>

      {onDelete && !lot.is_demo && (
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={() => onDelete(lot.public_id)}
            className="rounded-2xl bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
          >
            Eliminar lote
          </button>
        </div>
      )}

      {lot.is_demo && (
        <div className="mt-8 rounded-2xl border border-gold/20 bg-gold/5 p-4 text-sm text-gold">
          Este lote es un demo. El flujo de solicitud/cotización se habilitará en V1.1.
        </div>
      )}
    </div>
  );
}
