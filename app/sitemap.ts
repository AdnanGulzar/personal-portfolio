import type { MetadataRoute } from "next";
import { projects } from "@/lib/data";
import { posts } from "@/lib/posts";
import { absoluteUrl } from "@/lib/site";

// → /sitemap.xml (submit this URL in Google Search Console)
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const latestPost = posts.map((p) => p.date).sort().at(-1);
  return [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/blog/"), lastModified: latestPost, changeFrequency: "weekly", priority: 0.8 },
    ...posts.map((p) => ({ url: absoluteUrl(`/blog/${p.slug}/`), lastModified: p.date, changeFrequency: "yearly" as const, priority: 0.7 })),
    ...projects.map((p) => ({ url: absoluteUrl(`/projects/${p.slug}/`), changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
}
