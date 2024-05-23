import connectDB from "@/config/db";
import { GamesModel } from "@/models/Games";
import { NextRequest, NextResponse } from "next/server";

export const MOCK = {
  name: "Counter-Strike: Global Offensive",
  imageUrl:
    "https://media.rawg.io/media/games/736/73619bd336c894d6941d926bfd563946.jpg",
  metacriticRating: 81,
  description:
    "Counter-Strike is a multiplayer phenomenon in its simplicity. No complicated narratives to explain the source of the conflict, no futuristic and alien threats, but counter-terrorists against terrorists. Arena shooter at its core, CS:GO provides you with various methods of disposing enemies and reliant on cooperation within the team. During the round of the classical clash mode, you will gradually receive currency to purchase different equipment. Each player can carry a primary weapon, secondary pistol, knife and a set of grenades, which all can change the battle if wielded by the skilled player. \r\nObjectives are clear and vary from map to map, from game mode to game mode. Stop the terrorists from planting explosives, stop the counter-terrorist from retrieving the hostages, kill everyone who isn’t you and just perform the best with.\r\nCS:GO is one of the major cybersport discipline, which makes playing it more exciting to some players. Aside from purchasing the game, CS:GO is infamous for its loot case system, that requires players to purchase keys, in order to open said cases. Customization items consist of weapon skins, weapon stickers, and sprays that do not affect gameplay and have purely visual value to the player.",
  tags: [
    "Steam Achievements",
    "Multiplayer",
    "Full controller support",
    "steam-trading-cards",
    "Co-op",
    "cooperative",
    "First-Person",
    "FPS",
    "Online Co-Op",
    "Tactical",
    "stats",
    "Steam Workshop",
    "PvP",
    "Moddable",
    "War",
    "In-App Purchases",
    "Realistic",
    "Team-Based",
    "Fast-Paced",
    "Military",
    "Valve Anti-Cheat enabled",
    "Competitive",
    "e-sports",
    "Trading",
  ],
  genres: ["Shooter"],
  platforms: ["PC", "PlayStation", "Xbox", "Linux"],
  screenshots: [],
  redditUrl: "https://www.reddit.com/r/GlobalOffensive/",
  releasedDate: "2012-08-21",
};

export async function GET(request: NextRequest) {
  const mood = request.nextUrl.searchParams.get("mood");

  if (!mood)
    return NextResponse.json({ message: "Missing mood" }, { status: 422 });

  const platform = request.nextUrl.searchParams.get("platform");

  // const suggestedGame = await getSuggestedGame(mood, platform)

  await connectDB();

  const game = await GamesModel.find();

  return NextResponse.json(game);
}
