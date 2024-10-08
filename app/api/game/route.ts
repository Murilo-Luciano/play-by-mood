import { Platform } from "@/adapters/types";
import gameService from "@/services/gameService";
import { Mood } from "@/services/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const mood = request.nextUrl.searchParams.get("mood");

  if (!mood || !isMoodValid(mood))
    return NextResponse.json({ message: "Invalid Mood" }, { status: 422 });

  const platforms = request.nextUrl.searchParams.get("platforms")?.split(",");

  if (platforms && !isPlatformsValid(platforms))
    return NextResponse.json({ message: "Invalid Platforms" }, { status: 422 });

  const game = await gameService.getSuggestedGame(mood, platforms);

  return NextResponse.json(game || {});
}

function isMoodValid(mood: string): mood is Mood {
  return Object.values(Mood).includes(mood as Mood);
}

function isPlatformsValid(platforms: string[]): platforms is Platform[] {
  return platforms.every((platform) =>
    Object.values(Platform).includes(platform as Platform)
  );
}
