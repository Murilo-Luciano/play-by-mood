"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Mood } from "@/services/types";
import _ from "lodash";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

const moods = {
  [Mood.EXCITED]: {
    imageSrc: "/excited.png",
    description: "High-energy, looking for an adrenaline rush.",
  },
  [Mood.RELAXED]: {
    imageSrc: "/relaxed.png",
    description: "Wanting a calm, soothing experience.",
  },
  [Mood.FOCUSED]: {
    imageSrc: "/focused.png",
    description: "Ready to take on challenges and puzzles.",
  },
  [Mood.ADVENTUROUS]: {
    imageSrc: "/adventurous.png",
    description: "Eager to explore new worlds and environments.",
  },

  [Mood.COMPETITIVE]: {
    imageSrc: "/competitive.png",
    description: "In the mood for some intense multiplayer action.",
  },
  [Mood.CURIOUS]: {
    imageSrc: "/curious.png",
    description: "Looking to discover new stories or mechanics.",
  },
  [Mood.NOSTALGIC]: {
    imageSrc: "/nostalgic.png",
    description: "Longing for classic or retro gaming experiences.",
  },
  [Mood.SOCIAL]: {
    imageSrc: "/social.png",
    description: "Looking to play games with friends or meet new people.",
  },
  [Mood.ANGRY]: {
    imageSrc: "/angry.png",
    description: "Wanting to vent some frustration or blow off steam.",
  },
  [Mood.STRATEGIC]: {
    imageSrc: "/strategic.png",
    description:
      "Interested in tactical games that require planning and decision-making.",
  },
  [Mood.PLAYFUL]: {
    imageSrc: "/playful.png",
    description: "Wanting a light-hearted and fun experience.",
  },
};

export default function Home() {
  return (
    <main className="flex flex-col text-center p-4">
      <Head>
        <title>Play By Mood</title>
        <meta
          name="description"
          content="Find good games based on your mood!"
          key="desc"
        />

        <meta property="og:title" content="Play By Mood" />
        <meta
          property="og:description"
          content="Find good games based on your mood!"
        />
      </Head>

      <h2 className="text-start font-semibold text-lg">
        Find good games based on your mood!
      </h2>
      <p className="text-start text-base font-light ">
        What’s your mood today ?
      </p>
      <div className="h-4" />

      <ScrollArea className="h-[600px] w-full p-4 rounded-lg border">
        <div className="flex flex-wrap gap-6 justify-center">
          {Object.entries(moods).map(([key, proprieties]) => (
            <Link
              href={`/games/${key}`}
              key={key}
              className={`${buttonVariants({
                variant: "outline",
              })} h-auto w-full flex flex-col items-center justify-start bg-primary-foreground border-purple-500 rounded-xl shadow`}
            >
              <Image src={proprieties.imageSrc} alt="" height={48} width={48} />
              <span className="font-semibold text-lg">{_.capitalize(key)}</span>
              <p className="text-base font-light text-wrap">
                {proprieties.description}
              </p>
            </Link>
          ))}
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
