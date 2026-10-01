"use client";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { ArrowRight, Check, Download, Zap } from "lucide-react";
import { profile } from "@/lib/data";
import { asset } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

function BlurWords({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <motion.span
          key={i}
          className={`inline-block ${className ?? ""}`}
          initial={{ opacity: 0, y: 28, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: delay + i * 0.08, ease }}
        >
          {w}&nbsp;
        </motion.span>
      ))}
    </>
  );
}

// ── Typing code window ───────────────────────────────────────
type Tok = [string, string]; // [text, tailwind color class]
const K = "text-[#ff7b72]", F = "text-[#d2a8ff]", S = "text-[#a5d6ff]", V = "text-[#ffa657]", P = "text-fg", C = "text-subtle";
const code: Tok[][] = [
  [["// ship it, end to end", C]],
  [["import", K], [" { ", P], ["db", V], [" } ", P], ["from", K], [' "@/lib/db"', S], [";", P]],
  [],
  [["export async function", K], [" ", P], ["GET", F], ["(req: ", P], ["Request", V], [") {", P]],
  [["  const", K], [" user = ", P], ["await", K], [" db.user.", P], ["find", F], ["(req);", P]],
  [["  const", K], [" stack = [", P], ['"next"', S], [", ", P], ['"node"', S], [", ", P], ['"pg"', S], ["];", P]],
  [["  return", K], [" Response.", P], ["json", F], ["({ user, stack, ", P], ["ok", V], [": ", P], ["true", K], [" });", P]],
  [["}", P]],
];
const totalChars = code.reduce((n, l) => n + l.reduce((m, [t]) => m + t.length, 0) + 1, 0);

function CodeWindow() {
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (reduce) { setN(totalChars); return; }
    let i = 0;
    const start = setTimeout(() => {
      const id = setInterval(() => {
        i += 1;
        setN(i);
        if (i >= totalChars) clearInterval(id);
      }, 18);
    }, 1100);
    return () => clearTimeout(start);
  }, [reduce]);

  const lineStarts: number[] = [];
  code.reduce((off, l) => { lineStarts.push(off); return off + l.reduce((m, [t]) => m + t.length, 0) + 1; }, 0);
  return (
    <div className="card-border overflow-hidden rounded-2xl bg-[#08112a]/90 shadow-[0_30px_120px_-20px_rgba(0,0,0,0.9)] backdrop-blur">
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-xs text-subtle">app/api/me/route.ts</span>
      </div>
      <pre className="min-h-[248px] overflow-hidden p-5 font-mono text-[12.5px] leading-6 sm:text-[13px]">
        {code.map((line, li) => {
          const lineLen = line.reduce((m, [t]) => m + t.length, 0);
          let budget = Math.max(0, Math.min(n - lineStarts[li], lineLen));
          const out = line.map(([t, c], ti) => {
            const slice = t.slice(0, budget);
            budget -= slice.length;
            return slice ? <span key={ti} className={c}>{slice}</span> : null;
          });
          const caret = n < totalChars && n >= lineStarts[li] && n <= lineStarts[li] + lineLen;
          return (
            <div key={li} className="flex">
              <span className="mr-5 w-4 select-none text-right text-white/15">{li + 1}</span>
              <span className="whitespace-pre">
                {out}
                {caret && <span className="ml-px inline-block h-4 w-[7px] translate-y-[3px] animate-blink bg-white/80" />}
              </span>
            </div>
          );
        })}
      </pre>
    </div>
  );
}

