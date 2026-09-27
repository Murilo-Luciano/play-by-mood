import { MOST_POPULAR_PLATFORMS } from "@/adapters/types";
import { MOOD_KEYS, MOODS } from "@/lib/moods";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import {
  MINIMAL_METACRITIC_RATING,
  MINIMAL_RAWG_ADDED_COUNT,
} from "@/services/gameService";

export const dynamic = "force-static";

/** llms.txt (https://llmstxt.org): a plain-text site summary for LLMs. */
export function GET() {
  const moods = MOOD_KEYS.map(
    (key) =>
      `- [${MOODS[key].label} games](${SITE_URL}/games/${key}): ${MOODS[key].intro}`
  ).join("\n");

  const body = `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

${SITE_NAME} is a free website with no sign-up. The visitor picks a mood and the platforms they play on, and gets one video game suggestion with its screenshots, release date, Metacritic score, platforms, description and tags. They can ask for another game for the same mood at any time.

## How games are picked

- Each mood maps to genres and tags on RAWG (https://rawg.io), the largest open video game database.
- Only games with a Metacritic score of ${MINIMAL_METACRITIC_RATING} or higher, added by at least ${MINIMAL_RAWG_ADDED_COUNT.toLocaleString(
    "en-US"
  )} RAWG users, are eligible.
- One eligible game is picked at random for every request.
- Supported platforms: ${MOST_POPULAR_PLATFORMS.join(", ")}.

## Moods

${moods}

## Links

- [Home](${SITE_URL}/): pick a mood and platforms
- [Sitemap](${SITE_URL}/sitemap.xml)
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
