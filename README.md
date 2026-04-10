# hunterportfolio

Hunter Hardy's personal portfolio and blog. Built with Astro, Tailwind CSS v4, and TypeScript. Deployed on Cloudflare Workers.

Based on the [DevPortfolio](https://github.com/RyanFitzgerald/devportfolio) template by [Ryan Fitzgerald](https://x.com/rfitzio).

## Development

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run preview   # Preview build
```

## Deployment

Deployed via Cloudflare Workers. See `wrangler.jsonc` for configuration.

```bash
npm run build && npx wrangler deploy
```
