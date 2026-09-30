import Link from "next/link";

export default function NotFound() {
  return (
    <section className="relative grid min-h-[80svh] place-items-center px-6 text-center">
      <div aria-hidden className="absolute inset-0 bg-grid" />
      <div className="relative">
        <p className="text-metal font-serif text-[10rem] italic leading-none">404</p>
        <p className="mt-4 text-muted">This page wandered off. Let&apos;s get you back.</p>
        <Link href="/" className="mt-8 inline-block rounded-full bg-white px-6 py-3 text-sm font-medium text-black">Go home</Link>
      </div>
    </section>
  );
}
