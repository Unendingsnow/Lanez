# Lanez — Men's Textile Lane Finder

Live lane assignments for the Men's Textile League at Cardinal Lanes Beach Bowl in Wilmington, North Carolina.

## Files

The site now supports **Vercel directly**:

- `index.html` — complete browser UI, no build needed.
- `api/schedule.js` — Vercel Node serverless function for the live bowling schedule.
- `package.json` — Node ES module configuration.
- `index.js` and `wrangler.toml` — original Cloudflare Worker deployment files (retained).

## Deploy

### Vercel (recommended)

Import this repository into Vercel, select **Other** as framework if prompted, and set the Root Directory to the repository root. Leave Build Command and Output Directory unset. Redeploy after updating the repository.

The frontend uses `/api/schedule` to request current official data. If the bowling center is unavailable, the API reports a clear error instead of showing old assignments as current. You can also run `npx vercel dev` locally.

Source: https://www.cardinalbeachbowl.com/leagues/mens-textile/

## Install Lanez on a device

Lanez is a Progressive Web App (PWA). A visible **Install app** button triggers Chrome/Edge's native installation prompt when available. On iPhone/iPad, it displays Safari's **Share → Add to Home Screen → Open as Web App** instructions. Other browsers get platform-specific guidance. The button hides when already running as an installed app.

Files: `manifest.webmanifest`, `sw.js`, `favicon.svg`, and PNG icons in `icons/`. The service worker caches only the app shell for an offline launch screen; it deliberately never caches `/api/schedule` so old bowling assignments are not presented as current.
