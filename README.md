# Content Checker

Free website content analysis tool. Check if your page title, meta tags, headings, images, links, schema markup, and AI search readiness are working hard for you — in search engines and AI answers.

Live at [contentchecker.davidtiong.com](https://contentchecker.davidtiong.com)

## What it does

Paste any URL and get a score out of 100 across five categories:

- **First Impressions** (25 pts) — title, meta description, Open Graph tags, canonical URL
- **Content Structure** (25 pts) — H1, heading hierarchy, subheadings, word count, paragraph length
- **Images** (15 pts) — alt text coverage, missing alt text
- **Links** (10 pts) — internal links, external links, link text quality
- **AI & Search Readiness** (25 pts) — schema markup, FAQ content, meta robots, citable statements

Every check includes a plain-English explanation and a "how to fix" recommendation. All analysis runs client-side in the browser — no data is stored.

## Tech Stack

| Component    | Technology                   |
| ------------ | ---------------------------- |
| Frontend     | React 19 + TypeScript + Vite |
| Styling      | Tailwind CSS v4              |
| Proxy        | Cloudflare Pages Function    |
| Code Quality | ESLint, Prettier, TypeScript |

## Architecture

- **Client-side analysis** — the browser fetches HTML via a server-side proxy (to avoid CORS), then parses and scores everything locally using DOMParser
- **Cloudflare Pages Function** (`functions/api/fetch.ts`) — lightweight proxy that fetches the target URL and returns HTML. Includes rate limiting (10 req/min per IP) and SSRF protection (blocks private/local IPs)
- **No backend, no database, no AI** — purely deterministic rule-based checks

## Development

```bash
npm install
npm run dev          # Vite dev server with local fetch proxy
```

The dev server includes an inline fetch proxy (in `vite.config.ts`) that mirrors the Cloudflare Function, so everything works locally without Cloudflare.

## Build & Deploy

```bash
npm run build        # TypeScript + Vite build → dist/
```

Deployed to Cloudflare Pages. The `functions/` directory is automatically picked up as Pages Functions.

## Quality Checks

```bash
npm run lint         # ESLint
npm run format       # Prettier
npm run type-check   # TypeScript
npm run quality      # All of the above
npm run check        # Quality + npm audit
```

## Project Structure

```
content-checker/
├── src/
│   ├── components/       # React components
│   │   ├── Header.tsx
│   │   ├── UrlInput.tsx
│   │   ├── OverallScore.tsx
│   │   ├── ResultsPanel.tsx
│   │   ├── ScoreCard.tsx
│   │   ├── StatusBadge.tsx
│   │   └── UpgradeCallout.tsx
│   ├── services/
│   │   ├── analyser.ts   # All scoring logic (19 checks, 5 categories)
│   │   └── fetchPage.ts  # URL fetching + HTML parsing via DOMParser
│   ├── types/index.ts    # TypeScript interfaces
│   ├── App.tsx
│   └── main.tsx
├── functions/
│   └── api/fetch.ts      # Cloudflare Pages Function (CORS proxy)
├── public/
│   └── favicon.svg
└── index.html
```

## Part of the Content Checker family

This is the free version. **Content Checker Pro** (coming soon) adds AI-powered analysis — content rewriting, FAQ generation, schema markup recommendations, competitor comparison, and multi-page analysis.

## License

MIT + Commons Clause

## Author

[www.davidtiong.com](https://www.davidtiong.com)
