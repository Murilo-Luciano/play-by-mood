"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Image from "next/image";
import Link from "next/link";

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
    <main className="flex flex-col text-center p-4">
      <a className="text-xl font-extrabold tracking-tight mb-5" href="/">
        PlayByMood
      </a>

      <h2 className="text-start font-semibold text-lg">
        Find good games based on your mood!
      </h2>
      <p className="text-start text-base font-light ">
        What’s your mood today ?
      </p>
      <div className="h-4" />

      <ScrollArea className="h-[600px] w-full p-4 rounded-lg border">
        <div className="flex flex-wrap gap-6 justify-center">
          <MoodButton />
          <MoodButton />
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
        <ScrollBar />
      </ScrollArea>

      <div className="h-4" />

      <div className="flex flex-col gap-2 py-2">
        <p className="text-sm text-muted-foreground">
          Made by{" "}
          <a
            href="https://github.com/Murilo-Luciano"
            target="_blank"
            className="underline text-purple-500"
          >
            @Murilo
          </a>
        </p>
        <p className="text-sm text-muted-foreground">
          Inspired by{" "}
          <a
            href="https://mood2movie.com/"
            target="_blank"
            className="underline text-purple-500"
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
    <Link href="/games/EXCITED">
      <Button
        variant="outline"
        className="h-auto flex flex-col items-center justify-start bg-primary-foreground border-purple-500 rounded-xl shadow"
      >
        <Image src={"/happy.png"} alt="" height={48} width={48} />
        <span className="font-semibold text-lg">Strategic</span>
        <p className="text-base font-light text-wrap">
          Interested in tactical games that require planning and
          decision-making.
        </p>
      </Button>
    </Link>
  );
}
