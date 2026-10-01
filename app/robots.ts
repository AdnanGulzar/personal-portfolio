import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

// → /robots.txt
// Note: crawlers only read robots.txt at a domain's root. On a GitHub Pages *project* site
// (…github.io/<repo>/) this file isn't used — submit the sitemap in Search Console instead.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
