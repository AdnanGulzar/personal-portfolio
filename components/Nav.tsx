"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, X } from "lucide-react";
import { navLinks, profile } from "@/lib/data";

export default function Nav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const [hovered, setHovered] = useState<string | null>(null);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > prev && y > 400 && !open);
  });

  // Highlight the section currently in view
  useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1));
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: hidden ? -100 : 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-4 z-50 px-4"
    >
      <nav
        className={`mx-auto flex max-w-5xl items-center justify-between rounded-full border px-3 py-2 transition-all duration-500 ${
          scrolled ? "border-line bg-black/30 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl" : "border-transparent bg-transparent"
        }`}
      >
        <Link href="/" className="group flex items-center gap-2.5 pl-2" aria-label="Home">
          <span className="grid size-8 place-items-center rounded-full bg-white font-mono text-xs font-bold text-black transition-transform duration-500 group-hover:rotate-[360deg]">
            {profile.initials}
          </span>
          <span className="hidden text-sm font-medium text-fg sm:block">{profile.name}</span>
        </Link>

        <ul className="hidden items-center md:flex" onMouseLeave={() => setHovered(null)}>
          {navLinks.map((l) => (
            <li key={l.href} className="relative">
              <a
                href={`/${l.href}`}
                onMouseEnter={() => setHovered(l.href)}
                className={`relative z-10 block px-4 py-2 text-sm transition-colors ${active === l.href ? "text-white" : "text-muted hover:text-white"}`}
              >
                {l.label}
              </a>
              {(hovered ?? active) === l.href && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-white/[0.07]"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="/#contact"
            className="hidden rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-white/85 sm:block"
          >
            Let&apos;s talk
          </a>
          <button
            onClick={() => setOpen((o) => !o)}
            className="grid size-9 place-items-center rounded-full border border-line text-fg md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="mx-auto mt-2 max-w-5xl rounded-3xl border border-line bg-black/60 p-2 backdrop-blur-xl md:hidden"
          >
            {navLinks.map((l, i) => (
              <motion.a
                key={l.href}
                href={`/${l.href}`}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * i }}
                className="block rounded-2xl px-4 py-3 text-fg hover:bg-white/5"
              >
                {l.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
