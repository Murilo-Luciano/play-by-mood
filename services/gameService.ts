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

interface MoodQuery {
  id: string;
  tags?: {
    include: string[];
    exclude: string[];
  };
  genres?: string[];
}

export const QUERIES_BY_MOOD: Record<Mood, MoodQuery[]> = {
  [Mood.FOCUSED]: [
    {
      id: "genres-query",
      genres: ["puzzle"],
    },
  ],
  [Mood.PLAYFUL]: [
    {
      id: "genres-and-tags-query",
      tags: {
        include: ["local-multiplayer", "local-co-op"],
        exclude: [],
      },
      genres: ["casual"],
    },
  ],
  [Mood.STRATEGIC]: [
    {
      id: "genres-and-tags-query",
      tags: {
        include: [
          "economy",
          "city-builder",
          "building",
          "management",
          "base-building",
          "tactical",
          "rts",
        ],
        exclude: ["fps"],
      },
      genres: ["strategy"],
    },
  ],
  [Mood.ADVENTUROUS]: [
    {
      id: "tags-query",
      tags: {
        include: ["exploration", "open-world", "action-adventure"],
        exclude: [],
      },
    },
    {
      id: "genres-query",
      genres: ["adventure"],
    },
  ],
  [Mood.EXCITED]: [
    {
      id: "tags-query",
      tags: {
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
    },
  ],
  [Mood.COMPETITIVE]: [
    {
      id: "tags-query",
      tags: {
        include: ["competitive", "pvp", "online-pvp", "esports", "2d-fighter"],
        exclude: ["relaxing", "cute", "calm", "peaceful"],
      },
    },
  ],
  [Mood.RELAXED]: [
    {
      id: "tags-query",
      tags: {
        include: ["relaxing", "cute", "calm", "peaceful"],
        exclude: [],
      },
    },
  ],
  [Mood.CURIOUS]: [
    {
      id: "tags-query",
      tags: { include: ["story-rich"], exclude: [] },
    },
  ],
  [Mood.NOSTALGIC]: [
    {
      id: "tags-query",
      tags: {
        include: ["classic", "1990s", "1980s", "retro"],
        exclude: [],
      },
    },
  ],
  [Mood.SOCIAL]: [
    {
      id: "tags-query",
      tags: { include: ["online-multiplayer"], exclude: [] },
    },
  ],
  [Mood.ANGRY]: [
    {
      id: "tags-query",
      tags: {
        include: ["gore", "destruction", "blood"],
        exclude: ["relaxing", "cute", "calm", "peaceful"],
      },
    },
  ],
};

const GAMES_PER_MOOD_QUERY = 200;

async function importGames() {
  const totalPages = GAMES_PER_MOOD_QUERY / RAWG_ITENS_PER_PAGE;

  for (const [mood, queries] of Object.entries(QUERIES_BY_MOOD)) {
    for (const query of queries) {
      console.info(
        `[import-games] Enqueuing ${totalPages} pages for query ${query.id} ${mood} games`
      );

      await taskEnqueuer.enqueueGamesImportTasks(
        mood as Mood,
        query.id,
        totalPages
      );
    }
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
