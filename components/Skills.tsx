"use client";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useTime, useTransform, type MotionValue } from "motion/react";
import { Layers, Server, Cloud } from "lucide-react";
import { skillGroups, type SkillGroup } from "@/lib/data";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import TiltCard from "./TiltCard";

const icons = { frontend: Layers, backend: Server, devops: Cloud } as const;

const ORBIT_PERIOD = 30_000; // ms per revolution

// Chips travel around the circle by position only (no rotation), so text always stays level.
function OrbitChip({ label, offset, angle, index }: { label: string; offset: number; angle: MotionValue<number>; index: number }) {
  const left = useTransform(angle, (r) => `${50 + Math.cos(r + offset) * 50}%`);
  const top = useTransform(angle, (r) => `${50 + Math.sin(r + offset) * 50}%`);
  return (
    <motion.span
      className="absolute whitespace-nowrap rounded-full border border-line bg-black px-2.5 py-1 font-mono text-[10px] text-muted"
      style={{ left, top, x: "-50%", y: "-50%" }}
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.4 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
    >
      {label}
    </motion.span>
  );
}

function Orbit({ group }: { group: SkillGroup }) {
  const Icon = icons[group.id as keyof typeof icons];
  const reduce = useReducedMotion();
  const time = useTime();
  const angle = useTransform(time, (t) => (reduce ? 0 : (t / ORBIT_PERIOD) * Math.PI * 2));
  return (
    <div aria-hidden className="relative mx-auto mt-10 hidden aspect-square w-full max-w-[300px] lg:block">
      {[1, 0.68, 0.36].map((s, i) => (
        <div key={i} className="absolute inset-0 m-auto rounded-full border border-line" style={{ width: `${s * 100}%`, height: `${s * 100}%` }} />
      ))}
      <AnimatePresence>
        {group.orbit.map((t, i) => (
          <OrbitChip key={`${group.id}-${t}`} label={t} index={i} angle={angle} offset={(i / group.orbit.length) * Math.PI * 2} />
        ))}
      </AnimatePresence>
      <div className="absolute inset-0 m-auto grid size-16 place-items-center rounded-2xl border border-line-strong bg-white/[0.04] shadow-[0_0_60px_rgba(255,255,255,0.12)]">
        <AnimatePresence mode="wait">
          <motion.span key={group.id} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} transition={{ duration: 0.25 }}>
            <Icon className="size-5 text-white" />
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function Skills() {
  const [active, setActive] = useState(skillGroups[0].id);
  const group = skillGroups.find((g) => g.id === active)!;

  return (
    <section id="skills" className="relative overflow-x-clip border-y border-line bg-surface/50">
      <div aria-hidden className="absolute inset-0 bg-grid opacity-70" />
      <div className="relative mx-auto grid max-w-6xl gap-14 px-6 py-28 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <SectionHeading eyebrow="Skills" title="A full stack," accent="end to end" description="Comfortable across the whole request lifecycle — from the button a user taps to the query it runs." />
          <Reveal delay={0.2}>
            <div role="tablist" aria-label="Skill areas" className="mt-10 inline-flex rounded-full border border-line bg-black p-1">
              {skillGroups.map((g, gi) => {
                const Icon = icons[g.id as keyof typeof icons];
                const on = g.id === active;
                return (
                  <button
                    key={g.id}
                    id={`skill-tab-${g.id}`}
                    role="tab"
                    aria-selected={on}
                    aria-controls="skill-panel"
                    tabIndex={on ? 0 : -1}
                    onClick={() => setActive(g.id)}
                    onKeyDown={(e) => {
                      // arrow keys move between tabs (WAI-ARIA tabs pattern)
                      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
                      const next = skillGroups[(gi + (e.key === "ArrowRight" ? 1 : -1) + skillGroups.length) % skillGroups.length];
                      setActive(next.id);
                      document.getElementById(`skill-tab-${next.id}`)?.focus();
                    }}
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
          <Orbit group={group} />
        </div>

        <TiltCard wrapperClassName="self-center" className="p-8 sm:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={group.id}
              id="skill-panel"
              role="tabpanel"
              aria-labelledby={`skill-tab-${group.id}`}
              tabIndex={0}
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
        </TiltCard>
      </div>
    </section>
  );
}
