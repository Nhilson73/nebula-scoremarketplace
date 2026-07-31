import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "@/components/Shell";
import { ScoreBadge } from "@/components/ScoreBadge";
import { fetchLotByPublicId } from "@/lib/api";
import { DEMO_LOTS } from "@/lib/demo-data";

export async function generateStaticParams() {
  return DEMO_LOTS.map((lot) => ({ publicId: lot.public_id }));
}

export async function generateMetadata({ params }: { params: Promise<{ publicId: string }> }) {
  const { publicId } = await params;
  const lot = await fetchLotByPublicId(publicId);
  return { title: lot ? lot.lot_name : "Lote" };
}

export default async function LotDetailPage({ params }: { params: Promise<{ publicId: string }> }) {
  const { publicId } = await params;
  const lot = await fetchLotByPublicId(publicId);
  if (!lot) notFound();

  const snapshot = lot.nebula_score_snapshot;

  return (
    <Shell>
      <section className="px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl border border-primary/10 bg-card p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div>
                <h1 className="text-3xl font-bold md:text-5xl">{lot.lot_name}</h1>
                <p className="mt-2 text-lg text-foreground/80">
                  {lot.farm_name} · {lot.region}
                  {lot.altitude_m != null && ` · ${lot.altitude_m} msnm`}
                </p>
                <Link href={`/productores/${lot.producer_slug}/`} className="mt-2 inline-block text-primary hover:underline">
                  Ver productor
                </Link>
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
                <li><strong>Variedad:</strong> {lot.variety}</li>
                <li><strong>Proceso:</strong> {lot.process_method}</li>
                <li><strong>Cosecha:</strong> {lot.harvest_year}</li>
                <li><strong>Cantidad disponible:</strong> {lot.quantity_available} {lot.unit}</li>
                <li><strong>Precio referencia:</strong> {lot.reference_price ? `${lot.currency} ${lot.reference_price}` : "A convenir"}</li>
                <li><strong>Trazabilidad NOB®:</strong> {lot.nob_traceability_ref?.status === "pending" ? "Pendiente de vincular" : lot.nob_traceability_ref?.status}</li>
                <li><strong>Metodología:</strong> {snapshot.methodology_id} {snapshot.methodology_version}</li>
              </ul>
            </div>

            {lot.is_demo && (
              <div className="mt-8 rounded-2xl border border-gold/20 bg-gold/5 p-4 text-sm text-gold">
                Este lote es un demo. El flujo de solicitud/cotización se habilitará en V1.1.
              </div>
            )}
          </div>
        </div>
      </section>
    </Shell>
  );
}
