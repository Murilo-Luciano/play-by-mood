export const SITE_URL = "https://playbymood.com";
export const SITE_NAME = "PlayByMood";
export const SITE_TITLE = "PlayByMood · Find a video game for your mood";
export const SITE_DESCRIPTION =
  "Pick your mood and get one top-rated video game to play today. Free, no sign-up: PlayByMood suggests games with a Metacritic score of 70+ for PC, PlayStation, Xbox, mobile and more.";

/**
 * Next merges `openGraph` / `twitter` shallowly, so pages overriding them must
 * spread these to keep the shared fields.
 */
export const OPEN_GRAPH_BASE = {
  type: "website",
  siteName: SITE_NAME,
  locale: "en_US",
} as const;
export const TWITTER_BASE = { card: "summary_large_image" } as const;
