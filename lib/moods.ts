import { MOST_POPULAR_PLATFORMS, Platform } from "@/adapters/types";
import { Mood } from "@/services/types";

/**
 * UI copy per mood. `description` is the short tile text; `intro` says which
 * games the mood suggests (keep it in sync with `QUERIES_BY_MOOD`) and feeds
 * the mood page copy, metadata and llms.txt. `hue` tints the portrait glow.
 */
export const MOODS: Record<
  Mood,
  {
    label: string;
    image: string;
    description: string;
    intro: string;
    hue: number;
  }
> = {
  [Mood.EXCITED]: {
    label: "Excited",
    image: "/excited.png",
    description: "High-energy, looking for an adrenaline rush.",
    intro:
      "Adrenaline-fueled games: combat, stealth, horror, parkour, racing and post-apocalyptic survival.",
    hue: 12,
  },
  [Mood.RELAXED]: {
    label: "Relaxed",
    image: "/relaxed.png",
    description: "Wanting a calm, soothing experience.",
    intro: "Calm, cozy and peaceful games to unwind with.",
    hue: 170,
  },
  [Mood.FOCUSED]: {
    label: "Focused",
    image: "/focused.png",
    description: "Ready to take on challenges and puzzles.",
    intro: "Puzzle games that reward concentration and clever thinking.",
    hue: 220,
  },
  [Mood.ADVENTUROUS]: {
    label: "Adventurous",
    image: "/adventurous.png",
    description: "Eager to explore new worlds and environments.",
    intro:
      "Adventure, open-world and exploration games with big worlds to discover.",
    hue: 35,
  },
  [Mood.COMPETITIVE]: {
    label: "Competitive",
    image: "/competitive.png",
    description: "In the mood for some intense multiplayer action.",
    intro:
      "PvP, esports and fighting games where you test your skills against other players.",
    hue: 350,
  },
  [Mood.CURIOUS]: {
    label: "Curious",
    image: "/curious.png",
    description: "Looking to discover new stories or mechanics.",
    intro: "Story-rich games with memorable narratives.",
    hue: 265,
  },
  [Mood.NOSTALGIC]: {
    label: "Nostalgic",
    image: "/nostalgic.png",
    description: "Longing for classic or retro gaming experiences.",
    intro:
      "Classic and retro games, including favorites from the '80s and '90s.",
    hue: 45,
  },
  [Mood.SOCIAL]: {
    label: "Social",
    image: "/social.png",
    description: "Looking to play games with friends or meet new people.",
    intro: "Online multiplayer games to play with friends.",
    hue: 300,
  },
  [Mood.ANGRY]: {
    label: "Angry",
    image: "/angry.png",
    description: "Wanting to vent some frustration or blow off steam.",
    intro: "Over-the-top action with destruction and gore to blow off steam.",
    hue: 0,
  },
  [Mood.STRATEGIC]: {
    label: "Strategic",
    image: "/strategic.png",
    description:
      "Interested in tactical games that require planning and decision-making.",
    intro:
      "Strategy games: city builders, management, base building, tactics and RTS.",
    hue: 140,
  },
  [Mood.PLAYFUL]: {
    label: "Playful",
    image: "/playful.png",
    description: "Wanting a light-hearted and fun experience.",
    intro: "Casual games with local multiplayer and couch co-op.",
    hue: 80,
  },
};

export const MOOD_KEYS = Object.keys(MOODS) as Mood[];

/** `?platforms=` → selected platforms; a missing param means all of them. */
export function parsePlatforms(param: string | null): Platform[] {
  if (param === null) return MOST_POPULAR_PLATFORMS;

  return param
    .split(",")
    .filter((p): p is Platform =>
      MOST_POPULAR_PLATFORMS.includes(p as Platform)
    );
}

export function homeHref(platforms: string | null) {
  return platforms?.length ? `/?platforms=${platforms}` : "/";
}

export function resultHref(mood: Mood, platforms: Platform[]) {
  return `/games/${mood}?platforms=${encodeURIComponent(platforms.join(","))}`;
}

export function isMood(value: string): value is Mood {
  return Object.values(Mood).includes(value as Mood);
}
