import { inngest } from "@/adapters/tasks/inngest/client";
import {
  importGameDetail,
  importGameScreenshots,
  importGames,
  test,
} from "@/adapters/tasks/inngest/handlers";
import { serve } from "inngest/next";

console.log("[api/inngest] aqui!!!");

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [test, importGames, importGameDetail, importGameScreenshots],
});
