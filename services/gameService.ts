import {
  Platform,
  RAWG_ITENS_PER_PAGE,
  rawgParentPlatforms,
} from "@/adapters/rawg";

import taskEnqueuer from "@/adapters/tasks/inngest/enqueuers";
import connectDB from "@/config/db";
import GamesModel, { Games } from "@/models/Games";
import _ from "lodash";

export enum Mood {
  EXCITED = "EXCITED",
  RELAXED = "RELAXED",
  FOCUSED = "FOCUSED",
  ADVENTUROUS = "ADVENTUROUS",
  COMPETITIVE = "COMPETITIVE",
  CURIOUS = "CURIOUS",
  NOSTALGIC = "NOSTALGIC",
  SOCIAL = "SOCIAL",
  ANGRY = "ANGRY",
  STRATEGIC = "STRATEGIC",
  PLAYFUL = "PLAYFUL",
}

export const MINIMAL_RAWG_ADDED_COUNT = 800;
export const MINIMAL_METACRITIC_RATING = 70;
export const BLOCKED_TAGS = ["nsfw", "adult", "erotic"];

export const TAGS_BY_MOOD: Record<Mood, string[]> = {
  [Mood.EXCITED]: [
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
  [Mood.RELAXED]: ["relaxing", "cute", "calm", "peaceful"],
  [Mood.FOCUSED]: ["puzzle"],
  [Mood.ADVENTUROUS]: ["exploration", "open-world", "action-adventure"],
  [Mood.COMPETITIVE]: [
    "competitive",
    "pvp",
    "online-pvp",
    "esports",
    "2d-fighter",
  ],
  [Mood.CURIOUS]: ["story-rich"],
  [Mood.NOSTALGIC]: ["classic", "1990s", "1980s", "retro"],
  [Mood.SOCIAL]: ["online-multiplayer"],
  [Mood.ANGRY]: ["gore", "destruction", "blood"],
  [Mood.STRATEGIC]: [
    "economy",
    "city-builder",
    "building",
    "management",
    "base-building",
    "tactical",
    "rts",
  ],
  [Mood.PLAYFUL]: ["local-multiplayer", "local-co-op"],
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
