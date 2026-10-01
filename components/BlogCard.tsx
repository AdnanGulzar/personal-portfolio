import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatDate, type Post } from "@/lib/posts";
import { hexToRgb } from "@/lib/utils";
import SpotlightCard from "./SpotlightCard";

export default function BlogCard({ post }: { post: Post }) {
  return (
    <SpotlightCard color={hexToRgb(post.accent)} className="h-full">
      <Link href={`/blog/${post.slug}/`} className="group/post flex h-full flex-col p-6 sm:p-7">
        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.15em] text-subtle">
          <span className="size-1.5 rounded-full" style={{ background: post.accent, boxShadow: `0 0 10px ${post.accent}` }} />
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>·</span>
          <span>{post.readingTime}</span>
        </div>
        <h3 className="mt-5 text-2xl font-semibold leading-snug tracking-tight text-white text-balance">{post.title}</h3>
        <p className="mt-3 flex-1 leading-relaxed text-muted">{post.description}</p>
        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((t) => (
              <span key={t} className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-muted">{t}</span>
            ))}
          </div>
          <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line transition-all duration-500 group-hover/post:bg-white group-hover/post:text-black">
            <ArrowUpRight className="size-4 transition-transform group-hover/post:-translate-y-0.5 group-hover/post:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </SpotlightCard>
  );
}
