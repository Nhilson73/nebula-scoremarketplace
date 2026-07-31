"use client";

import Link from "next/link";
import { Shell } from "@/components/Shell";
import { LotCard } from "@/components/LotCard";
import { useLots } from "@/lib/useLots";
import type { DemoLot } from "@/lib/demo-data";

export default function Home() {
  const { lots, mounted, deleteLot } = useLots();

  const featured = Object.values(
    lots.reduce<Record<string, DemoLot>>((acc, lot) => {
      if (!acc[lot.product_type]) acc[lot.product_type] = lot;
      return acc;
    }, {}),
  ).slice(0, 3);

  return (
    <Shell>
      <section className="relative overflow-hidden px-4 py-24 md:py-32">
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="text-center">
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
              ScoreMarketplace V1
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
              Lotes verificados con Nebula Score®
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl font-light text-foreground/90 md:text-2xl">
              Evalúa café, cacao y vino con Nebula Score® y publica los lotes directamente en el marketplace.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/evaluar/" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 text-lg font-semibold text-background transition hover:bg-accent">
                Nueva evaluación
              </Link>
              <Link href="/lotes/" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-accent px-8 py-4 text-lg font-semibold text-accent transition hover:bg-accent hover:text-background">
                Explorar lotes
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold md:text-5xl">Lotes destacados</h2>
            <p className="mx-auto mt-4 max-w-2xl text-foreground/70">
              {mounted ? "Muestra de lotes verificados con score Nebula." : "Cargando lotes..."}
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((lot) => (
              <LotCard key={lot.public_id} lot={lot} onDelete={deleteLot} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/lotes/" className="inline-flex items-center gap-2 rounded-xl bg-primary/10 px-6 py-3 font-semibold text-primary transition hover:bg-primary hover:text-background">
              Ver todos los lotes
            </Link>
          </div>
        </div>
      </section>
    </Shell>
  );
}
