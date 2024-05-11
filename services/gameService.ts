import { Genres, Platform } from "@/adapters/rawg";
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
  [Mood.HAPPY]: [Genres.CASUAL, Genres.FAMILY, Genres.PUZZLE],
  [Mood.SAD]: [Genres.ADVENTURE, Genres.ROLE_PLAYING_GAMES_RPG],
  [Mood.EXCITED]: [Genres.ACTION, Genres.SHOOTER, Genres.RACING],
  [Mood.BORED]: [Genres.ARCADE, Genres.SIMULATION, Genres.CASUAL],
  [Mood.STRESSED]: [Genres.STRATEGY, Genres.PUZZLE, Genres.FIGHTING],
  [Mood.RELAXED]: [Genres.SIMULATION, Genres.CASUAL, Genres.PUZZLE],
  [Mood.ENERGETIC]: [Genres.SPORTS, Genres.ACTION, Genres.RACING],
  [Mood.TIRED]: [Genres.SIMULATION, Genres.CASUAL],
  [Mood.ANXIOUS]: [
    Genres.PUZZLE,
    Genres.STRATEGY,
    Genres.ROLE_PLAYING_GAMES_RPG,
  ],
  [Mood.INSPIRED]: [Genres.INDIE, Genres.ROLE_PLAYING_GAMES_RPG],
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
