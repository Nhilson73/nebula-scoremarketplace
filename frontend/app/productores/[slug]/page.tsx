import { notFound } from "next/navigation";
import { Shell } from "@/components/Shell";
import { LotCard } from "@/components/LotCard";
import { fetchProducerBySlug, fetchLots } from "@/lib/api";
import { DEMO_PRODUCERS } from "@/lib/demo-data";

export async function generateStaticParams() {
  return DEMO_PRODUCERS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const producer = await fetchProducerBySlug(slug);
  return { title: producer ? producer.business_name : "Productor" };
}

export default async function ProducerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const producer = await fetchProducerBySlug(slug);
  if (!producer) notFound();

  const allLots = await fetchLots();
  const lots = allLots.filter((l) => l.producer_id === producer.id);

  return (
    <Shell>
      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-primary/10 bg-card p-8">
            <h1 className="text-3xl font-bold md:text-5xl">{producer.business_name}</h1>
            <p className="mt-2 text-lg text-foreground/80">{producer.region}, {producer.country}</p>
            <p className="mt-4 text-foreground/80">{producer.bio}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              <span className="rounded-full bg-surface px-3 py-1">NFB: {producer.nfb_tier}</span>
              <span className="rounded-full bg-surface px-3 py-1">NOB: {producer.nob_plan || "Pendiente"}</span>
              {producer.verified && <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">Verificado</span>}
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold">Lotes publicados</h2>
            {lots.length === 0 ? (
              <p className="mt-4 text-foreground/70">No hay lotes publicados aún.</p>
            ) : (
              <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {lots.map((lot) => (
                  <LotCard key={lot.public_id} lot={lot} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </Shell>
  );
}
