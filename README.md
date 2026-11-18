# Lanez — Men's Textile Lane Finder

Live lane assignments for the Men's Textile League at Cardinal Lanes Beach Bowl in Wilmington, North Carolina.

## Files

This repository uses a **flat layout**, so all files can be uploaded separately in GitHub's mobile browser:

- `index.js` — complete website, Cloudflare Worker API, and lane schedule parser.
- `wrangler.toml` — configuration for deployment to Cloudflare Workers.
- `README.md` — this document.

## Deploy

The official schedule is fetched server-side, so GitHub Pages by itself is **not sufficient**. To deploy through Cloudflare Workers, install Node.js and run from the repository directory:

```sh
npx wrangler login
npx wrangler deploy
```

The project has no npm dependencies. Updates to the official league source may require adjustments to the parser in `index.js`.

Source: https://www.cardinalbeachbowl.com/leagues/mens-textile/
