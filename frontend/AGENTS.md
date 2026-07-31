# Nebula ScoreMarketplace® — Frontend Agent Notes

- Static Next.js 16 App Router client application. No Python backend in this GitHub Pages deployment.
- In-browser Nebula Score® engine lives in `lib/engine.ts`; methodologies are JSON files in `public/methodologies/`.
- New lots are stored in the browser (`localStorage`) and merged with the demo catalog in `lib/demo-data.ts`.
- Public copy must use `®` for Nebula Score®, Nebula Fermentation®, Nebula OriginBlok® and Nebula ScoreMarketplace®.
- Demo lots are marked with `is_demo: true` and a `[DEMO]` prefix; user-created lots are not deletable from UI by default unless the delete button is shown.
- Do not invent prices or business data; real fields are entered by the user and may remain empty (`A convenir`).
- Run `npm run lint` before committing frontend changes.
