import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.info("[games-importer] Handling cron request");

  // await importGames()

  return NextResponse.json({});
}
