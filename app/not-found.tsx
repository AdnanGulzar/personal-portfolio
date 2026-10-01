import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="relative grid min-h-[80svh] place-items-center px-6 text-center">
      <div aria-hidden className="absolute inset-0 bg-grid" />
      <div className="relative">
        <p aria-hidden className="text-metal font-serif text-[10rem] italic leading-none">404</p>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-white">Page not found</h1>
        <p className="mt-3 text-muted">This page wandered off. Let&apos;s get you back.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="inline-flex min-h-11 items-center rounded-full bg-white px-6 text-sm font-medium text-black">Go home</Link>
          <Link href="/#work" className="inline-flex min-h-11 items-center rounded-full border border-line px-6 text-sm text-fg transition hover:border-line-strong">See my work</Link>
          <Link href="/blog/" className="inline-flex min-h-11 items-center rounded-full border border-line px-6 text-sm text-fg transition hover:border-line-strong">Read the blog</Link>
        </div>
      </div>
    </section>
  );
}
