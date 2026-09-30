"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Layers, Server, Cloud } from "lucide-react";
import { skillGroups } from "@/lib/data";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const icons = { frontend: Layers, backend: Server, devops: Cloud } as const;

function Orbit({ items }: { items: string[] }) {
  return (
    <div aria-hidden className="relative mx-auto mt-10 hidden aspect-square w-full max-w-[300px] lg:block">
      {[1, 0.68, 0.36].map((s, i) => (
        <div key={i} className="absolute inset-0 m-auto rounded-full border border-line" style={{ width: `${s * 100}%`, height: `${s * 100}%` }} />
      ))}
      <motion.div className="absolute inset-0" animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}>
        {items.map((t, i) => {
          const a = (i / items.length) * Math.PI * 2;
          return (
            <motion.span
              key={t}
              className="absolute whitespace-nowrap rounded-full border border-line bg-black px-2.5 py-1 font-mono text-[10px] text-muted"
              style={{ left: `${50 + Math.cos(a) * 50}%`, top: `${50 + Math.sin(a) * 50}%`, x: "-50%", y: "-50%" }}
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
              {t}
            </motion.span>
          );
        })}
      </motion.div>
      <div className="absolute inset-0 m-auto grid size-16 place-items-center rounded-2xl border border-line-strong bg-white/[0.04] shadow-[0_0_60px_rgba(255,255,255,0.12)]">
        <span className="font-mono text-xs text-white">&lt;/&gt;</span>
      </div>
    </div>
  );
}

export default function Skills() {
  const [active, setActive] = useState(skillGroups[0].id);
  const group = skillGroups.find((g) => g.id === active)!;

  return (
    <section id="skills" className="relative border-y border-line bg-surface/50">
      <div aria-hidden className="absolute inset-0 bg-grid opacity-70" />
      <div className="relative mx-auto grid max-w-6xl gap-14 px-6 py-28 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <SectionHeading eyebrow="Skills" title="A full stack," accent="end to end" description="Comfortable across the whole request lifecycle — from the button a user taps to the query it runs." />
          <Reveal delay={0.2}>
            <div role="tablist" className="mt-10 inline-flex rounded-full border border-line bg-black p-1">
              {skillGroups.map((g) => {
                const Icon = icons[g.id as keyof typeof icons];
                const on = g.id === active;
                return (
                  <button
                    key={g.id}
                    role="tab"
                    aria-selected={on}
                    onClick={() => setActive(g.id)}
                    className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors ${on ? "text-black" : "text-muted hover:text-white"}`}
                  >
                    {on && <motion.span layoutId="skill-tab" className="absolute inset-0 rounded-full bg-white" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
                    <Icon className="relative size-4" />
                    <span className="relative">{g.label}</span>
                  </button>
                );
              })}
            </div>
          </Reveal>
          <Orbit items={skillGroups.flatMap((g) => g.skills.slice(0, 2).map((s) => s.name.split(" ")[0]))} />
        </div>

        <div className="card-border self-center rounded-3xl p-8 sm:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-lg text-fg">{group.description}</p>
              <ul className="mt-8 space-y-6">
                {group.skills.map((s, i) => (
                  <li key={s.name}>
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="text-fg">{s.name}</span>
                      <motion.span className="font-mono text-xs text-subtle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.08 }}>
                        {s.level}%
                      </motion.span>
                    </div>
                    <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                      <motion.div
                        className="relative h-full rounded-full bg-gradient-to-r from-white/40 to-white"
                        initial={{ width: 0 }}
                        animate={{ width: `${s.level}%` }}
                        transition={{ delay: 0.1 + i * 0.08, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <span className="absolute right-0 top-1/2 size-2.5 -translate-y-1/2 translate-x-1/2 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)]" />
                      </motion.div>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
