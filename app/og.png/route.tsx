import { profile } from "@/lib/data";
import { renderOg } from "@/lib/og";

// Social preview for the home page → /og.png
export const dynamic = "force-static";

export function GET() {
  return renderOg({ eyebrow: "Portfolio", title: `${profile.name}, ${profile.role}`, subtitle: profile.tagline });
}
