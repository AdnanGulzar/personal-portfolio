import { techMarquee } from "@/lib/data";

function Row({ reverse = false }: { reverse?: boolean }) {
  const items = [...techMarquee, ...techMarquee];
  return (
    <div className="mask-fade-x flex overflow-hidden">
      <div
        className="flex shrink-0 animate-marquee items-center gap-3 pr-3 hover:[animation-play-state:paused]"
        style={reverse ? { animationDirection: "reverse" } : undefined}
      >
        {items.map((t, i) => (
          <span
            key={i}
            className="whitespace-nowrap rounded-full border border-line bg-white/[0.02] px-4 py-2 font-mono text-sm text-muted transition hover:border-line-strong hover:text-white"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function TechMarquee() {
  return (
    <section aria-label="Technologies" className="relative space-y-3 border-y border-line py-10">
      <p className="mb-6 text-center font-mono text-xs uppercase tracking-[0.2em] text-subtle">Tools I ship with daily</p>
      <Row />
      <Row reverse />
    </section>
  );
}
