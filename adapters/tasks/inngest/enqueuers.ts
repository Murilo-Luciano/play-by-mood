import { Mood } from "@/services/gameService";
import _ from "lodash";
import { inngest } from "./client";

async function enqueueGamesImportTasksByGenre(mood: Mood, totalPages: number) {
  const tasksEnqueuer: (() => Promise<void>)[] = [];

  for (let page = 1; page <= totalPages; page++) {
    tasksEnqueuer.push(async () => {
      await inngest.send({
        name: "games/import",
        data: {
          mood,
          page,
        },
      });
    });
  }

  await enqueueTasksWithConcurrency(tasksEnqueuer, 200);
}

async function enqueueTasksWithConcurrency(
  tasksEnqueuer: (() => Promise<void>)[],
  concurrency: number
) {
  const tasksEnqueuerChunks = _.chunk(tasksEnqueuer, concurrency);

  for (const tasksEnqueuer of tasksEnqueuerChunks) {
    await Promise.allSettled(
      tasksEnqueuer.map((taskEnqueuer) => taskEnqueuer())
    );
  }
}

export default { enqueueGamesImportTasksByGenre };
