# PlayByMood

[PlayByMood](https://playbymood.com/) is a game recommendation website that matches you with a game for how you feel right now. Pick a mood, optionally narrow it down to the platforms you play on, and PlayByMood suggests a top-rated game that fits. Not feeling it? Hit **CONTINUE? NEW GAME** to roll another one.

The available moods are:

- Excited
- Relaxed
- Focused
- Adventurous
- Competitive
- Curious
- Nostalgic
- Social
- Angry
- Strategic
- Playful

Supported platforms: PC, macOS, Linux, Web, PlayStation, Xbox, iOS and Android.

## How it works

Suggestions come from the [rawg.io](https://rawg.io/) API at request time; there is no database or background job.

Each mood maps to one or more RAWG queries built from genres and tags, defined in `QUERIES_BY_MOOD` (`services/gameService.ts`). For example, the "Strategic" mood looks for games in the "strategy" genre tagged with "economy", "city-builder", "management", "tactical", "rts" and more, excluding FPS games.

For every query of the selected mood, PlayByMood:

1. Fetches up to 200 of the most popular games on RAWG with a Metacritic score of at least 70.
2. Drops games with excluded tags, adult content, or fewer than 1,000 RAWG users, and removes duplicates across queries.
3. Filters by the platforms you selected, picks one game at random and fetches its details (description, tags, screenshots).

RAWG responses are cached in the Next.js data cache for a day. Platform filtering happens in the app, not in the RAWG request, so every user shares the same cached responses and the project stays within the RAWG free tier (20k requests/month).

## Built with

- [Next.js 14](https://nextjs.org/) (App Router)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [SWR](https://swr.vercel.app/)
- Deployed on [Vercel](https://vercel.com/)

## Running locally

### Environment variables

Get a free API key at [rawg.io/apidocs](https://rawg.io/apidocs), then create a `.env` file in the root directory:

```env
RAWG_API_KEY="<your-rawg-api-key>"
```

### Start the app

With Docker Compose (Node 24):

```bash
docker compose up
```

Or directly with Yarn, if you have Node 24 installed:

```bash
yarn install
yarn dev
```

The app will be available at http://localhost:3000.

### Scripts

| Command      | Description                                         |
| ------------ | --------------------------------------------------- |
| `yarn dev`   | Start the development server                        |
| `yarn build` | Build for production                                |
| `yarn start` | Serve the production build                          |
| `yarn lint`  | Run `next lint`                                     |
| `yarn sh`    | Open a shell in the `docker-play-by-mood` container |

## Project structure

```
app/          Pages, API route (/api/game), sitemap, robots, llms.txt and share images
components/   Shared UI (mood picker, wordmark, credits) and generated shadcn/ui components
services/     Business logic and the per-mood RAWG queries
adapters/     RAWG HTTP client and platform mapping
lib/          Mood copy, color palette, site metadata and client hooks
public/       Mood emoji images
```

## Contributing

Contributions to PlayByMood are always welcome! If you find a bug or have a feature request, please create an [issue](https://github.com/Murilo-Luciano/play-by-mood/issues/new) on GitHub. If you'd like to contribute code, please [fork](https://github.com/Murilo-Luciano/play-by-mood/fork) the repository and submit a pull request.

To add or change a mood, update the `Mood` enum (`services/types.ts`), `QUERIES_BY_MOOD` (`services/gameService.ts`), `MOODS` (`lib/moods.ts`) and add an emoji image at `public/<mood>.png`.
