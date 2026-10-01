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

export const metadata: Metadata = {
  title: { default: `${profile.name} — ${profile.role}`, template: `%s · ${profile.name}` },
  description: profile.tagline,
  openGraph: { title: `${profile.name} — ${profile.role}`, description: profile.tagline, type: "website" },
};

export const viewport: Viewport = { themeColor: "#050b1f" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="grain font-sans">
        <Providers>
          <ScrollProgress />
          <CursorGlow />
          <Nav />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
