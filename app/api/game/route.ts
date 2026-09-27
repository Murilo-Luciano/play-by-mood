import { RawgError } from "@/adapters/rawg";
import { Platform } from "@/adapters/types";
import { isMood } from "@/lib/moods";
import gameService from "@/services/gameService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const mood = request.nextUrl.searchParams.get("mood");

  if (!mood || !isMood(mood))
    return NextResponse.json({ message: "Invalid Mood" }, { status: 422 });

  const platforms = request.nextUrl.searchParams.get("platforms")?.split(",");

  if (platforms && !isPlatformsValid(platforms))
    return NextResponse.json({ message: "Invalid Platforms" }, { status: 422 });

  try {
    const game = await gameService.getSuggestedGame(mood, platforms);

    return NextResponse.json(game || {});
  } catch (error) {
    if (!(error instanceof RawgError)) throw error;

    console.error("[api-game] Failed to get suggested game", error);

    return NextResponse.json(
      { message: "Could not reach the games database" },
      { status: 502 }
    );
  }
}

function isPlatformsValid(platforms: string[]): platforms is Platform[] {
  return platforms.every((platform) =>
    Object.values(Platform).includes(platform as Platform)
  );
}
