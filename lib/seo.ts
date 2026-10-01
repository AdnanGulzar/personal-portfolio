import type { Metadata } from "next";
import { profile } from "./data";
import { absoluteUrl, ogImage, SEO_KEYWORDS } from "./site";

const siteName = `${profile.name} · ${profile.role}`;

/**
 * Full metadata for a page: title, description, canonical URL, Open Graph (LinkedIn, Facebook, Slack…)
 * and X/Twitter card. Next replaces — not merges — openGraph/twitter per page, so every page builds all of it here.
 */
export function pageMeta({
  title,
  description,
  path,
  imageAlt,
  keywords = [],
  article,
}: {
  title?: string; // omit for the home page (uses the default title)
  description: string;
  path: string; // e.g. "/blog/what-is-system-design/"
  imageAlt?: string;
  keywords?: string[];
  article?: { publishedTime: string; tags: string[] };
}): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = title ? `${title} · ${profile.name}` : `${profile.name}, ${profile.role}`;
  const images = ogImage(path, imageAlt ?? fullTitle);

  return {
    ...(title ? { title } : {}),
    description,
    keywords: [...keywords, ...SEO_KEYWORDS],
    alternates: { canonical: url },
    openGraph: {
      url,
      title: fullTitle,
      description,
      siteName,
      locale: "en_GB",
      images,
      ...(article
        ? { type: "article", publishedTime: article.publishedTime, authors: [absoluteUrl("/")], tags: article.tags }
        : { type: "website" }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: images.map((i) => i.url),
    },
  };
}

// ── Structured data (JSON-LD) — helps Google show rich results ─────────

export const personJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  description: profile.summary,
  url: absoluteUrl("/"),
  image: absoluteUrl("/og.png"),
  sameAs: Object.values(profile.socials).filter(Boolean),
  knowsAbout: ["React", "Next.js", "TypeScript", "Node.js", "NestJS", "PostgreSQL", "Redis", "System design", "Frontend performance"],
});

export const websiteJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteName,
  url: absoluteUrl("/"),
  author: { "@type": "Person", name: profile.name },
});

export const blogPostingJsonLd = (p: { slug: string; title: string; description: string; date: string; tags: string[] }) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: p.title,
  description: p.description,
  datePublished: p.date,
  dateModified: p.date,
  keywords: p.tags.join(", "),
  url: absoluteUrl(`/blog/${p.slug}/`),
  mainEntityOfPage: absoluteUrl(`/blog/${p.slug}/`),
  image: absoluteUrl(`/blog/${p.slug}/og.png`),
  author: { "@type": "Person", name: profile.name, url: absoluteUrl("/") },
  publisher: { "@type": "Person", name: profile.name, url: absoluteUrl("/") },
});

export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absoluteUrl(it.path) })),
});
