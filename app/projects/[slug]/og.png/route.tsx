import { projects } from "@/lib/data";
import { renderOg } from "@/lib/og";

// Social preview per project → /projects/<slug>/og.png
export const dynamic = "force-static";
export const dynamicParams = false;
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug)!;
  return renderOg({ eyebrow: p.kicker, title: p.title, subtitle: p.description, accent: p.accent });
}
