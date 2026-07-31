# Nebula ScoreMarketplace®

Aplicación unificada que combina el motor de evaluación de **Nebula Score®** con el catálogo de **Nebula Marketplace®**.

- Ingresa un lote en `/evaluar` y, al calcular, se publica automáticamente en `/lotes`.
- Versión estática para GitHub Pages: el motor corre en el navegador y los lotes creados se guardan en `localStorage`.
- Los lotes demo se mantienen marcados `[DEMO]`; los lotes de prueba del usuario se pueden borrar uno a uno o todos a la vez.

## Tecnología

- Next.js 16 App Router + React 19 + Tailwind CSS v4
- Motor de puntuación Nebula Score® en TypeScript (`frontend/lib/engine.ts`)
- Metodologías JSON en `frontend/public/methodologies/`

## Desarrollo local

```bash
cd frontend
npm install
npm run dev
```

## Build y deploy a GitHub Pages

```bash
cd frontend
BASE_PATH=/nebula-scoremarketplace npm run build
```

El workflow `.github/workflows/deploy-frontend.yml` compila y despliega automáticamente en cada push a `main`.

## Notas

- Como GitHub Pages es estático, no hay backend Python en la versión desplegada.
- Si más adelante se requiere persistencia real, se puede agregar el backend monolítico FastAPI y desplegar en Fly.io, Railway, etc.
