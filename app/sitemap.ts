import { MOOD_KEYS } from "@/lib/moods";
import { SITE_URL } from "@/lib/site";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    ...MOOD_KEYS.map((mood) => ({
      url: `${SITE_URL}/games/${mood}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
