"use client";

import Image from "next/image";

// import { Mood } from "@/services/gameService";
/**@todo: Get from service folder ? */
enum Mood {
  EXCITED = "EXCITED",
  RELAXED = "RELAXED",
  FOCUSED = "FOCUSED",
  ADVENTUROUS = "ADVENTUROUS",
  COMPETITIVE = "COMPETITIVE",
  CURIOUS = "CURIOUS",
  NOSTALGIC = "NOSTALGIC",
  SOCIAL = "SOCIAL",
  ANGRY = "ANGRY",
  STRATEGIC = "STRATEGIC",
  PLAYFUL = "PLAYFUL",
}

export default function Home() {
  return (
    <main className="flex flex-col text-center py-4">
      <h1 className="text-xl font-extrabold tracking-tight mb-5">PlayByMood</h1>
      <h2 className="text-2xl font-extrabold tracking-tight">
        Find good games based on your mood
      </h2>
      <p className="text-sm text-muted-foreground">What’s your mood today ?</p>
      <div className="flex flex-wrap gap-6 justify-center mt-3">
        <MoodButton />
        <MoodButton />
        <MoodButton />
        <MoodButton />
        <MoodButton />
        <MoodButton />
        <MoodButton />
        <MoodButton />
        <MoodButton />
      </div>
      <div className="flex flex-col gap-2 py-2 mt-7">
        <p className="text-sm text-muted-foreground">
          Made by{" "}
          <a
            href="https://github.com/Murilo-Luciano"
            target="_blank"
            className="underline"
          >
            @Murilo
          </a>
        </p>
        <p className="text-sm text-muted-foreground">
          Inspired by{" "}
          <a
            href="https://mood2movie.com/"
            target="_blank"
            className="underline"
          >
            @Mood2Movie
          </a>
        </p>
      </div>
    </main>
  );
}

function MoodButton() {
  return (
    <a
      className="w-44 h-44 flex flex-col justify-between items-center"
      href="/games/RELAXED"
    >
      <Image src={"/happy.png"} alt="" height={132} width={132} />
      <div className="bg-purple-500 w-full rounded-b-2xl">
        <p className="text-xl font-extrabold">Happy</p>
      </div>
    </a>
  );
}
