import { llmsTxt } from "@/lib/llms";

// → /llms.txt (site summary for AI assistants, https://llmstxt.org)
export const dynamic = "force-static";

export function GET() {
  return new Response(llmsTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
