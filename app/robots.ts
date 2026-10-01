import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

// → /robots.txt
// Note: crawlers only read robots.txt at a domain's root. On a GitHub Pages *project* site
// (…github.io/<repo>/) this file isn't used — submit the sitemap in Search Console instead.
export const dynamic = "force-static";

// AI search & assistant crawlers, named explicitly so the site can be cited in AI answers (GEO)
const AI_BOTS = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User",
  "ClaudeBot", "Claude-SearchBot", "Claude-User",
  "PerplexityBot", "Perplexity-User",
  "Google-Extended", "Applebot-Extended", "Bingbot", "CCBot", "meta-externalagent", "DuckAssistBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: AI_BOTS, allow: "/" },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
