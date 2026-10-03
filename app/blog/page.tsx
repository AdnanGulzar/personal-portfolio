import type { Metadata } from "next";
import { posts } from "@/lib/posts";
import Reveal from "@/components/Reveal";
import BlogCard from "@/components/BlogCard";
import JsonLd from "@/components/JsonLd";
import { pageMeta, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Blog",
  description: "Interactive write-ups on system design, frontend performance and building for the web.",
  path: "/blog/",
  keywords: ["blog", "system design", "frontend performance", "React performance", "web development"],
});

export default function BlogIndex() {
  return (
    <section className="relative overflow-hidden pt-36 pb-24">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog/" }])} />
      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal delay={0.05}>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            <span className="text-metal">The </span>
            <span className="font-serif font-normal italic text-white">blog</span>
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            Hands-on explanations with live demos. Every post has something to drag, type into or break.
          </p>
        </Reveal>
        <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2">
          {posts.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.06} className="h-full">
              <BlogCard post={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
