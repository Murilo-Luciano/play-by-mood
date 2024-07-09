import { Platform } from "@/adapters/rawg";
import GamesModel from "@/models/Games";
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

  console.log("AQUI!!! ----> game", game);

  await GamesModel.create({
    id: 123456,
    __v: 0,
    description:
      "The Longest Journey is an amazing graphical adventure, where the player controls the protagonist, April Ryan, on her journey between parallel universes. Embark on an exciting and original journey of discovery, where you will explore, solve puzzles, meet new people, face terrifying monsters, learn, grow, and live the adventure of a lifetime!\nOver 150 locations spanning two distinct and detailed worlds\nMore than 70 speaking characters\n40+ hours of gameplay\n20+ minutes of high-resolution pre-rendered video footage\nCinematic musical score",
    genres: [
      {
        id: 3,
        name: "Adventure",
        slug: "adventure",
        games_count: 138903,
        image_background:
          "https://media.rawg.io/media/games/253/2534a46f3da7fa7c315f1387515ca393.jpg",
      },
      {
        id: 7,
        name: "Puzzle",
        slug: "puzzle",
        games_count: 97270,
        image_background:
          "https://media.rawg.io/media/games/e07/e07737df8469bf32d132ba9eaffc3461.jpg",
      },
    ],
    imageUrl:
      "https://media.rawg.io/media/screenshots/944/944933ddfb27a6ebc1c3e4c3ee250503.jpg",
    metacriticRating: 91,
    name: "The Longest Journey",
    platforms: [
      {
        id: 1,
        name: "PC",
        slug: "pc",
      },
    ],
    redditUrl: "123",
    releasedDate: "1999-11-18",
    screenshots: [
      {
        id: 144251,
        image:
          "https://media.rawg.io/media/screenshots/bf6/bf601dfd0ca34295da84a9072d0c7e46.jpg",
        width: 640,
        height: 480,
        is_deleted: false,
      },
      {
        id: 144252,
        image:
          "https://media.rawg.io/media/screenshots/043/04305c772d6323692a12ddcf4e1aeadb.jpg",
        width: 640,
        height: 480,
        is_deleted: false,
      },
      {
        id: 144253,
        image:
          "https://media.rawg.io/media/screenshots/f29/f29323a3921599b6cf363cfb2763c47e.jpg",
        width: 640,
        height: 480,
        is_deleted: false,
      },
      {
        id: 144254,
        image:
          "https://media.rawg.io/media/screenshots/bab/bab5e8e257ced2ebf0830398bf94740d.jpg",
        width: 640,
        height: 480,
        is_deleted: false,
      },
      {
        id: 144255,
        image:
          "https://media.rawg.io/media/screenshots/3b0/3b0b81064b334eead52cee429b0ce984.jpg",
        width: 640,
        height: 480,
        is_deleted: false,
      },
      {
        id: 144256,
        image:
          "https://media.rawg.io/media/screenshots/2a9/2a9904e36e7175e460c49268cb134db1.jpg",
        width: 640,
        height: 480,
        is_deleted: false,
      },
    ],
    tags: [
      {
        id: 31,
        name: "Singleplayer",
        slug: "singleplayer",
        language: "eng",
        games_count: 220522,
        image_background:
          "https://media.rawg.io/media/games/511/5118aff5091cb3efec399c808f8c598f.jpg",
      },
      {
        id: 13,
        name: "Atmospheric",
        slug: "atmospheric",
        language: "eng",
        games_count: 32548,
        image_background:
          "https://media.rawg.io/media/games/f46/f466571d536f2e3ea9e815ad17177501.jpg",
      },
      {
        id: 42,
        name: "Great Soundtrack",
        slug: "great-soundtrack",
        language: "eng",
        games_count: 3391,
        image_background:
          "https://media.rawg.io/media/games/ee3/ee3e10193aafc3230ba1cae426967d10.jpg",
      },
      {
        id: 24,
        name: "RPG",
        slug: "rpg",
        language: "eng",
        games_count: 20341,
        image_background:
          "https://media.rawg.io/media/games/ee3/ee3e10193aafc3230ba1cae426967d10.jpg",
      },
      {
        id: 118,
        name: "Story Rich",
        slug: "story-rich",
        language: "eng",
        games_count: 21003,
        image_background:
          "https://media.rawg.io/media/games/8a0/8a02f84a5916ede2f923b88d5f8217ba.jpg",
      },
      {
        id: 45,
        name: "2D",
        slug: "2d",
        language: "eng",
        games_count: 194092,
        image_background:
          "https://media.rawg.io/media/games/ffe/ffed87105b14f5beff72ff44a7793fd5.jpg",
      },
      {
        id: 32,
        name: "Sci-fi",
        slug: "sci-fi",
        language: "eng",
        games_count: 18804,
        image_background:
          "https://media.rawg.io/media/games/120/1201a40e4364557b124392ee50317b99.jpg",
      },
      {
        id: 64,
        name: "Fantasy",
        slug: "fantasy",
        language: "eng",
        games_count: 27201,
        image_background:
          "https://media.rawg.io/media/games/d2c/d2c74dacd89fd817c2deb625b01adb1a.jpg",
      },
      {
        id: 4,
        name: "Funny",
        slug: "funny",
        language: "eng",
        games_count: 24439,
        image_background:
          "https://media.rawg.io/media/games/744/744adc36e6573dd67a0cb0e373738d19.jpg",
      },
      {
        id: 193,
        name: "Classic",
        slug: "classic",
        language: "eng",
        games_count: 1788,
        image_background:
          "https://media.rawg.io/media/games/ee3/ee3e10193aafc3230ba1cae426967d10.jpg",
      },
      {
        id: 189,
        name: "Female Protagonist",
        slug: "female-protagonist",
        language: "eng",
        games_count: 12087,
        image_background:
          "https://media.rawg.io/media/games/63f/63f0e68688cad279ed38cde931dbfcdb.jpg",
      },
      {
        id: 141,
        name: "Point & Click",
        slug: "point-click",
        language: "eng",
        games_count: 12763,
        image_background:
          "https://media.rawg.io/media/games/264/2642b17a7885f7abc4fd018e98943242.jpg",
      },
      {
        id: 167,
        name: "Futuristic",
        slug: "futuristic",
        language: "eng",
        games_count: 5184,
        image_background:
          "https://media.rawg.io/media/games/26d/26d4437715bee60138dab4a7c8c59c92.jpg",
      },
      {
        id: 226,
        name: "Cyberpunk",
        slug: "cyberpunk",
        language: "eng",
        games_count: 4477,
        image_background:
          "https://media.rawg.io/media/games/81e/81e6c6819d4322caf375b6735c3043ec.jpg",
      },
    ],
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
