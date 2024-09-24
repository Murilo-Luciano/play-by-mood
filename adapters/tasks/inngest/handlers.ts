import rawg from "@/adapters/rawg";
import connectDB from "@/config/db";
import GamesModel from "@/models/Games";
import {
  BLOCKED_TAGS,
  MINIMAL_METACRITIC_RATING,
  MINIMAL_RAWG_ADDED_COUNT,
  Mood,
  TAGS_BY_MOOD,
} from "@/services/gameService";
import { GetEvents } from "inngest";
import { inngest } from "./client";

type Event = GetEvents<typeof inngest>;

export const importGames = inngest.createFunction(
  { id: "import-games", concurrency: 2 },
  { event: "games/import" },
  async ({ event, step }) => {
    const { mood, page } = event.data;

    if (!isMoodValid(mood)) {
      console.error(`[inngest-import-game] Invalid mood ${mood}`);

      return;
    }

    if (typeof page != "number") {
      console.error(`[inngest-import-game] Invalid page ${page}`);

      return;
    }

    const tags = TAGS_BY_MOOD[mood];

    if (!tags) {
      console.error(
        `[inngest-import-game] Tags not registered for mood ${mood}`
      );

      return;
    }

    if (!tags.include.length) {
      console.error(`[inngest-import-game] No tags mood ${mood}`);

      return;
    }

    console.info(
      `[inngest-import-game] Importing page ${page} of ${mood} games`
    );

    const gamesId = (await rawg.getGamesByTags(tags.include, page)).map(
      (game) => game.id
    );

    const gamesDetailEvents = gamesId.map<Event["games/import.details"]>(
      (id) => ({
        name: "games/import.details",
        data: {
          gameId: id,
          mood,
        },
      })
    );

    console.info(
      `[inngest-import-game] Enqueuing ${
        gamesDetailEvents.length
      } games of: page ${page} genre ${tags.toString()}`
    );

    await step.sendEvent("enqueue-games-detail-import", gamesDetailEvents);

    console.info(
      `[inngest-import-game] Finished importing page ${page} of ${tags.toString()} games`
    );
    return;
  }
);

export const importGameDetail = inngest.createFunction(
  { id: "import-game-details", concurrency: 2 },
  { event: "games/import.details" },
  async ({ event, step }) => {
    const { gameId, mood } = event.data;

    if (!gameId) {
      console.error(`[inngest-import-game-details] Missing gameId`);
      return;
    }

    if (!isMoodValid(mood)) {
      console.error(`[inngest-import-game-details] Invalid mood ${mood}`);

      return;
    }

    console.info(`[inngest-import-game-details] Importing ${gameId} details`);

    const game = await rawg.getGameDetails(gameId);

    const excludeTags = TAGS_BY_MOOD[mood]?.exclude || [];

    if (
      game.tags
        .map((tag) => tag.slug)
        .some((slug) => excludeTags.includes(slug))
    ) {
      console.info(
        `[inngest-import-game-details] Game ${gameId} has exclude tags`
      );

      return;
    }
    if (
      game.tags
        .map((tag) => tag.slug)
        .some((slug) => BLOCKED_TAGS.includes(slug))
    ) {
      console.info(
        `[inngest-import-game-details] Game ${gameId} has blocked tags`
      );

      return;
    }

    if (game.added < MINIMAL_RAWG_ADDED_COUNT) {
      console.info(
        `[inngest-import-game-details] Game ${gameId} added count is bellow the minimal`
      );

      return;
    }

    if (game.metacritic < MINIMAL_METACRITIC_RATING) {
      console.info(
        `[inngest-import-game-details] Game ${gameId} metacritic is bellow the minimal`
      );

      return;
    }

    await connectDB();
    await GamesModel.findOneAndUpdate(
      { id: game.id, mood },
      {
        name: game.name,
        description: game.description,
        rawgAddedCount: game.added,
        metacriticRating: game.metacritic,
        imageUrl: game.background_image,
        releasedDate: game.released,
        redditUrl: game.reddit_url,
        tags: game.tags,
        genres: game.genres,
        platforms: game.parent_platforms.map((p) => p.platform),
      },
      { upsert: true }
    );

    console.info(
      `[inngest-import-game-details] Finished importing ${gameId} details`
    );

    console.info(
      `[inngest-import-game-details] Enqueuing screenshot import ${game.id}`
    );

    await step.sendEvent("enqueue-games-detail-screenshots", {
      name: "games/import.screenshots",
      data: {
        gameId: game.id,
      },
    });
  }
);

export const importGameScreenshots = inngest.createFunction(
  { id: "import-game-screenshots", concurrency: 2 },
  { event: "games/import.screenshots" },
  async ({ event }) => {
    const { gameId } = event.data;

    if (!gameId) {
      console.error(`[inngest-import-game-screenshots] Missing gameId`);
      return;
    }

    console.info(
      `[inngest-import-game-screenshots] Importing ${gameId} screenshots`
    );

    const screenshots = await rawg.getGameScreenshots(gameId);

    await connectDB();
    await GamesModel.updateMany({ id: gameId }, { screenshots });

    console.info(
      `[inngest-import-game-screenshots] Finished importing ${gameId} screenshots`
    );
  }
);

function isMoodValid(mood: any): mood is Mood {
  return Object.values(Mood).includes(mood);
}
