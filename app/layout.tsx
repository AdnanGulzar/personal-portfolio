import type { Metadata, Viewport } from "next";
// Self-hosted fonts (bundled at build time — no network needed)
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./globals.css";
import { profile } from "@/lib/data";
import Providers from "@/components/Providers";
import Nav from "@/components/Nav";
import ScrollProgress from "@/components/ScrollProgress";
import CursorGlow from "@/components/CursorGlow";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, GSC_VERIFICATION } from "@/lib/site";
import { pageMeta, personJsonLd, websiteJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...pageMeta({ description: profile.tagline, path: "/", imageAlt: `${profile.name}, ${profile.role}` }),
  title: { default: `${profile.name}, ${profile.role}`, template: `%s · ${profile.name}` },
  applicationName: profile.name,
  authors: [{ name: profile.name, url: profile.socials.linkedin }],
  creator: profile.name,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  ...(GSC_VERIFICATION ? { verification: { google: GSC_VERIFICATION } } : {}),
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = { themeColor: "#050b1f" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="grain font-sans">
        <JsonLd data={[personJsonLd(), websiteJsonLd()]} />
        <Providers>
          <ScrollProgress />
          <CursorGlow />
          <Nav />
          <main>{children}</main>
          <Footer />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
