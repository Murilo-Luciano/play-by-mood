import { SITE_URL } from "@/lib/site";
import type { MetadataRoute } from "next";

// AI crawlers (GPTBot, ClaudeBot, PerplexityBot...) are welcome: being cited
// by generative search is part of how people find the site.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
