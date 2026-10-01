import type { NextConfig } from "next";
import createMDX from "@next/mdx";

// Base path for GitHub Pages project sites (e.g. "/personal-portfolio-").
// Set automatically by the GitHub Actions workflow; empty for local dev.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

// Fully static export (SSG): `next build` writes plain HTML/CSS/JS to /out
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  pageExtensions: ["ts", "tsx", "md", "mdx"],
};

// Blog posts are MDX (content/blog). Plugins are given by name so they work with Turbopack.
const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: [["rehype-pretty-code", { theme: "github-dark", keepBackground: true }]],
  },
});

export default withMDX(nextConfig);
