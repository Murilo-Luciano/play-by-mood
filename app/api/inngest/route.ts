import { inngest } from "@/adapters/tasks/inngest/client";
import {
  importGameDetail,
  importGameScreenshots,
  importGames,
} from "@/adapters/tasks/inngest/handlers";
import { serve } from "inngest/next";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [importGames, importGameDetail, importGameScreenshots],
});
