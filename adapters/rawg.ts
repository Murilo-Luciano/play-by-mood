import { MOST_POPULAR_PLATFORMS, Platform } from "./types";

export enum Genre {
  ACTION = "action",
  INDIE = "indie",
  ADVENTURE = "adventure",
  RPG = "role-playing-games-rpg",
  STRATEGY = "strategy",
  SHOOTER = "shooter",
  CASUAL = "casual",
  SIMULATION = "simulation",
  PUZZLE = "puzzle",
  ARCADE = "arcade",
  PLATFORMER = "platformer",
  RACING = "racing",
  MASSIVELY_MULTIPLAYER = "massively-multiplayer",
  SPORTS = "sports",
  FIGHTING = "fighting",
  FAMILY = "family",
  BOARD_GAMES = "board-games",
  EDUCATIONAL = "educational",
  CARD = "card",
}

interface RawgTag {
  id: number;
  name: string;
  slug: string;
  language: string;
}

interface RawgGenre {
  id: number;
  name: string;
  slug: string;
}

interface RawgParentPlatform {
  platform: {
    id: number;
    name: string;
    slug: string;
  };
}

/**
 * https://api.rawg.io/docs/#operation/games_list
 * The official schema omits tags, genres, parent_platforms and short_screenshots,
 * but the API returns them. List tags mix languages (e.g. "eng" and "rus").
 */
export interface RawgListGame {
  id: number;
  name: string;
  released: string;
  background_image: string;
  metacritic: number | null;
  added: number;
  tags: RawgTag[];
  genres: RawgGenre[];
  parent_platforms: RawgParentPlatform[];
  /** The first item (id -1) is the background image, not a screenshot. */
  short_screenshots: { id: number; image: string }[];
}

interface RawgListGamesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: RawgListGame[];
}

/** https://api.rawg.io/docs/#operation/games_read */
export interface RawgGameDetails {
  id: number;
  name: string;
  description: string;
  description_raw: string;
  metacritic: number;
  background_image: string;
  released: string;
  added: number;
  tags: RawgTag[];
  genres: RawgGenre[];
  parent_platforms: RawgParentPlatform[];
  reddit_url: string;
}

export const RAWG_ITENS_PER_PAGE = 40;

/** RAWG data changes slowly; cache responses in the Next.js data cache for a day. */
const RAWG_CACHE_SECONDS = 60 * 60 * 24;

export const rawgParentPlatforms = {
  [Platform.PC]: { id: 1 },
  [Platform.PLAYSTATION]: { id: 2 },
  [Platform.XBOX]: { id: 3 },
  [Platform.IOS]: { id: 4 },
  [Platform.ANDROID]: { id: 8 },
  [Platform.APPLE_MACINTOSH]: { id: 5 },
  [Platform.LINUX]: { id: 6 },
  [Platform.WEB]: { id: 14 },
  [Platform.NINTENDO]: { id: 7 },
  [Platform.ATARI]: { id: 9 },
  [Platform.COMMODORE_AMIGA]: { id: 10 },
  [Platform.SEGA]: { id: 11 },
  [Platform.PANASONIC_3DO]: { id: 12 },
  [Platform.NEO_GEO]: { id: 13 },
};

async function rawgGet<T>(
  path: string,
  params: Record<string, string | number>
): Promise<T> {
  if (!process.env.RAWG_API_KEY) throw new Error("No RAWG_API_KEY defined");

  const searchParams = new URLSearchParams({
    ...Object.fromEntries(
      Object.entries(params).map(([key, value]) => [key, String(value)])
    ),
    key: process.env.RAWG_API_KEY,
  });

  // Error messages never include the URL: it carries the API key.
  let response: Response;
  try {
    response = await fetch(`https://api.rawg.io/api${path}?${searchParams}`, {
      next: { revalidate: RAWG_CACHE_SECONDS },
    });
  } catch (error) {
    throw new RawgError(`[rawg] ${path} request failed`, { cause: error });
  }

  if (!response.ok) {
    throw new RawgError(`[rawg] ${path} responded ${response.status}`);
  }

  return response.json();
}

/** RAWG is unreachable or answered with an error status. */
export class RawgError extends Error {
  name = "RawgError";
}

/** Lists games ordered by popularity, restricted to the most popular platforms. */
async function getGames(
  query: { tags?: string[]; genres?: string[]; minimalMetacritic: number },
  page = 1
) {
  if (!query.tags && !query.genres) {
    throw new Error("[rawg.getGames] query cant be empty");
  }

  return rawgGet<RawgListGamesResponse>("/games", {
    ...(!!query.tags && { tags: query.tags.join(",") }),
    ...(!!query.genres && { genres: query.genres.join(",") }),
    metacritic: `${query.minimalMetacritic},100`,
    ordering: "-added",
    parent_platforms: MOST_POPULAR_PLATFORMS.map(
      (platform) => rawgParentPlatforms[platform].id
    ).join(","),
    page: page,
    page_size: RAWG_ITENS_PER_PAGE,
  });
}

async function getGameDetails(gameId: number) {
  return rawgGet<RawgGameDetails>(`/games/${gameId}`, {});
}

export default {
  getGames,
  getGameDetails,
};
