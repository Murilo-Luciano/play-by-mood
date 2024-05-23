import axios from "axios";

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

export enum Platform {
  PC = "PC",
  PLAYSTATION = "PlayStation",
  XBOX = "Xbox",
  IOS = "iOS",
  ANDROID = "Android",
  APPLE_MACINTOSH = "Apple Macintosh",
  LINUX = "Linux",
  NINTENDO = "Nintendo",
  ATARI = "Atari",
  COMMODORE_AMIGA = "Commodore / Amiga",
  SEGA = "SEGA",
  PANASONIC_3DO = "3DO",
  NEO_GEO = "Neo Geo",
  WEB = "Web",
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
  description_raw: string;
  metacritic: number;
  background_image: string;
  released: string;
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

const rawgGenres = {
  [Genre.ACTION]: { id: 4 },
  [Genre.INDIE]: { id: 51 },
  [Genre.ADVENTURE]: { id: 3 },
  [Genre.RPG]: { id: 5 },
  [Genre.STRATEGY]: { id: 10 },
  [Genre.SHOOTER]: { id: 2 },
  [Genre.CASUAL]: { id: 40 },
  [Genre.SIMULATION]: { id: 14 },
  [Genre.PUZZLE]: { id: 7 },
  [Genre.ARCADE]: { id: 11 },
  [Genre.PLATFORMER]: { id: 83 },
  [Genre.RACING]: { id: 1 },
  [Genre.MASSIVELY_MULTIPLAYER]: { id: 59 },
  [Genre.SPORTS]: { id: 15 },
  [Genre.FIGHTING]: { id: 6 },
  [Genre.FAMILY]: { id: 19 },
  [Genre.BOARD_GAMES]: { id: 28 },
  [Genre.EDUCATIONAL]: { id: 34 },
  [Genre.CARD]: { id: 17 },
};

/**@todo: lidar com erros */

async function getGamesByGenres(genres: Genre[], page = 1) {
  const genresIds = genres.map((genre) => rawgGenres[genre].id);

  const response = await axios.get<RawgListGamesResponse>(
    "https://api.rawg.io/api/games",
    {
      params: {
        key: process.env.RAWG_API_KEY,
        genres: genresIds.toString(),
        ordering: "-metacritic",
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

export default { getGamesByGenres, getGameDetails, getGameScreenshots };
