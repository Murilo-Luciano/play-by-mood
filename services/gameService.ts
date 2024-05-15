import { Genre, Platform } from "@/adapters/rawg";
import { MOCK } from "@/app/api/games/route";

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

const genresByMood = {
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

async function getSuggestedGame(
  mood: Mood,
  platform: Platform
): Promise<SuggestedGame> {
  const genres = genresByMood[mood];

  const game: any = {}; // gamesProvider.getGameByGenres(genres, platform)

  return MOCK;
}

async function importGames() {}

export default { getSuggestedGame };
