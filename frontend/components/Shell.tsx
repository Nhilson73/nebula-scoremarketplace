"use client";

import Link from "next/link";
import { useState } from "react";

const nav = [
  { label: "Inicio", href: "/" },
  { label: "Lotes", href: "/lotes/" },
  { label: "Evaluar", href: "/evaluar/" },
  { label: "NFB", href: "/catalogo/nfb/" },
  { label: "NOB", href: "/catalogo/nob/" },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-primary/10 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-primary"
            onClick={() => setOpen(false)}
          >
            Nebula ScoreMarketplace®
          </Link>
          <nav className="hidden gap-6 text-sm font-medium md:flex">
            {nav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="inline-flex min-h-[44px] items-center text-foreground/80 transition hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-md text-foreground/80 md:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            {open ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
        {open && (
          <nav className="border-t border-primary/10 bg-background px-4 py-4 md:hidden">
            <div className="flex flex-col gap-4">
              {nav.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium text-foreground/80 hover:text-primary"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-primary/10 bg-surface px-4 py-12">
        <div className="mx-auto max-w-7xl text-center text-sm text-foreground/50">
          <p>© {new Date().getFullYear()} Cafelium SRL. Nebula Score®, Nebula Fermentation® y Nebula OriginBlok® son marcas del ecosistema Nebula.</p>
          <p className="mt-2">Lotes marcados con [DEMO] son datos de demostración.</p>
        </div>
      </footer>
    </div>
  );
}
