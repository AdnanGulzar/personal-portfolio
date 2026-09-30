"use client";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/lib/data";
import SectionHeading from "./SectionHeading";
import SpotlightCard from "./SpotlightCard";
import ProjectVisual from "./ProjectVisual";
import Reveal from "./Reveal";
import { hexToRgb } from "@/lib/utils";

export default function Projects() {
  return (
    <section id="work" className="relative mx-auto max-w-6xl px-6 py-28">
      <SectionHeading
        eyebrow="Selected work"
        title="Things I've"
        accent="built & shipped"
        description="A few products I've designed, engineered and deployed — from enterprise SaaS portals to AI-driven dashboards and annotation tools."
      />

      <div className="mt-16 grid gap-5 md:grid-cols-6">
        {projects.map((p, i) => {
          const span = i < 2 ? "md:col-span-3" : "md:col-span-2";
          return (
            <Reveal key={p.slug} delay={(i % 3) * 0.08} className={span}>
              <SpotlightCard color={hexToRgb(p.accent)} className="h-full">
                <Link
                  href={`/projects/${p.slug}/`}
                  className="flex h-full flex-col p-5"
                  aria-label={`${p.title} case study`}
                >
                  <div className={i < 2 ? "h-64" : "h-48"}>
                    <ProjectVisual accent={p.accent} variant={i} image={p.image} alt={`${p.title} screenshot`} />
                  </div>
                  <div className="flex flex-1 flex-col px-1 pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-mono text-xs uppercase tracking-wider text-subtle">
                          {p.kicker}
                        </p>
                        <h3 className="mt-2 text-xl font-semibold tracking-tight text-white">
                          {p.title}
                        </h3>
                      </div>
                      <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line text-muted transition-all duration-500 group-hover:rotate-45 group-hover:border-white group-hover:bg-white group-hover:text-black">
                        <ArrowUpRight className="size-4" />
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {p.description}
                    </p>
                    <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
                      {p.stack.slice(0, 4).map((s) => (
                        <span
                          key={s}
                          className="rounded-full border border-line bg-white/[0.02] px-2.5 py-1 font-mono text-[11px] text-muted"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </SpotlightCard>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
