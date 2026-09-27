import rawg, {
  RAWG_ITENS_PER_PAGE,
  RawgError,
  RawgGameDetails,
  RawgListGame,
  rawgParentPlatforms,
} from "@/adapters/rawg";
import { Platform } from "@/adapters/types";
import _ from "lodash";
import { Mood, SuggestedGame } from "./types";

const MINIMAL_RAWG_ADDED_COUNT = 1000;
const MINIMAL_METACRITIC_RATING = 70;
const BLOCKED_TAGS = ["nsfw", "adult", "erotic"];

interface MoodQuery {
  id: string;
  tags?: {
    include: string[];
    exclude: string[];
  };
  genres?: string[];
}

export const QUERIES_BY_MOOD: Record<Mood, MoodQuery[]> = {
  [Mood.FOCUSED]: [
    {
      id: "genres-query",
      genres: ["puzzle"],
    },
  ],
  [Mood.PLAYFUL]: [
    {
      id: "genres-and-tags-query",
      tags: {
        include: ["local-multiplayer", "local-co-op"],
        exclude: [],
      },
      genres: ["casual"],
    },
  ],
  [Mood.STRATEGIC]: [
    {
      id: "genres-and-tags-query",
      tags: {
        include: [
          "economy",
          "city-builder",
          "building",
          "management",
          "base-building",
          "tactical",
          "rts",
        ],
        exclude: ["fps"],
      },
      genres: ["strategy"],
    },
  ],
  [Mood.ADVENTUROUS]: [
    {
      id: "tags-query",
      tags: {
        include: ["exploration", "open-world", "action-adventure"],
        exclude: [],
      },
    },
    {
      id: "genres-query",
      genres: ["adventure"],
    },
  ],
  [Mood.EXCITED]: [
    {
      id: "tags-query",
      tags: {
        include: [
          "stealth",
          "horror",
          "survival-horror",
          "violent",
          "combat",
          "runner",
          "martial-arts",
          "war",
          "military",
          "post-apocalyptic",
          "hack-and-slash",
          "exploration",
          "perma-death",
          "parkour",
          "street-racing",
          "driving",
        ],
        exclude: ["relaxing", "cute", "calm", "peaceful"],
      },
    },
  ],
  [Mood.COMPETITIVE]: [
    {
      id: "tags-query",
      tags: {
        include: ["competitive", "pvp", "online-pvp", "esports", "2d-fighter"],
        exclude: ["relaxing", "cute", "calm", "peaceful"],
      },
    },
  ],
  [Mood.RELAXED]: [
    {
      id: "tags-query",
      tags: {
        include: ["relaxing", "cute", "calm", "peaceful"],
        exclude: [],
      },
    },
  ],
  [Mood.CURIOUS]: [
    {
      id: "tags-query",
      tags: { include: ["story-rich"], exclude: [] },
    },
  ],
  [Mood.NOSTALGIC]: [
    {
      id: "tags-query",
      tags: {
        include: ["classic", "1990s", "1980s", "retro"],
        exclude: [],
      },
    },
  ],
  [Mood.SOCIAL]: [
    {
      id: "tags-query",
      tags: { include: ["online-multiplayer"], exclude: [] },
    },
  ],
  [Mood.ANGRY]: [
    {
      id: "tags-query",
      tags: {
        include: ["gore", "destruction", "blood"],
        exclude: ["relaxing", "cute", "calm", "peaceful"],
      },
    },
  ],
};

/** Only the most added games of each query are considered, as the RAWG list is ordered by `added`. */
const GAMES_PER_MOOD_QUERY = 200;

const MAX_DETAILS_ATTEMPTS = 3;

const CYRILLIC_REGEX = /[\u0400-\u04FF]/;

async function getSuggestedGame(
  mood: Mood,
  platforms?: Platform[]
): Promise<SuggestedGame | undefined> {
  const queriesGames = await Promise.all(
    QUERIES_BY_MOOD[mood].map(async (query) =>
      (await getQueryGames(query)).filter((game) => isEligible(game, query))
    )
  );

  const platformIds =
    platforms && platforms.map((platform) => rawgParentPlatforms[platform].id);

  const candidates = _.uniqBy(queriesGames.flat(), (game) => game.id).filter(
    (game) =>
      !platformIds ||
      game.parent_platforms.some(({ platform }) =>
        platformIds.includes(platform.id)
      )
  );

  // RAWG's detail endpoint fails intermittently (bursts of 502s), so fall back
  // to other candidates instead of failing the whole suggestion.
  const attempts = _.sampleSize(candidates, MAX_DETAILS_ATTEMPTS);

  for (let index = 0; index < attempts.length; index++) {
    const game = attempts[index];

    let details: RawgGameDetails;
    try {
      details = await rawg.getGameDetails(game.id);
    } catch (error) {
      if (!(error instanceof RawgError) || index === attempts.length - 1) {
        throw error;
      }

      console.warn(
        `[game-service] Failed to get details of game ${game.id}, trying another one`,
        error
      );
      continue;
    }

    return toSuggestedGame(game, details);
  }

  return undefined;
}

function toSuggestedGame(
  game: RawgListGame,
  details: RawgGameDetails
): SuggestedGame {
  return {
    id: details.id,
    name: details.name,
    description: details.description,
    metacriticRating: details.metacritic,
    imageUrl: details.background_image,
    releasedDate: details.released,
    // Detail tags are marked English, but some RAWG tags still have Cyrillic names.
    tags: details.tags
      .filter((tag) => !CYRILLIC_REGEX.test(tag.name))
      .map(({ id, name }) => ({ id, name })),
    genres: details.genres.map(({ id, name }) => ({ id, name })),
    platforms: details.parent_platforms.map(({ platform }) => ({
      id: platform.id,
      name: platform.name,
    })),
    screenshots: game.short_screenshots
      .filter((screenshot) => screenshot.id !== -1)
      .map(({ id, image }) => ({ id, image })),
  };
}

/** Fetches every page (up to `GAMES_PER_MOOD_QUERY` games) of a mood query. */
async function getQueryGames(query: MoodQuery): Promise<RawgListGame[]> {
  const rawgQuery = {
    tags: query.tags?.include,
    genres: query.genres,
    minimalMetacritic: MINIMAL_METACRITIC_RATING,
  };

  const firstPage = await rawg.getGames(rawgQuery, 1);

  const totalPages = Math.min(
    Math.ceil(firstPage.count / RAWG_ITENS_PER_PAGE),
    GAMES_PER_MOOD_QUERY / RAWG_ITENS_PER_PAGE
  );

  const otherPages = await Promise.all(
    _.range(2, totalPages + 1).map((page) => rawg.getGames(rawgQuery, page))
  );

  return [firstPage, ...otherPages].flatMap((page) => page.results);
}

function isEligible(game: RawgListGame, query: MoodQuery) {
  const excludedTags = [...(query.tags?.exclude || []), ...BLOCKED_TAGS];

  return (
    !game.tags.some((tag) => excludedTags.includes(tag.slug)) &&
    game.added >= MINIMAL_RAWG_ADDED_COUNT &&
    (game.metacritic || 0) >= MINIMAL_METACRITIC_RATING
  );
}

export default { getSuggestedGame };
