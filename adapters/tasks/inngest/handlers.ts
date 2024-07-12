import rawg, { Genre } from "@/adapters/rawg";
import connectDB from "@/config/db";
import GamesModel from "@/models/Games";
import { GetEvents } from "inngest";
import { inngest } from "./client";

type Event = GetEvents<typeof inngest>;

export const importGames = inngest.createFunction(
  { id: "import-games", concurrency: 2 },
  { event: "games/import" },
  async ({ event, step }) => {
    const { genres, page } = event.data;

    if (!isGenresValid(genres)) {
      console.error(
        `[inngest-import-game] Invalid genres ${genres.toString()}`
      );

      return;
    }

    if (typeof page != "number") {
      console.error(`[inngest-import-game] Invalid page ${page}`);

      return;
    }

    console.info(
      `[inngest-import-game] Importing page ${page} of ${genres.toString()} games`
    );

    const gamesId = (await rawg.getGamesByGenres(genres, page)).map(
      (game) => game.id
    );

    const gamesDetailEvents = gamesId.map<Event["games/import.details"]>(
      (id) => ({
        name: "games/import.details",
        data: {
          gameId: id,
        },
      })
    );

    console.info(
      `[inngest-import-game] Enqueuing ${
        gamesDetailEvents.length
      } games of: page ${page} genre ${genres.toString()}`
    );

    await step.sendEvent("enqueue-games-detail-import", gamesDetailEvents);

    console.info(
      `[inngest-import-game] Finished importing page ${page} of ${genres.toString()} games`
    );
    return;
  }
);

export const importGameDetail = inngest.createFunction(
  { id: "import-game-details", concurrency: 2 },
  { event: "games/import.details" },
  async ({ event, step }) => {
    const { gameId } = event.data;

    if (!gameId) {
      console.error(`[inngest-import-game-details] Missing gameId`);
      return;
    }

    console.info(`[inngest-import-game-details] Importing ${gameId} details`);

    const game = await rawg.getGameDetails(gameId);

    await connectDB();
    await GamesModel.findOneAndUpdate(
      { id: game.id },
      {
        name: game.name,
        description: game.description_raw,
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
    await GamesModel.findOneAndUpdate({ id: gameId }, { screenshots });

    console.info(
      `[inngest-import-game-screenshots] Finished importing ${gameId} screenshots`
    );
  }
);

export const test = inngest.createFunction(
  { id: "test-inngest" },
  { event: "app/test.inngest" },
  async ({ event, step }) => {
    console.info(`[test-inngest] Testing inngest`);

    console.log("AQUI!!!!!!!!!");

    console.info(`[test-inngest] Finished Testing inngest`);
    return;
  }
);

function isGenresValid(genres: any): genres is Genre[] {
  if (!Array.isArray(genres)) return false;

  return genres.every((genre) => Object.values(Genre).includes(genre));
}
