# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

PlayByMood (https://playbymood.com/) suggests a top-rated game for a user-selected mood, optionally filtered by platform. Game data is imported monthly from the rawg.io API into MongoDB. Stack: Next.js 14 (App Router), Tailwind, shadcn/ui, MongoDB via Mongoose/Typegoose, Inngest for background jobs, Vercel Cron.

## Commands

Package manager is Yarn.

- `docker compose up` — the documented way to run the app (Node 24 container, runs `yarn install && yarn dev`, serves http://localhost:3000). `yarn dev` works directly too.
- `yarn build` / `yarn start` — production build/serve.
- `yarn lint` — `next lint` (no ESLint config is committed yet, so the first run prompts to create one).
- `yarn sh` — shell into the `docker-play-by-mood` container.
- `yarn inngest` — start the Inngest Dev Server (run inside the container). Required for the import pipeline to actually execute locally.
- Trigger an import manually:
  ```bash
  curl http://localhost:3000/api/cron/games-importer -H 'Authorization: Bearer <CRON_SECRET>'
  ```

There is no test suite. Formatting is Prettier with organize-imports on save (`.vscode/settings.json`).

Required env vars (`.env`): `MONGODB_URI`, `RAWG_API_KEY`, `CRON_SECRET`.

## Architecture

**Read path.** `app/page.tsx` (mood + platform picker) links to `app/games/[mood]/page.tsx`, a client component that fetches `/api/game?mood=X&platforms=A,B` via SWR. `app/api/game/route.ts` validates input and calls `gameService.getSuggestedGame`, which does a Mongo `$sample` of one game matching the mood and (optionally) any of the selected rawg parent-platform IDs. "Try a new suggestion" just revalidates the SWR key to get another random sample.

**Import pipeline (fan-out via Inngest events).**
1. Vercel Cron (`vercel.json`, 04:00 on the 1st of each month) hits `app/api/cron/games-importer/route.ts`, authenticated by `Bearer CRON_SECRET`.
2. `gameService.importGames` iterates `QUERIES_BY_MOOD` and, per mood query, sends one `games/import` event per page (`GAMES_PER_MOOD_QUERY / RAWG_ITENS_PER_PAGE` pages) through `adapters/tasks/inngest/enqueuers.ts`.
3. Handlers in `adapters/tasks/inngest/handlers.ts` (served by `app/api/inngest/route.ts` — new Inngest functions must be registered there):
   - `games/import` → lists game IDs from rawg for that query/page → emits `games/import.details` per game.
   - `games/import.details` → skips games already stored with screenshots, fetches details, filters by the query's `tags.exclude`, `BLOCKED_TAGS`, `MINIMAL_RAWG_ADDED_COUNT`, `MINIMAL_METACRITIC_RATING`, then upserts → emits `games/import.screenshots`.
   - `games/import.screenshots` → fetches screenshots and writes them to every document with that game `id`.

Note that rawg's list endpoint is only queried with `tags.include`/`genres`; `tags.exclude` is enforced afterwards in the details handler.

**Data model.** `models/Games.ts` (Typegoose, collection `games`). A document is keyed by `(id, mood)` — the same rawg game can be stored once per mood it matches. `connectDB()` from `config/db.ts` must be called before model access in server code.

**Layering.** `services/` holds business logic and mood query config; `adapters/` wraps external systems (rawg HTTP client, Inngest). `services/types.ts` (`Mood`) and `adapters/types.ts` (`Platform`, `MOST_POPULAR_PLATFORMS`) are intentionally kept free of server-only imports so client components can use them — don't import `gameService`, `rawg.ts`, or `config/db.ts` from client code. Imports use the `@/*` alias for the repo root.

**Platforms.** The UI `Platform` enum is mapped to rawg parent-platform IDs via `rawgParentPlatforms` in `adapters/rawg.ts`; that mapping is used both when importing (only `MOST_POPULAR_PLATFORMS` are queried) and when filtering suggestions.

## Adding or changing a mood

Touch all of: the `Mood` enum (`services/types.ts`), `QUERIES_BY_MOOD` (`services/gameService.ts`; typed as `Record<Mood, …>` so the compiler flags omissions), the `moods` map in `app/page.tsx` (image + description), and an emoji image at `public/<mood lowercase>.png`. Query `id`s must be unique within a mood since handlers look queries up by `(mood, queryId)`.

`components/ui/` is generated shadcn/ui code (`components.json`); add components with the shadcn CLI rather than hand-writing them.
