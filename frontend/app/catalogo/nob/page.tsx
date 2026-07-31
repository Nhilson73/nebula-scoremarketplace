import { Shell } from "@/components/Shell";
import { TierCard } from "@/components/TierCard";
import { fetchNobTiers } from "@/lib/api";
import type { Tier } from "@/lib/demo-data";

export const metadata = {
  title: "Catálogo NOB",
};

export default async function NobCatalogPage() {
  const tiers = await fetchNobTiers();

  return (
    <Shell>
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold md:text-5xl">Nebula OriginBlok®</h1>
            <p className="mx-auto mt-4 max-w-2xl text-foreground/70">Planes de trazabilidad para conectar lotes con compradores verificados.</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {tiers.map((tier: Tier) => (
              <TierCard key={tier.slug} name={tier.name} description={tier.description} features={tier.key_features || []} price={tier.price} />
            ))}
          </div>
        </div>
      </section>
    </Shell>
  );
}
