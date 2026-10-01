import { posts } from "@/lib/posts";
import { renderOg } from "@/lib/og";

// Social preview per post → /blog/<slug>/og.png
export const dynamic = "force-static";
export const dynamicParams = false;
export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = posts.find((x) => x.slug === slug)!;
  return renderOg({ eyebrow: `Blog · ${p.readingTime}`, title: p.title, accent: p.accent });
}
