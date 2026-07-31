# Nebula ScoreMarketplace® — Frontend

Next.js 16 + React 19 + Tailwind CSS v4.

## Scripts

```bash
npm install
npm run dev      # desarrollo
npm run build    # export estático
npm run lint     # eslint
```

El build estático se genera en `dist/` usando `output: "export"` y `trailingSlash: true`.

## Estructura relevante

- `app/evaluar/page.tsx` — formulario de evaluación
- `components/ScoreForm.tsx` — formulario de Nebula Score®
- `lib/engine.ts` — motor de puntuación cliente
- `lib/storage.ts` — almacenamiento de lotes en `localStorage`
- `lib/lot.ts` — conversión de evaluación a lote publicado
