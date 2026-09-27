import { MOST_POPULAR_PLATFORMS, Platform } from "@/adapters/types";
import { Mood } from "@/services/types";

/** UI copy per mood. `hue` tints the mood's portrait glow and power bar. */
export const MOODS: Record<
  Mood,
  { label: string; image: string; description: string; hue: number }
> = {
  [Mood.EXCITED]: {
    label: "Excited",
    image: "/excited.png",
    description: "High-energy, looking for an adrenaline rush.",
    hue: 12,
  },
  [Mood.RELAXED]: {
    label: "Relaxed",
    image: "/relaxed.png",
    description: "Wanting a calm, soothing experience.",
    hue: 170,
  },
  [Mood.FOCUSED]: {
    label: "Focused",
    image: "/focused.png",
    description: "Ready to take on challenges and puzzles.",
    hue: 220,
  },
  [Mood.ADVENTUROUS]: {
    label: "Adventurous",
    image: "/adventurous.png",
    description: "Eager to explore new worlds and environments.",
    hue: 35,
  },
  [Mood.COMPETITIVE]: {
    label: "Competitive",
    image: "/competitive.png",
    description: "In the mood for some intense multiplayer action.",
    hue: 350,
  },
  [Mood.CURIOUS]: {
    label: "Curious",
    image: "/curious.png",
    description: "Looking to discover new stories or mechanics.",
    hue: 265,
  },
  [Mood.NOSTALGIC]: {
    label: "Nostalgic",
    image: "/nostalgic.png",
    description: "Longing for classic or retro gaming experiences.",
    hue: 45,
  },
  [Mood.SOCIAL]: {
    label: "Social",
    image: "/social.png",
    description: "Looking to play games with friends or meet new people.",
    hue: 300,
  },
  [Mood.ANGRY]: {
    label: "Angry",
    image: "/angry.png",
    description: "Wanting to vent some frustration or blow off steam.",
    hue: 0,
  },
  [Mood.STRATEGIC]: {
    label: "Strategic",
    image: "/strategic.png",
    description:
      "Interested in tactical games that require planning and decision-making.",
    hue: 140,
  },
  [Mood.PLAYFUL]: {
    label: "Playful",
    image: "/playful.png",
    description: "Wanting a light-hearted and fun experience.",
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
