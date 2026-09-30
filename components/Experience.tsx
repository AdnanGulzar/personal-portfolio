"use client";
import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { experience } from "@/lib/data";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

export default function Experience() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.6"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 25 });

  return (
    <section id="experience" className="relative mx-auto max-w-4xl px-6 py-28">
      <SectionHeading eyebrow="Experience" title="Where I've" accent="made an impact" align="center" />

      <ol ref={ref} className="relative mt-20 space-y-16 pl-10 sm:pl-14">
        <div aria-hidden className="absolute left-3 top-2 bottom-2 w-px bg-line sm:left-5" />
        <motion.div aria-hidden style={{ scaleY }} className="absolute left-3 top-2 bottom-2 w-px origin-top bg-gradient-to-b from-white via-white/70 to-transparent sm:left-5" />

        {experience.map((job, i) => (
          <li key={job.company + job.period} className="relative">
            <motion.span
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="absolute -left-10 top-1.5 grid size-6 place-items-center rounded-full border border-line-strong bg-black sm:-left-14 sm:ml-2"
            >
              <span className="size-2 rounded-full bg-white shadow-[0_0_14px_rgba(255,255,255,0.9)]" />
            </motion.span>
            <Reveal delay={i * 0.05}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className="text-xl font-semibold tracking-tight text-white">
                  {job.role} <span className="font-serif text-[1.1em] font-normal italic text-muted">at</span>{" "}
                  {job.url ? (
                    <a href={job.url} target="_blank" rel="noreferrer" className="underline decoration-line-strong underline-offset-4 transition hover:decoration-white">{job.company}</a>
                  ) : (
                    job.company
                  )}
                </h3>
                <span className="font-mono text-xs text-subtle">{job.period}</span>
              </div>
              <ul className="mt-4 space-y-2">
                {job.points.map((pt) => (
                  <li key={pt} className="flex gap-3 text-muted">
                    <span className="mt-2.5 h-px w-3 shrink-0 bg-white/30" />
                    {pt}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {job.stack.map((s) => (
                  <span key={s} className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-muted">{s}</span>
                ))}
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
