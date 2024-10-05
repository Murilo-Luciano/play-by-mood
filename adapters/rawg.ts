import axios from "axios";
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

/** https://api.rawg.io/docs/#operation/games_list */
interface RawgListGamesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    id: number;
  }[];
}

/** https://api.rawg.io/docs/#operation/games_read */
interface RawgGameDetailsResponse {
  id: number;
  name: string;
  description: string;
  description_raw: string;
  metacritic: number;
  background_image: string;
  released: string;
  added: number;
  tags: {
    id: number;
    name: string;
    slug: string;
    language: string;
    games_count: number;
    image_background: string;
  }[];
  genres: {
    id: number;
    name: string;
    slug: string;
    games_count: number;
    image_background: string;
  }[];
  parent_platforms: {
    platform: {
      id: number;
      name: string;
      slug: string;
    };
  }[];
  reddit_url: string;
}

/** https://api.rawg.io/docs/#operation/games_screenshots_list */
interface RawgGameScreenshotsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    id: number;
    image: string;
    width: number;
    height: number;
    is_deleted: boolean;
  }[];
}

export const RAWG_ITENS_PER_PAGE = 40;

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

async function getGamesByTags(tags: string[], page = 1) {
  const response = await axios.get<RawgListGamesResponse>(
    "https://api.rawg.io/api/games",

    {
      params: {
        key: process.env.RAWG_API_KEY,
        tags: tags.join(","),
        ordering: "-added",
        parent_platforms: MOST_POPULAR_PLATFORMS.map(
          (platform) => rawgParentPlatforms[platform].id
        ).join(","),
        page: page,
        page_size: RAWG_ITENS_PER_PAGE,
      },
    }
  );

  return response.data.results;
}

async function getGameDetails(gameId: number) {
  const response = await axios.get<RawgGameDetailsResponse>(
    `https://api.rawg.io/api/games/${gameId}`,
    {
      params: {
        key: process.env.RAWG_API_KEY,
      },
    }
  );

  return response.data;
}

async function getGameScreenshots(gameId: number) {
  const response = await axios.get<RawgGameScreenshotsResponse>(
    `https://api.rawg.io/api/games/${gameId}/screenshots`,
    {
      params: {
        key: process.env.RAWG_API_KEY,
      },
    }
  );

  return response.data.results;
}

export default {
  getGamesByTags,
  getGameDetails,
  getGameScreenshots,
};
