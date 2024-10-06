"use client";

import { MOST_POPULAR_PLATFORMS } from "@/adapters/types";
import { buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Mood } from "@/services/types";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import _ from "lodash";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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
  const [selectedPlatforms, setSelectedPlatforms] = useState(
    MOST_POPULAR_PLATFORMS
  );

  return (
    <main className="flex flex-col text-center p-4 md:px-24">
      <h2 className="text-start font-semibold text-lg md:text-xl">
        Find good games based on your mood!
      </h2>

      <div className="h-4" />

      <p className="text-start text-base md:text-lg font-light ">
        Select your preferred platforms:
      </p>

      <div className="h-4" />

      <Popover>
        <PopoverTrigger
          className={`self-start border-dashed border-purple-500 md:w-[200px] ${buttonVariants(
            { variant: "outline" }
          )}`}
        >
          <PlusCircledIcon className="mr-2 h-4 w-4" />
          Platforms
        </PopoverTrigger>
        <PopoverContent>
          <Command>
            <CommandInput placeholder="Platform" />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {MOST_POPULAR_PLATFORMS.map((platform) => (
                  <CommandItem key={platform}>
                    <Checkbox
                      id={platform}
                      checked={selectedPlatforms.includes(platform)}
                      onCheckedChange={() =>
                        selectedPlatforms.includes(platform)
                          ? setSelectedPlatforms(
                              selectedPlatforms.filter((p) => p !== platform)
                            )
                          : setSelectedPlatforms([
                              ...selectedPlatforms,
                              platform,
                            ])
                      }
                    />
                    <label htmlFor={platform} className="text-base ml-2 w-full">
                      {_.capitalize(platform)}
                    </label>
                  </CommandItem>
                ))}
              </CommandGroup>

              {selectedPlatforms.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => setSelectedPlatforms([])}
                      className="justify-center text-center"
                    >
                      Clear filters
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="h-8" />

      <p className="text-start text-base md:text-lg font-light ">
        What’s your mood today ?
      </p>

      <div className="h-4" />

      <ScrollArea className="h-[600px] w-full p-4 rounded-lg border">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Object.entries(moods).map(([key, proprieties]) => (
            <Link
              href={`/games/${key}?platforms=${selectedPlatforms.join(",")}`}
              key={key}
              className={`${buttonVariants({
                variant: "outline",
              })} h-auto w-full flex flex-col items-center justify-start bg-primary-foreground border-purple-500 rounded-xl shadow`}
            >
              <Image
                src={proprieties.imageSrc}
                alt={`${key.toLowerCase()} emoji`}
                height={48}
                width={48}
                className="mb-2"
              />
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
