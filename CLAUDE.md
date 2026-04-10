# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a modern, minimalist portfolio template built with Astro and Tailwind CSS v4. It's designed to be easily customizable through a single configuration file while maintaining a clean, professional appearance.

## Tech Stack

- **Astro**: Static site generator
- **Tailwind CSS v4**: Utility-first CSS framework using the new @tailwindcss/vite plugin
- **TypeScript**: For type-safe configuration
- **Tabler Icons**: Icon library

## Development Commands

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
```

## Deployment

The site is configured for **Cloudflare Workers** deployment using the `@astrojs/cloudflare` adapter.

### Key Files

- `wrangler.jsonc` - Cloudflare Worker configuration
- `public/.assetsignore` - Excludes internal Cloudflare files from static assets

### Deploy Commands

```bash
npm run build           # Build the site (generates dist/_worker.js)
npx wrangler deploy     # Deploy to Cloudflare Workers
npx wrangler dev        # Local development with Cloudflare runtime
```

### Cloudflare Dashboard Settings

When setting up in Cloudflare:

- **Build command**: `npm run build`
- **Deploy command**: `npx wrangler deploy`

## Architecture

Component-based Astro site with two content layers:

- **Portfolio config** (`src/config.ts`): Single source of truth for name, social links, skills, projects, experience, education. Sections hide automatically if their data is removed.
- **Content collections** (`src/content/`): Blog posts (`blog/`) and project case studies (`projects/`) using Astro content collections with Zod schemas defined in `src/content/config.ts`.

### Key Directories

- `src/components/` — Astro components (portfolio sections, blog components, nav, scroll-to-top)
- `src/layouts/BlogPost.astro` — Blog post layout with prose styling, popout code blocks/images, and hero image support
- `src/pages/` — Routes: index, blog, projects, cv, rss, 404
- `public/blog/` — Static assets for blog posts (images, video)

### Blog System

- Blog posts are MDX files in `src/content/blog/`
- Custom MDX components: Callout, SkeletonDemo, MermaidChart, SpecTable, ColorSwatch
- Code blocks use `astro-expressive-code`
- Schema fields: title, description, pubDate, heroImage, heroCaption, tags, readTime, draft

## Code Style

- All components are `.astro` — no React/Vue
- Tailwind utility classes for all styling; maintain the monospace aesthetic (IBM Plex Mono)
- Use semantic HTML and Tabler Icons
- Accent color propagates via CSS custom properties (`accentColor` / `accentColorDark` in config)
- Portfolio content changes go in `src/config.ts`, not in components
- New portfolio sections should render conditionally based on config data
- No linting or test framework configured
