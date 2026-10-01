"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ArrowUpRight, Check, Code, Copy, LoaderCircle, Mail, Send } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "./Icons";
import { profile } from "@/lib/data";
import Reveal from "./Reveal";
import Magnetic from "./Magnetic";
import TiltCard from "./TiltCard";
import Eyebrow from "./Eyebrow";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard unavailable */ }
  };

  // Messages are delivered to your inbox by Web3Forms (works on a static site).
  // Set NEXT_PUBLIC_WEB3FORMS_KEY in .env.local — see .env.local.example.
  // Without a key, the form falls back to opening the visitor's email app.
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const honeypot = (e.currentTarget.elements.namedItem("botcheck") as HTMLInputElement | null)?.checked;
    if (honeypot) return;

    if (!accessKey) {
      const subject = encodeURIComponent(`Project enquiry from ${form.name}`);
      const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `Portfolio enquiry from ${form.name}`,
          from_name: "Portfolio contact form",
          name: form.name,
          email: form.email,
          replyto: form.email,
          message: form.message,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.message || "Failed");
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
    }
  };

  const input =
    "w-full rounded-xl border border-line bg-black/60 px-4 py-3 text-sm text-fg placeholder:text-subtle outline-none transition focus:border-white/40 focus:ring-4 focus:ring-white/5";

  return (
    <section id="contact" className="relative overflow-hidden px-6 py-28">
      <div aria-hidden className="absolute left-1/2 top-0 h-[600px] w-[800px] animate-beam"
        style={{ background: "conic-gradient(from 180deg at 50% 0%, transparent 44%, rgba(255,255,255,0.1) 50%, transparent 56%)", filter: "blur(30px)" }} />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <Eyebrow>Contact</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-5 text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
                <span className="text-metal">Have an idea?</span>
                <br />
                <span className="font-serif font-normal italic text-white">Let&apos;s build it.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-md text-lg text-muted">
                I&apos;m open to freelance projects, full-time roles and interesting collaborations. I usually reply within a day.
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-10 space-y-3">
                <button
                  onClick={copy}
                  className="group flex w-full max-w-md items-center gap-4 rounded-2xl border border-line bg-white/[0.02] p-4 text-left transition hover:border-line-strong hover:bg-white/[0.04]"
                >
                  <span className="grid size-10 place-items-center rounded-xl border border-line"><Mail className="size-4 text-fg" /></span>
                  <span className="flex-1">
                    <span className="block text-xs text-subtle">Email</span>
                    <span className="block text-sm text-fg">{profile.email}</span>
                  </span>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={copied ? "y" : "n"}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className={copied ? "text-emerald-400" : "text-subtle group-hover:text-white"}
                    >
                      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                    </motion.span>
                  </AnimatePresence>
                </button>
                <div className="flex max-w-md flex-wrap gap-2 pt-1">
                  {[
                    { href: profile.socials.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
                    { href: profile.socials.github, label: "GitHub", Icon: GitHubIcon },
                    { href: profile.socials.leetcode, label: "LeetCode", Icon: Code },
                  ]
                    .filter((l) => l.href)
                    .map(({ href, label, Icon }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.02] px-4 py-2 text-sm text-muted transition hover:border-line-strong hover:text-white"
                      >
                        <Icon className="size-4" />
                        {label}
                        <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </a>
                    ))}
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <TiltCard className="p-6 sm:p-8">
            <form onSubmit={submit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs text-muted">Name</span>
                  <input required className={input} placeholder="Jane Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs text-muted">Email</span>
                  <input required type="email" className={input} placeholder="jane@company.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </label>
              </div>
              <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />
              <label className="block">
                <span className="mb-2 block text-xs text-muted">Message</span>
                <textarea required rows={5} className={`${input} resize-none`} placeholder="Tell me about your project, timeline and budget…" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </label>
              <div className="flex items-center justify-between gap-4 pt-2">
                <p className="text-xs text-subtle" aria-live="polite">
                  {status === "sent" ? (
                    <span className="text-emerald-400">Thanks! Your message has been sent.</span>
                  ) : status === "error" ? (
                    <span className="text-red-400">Couldn&apos;t send — please email me directly.</span>
                  ) : accessKey ? (
                    "I'll reply to the email you provide."
                  ) : (
                    "Opens in your email app."
                  )}
                </p>
                <Magnetic>
                  <button type="submit" disabled={status === "sending"} className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:shadow-[0_0_40px_rgba(255,255,255,0.35)] disabled:cursor-wait disabled:opacity-70">
                    {status === "sending" ? (
                      <LoaderCircle className="size-4 animate-spin" />
                    ) : (
                      <Send className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    )}
                    {status === "sending" ? "Sending…" : "Send message"}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </Magnetic>
              </div>
            </form>
            </TiltCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
