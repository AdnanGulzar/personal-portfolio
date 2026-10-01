import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { posts } from "@/lib/posts";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import BlogCard from "./BlogCard";

/** Home page section: latest posts. */
export default function Blog() {
  return (
    <section id="blog" className="relative mx-auto max-w-6xl px-6 py-28">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          eyebrow="Blog"
          title="Notes from"
          accent="the build"
          description="Interactive write-ups on the things I work with every day. Drag, type and click your way through the ideas."
        />
        <Reveal delay={0.2}>
          <Link href="/blog/" className="group inline-flex items-center gap-2 text-sm text-muted transition hover:text-white">
            All posts <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
      <div className="mt-14 grid gap-5 md:grid-cols-2">
        {posts.slice(0, 4).map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.08} className="h-full">
            <BlogCard post={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
