import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "./data";
import { SITE_URL, BASE_PATH } from "./site";

// Social preview images (Open Graph / LinkedIn / X), rendered to PNG at build time.
// Each page has an og.png route next to it (app/**/og.png/route.tsx) so the file keeps its extension on static hosts.
const ogSize = { width: 1200, height: 630 };

const fontDir = join(process.cwd(), "node_modules/@fontsource/inter/files");
const font = (weight: 400 | 600 | 700) => readFile(join(fontDir, `inter-latin-${weight}-normal.woff`));

export async function renderOg({
  eyebrow,
  title,
  subtitle,
  accent = "#3b82f6",
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  accent?: string;
}) {
  const [regular, semibold, bold] = await Promise.all([font(400), font(600), font(700)]);
  const domain = `${SITE_URL}${BASE_PATH}`.replace(/^https?:\/\//, "");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#050b1f",
          backgroundImage: `radial-gradient(circle at 85% 0%, ${accent}77 0%, transparent 50%), radial-gradient(circle at 0% 100%, #a855f733 0%, transparent 40%)`,
          color: "#ededed",
          fontFamily: "Inter",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 24, letterSpacing: 4, textTransform: "uppercase", color: "#a1a1a1" }}>
          <div style={{ width: 12, height: 12, borderRadius: 999, background: accent }} />
          {eyebrow}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ fontSize: title.length > 48 ? 60 : 72, fontWeight: 700, lineHeight: 1.08, letterSpacing: -2, color: "#ffffff" }}>{title}</div>
          {subtitle && <div style={{ fontSize: 28, lineHeight: 1.4, color: "#a1a1a1", maxWidth: 980 }}>{subtitle}</div>}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: 60, height: 60, borderRadius: 999, background: "#ffffff", color: "#050b1f", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700 }}>
              {profile.initials}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 26, fontWeight: 600, color: "#ffffff" }}>{profile.name}</div>
              <div style={{ fontSize: 20, color: "#a1a1a1" }}>{profile.role}</div>
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 20, color: "#6b6b6b" }}>{domain}</div>
        </div>

        {/* accent bar along the bottom edge */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 8, display: "flex", backgroundImage: "linear-gradient(90deg, #3b82f6, #a855f7, #ec4899)" }} />
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Inter", data: regular, weight: 400, style: "normal" },
        { name: "Inter", data: semibold, weight: 600, style: "normal" },
        { name: "Inter", data: bold, weight: 700, style: "normal" },
      ],
    }
  );
}