// ── Hero ──────────────────────────────────────────────────────
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  // 3D tilt for the code window
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 120, damping: 18 });

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-32 pb-20"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
    >
      {/* Background layers */}
      <div aria-hidden className="absolute inset-0 bg-grid" />
      <div
        aria-hidden
        className="absolute left-1/2 top-0 h-[720px] w-[900px] animate-beam"
        style={{ background: "conic-gradient(from 180deg at 50% 0%, transparent 42%, rgba(255,255,255,0.14) 50%, transparent 58%)", filter: "blur(30px)" }}
      />
      <motion.div
        aria-hidden
        className="absolute -left-40 top-40 size-[520px] rounded-full bg-[#3b82f6]/15 blur-[120px]"
        animate={{ x: [0, 80, 0], y: [0, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute -right-40 bottom-0 size-[520px] rounded-full bg-[#a855f7]/12 blur-[120px]"
        animate={{ x: [0, -60, 0], y: [0, -50, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-black" />

      <motion.div style={{ y, opacity, scale }} className="relative mx-auto grid w-full max-w-6xl items-center gap-16 px-6 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <motion.a
            href="#contact"
            initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, ease }}
            className="group inline-flex items-center gap-2.5 rounded-full border border-line bg-white/[0.03] py-1.5 pl-3 pr-4 text-sm text-muted backdrop-blur transition hover:border-line-strong hover:text-white"
          >
            <span className="relative flex size-2">
              <span className="absolute inset-0 animate-pulse-ring rounded-full bg-emerald-400" />
              <span className="relative size-2 rounded-full bg-emerald-400" />
            </span>
            {profile.available ? "Available for new projects" : "Currently booked"}
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </motion.a>

          <h1 className="mt-8 text-[clamp(2.75rem,5.6vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
            <BlurWords text="I build software" delay={0.15} className="text-metal pb-[0.08em]" />
            <br />
            <BlurWords text="from" delay={0.4} className="text-metal pb-[0.08em]" />
            <BlurWords text="pixel" delay={0.5} className="font-serif font-normal italic text-white" />
            <BlurWords text="to" delay={0.6} className="text-metal pb-[0.08em]" />
            <br className="sm:hidden" />
            <BlurWords text="production." delay={0.7} className="font-serif font-normal italic text-shine" />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.95, ease }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-muted text-pretty"
          >
            I&apos;m <span className="text-fg">{profile.name}</span>, a {profile.role.toLowerCase()} building
            polished React interfaces, solid APIs and the data pipelines behind them.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1, ease }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <a
              href="#work"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:shadow-[0_0_40px_rgba(255,255,255,0.35)]"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              View my work
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </a>
            {profile.resumeUrl && <a
              href={asset(profile.resumeUrl)}
              download={`${profile.name.replace(/\s+/g, "-")}-CV.pdf`}
              className="conic-border group inline-flex items-center gap-2 rounded-full border border-line-strong bg-black px-6 py-3 text-sm font-medium text-fg transition hover:text-white"
            >
              Download CV
              <Download className="size-4 transition-transform group-hover:translate-y-0.5" />
            </a>}
          </motion.div>
        </div>

        {/* Code window with floating chips */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.1, delay: 0.6, ease }}
          style={{ perspective: 1200 }}
          className="relative hidden sm:block"
        >
          <div aria-hidden className="absolute -inset-10 animate-spin-slow rounded-full opacity-[0.18] blur-3xl"
            style={{ background: "conic-gradient(from 0deg, #3b82f6, #a855f7, #ec4899, #10b981, #3b82f6)" }} />
          <motion.div style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }} className="relative">
            <CodeWindow />

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.2, type: "spring", stiffness: 200, damping: 16 }}
              style={{ translateZ: 60 }}
              className="absolute -left-8 -bottom-6"
            >
              <div className="flex animate-float items-center gap-2 rounded-xl border border-line bg-black/80 px-3.5 py-2.5 text-xs backdrop-blur">
                <span className="grid size-5 place-items-center rounded-full bg-emerald-500/20 text-emerald-400"><Check className="size-3" /></span>
                <span className="text-fg">Deployed to production</span>
                <span className="font-mono text-subtle">42s</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.5, type: "spring", stiffness: 200, damping: 16 }}
              style={{ translateZ: 80 }}
              className="absolute -right-6 -top-6"
            >
              <div className="flex animate-float items-center gap-2 rounded-xl border border-line bg-black/80 px-3.5 py-2.5 text-xs backdrop-blur [animation-delay:-3s]">
                <Zap className="size-3.5 text-amber-400" />
                <span className="text-fg">Lighthouse</span>
                <span className="font-mono text-emerald-400">95+</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block"
      >
        <div className="flex h-9 w-5 justify-center rounded-full border border-white/20 pt-2">
          <motion.span
            className="h-1.5 w-1 rounded-full bg-white/70"
            animate={{ y: [0, 10, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
