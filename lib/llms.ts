import fs from "node:fs";
import path from "node:path";
import { experience, profile, projects, skillGroups } from "./data";
import { posts } from "./posts";
import { absoluteUrl } from "./site";

// ─────────────────────────────────────────────────────────────
//  Plain-text site summaries for AI assistants and answer engines
//  (ChatGPT, Claude, Perplexity, Gemini…), following https://llmstxt.org
// ─────────────────────────────────────────────────────────────

const SOCIAL_LABELS: Record<string, string> = { github: "GitHub", linkedin: "LinkedIn", leetcode: "LeetCode", x: "X" };

const about = () => [
  `# ${profile.name}`,
  "",
  `> ${profile.role}. ${profile.tagline}`,
  "",
  profile.summary,
  "",
  `- Website: ${absoluteUrl("/")}`,
  `- Email: ${profile.email}`,
  ...Object.entries(profile.socials).filter(([, v]) => v).map(([k, v]) => `- ${SOCIAL_LABELS[k] ?? k}: ${v}`),
  ...(profile.resumeUrl ? [`- CV (PDF): ${absoluteUrl(profile.resumeUrl)}`] : []),
  `- Available for work: ${profile.available ? "yes" : "no"}`,
];

/** /llms.txt — a short index of the site. */
export function llmsTxt() {
  return [
    ...about(),
    "",
    "## Projects",
    ...projects.map((p) => `- [${p.title}](${absoluteUrl(`/projects/${p.slug}/`)}): ${p.description}`),
    "",
    "## Blog",
    ...posts.map((p) => `- [${p.title}](${absoluteUrl(`/blog/${p.slug}/`)}): ${p.description}`),
    "",
    "## Optional",
    `- [Full profile, experience, projects and articles in one file](${absoluteUrl("/llms-full.txt")})`,
    "",
  ].join("\n");
}

/** MDX → readable Markdown: drops interactive demo components, keeps callout text. */
const mdxToText = (src: string) =>
  src
    .replace(/^(import|export) .*$/gm, "")
    .replace(/^<CodePlayground[\s\S]*?^\/>$/gm, "")
    .replace(/<Callout[^>]*title="([^"]*)"[^>]*>/g, "**$1:**")
    .replace(/<\/?[A-Z][^>]*>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

/** /llms-full.txt — everything on the site as one Markdown document. */
export function llmsFullTxt() {
  const blog = posts.map((p) => {
    const body = fs.readFileSync(path.join(process.cwd(), "content/blog", `${p.slug}.mdx`), "utf8");
    return [`### ${p.title}`, "", `URL: ${absoluteUrl(`/blog/${p.slug}/`)} · Published ${p.date} · Tags: ${p.tags.join(", ")}`, "", mdxToText(body)].join("\n");
  });

  return [
    ...about(),
    "",
    "## Skills",
    ...skillGroups.map((g) => `- ${g.label}: ${g.skills.map((s) => s.name).join("; ")}`),
    "",
    "## Experience",
    ...experience.flatMap((e) => [
      "",
      `### ${e.role}, ${e.company} (${e.period})`,
      ...e.points.map((pt) => `- ${pt}`),
      `- Stack: ${e.stack.join(", ")}`,
    ]),
    "",
    "## Projects",
    ...projects.flatMap((p) => [
      "",
      `### ${p.title} (${p.year})`,
      `URL: ${absoluteUrl(`/projects/${p.slug}/`)}${p.liveUrl ? ` · Live: ${p.liveUrl}` : ""}`,
      `Role: ${p.role} · Stack: ${p.stack.join(", ")}`,
      "",
      ...p.longDescription.flatMap((d) => [d, ""]),
      ...p.highlights.map((h) => `- ${h}`),
    ]),
    "",
    "## Blog",
    "",
    blog.join("\n\n"),
    "",
  ].join("\n");
}
