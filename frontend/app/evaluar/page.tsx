"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Shell } from "@/components/Shell";
import { ScoreForm } from "@/components/ScoreForm";
import { addUserLot } from "@/lib/storage";
import type { Methodology } from "@/lib/types";
import type { DemoLot } from "@/lib/demo-data";

import coffeeV1 from "@/public/methodologies/coffee/v1.json";
import cacaoV1 from "@/public/methodologies/cacao/v1.json";
import wineV1 from "@/public/methodologies/wine/v1.json";

const METHODOLOGIES: Record<string, Methodology> = {
  coffee: coffeeV1 as unknown as Methodology,
  cacao: cacaoV1 as unknown as Methodology,
  wine: wineV1 as unknown as Methodology,
};

const PRODUCTS = [
  { key: "coffee", label: "Café" },
  { key: "cacao", label: "Cacao" },
  { key: "wine", label: "Vino" },
];

export default function EvaluarPage() {
  const router = useRouter();
  const [product, setProduct] = useState("coffee");
  const methodology = useMemo(() => METHODOLOGIES[product], [product]);

  const handleCreated = (lot: DemoLot) => {
    addUserLot(lot);
    router.push(`/lotes/?lot=${lot.public_id}`);
  };

  return (
    <Shell>
      <section className="px-4 py-12 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold md:text-5xl">Evaluar lote</h1>
            <p className="mx-auto mt-4 max-w-2xl text-foreground/70">
              Ingresa los datos del lote y calcula su Nebula Score®. Al guardar se publicará
              automáticamente en el marketplace.
            </p>
          </div>

          <div className="mb-8 flex justify-center">
            <div className="inline-flex rounded-2xl border border-primary/10 bg-card p-1">
              {PRODUCTS.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setProduct(p.key)}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    product === p.key
                      ? "bg-primary text-background"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <ScoreForm
            methodology={methodology}
            onSubmit={handleCreated}
            onCancel={() => router.push("/")}
          />
        </div>
      </section>
    </Shell>
  );
}
