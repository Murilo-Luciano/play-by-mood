import { Genre, Platform, RAWG_ITENS_PER_PAGE } from "@/adapters/rawg";
import { MOCK } from "@/app/api/games/route";

import taskEnqueuer from "@/adapters/tasks/inngest/enqueuers";
export interface SuggestedGame {
  name: string;
  imageUrl: string;
  metacriticRating: number;
  description: string;
  tags: string[];
  genres: string[];
  platforms: string[];
  screenshots: string[];
  releasedDate: string;
  redditUrl: string;
}

export enum Mood {
  HAPPY = "HAPPY",
  SAD = "SAD",
  EXCITED = "EXCITED",
  BORED = "BORED",
  STRESSED = "STRESSED",
  RELAXED = "RELAXED",
  ENERGETIC = "ENERGETIC",
  TIRED = "TIRED",
  ANXIOUS = "ANXIOUS",
  INSPIRED = "INSPIRED",
}

const GENRES_BY_MOOD = {
  [Mood.HAPPY]: [Genre.CASUAL, Genre.FAMILY, Genre.PUZZLE],
  [Mood.SAD]: [Genre.ADVENTURE, Genre.RPG],
  [Mood.EXCITED]: [Genre.ACTION, Genre.SHOOTER, Genre.RACING],
  [Mood.BORED]: [Genre.ARCADE, Genre.SIMULATION, Genre.CASUAL],
  [Mood.STRESSED]: [Genre.STRATEGY, Genre.PUZZLE, Genre.FIGHTING],
  [Mood.RELAXED]: [Genre.SIMULATION, Genre.CASUAL, Genre.PUZZLE],
  [Mood.ENERGETIC]: [Genre.SPORTS, Genre.ACTION, Genre.RACING],
  [Mood.TIRED]: [Genre.SIMULATION, Genre.CASUAL],
  [Mood.ANXIOUS]: [Genre.PUZZLE, Genre.STRATEGY, Genre.RPG],
  [Mood.INSPIRED]: [Genre.INDIE, Genre.RPG],
};

const GAMES_PER_MOOD = 200;

async function importGames() {
  for (const [mood, genres] of Object.entries(GENRES_BY_MOOD)) {
    const totalPages = GAMES_PER_MOOD / RAWG_ITENS_PER_PAGE;

    console.info(
      `[import-games] Enqueuing ${totalPages} pages for ${mood} games`
    );

    await taskEnqueuer.enqueueGamesImportTasksByGenre(genres, totalPages);
  }
}

async function getSuggestedGame(
  mood: Mood,
  platform: Platform
): Promise<SuggestedGame> {
  const genres = GENRES_BY_MOOD[mood];

  const game: any = {}; // GamesModel.findOne...

  return MOCK;
}

export default { importGames, getSuggestedGame };
