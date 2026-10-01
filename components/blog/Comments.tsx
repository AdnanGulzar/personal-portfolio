"use client";
import Giscus from "@giscus/react";
import { giscus } from "@/lib/data";

/** Comments + reactions via GitHub Discussions (giscus). Hidden until lib/data.ts → giscus is filled in. */
export default function Comments() {
  if (!giscus.repo || !giscus.repoId || !giscus.categoryId) return null;
  return (
    <section className="mt-20 border-t border-line pt-10">
      <h2 className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-subtle">Comments</h2>
      <Giscus
        repo={giscus.repo as `${string}/${string}`}
        repoId={giscus.repoId}
        category={giscus.category}
        categoryId={giscus.categoryId}
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="transparent_dark"
        lang="en"
        loading="lazy"
      />
    </section>
  );
}
