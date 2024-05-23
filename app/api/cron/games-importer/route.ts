import gameService from "@/services/gameService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.info("[games-importer] Handling cron request");

  await gameService.importGames();

  return NextResponse.json({});
}
