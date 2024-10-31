import { Mood } from "@/services/types";
import _ from "lodash";
import { inngest } from "./client";

async function enqueueGamesImportTasks(
  mood: Mood,
  queryId: string,
  totalPages: number
) {
  const tasksEnqueuer: (() => Promise<void>)[] = [];

  for (let page = 1; page <= totalPages; page++) {
    tasksEnqueuer.push(async () => {
      await inngest.send({
        name: "games/import",
        data: {
          mood,
          queryId,
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

export default { enqueueGamesImportTasks };
