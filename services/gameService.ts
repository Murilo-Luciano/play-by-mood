import { RAWG_ITENS_PER_PAGE, rawgParentPlatforms } from "@/adapters/rawg";

import taskEnqueuer from "@/adapters/tasks/inngest/enqueuers";
import { Platform } from "@/adapters/types";
import connectDB from "@/config/db";
import GamesModel, { Games } from "@/models/Games";
import _ from "lodash";
import { Mood } from "./types";

export const MINIMAL_RAWG_ADDED_COUNT = 1000;
export const MINIMAL_METACRITIC_RATING = 70;
export const BLOCKED_TAGS = ["nsfw", "adult", "erotic"];

export const TAGS_BY_MOOD: Record<
  Mood,
  { include: string[]; exclude: string[] }
> = {
  [Mood.EXCITED]: {
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
  [Mood.RELAXED]: {
    include: ["relaxing", "cute", "calm", "peaceful"],
    exclude: [],
  },
  [Mood.FOCUSED]: { include: ["puzzle"], exclude: [] },
  [Mood.ADVENTUROUS]: {
    include: ["exploration", "open-world", "action-adventure"],
    exclude: [],
  },
  [Mood.COMPETITIVE]: {
    include: ["competitive", "pvp", "online-pvp", "esports", "2d-fighter"],
    exclude: ["relaxing", "cute", "calm", "peaceful"],
  },
  [Mood.CURIOUS]: { include: ["story-rich"], exclude: [] },
  [Mood.NOSTALGIC]: {
    include: ["classic", "1990s", "1980s", "retro"],
    exclude: [],
  },
  [Mood.SOCIAL]: { include: ["online-multiplayer"], exclude: [] },
  [Mood.ANGRY]: {
    include: ["gore", "destruction", "blood"],
    exclude: ["relaxing", "cute", "calm", "peaceful"],
  },
  [Mood.STRATEGIC]: {
    include: [
      "economy",
      "city-builder",
      "building",
      "management",
      "base-building",
      "tactical",
      "rts",
    ],
    exclude: [],
  },
  [Mood.PLAYFUL]: {
    include: ["local-multiplayer", "local-co-op"],
    exclude: [],
  },
};

const GAMES_PER_MOOD = 600;

async function importGames() {
  for (const mood of Object.keys(TAGS_BY_MOOD)) {
    const totalPages = GAMES_PER_MOOD / RAWG_ITENS_PER_PAGE;

    console.info(
      `[import-games] Enqueuing ${totalPages} pages for ${mood} games`
    );

    await taskEnqueuer.enqueueGamesImportTasksByGenre(mood as Mood, totalPages);
  }
}

async function getSuggestedGame(
  mood: Mood,
  platforms?: Platform[]
): Promise<Games | undefined> {
  await connectDB();

  const platformIds =
    platforms && platforms.map((platform) => rawgParentPlatforms[platform].id);

  const game = await GamesModel.aggregate<Games>([
    { $addFields: { platformIds: "$platforms.id" } },
    {
      $match: {
        ...(platformIds && { platformIds: { $in: platformIds } }),
        mood,
      },
    },
    { $sample: { size: 1 } },
  ]);

  return _.first(game);
}

export default { importGames, getSuggestedGame };
