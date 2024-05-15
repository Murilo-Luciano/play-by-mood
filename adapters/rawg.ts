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

async function getGamesByGenres(genres: Genre[]) {
  const genresIds = genres.map((genre) => rawgGenres[genre].id);

  // pegar 200 games por cada mood
  // 5 chamadas por mood ( no max ) -> 50 chamadas
  // cada chamada leva ~4s

  // https://www.inngest.com/docs/quick-start?ref=docs-homepage
  /**@todo: enfileirar todas as chamadas com o inngest */

  // 4s
  const response = await axios.get<RawgListGamesResponse>(
    "https://api.rawg.io/api/games",
    {
      params: {
        key: process.env.RAWG_API_KEY,
        genres: genresIds.toString(),
        ordering: "-metacritic",
        page: 1,
        page_size: 40,
      },
    }
  );
}

export default {};
