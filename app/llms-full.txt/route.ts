import { llmsFullTxt } from "@/lib/llms";

// → /llms-full.txt (the whole site as one Markdown file for AI assistants)
export const dynamic = "force-static";

export function GET() {
  return new Response(llmsFullTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
