import type { Metadata } from "next";
import { experience, profile, skillGroups, type Project } from "./data";
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

// ── Structured data (JSON-LD) — helps Google rich results and AI answer engines (GEO) ─────────
// Entities share stable @ids so search engines and LLMs connect the person, site and content.

const PERSON_ID = () => absoluteUrl("/#person");
const WEBSITE_ID = () => absoluteUrl("/#website");
const personRef = () => ({ "@id": PERSON_ID() });

export const personJsonLd = () => {
  const current = experience.find((e) => /present/i.test(e.period));
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID(),
    name: profile.name,
    jobTitle: profile.role,
    description: profile.summary,
    email: `mailto:${profile.email}`,
    url: absoluteUrl("/"),
    image: absoluteUrl("/og.png"),
    sameAs: Object.values(profile.socials).filter(Boolean),
    ...(current ? { worksFor: { "@type": "Organization", name: current.company, ...(current.url ? { url: current.url } : {}) } } : {}),
    hasOccupation: {
      "@type": "Occupation",
      name: profile.role,
      skills: skillGroups.flatMap((g) => g.skills.map((s) => s.name)).join(", "),
    },
    knowsAbout: ["React", "Next.js", "TypeScript", "Node.js", "NestJS", "PostgreSQL", "Redis", "BullMQ", "System design", "Frontend performance"],
  };
};

export const websiteJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID(),
  name: siteName,
  url: absoluteUrl("/"),
  inLanguage: "en",
  author: personRef(),
  publisher: personRef(),
});

/** Home page: marks it as the profile page of the person (what AI engines look for on a portfolio). */
export const profilePageJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: absoluteUrl("/"),
  name: `${profile.name}, ${profile.role}`,
  isPartOf: { "@id": WEBSITE_ID() },
  mainEntity: personRef(),
});

export const projectJsonLd = (p: Project) => ({
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: p.title,
  headline: p.title,
  description: p.description,
  abstract: p.longDescription.join(" "),
  url: absoluteUrl(`/projects/${p.slug}/`),
  image: absoluteUrl(`/projects/${p.slug}/og.png`),
  dateCreated: p.year,
  keywords: p.stack.join(", "),
  creator: personRef(),
  ...(p.liveUrl ? { sameAs: p.liveUrl } : {}),
  isPartOf: { "@id": WEBSITE_ID() },
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
  inLanguage: "en",
  author: { "@type": "Person", "@id": PERSON_ID(), name: profile.name, url: absoluteUrl("/") },
  publisher: personRef(),
  isPartOf: { "@id": WEBSITE_ID() },
});

export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absoluteUrl(it.path) })),
});
