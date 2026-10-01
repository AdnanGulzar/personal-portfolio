import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { formatDate, posts } from "@/lib/posts";
import Reveal from "@/components/Reveal";
import Comments from "@/components/blog/Comments";
import JsonLd from "@/components/JsonLd";
import { pageMeta, blogPostingJsonLd, breadcrumbJsonLd } from "@/lib/seo";

// Pre-render one static page per post at build time (SSG)
export const dynamicParams = false;
export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = posts.find((x) => x.slug === slug);
  return p
    ? pageMeta({
        title: p.title,
        description: p.description,
        path: `/blog/${p.slug}/`,
        imageAlt: p.title,
        keywords: p.tags,
        article: { publishedTime: p.date, tags: p.tags },
      })
    : {};
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const idx = posts.findIndex((x) => x.slug === slug);
  if (idx === -1) notFound();
  const post = posts[idx];
  const next = posts[(idx + 1) % posts.length];
  const { default: Content } = await import(`@/content/blog/${slug}.mdx`);

  return (
    <article className="relative overflow-hidden pt-36 pb-24">
      <JsonLd
        data={[
          blogPostingJsonLd(post),
          breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog/" }, { name: post.title, path: `/blog/${post.slug}/` }]),
        ]}
      />
      <div aria-hidden className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full blur-[140px]" style={{ background: `${post.accent}22` }} />

      <div className="relative mx-auto max-w-3xl px-6">
        <header className="border-b border-line pb-10">
          <Reveal delay={0.05}>
            <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.15em] text-subtle">
              <span className="size-1.5 rounded-full" style={{ background: post.accent, boxShadow: `0 0 10px ${post.accent}` }} />
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span>·</span>
              <span>{post.readingTime}</span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-metal mt-5 text-3xl font-semibold leading-[1.15] tracking-tight text-balance sm:text-4xl">{post.title}</h1>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-5 text-lg leading-relaxed text-muted">{post.description}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-6 flex flex-wrap gap-1.5">
              {post.tags.map((t) => (
                <span key={t} className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-muted">{t}</span>
              ))}
            </div>
          </Reveal>
        </header>

        <div className="pt-4 text-[17px]">
          <Content />
        </div>

        <Comments />

        {posts.length > 1 && (
          <Reveal className="mt-24">
            <Link href={`/blog/${next.slug}/`} className="group block rounded-3xl border border-line p-8 transition hover:border-line-strong hover:bg-white/[0.02]">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-subtle">Next post</p>
              <div className="mt-3 flex items-center justify-between gap-4">
                <p className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{next.title}</p>
                <span className="grid size-12 shrink-0 place-items-center rounded-full border border-line transition-all duration-500 group-hover:bg-white group-hover:text-black">
                  <ArrowRight className="size-5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </Reveal>
        )}
      </div>
    </article>
  );
}
