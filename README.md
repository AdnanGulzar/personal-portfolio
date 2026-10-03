# Developer Portfolio — Next.js (SSG)

A dark, animation-heavy portfolio for a full stack developer. Built with **Next.js 16 (App Router)**, **Tailwind CSS v4** and **Motion**, exported as a fully static site.

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export → ./out
npm start        # preview ./out locally
```

## Make it yours

All content lives in **`lib/data.ts`** — name, bio, stats, skills, projects, experience and social links. Every section and each `/projects/[slug]` page reads from it.

- New project → add an entry to `projects`; its page is generated at build time via `generateStaticParams`.
- Colours / fonts → `app/globals.css` (`@theme` block).
- Contact form → opens the visitor's mail client (static-friendly). Swap `submit()` in `components/Contact.tsx` for Formspree, Resend or your own API if you add a backend.
- Fonts are self-hosted via Fontsource, so builds need no network access to Google Fonts.

## What's animated

Word-by-word blur-in headline · typing code window with 3D mouse tilt · floating status chips · light beam + drifting glow orbs · cursor spotlight · scroll progress bar · auto-hiding glass nav with sliding pill · dual tech marquee · scroll-scrubbed About text · count-up stats · spotlight-border project cards with tilt · animated tab indicator and skill bars · orbiting tech ring · scroll-drawn timeline · magnetic CTA. Everything respects `prefers-reduced-motion`.

## Deploy

`npm run build` outputs plain HTML/CSS/JS in `out/` — host it anywhere static: Vercel, Netlify, GitHub Pages, Cloudflare Pages or a Render static site (publish directory `out`).

## SEO, social previews & analytics

Already built in — just add your IDs:

| What | Where it lives |
|---|---|
| Titles, descriptions, canonical URLs, Open Graph + X cards | `lib/seo.ts` (`pageMeta`), used by every page |
| Social preview images (1200×630 PNG) | `lib/og.tsx`, generated per page at `…/og.png` |
| Structured data (Person, WebSite, BlogPosting, Breadcrumbs) | `lib/seo.ts` → `components/JsonLd.tsx` |
| `sitemap.xml` / `robots.txt` | `app/sitemap.ts`, `app/robots.ts` |
| Google Analytics 4 + Core Web Vitals | `components/Analytics.tsx` |
| Cloudflare Web Analytics (cookieless) | `components/Analytics.tsx` |

**Google Analytics:** create a GA4 property → Admin → Data streams → Web → copy the Measurement ID (`G-…`). Add it as a repo variable `GA_MEASUREMENT_ID` (Settings → Secrets and variables → Actions → **Variables**) and redeploy. Locally, set `NEXT_PUBLIC_GA_ID` in `.env.local`. Real-user LCP / INP / CLS / FCP / TTFB arrive as GA events of the same name.

**Cloudflare Web Analytics:** free and cookieless (no consent banner needed). In the Cloudflare dashboard → *Analytics & Logs* → *Web Analytics* → *Add a site* → enter `adnangul.com` and choose the manual JS snippet (the domain doesn't need to use Cloudflare DNS). Copy only the `token` value from the snippet, add it as repo variable `CF_BEACON_TOKEN` and redeploy. Locally, set `NEXT_PUBLIC_CF_BEACON_TOKEN` in `.env.local`.

**Google Search Console:** add a **Domain** property for `adnangul.com` (verify with the DNS TXT record in GoDaddy), or a **URL prefix** property with the *HTML tag* method → copy only the `content="…"` value → save it as repo variable `GSC_VERIFICATION` → redeploy → click *Verify*. Then **Sitemaps** → submit `sitemap.xml`.

**Check previews:** LinkedIn [Post Inspector](https://www.linkedin.com/post-inspector/) (also refreshes LinkedIn's cache) · [opengraph.xyz](https://www.opengraph.xyz) · Google [Rich Results Test](https://search.google.com/test/rich-results).

## Structure

```
app/            layout, home page, projects/[slug] (SSG), 404, icon
components/     Hero, Nav, Projects, Skills, Experience, Contact, … 
lib/data.ts     all site content
lib/utils.ts    helpers
```
