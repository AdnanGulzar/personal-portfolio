import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { projects } from "@/lib/data";
import { hexToRgb } from "@/lib/utils";
import Reveal from "@/components/Reveal";
import ProjectVisual from "@/components/ProjectVisual";
import SpotlightCard from "@/components/SpotlightCard";
import { GitHubIcon } from "@/components/Icons";

// Pre-render one static page per project at build time (SSG)
export const dynamicParams = false;
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  return p ? { title: p.title, description: p.description } : {};
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const idx = projects.findIndex((x) => x.slug === slug);
  if (idx === -1) notFound();
  const p = projects[idx];
  const next = projects[(idx + 1) % projects.length];

  return (
    <article className="relative overflow-hidden pt-36 pb-24">
      <div aria-hidden className="absolute inset-0 bg-grid" />
      <div aria-hidden className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full blur-[140px]" style={{ background: `${p.accent}22` }} />

      <div className="relative mx-auto max-w-4xl px-6">
        <Reveal>
          <Link href="/#work" className="group inline-flex items-center gap-2 text-sm text-muted transition hover:text-white">
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" /> All projects
          </Link>
        </Reveal>

        <Reveal delay={0.05}>
          <p className="mt-10 font-mono text-xs uppercase tracking-[0.2em] text-subtle">{p.kicker}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="text-metal mt-4 text-5xl font-semibold tracking-tight sm:text-7xl">{p.title}</h1>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-muted">{p.description}</p>
        </Reveal>

        <Reveal delay={0.2}>
          <dl className="mt-10 grid grid-cols-2 gap-6 border-y border-line py-6 sm:grid-cols-3">
            <div><dt className="text-xs text-subtle">Role</dt><dd className="mt-1 text-sm text-fg">{p.role}</dd></div>
            <div><dt className="text-xs text-subtle">Year</dt><dd className="mt-1 text-sm text-fg">{p.year}</dd></div>
            <div className="col-span-2 flex items-center gap-2 sm:col-span-1 sm:justify-end">
              {p.liveUrl && (
                <a href={p.liveUrl} className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-white/85">
                  Live <ArrowUpRight className="size-4" />
                </a>
              )}
              {p.repoUrl && (
                <a href={p.repoUrl} className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm text-fg transition hover:border-line-strong">
                  <GitHubIcon className="size-4" /> Code
                </a>
              )}
            </div>
          </dl>
        </Reveal>

        <Reveal delay={0.25} className="mt-12">
          <SpotlightCard color={hexToRgb(p.accent)} tilt={false} className="p-3">
            <div className="h-72 sm:h-96"><ProjectVisual accent={p.accent} variant={idx} image={p.image} alt={`${p.title} screenshot`} /></div>
          </SpotlightCard>
        </Reveal>

        <div className="mt-16 grid gap-12 md:grid-cols-[1.4fr_1fr]">
          <div className="space-y-5">
            <Reveal><h2 className="text-2xl font-semibold tracking-tight text-white">Overview</h2></Reveal>
            {p.longDescription.map((para, i) => (
              <Reveal key={i} delay={0.05 * i}><p className="leading-relaxed text-muted">{para}</p></Reveal>
            ))}
          </div>
          <div>
            <Reveal><h2 className="text-2xl font-semibold tracking-tight text-white">Highlights</h2></Reveal>
            <ul className="mt-5 space-y-3">
              {p.highlights.map((h, i) => (
                <Reveal key={h} delay={0.06 * i}>
                  <li className="flex gap-3 text-sm text-muted">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full" style={{ background: `${p.accent}25`, color: p.accent }}>
                      <Check className="size-3" />
                    </span>
                    {h}
                  </li>
                </Reveal>
              ))}
            </ul>
            <Reveal delay={0.2}>
              <h3 className="mt-10 font-mono text-xs uppercase tracking-[0.2em] text-subtle">Stack</h3>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.stack.map((s) => (
                  <span key={s} className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-muted">{s}</span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal className="mt-24">
          <Link href={`/projects/${next.slug}/`} className="group block rounded-3xl border border-line p-8 transition hover:border-line-strong hover:bg-white/[0.02]">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-subtle">Next project</p>
            <div className="mt-3 flex items-center justify-between gap-4">
              <p className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{next.title}</p>
              <span className="grid size-12 place-items-center rounded-full border border-line transition-all duration-500 group-hover:bg-white group-hover:text-black">
                <ArrowRight className="size-5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        </Reveal>
      </div>
    </article>
  );
}
