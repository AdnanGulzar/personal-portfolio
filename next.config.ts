import type { NextConfig } from "next";

// Base path for GitHub Pages project sites (e.g. "/personal-portfolio-").
// Set automatically by the GitHub Actions workflow; empty for local dev.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

// Fully static export (SSG): `next build` writes plain HTML/CSS/JS to /out
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
};

export default nextConfig;
