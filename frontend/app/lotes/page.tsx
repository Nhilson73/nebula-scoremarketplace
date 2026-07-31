"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Shell } from "@/components/Shell";
import { LotCard } from "@/components/LotCard";
import { LotDetail } from "@/components/LotDetail";
import { useLots } from "@/lib/useLots";

function LotsCatalog() {
  const searchParams = useSearchParams();
  const selectedPublicId = searchParams.get("lot");
  const { lots, mounted, deleteLot, clearAll } = useLots();

  const selectedLot = selectedPublicId
    ? lots.find((l) => l.public_id === selectedPublicId)
    : undefined;

  const userLotsCount = lots.filter((l) => !l.is_demo).length;

  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold md:text-5xl">Explorar lotes</h1>
          <p className="mx-auto mt-4 max-w-2xl text-foreground/70">
            Lotes publicados con verificación Nebula Score®.
          </p>
        </div>

        <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {userLotsCount > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="rounded-2xl border border-red-400/30 px-5 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
            >
              Borrar todos mis lotes de prueba ({userLotsCount})
            </button>
          )}
        </div>

        {selectedLot && (
          <div className="mx-auto mt-10 max-w-4xl">
            <LotDetail lot={selectedLot} onDelete={deleteLot} />
          </div>
        )}

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {lots.map((lot) => (
            <LotCard key={lot.public_id} lot={lot} onDelete={deleteLot} />
          ))}
        </div>

        {!mounted && (
          <p className="mt-12 text-center text-foreground/60">Cargando lotes...</p>
        )}
      </div>
    </section>
  );
}

export default function LotsPage() {
  return (
    <Shell>
      <Suspense fallback={<p className="py-20 text-center text-foreground/60">Cargando catálogo...</p>}>
        <LotsCatalog />
      </Suspense>
    </Shell>
  );
}
