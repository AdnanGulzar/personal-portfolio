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

## Structure

```
app/            layout, home page, projects/[slug] (SSG), 404, icon
components/     Hero, Nav, Projects, Skills, Experience, Contact, … 
lib/data.ts     all site content
lib/utils.ts    helpers
```
