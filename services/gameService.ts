import {
  Genre,
  Platform,
  RAWG_ITENS_PER_PAGE,
  rawgGenres,
  rawgParentPlatforms,
} from "@/adapters/rawg";

import taskEnqueuer from "@/adapters/tasks/inngest/enqueuers";
import connectDB from "@/config/db";
import GamesModel, { Games } from "@/models/Games";
import _ from "lodash";

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

/**@todo: Refactor */
async function getSuggestedGame(
  mood: Mood,
  platforms?: Platform[]
): Promise<Games | undefined> {
  const genres = GENRES_BY_MOOD[mood];
  const genresIds = genres.map((genre) => rawgGenres[genre].id);

  const platformIds =
    platforms && platforms.map((platform) => rawgParentPlatforms[platform].id);

  await connectDB();

  // find a game with exactly all genres
  const gameWithExactlyAllGenres = await GamesModel.aggregate<Games>([
    { $addFields: { genresIds: "$genres.id", platformIds: "$platforms.id" } },
    {
      $match: {
        ...(platformIds && { platformIds: { $in: platformIds } }),
        genresIds: { $all: genresIds, $size: genresIds.length },
      },
    },
    { $sample: { size: 1 } },
  ]);

  if (!_.isEmpty(gameWithExactlyAllGenres)) {
    return _.first(gameWithExactlyAllGenres)!;
  }

  // find a game with all genres
  const gameWithAllGenres = await GamesModel.aggregate<Games>([
    { $addFields: { genresIds: "$genres.id", platformIds: "$platforms.id" } },
    {
      $match: {
        ...(platformIds && { platformIds: { $in: platformIds } }),
        genresIds: { $all: genresIds, $size: genresIds.length },
      },
    },
    { $sample: { size: 1 } },
  ]);

  if (!_.isEmpty(gameWithAllGenres)) {
    return _.first(gameWithAllGenres)!;
  }

  // find a game with at least one genre
  const gameWithAlmostAllGenres = await GamesModel.aggregate<Games>([
    { $addFields: { genresIds: "$genres.id", platformIds: "$platforms.id" } },
    {
      $match: {
        ...(platformIds && { platformIds: { $in: platformIds } }),
        genresIds: { $in: genresIds },
      },
    },
    { $sample: { size: 1 } },
  ]);

  return _.first(gameWithAlmostAllGenres);
}

export default { importGames, getSuggestedGame };
