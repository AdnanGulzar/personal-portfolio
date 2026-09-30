import Reveal from "./Reveal";

export default function SectionHeading({
  eyebrow,
  title,
  accent,
  description,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  description?: string;
  align?: "left" | "center";
}) {
  const center = align === "center";
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <Reveal>
        <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-subtle">
          <span className="h-px w-6 bg-white/30" />
          {eyebrow}
        </span>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="mt-5 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          <span className="text-metal">{title}</span>
          {accent && (
            <>
              {" "}
              <span className="font-serif text-[1.08em] font-normal italic text-white">{accent}</span>
            </>
          )}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.16}>
          <p className="mt-5 text-lg leading-relaxed text-muted text-pretty">{description}</p>
        </Reveal>
      )}
    </div>
  );
}
