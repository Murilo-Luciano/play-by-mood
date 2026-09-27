# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

PlayByMood (https://playbymood.com/) suggests a top-rated game for a user-selected mood, optionally filtered by platform. Suggestions are fetched from the rawg.io API at request time; there is no database or background job. Stack: Next.js 14 (App Router), Tailwind, shadcn/ui, deployed on Vercel.

## Commands

Package manager is Yarn.

- `docker compose up` — the documented way to run the app (Node 24 container, runs `yarn install && yarn dev`, serves http://localhost:3000). `yarn dev` works directly too.
- `yarn build` / `yarn start` — production build/serve.
- `yarn lint` — `next lint` (no ESLint config is committed yet, so the first run prompts to create one).
- `yarn sh` — shell into the `docker-play-by-mood` container.

There is no test suite. Formatting is Prettier with organize-imports on save (`.vscode/settings.json`).

Required env var (`.env`): `RAWG_API_KEY`.

## Architecture

**Request flow.** `app/page.tsx` (mood + platform picker) links to `app/games/[mood]/page.tsx`, a client component that fetches `/api/game?mood=X&platforms=A,B` via SWR (`lib/useSuggestion.ts`). `app/api/game/route.ts` validates input and calls `gameService.getSuggestedGame`, which:
1. For every query of the mood in `QUERIES_BY_MOOD`, fetches all RAWG list pages (up to `GAMES_PER_MOOD_QUERY` games, ordered by `-added`, `metacritic` filtered by RAWG, restricted to `MOST_POPULAR_PLATFORMS`).
2. Filters in-app by the query's `tags.exclude`, `BLOCKED_TAGS`, `MINIMAL_RAWG_ADDED_COUNT`, `MINIMAL_METACRITIC_RATING`, dedupes across queries, then filters by the selected platforms.
3. Samples one game and fetches its details (description and English-only tags; list tags mix languages). Screenshots come from the list's `short_screenshots`, minus the `id: -1` cover image.

"CONTINUE? NEW GAME" just revalidates the SWR key to get another random sample.

**Caching / RAWG quota.** `adapters/rawg.ts` uses `fetch` with `next: { revalidate }` so list pages and game details live in the Next.js data cache for a day. The RAWG free tier is 20k requests/month, so keep RAWG request URLs independent of per-user input: platform filtering is done in-app precisely so the cache key doesn't vary with the user's platform selection.

**Layering.** `services/` holds business logic and mood query config; `adapters/` wraps external systems (RAWG HTTP client). `services/types.ts` (`Mood`, `SuggestedGame`) and `adapters/types.ts` (`Platform`, `MOST_POPULAR_PLATFORMS`) are intentionally kept free of server-only imports so client components can use them — don't import `gameService` or `rawg.ts` from client code. Imports use the `@/*` alias for the repo root.

**Platforms.** The UI `Platform` enum is mapped to rawg parent-platform IDs via `rawgParentPlatforms` in `adapters/rawg.ts`.

## Adding or changing a mood

Touch all of: the `Mood` enum (`services/types.ts`), `QUERIES_BY_MOOD` (`services/gameService.ts`; typed as `Record<Mood, …>` so the compiler flags omissions), `MOODS` in `lib/moods.ts` (label, image, description, hue; also a `Record<Mood, …>`), and an emoji image at `public/<mood lowercase>.png`. Each extra query multiplies RAWG requests on a cold cache (up to 5 list pages per query).

## UI

The visual identity is "Neon Arcade": retro arcade/CRT look, dark only. Colors live in `lib/palette.ts` and are exposed to Tailwind as `neon-*` / `crt-*` (e.g. `bg-crt-panel`, `text-neon-cyan`, `shadow-[inset_0_0_0_2px_theme(colors.crt.line)]`); use them instead of raw hex. Fonts are loaded in `app/layout.tsx` and used via `font-pixel` (Press Start 2P, headings/labels) and `font-terminal` (VT323, body default). Glow text, blinking, the CRT scanlines/vignette and the mood tile hover live in `app/globals.css`. Shared chrome: `components/Wordmark.tsx`, `components/Credits.tsx`.

`components/ui/` is generated shadcn/ui code (`components.json`), currently unused by the pages; add components with the shadcn CLI rather than hand-writing them.
