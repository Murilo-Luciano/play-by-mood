/**@todo: repensar aonde colocar na estrutura de pastas */

import rawg, { Genre } from "@/adapters/rawg";
import { GetEvents } from "inngest";
import { inngest } from "./client";

type Event = GetEvents<typeof inngest>;

export const importGames = inngest.createFunction(
  { id: "import-games", concurrency: 2 },
  { event: "game/import" },
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

    const gamesDetailEvents = gamesId.map<Event["game/import.details"]>(
      (id) => ({
        name: "game/import.details",
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
  { event: "game/import.details" },
  async ({ event, step }) => {
    const { gameId } = event.data;

    if (!gameId) {
      console.error(`[inngest-import-game-details] Missing gameId`);
      return;
    }

    console.info(`[inngest-import-game-details] Importing ${gameId} details`);

    const game = await rawg.getGameDetails(gameId);
  }
);

function isGenresValid(genres: any): genres is Genre[] {
  if (!Array.isArray(genres)) return false;

  return genres.every((genre) => Object.values(Genre).includes(genre));
}
