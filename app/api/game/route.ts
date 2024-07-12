import { Platform } from "@/adapters/rawg";
import { inngest } from "@/adapters/tasks/inngest/client";
import gameService, { Mood } from "@/services/gameService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const mood = request.nextUrl.searchParams.get("mood");

  if (!mood || !isMoodValid(mood))
    return NextResponse.json({ message: "Invalid Mood" }, { status: 422 });

  const platforms = request.nextUrl.searchParams.get("platforms")?.split(",");

  if (platforms && !isPlatformsValid(platforms))
    return NextResponse.json({ message: "Invalid Platforms" }, { status: 422 });

  const game = await gameService.getSuggestedGame(mood, platforms);

  console.log("ENVIANDO EVENTO");
  await inngest.send({
    name: "app/test.inngest",
    data: {},
  });

  return NextResponse.json(game || {});
}

function isMoodValid(mood: string): mood is Mood {
  return Object.values(Mood).includes(mood as Mood);
}

function isPlatformsValid(platforms: string[]): platforms is Platform[] {
  return platforms.every((platform) =>
    Object.keys(Platform).includes(platform as Platform)
  );
}
