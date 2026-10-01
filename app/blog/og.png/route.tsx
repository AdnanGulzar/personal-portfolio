import { renderOg } from "@/lib/og";

// Social preview for the blog index → /blog/og.png
export const dynamic = "force-static";

export function GET() {
  return renderOg({
    eyebrow: "Blog",
    title: "Notes from the build",
    subtitle: "Interactive write-ups on system design, frontend performance and building for the web.",
    accent: "#a855f7",
  });
}
