import gameService from "@/services/gameService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  console.info("[games-importer] Handling cron request");

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.info("[games-importer] Unauthorized cron request");

    return new Response("Unauthorized", {
      status: 401,
    });
  }

  await gameService.importGames();

  console.info("[games-importer] Finished handling cron request");
  return NextResponse.json({});
}
