// ─────────────────────────────────────────────────────────────
//  All site content lives here. Every section reads from this file.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: "Adnan Gul",
  initials: "AG",
  role: "Senior Full Stack Developer",
  email: "adnan.gull548922@gmail.com",
  available: true,
  tagline:
    "I build fast, scalable web products end to end — from React UIs to APIs, databases and job queues.",
  summary:
    "Senior full stack developer with 6+ years shipping scalable web applications end to end. On the frontend I build with React.js, Next.js and TypeScript; on the backend I design APIs, database schemas and migrations, data import pipelines and Redis/BullMQ job processing. I've delivered enterprise dashboards, CRM and reporting modules and AI-powered features, and I care about secure, well-audited systems that stay fast as they grow.",
  socials: {
    github: "https://github.com/AdnanGulzar",
    linkedin: "https://www.linkedin.com/in/adnangul",
    leetcode: "", // e.g. "https://leetcode.com/u/your-username/" — empty hides it
    x: "", // leave empty to hide the icon
  },
  resumeUrl: "/cv.pdf", // file lives in /public — empty hides the button
};

export const stats: { value: number; suffix: string; label: string; decimals?: number }[] = [
  { value: 6, suffix: "+", label: "Years experience" },
  { value: 10, suffix: "+", label: "Full stack apps delivered" },
  { value: 45, suffix: "%", label: "Faster annotation tooling" },
  { value: 95, suffix: "+", label: "Lighthouse score" },
];

export const techMarquee = [
  "React.js", "Next.js", "TypeScript", "JavaScript", "Redux Toolkit", "Zustand",
  "RTK Query", "Tailwind CSS", "Material UI", "Framer Motion", "Node.js",
  "NestJS", "Express", "MongoDB", "MySQL", "Redis", "BullMQ", "Docker",
  "GitHub Actions", "AWS",
];

export type SkillGroup = {
  id: string;
  label: string;
  description: string;
  skills: { name: string; level: number }[];
  orbit: string[]; // short tech names shown on the orbit
};

export const skillGroups: SkillGroup[] = [
  {
    id: "frontend",
    label: "Frontend",
    description: "Modular, animated, performance-obsessed interfaces.",
    orbit: ["React", "Next.js", "TypeScript", "Redux", "Zustand", "MUI", "SCSS", "Framer Motion"],
    skills: [
      { name: "React.js / Next.js", level: 95 },
      { name: "TypeScript / JavaScript (ES6+)", level: 92 },
      { name: "Redux Toolkit / Zustand / RTK Query", level: 90 },
      { name: "MUI / Styled Components / SCSS", level: 88 },
      { name: "Framer Motion", level: 85 },
      { name: "Chart.js / Recharts dashboards", level: 85 },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    description: "APIs, schemas, pipelines and queues that keep products running.",
    orbit: ["Node.js", "Express", "NestJS", "WebSockets", "Redis", "BullMQ", "MongoDB", "MySQL"],
    skills: [
      { name: "Node.js / Express / NestJS", level: 88 },
      { name: "RESTful APIs / WebSockets / SSE", level: 88 },
      { name: "Schema design & migrations", level: 85 },
      { name: "Redis / BullMQ job queues", level: 82 },
      { name: "MongoDB / MySQL", level: 80 },
      { name: "Auth, security & audit logging", level: 82 },
    ],
  },
  {
    id: "devops",
    label: "DevOps",
    description: "Containerised builds, CI/CD and cloud deploys.",
    orbit: ["Git", "GitHub", "CI/CD", "Docker", "AWS EC2", "DigitalOcean", "Nginx"],
    skills: [
      { name: "Git / GitHub", level: 92 },
      { name: "GitHub Actions (CI/CD)", level: 82 },
      { name: "Docker / Docker Compose", level: 78 },
      { name: "AWS EC2 / DigitalOcean", level: 72 },
      { name: "Nginx", level: 68 },
    ],
  },
];

export type Project = {
  slug: string;
  title: string;
  kicker: string;
  description: string;
  longDescription: string[];
  highlights: string[];
  stack: string[];
  year: string;
  role: string;
  accent: string; // any CSS color, used for glows
  liveUrl?: string;
  image?: string; // screenshot in /public, e.g. "/projects/name.webp"
  repoUrl?: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "dealership-operations-portal",
    title: "Dealership Operations Portal",
    kicker: "Enterprise SaaS · Full stack",
    description:
      "A production portal car dealerships use to manage service appointments, customer communication, video check-ins, appraisals and online payments.",
    longDescription: [
      "A production web portal used by dealer groups in several countries to run service appointments, customer communication, video check-ins, triage and appraisals, and online payments. The codebase is an Nx monorepo with a React frontend and a NestJS backend.",
      "I built full-stack features across the product: React, TypeScript and PrimeReact on the frontend, and NestJS with Prisma and PostgreSQL on the backend. I designed event-driven notifications, where domain events fan out to users watching an appointment, respect each user's preferences, and fail without breaking the request. I also brought appointments from a legacy system into real-time updates, so they emit the same change events as native ones.",
      "Beyond features, I tuned API responses with interceptors that trim list payloads while keeping the fields the UI needs, maintained a CI audit gate that fixes high and critical vulnerabilities with targeted dependency pinning, and kept coverage high with hundreds of Jest and Vitest unit tests for services, repositories and event listeners. I also worked on Keycloak login and roles, multi-language support (i18next), multi-timezone handling, Formik/Yup validation and a shared component library.",
    ],
    highlights: [
      "Event-driven notifications that respect user preferences and fail safely",
      "Legacy appointments brought into the same real-time change events",
      "CI audit gate clearing high & critical vulnerabilities",
      "Hundreds of unit tests across services, repositories and listeners",
    ],
    stack: ["TypeScript", "React", "Vite", "PrimeReact", "NestJS", "Prisma", "PostgreSQL", "Nx", "Keycloak", "Jest / Vitest", "Docker", "Git"],
    year: "2025",
    role: "Senior full stack engineer",
    accent: "#06b6d4",
    image: "/projects/dealership-portal.webp",
    featured: true,
  },
  {
    slug: "ai-admin-panel",
    title: "AI-Driven Admin Panel",
    kicker: "Enterprise · Restaurant operations",
    description:
      "An AI-powered admin panel with live order management, real-time notifications and analytics for multi-restaurant businesses.",
    longDescription: [
      "A cross-platform admin panel for enterprise clients running multiple restaurants and branches, built with React.js, Next.js and TypeScript at Nizek.",
      "I integrated AI APIs and LLMs for intelligent customer support and predictive insights, and built the core modules: live template management, bulk uploads with real-time progress, a dynamic form builder, WebSocket and SSE notifications, and live analytics dashboards.",
    ],
    highlights: [
      "Load times improved by 35% with code-splitting, lazy loading and Suspense",
      "Bundle size cut by 25% with a Lighthouse score of 95+",
      "Team velocity up 40% through reusable component patterns",
    ],
    stack: ["Next.js", "React", "TypeScript", "WebSockets", "Recharts", "React Hook Form"],
    year: "2024",
    role: "Senior frontend developer",
    accent: "#3b82f6",
    featured: true,
  },
  {
    slug: "algorithm-simulator",
    title: "Algorithm Simulator",
    kicker: "Education · Interactive visualiser",
    description:
      "Watch algorithms run step by step — every read, write, swap, insert and traversal traced and animated as it happens.",
    longDescription: [
      "Algorithm Simulator is an interactive tool for learning how algorithms and data structures work. Pick a method, give it input data and step through its execution while the data, variables, pseudocode and a numbered trace of every operation update together.",
      "It ships with 30 built-in methods across arrays, searching, sorting (bubble, insertion, selection, merge, quick and heap sort), recursion, strings, stacks, queues, linked lists, graphs (BFS and DFS) and trees. In Custom code mode you can edit the source and run your own version — reads, writes, push, pop, splice and slice are tracked automatically.",
    ],
    highlights: [
      "30 built-in algorithms and data-structure operations",
      "Custom code mode with automatic operation tracking",
      "Play, pause, step back/forward, speed and step-size controls",
      "Shareable URLs per method, plus Midnight, Light and Dracula themes",
    ],
    stack: ["JavaScript", "React", "Code instrumentation", "Vercel"],
    year: "2026",
    role: "Solo project",
    accent: "#22d3ee",
    liveUrl: "https://algo-simulator-murex.vercel.app/?mode=builtin&algo=push",
    image: "/projects/algo-simulator.webp",
  },
  {
    slug: "food-delivery-storefront",
    title: "Food Delivery Storefront",
    kicker: "Food delivery · Customer ordering app",
    description:
      "A multi-language food delivery storefront where customers browse restaurant menus, pick a delivery area and time, and order online.",
    longDescription: [
      "A customer-facing food delivery web app built at Nizek for restaurants in Kuwait. Customers choose their delivery location and time, browse a restaurant's menu by category, and add dishes to their cart.",
      "I built the storefront with React.js, Next.js and TypeScript, including the category-based menu, product cards with images, descriptions and discounted prices, the cart, language switching and account menus.",
    ],
    highlights: [
      "Delivery location and time selection before ordering",
      "Category menus with discounted pricing and item badges",
      "Multi-language UI with cart and account flows",
    ],
    stack: ["Next.js", "React", "TypeScript", "Responsive design"],
    year: "2024",
    role: "Senior frontend developer",
    accent: "#f97316",
    image: "/projects/food-delivery.webp",
  },
  {
    slug: "ai-annotation-platform",
    title: "AI Annotation Platform",
    kicker: "AI tooling · Data labeling",
    description:
      "Labeling and annotation tools for image, video and vector data that feed AI training pipelines.",
    longDescription: [
      "At Turing I engineered AI-powered labeling and annotation platforms using React, SVG and Canvas APIs, so internal teams and external users could create, edit and manage annotations on large datasets.",
      "I built reusable toolkits for bounding boxes, shapes and masks, optimised rendering for large canvases, and worked with data scientists to plug the tools into AI training pipelines.",
    ],
    highlights: [
      "Annotation tool performance improved by 45%",
      "Internal toolkit cut labeling setup time by 30%",
      "Stable workflows across image, video and vector data",
    ],
    stack: ["React", "TypeScript", "Canvas API", "SVG"],
    year: "2025",
    role: "Senior frontend engineer",
    accent: "#a855f7",
    featured: true,
  },
  {
    slug: "ecommerce-design-system",
    title: "E-commerce & Design System",
    kicker: "E-commerce · SEO & design systems",
    description:
      "SEO-optimised e-commerce platforms and admin dashboards on a shared, accessible design system.",
    longDescription: [
      "At AlSalaam Tech House I led end-to-end development of SEO-optimised web apps with React.js, Next.js, TypeScript and Redux Toolkit.",
      "I built modular component libraries and a unified design system, managed async data flows with RTK Query, and set up GitHub Actions pipelines for multi-environment deploys.",
    ],
    highlights: [
      "Load speed improved by 40% through bundle optimisation",
      "Design system reduced UI development time by 30%",
      "WCAG-compliant, responsive interfaces",
    ],
    stack: ["Next.js", "Redux Toolkit", "RTK Query", "MUI", "Framer Motion", "GitHub Actions"],
    year: "2023",
    role: "Full stack developer",
    accent: "#10b981",
  },
  {
    slug: "my-freedom",
    title: "My Freedom",
    kicker: "FinTech · AI-powered trading platform",
    description:
      "A UAE-based AI-powered trading and investment platform covering forex, crypto, indices, stocks and commodities.",
    longDescription: [
      "My Freedom is an AI-powered trading and investment platform from the UAE that aims to make investing accessible to everyone. Users track their investments through dashboards across forex, cryptocurrency, indices, stocks and commodities.",
      "At Freedom Technologies I worked on the platform's MERN stack applications: responsive interfaces with Material UI, Framer Motion and Styled Components, secure authentication with JWT, Passport.js and Helmet, and RESTful APIs between the frontend and backend services. I containerised the apps with Docker and set up GitHub Actions for automated CI/CD.",
    ],
    highlights: [
      "Three production-ready applications delivered ahead of schedule",
      "Frontend performance metrics up 20% with lazy loading",
      "Hardened authentication and validation across the platform",
    ],
    stack: ["React", "Node.js", "Express", "MongoDB", "Material UI", "Framer Motion", "JWT", "Docker"],
    year: "2023",
    role: "Frontend developer",
    accent: "#f59e0b",
    liveUrl: "https://myfreedom.ae/freedom/",
    image: "/projects/my-freedom.webp",
  },
  {
    slug: "client-web-apps",
    title: "Client Web Applications",
    kicker: "Agency · E-commerce, education, automation",
    description:
      "10+ custom full stack apps for clients across e-commerce, education and business automation.",
    longDescription: [
      "At Nenu Tech I delivered custom MERN applications for a range of clients, from storefronts to learning platforms and internal tools.",
      "Work included role-based access control, Stripe, PayPal and Google Maps integrations, and deployments on AWS and DigitalOcean behind Nginx and Docker.",
    ],
    highlights: [
      "10+ full stack applications delivered",
      "Backend response times cut by 30% with caching",
      "Lighthouse performance scores raised to 90+",
    ],
    stack: ["React", "Redux", "Node.js", "MongoDB", "Stripe", "Nginx"],
    year: "2021",
    role: "Full stack engineer",
    accent: "#ec4899",
  },
];

export const experience = [
  {
    company: "NexaQuanta",
    url: "https://nexaquanta.ai/",
    role: "Senior Full Stack Engineer",
    period: "Oct 2025 — Present · Remote (London, UK)",
    points: [
      "Built a CRM & product reporting module with email-based delivery for business intelligence.",
      "Designed & executed an enterprise database schema migration achieving 100% parity.",
      "Built the complete aftersales appointment lifecycle module — 60+ merged MRs.",
      "Integrated the CitNOW video library, eliminating cross-system context-switching.",
      "Architected a CSV data import pipeline with batch optimisation & duplicate detection.",
      "Implemented multi-dealer org scoping with a dual-database architecture.",
      "Patched a critical injection vulnerability and built a generic audit module.",
      "Fixed Redis Cluster CROSSSLOT errors for stable BullMQ job processing.",
    ],
    stack: ["Node.js", "Redis", "BullMQ", "CSV pipelines"],
  },
  {
    company: "Nizek",
    role: "Senior Full Stack Developer",
    period: "Dec 2023 — Present · Remote",
    points: [
      "Lead development of high-performance web apps with React.js, Next.js and TypeScript for enterprise clients.",
      "Delivered an AI-driven admin panel with LLM-powered support and predictive insights.",
      "Improved load times by 35% and cut bundle size by 25% (Lighthouse 95+).",
    ],
    stack: ["Next.js", "TypeScript", "WebSockets", "NestJS"],
  },
  {
    company: "Turing",
    role: "Senior Frontend Engineer",
    period: "Nov 2024 — Mar 2025 · Remote",
    points: [
      "Engineered AI labeling and annotation platforms with React, SVG and Canvas APIs.",
      "Improved annotation tool performance by 45% through rendering and state optimisation.",
      "Built an internal toolkit that cut labeling setup time by 30%.",
    ],
    stack: ["React", "Canvas", "SVG", "TypeScript"],
  },
  {
    company: "AlSalaam Tech House",
    role: "Full Stack Developer",
    period: "Apr 2023 — Dec 2023 · Remote",
    points: [
      "Built SEO-optimised apps with Next.js, TypeScript and Redux Toolkit.",
      "Delivered a unified design system that reduced UI development time by 30%.",
      "Improved load speed by 40% and set up GitHub Actions CI/CD.",
    ],
    stack: ["Next.js", "RTK Query", "MUI", "GitHub Actions"],
  },
  {
    company: "Freedom Technologies",
    role: "Frontend Developer",
    period: "Jan 2023 — Apr 2023 · Remote",
    points: [
      "Developed MERN stack apps with secure JWT / Passport.js authentication.",
      "Delivered three production-ready apps ahead of schedule.",
    ],
    stack: ["React", "Node.js", "MongoDB", "Docker"],
  },
  {
    company: "Nenu Tech",
    role: "Full Stack Engineer",
    period: "Oct 2021 — Mar 2022 · Islamabad",
    points: [
      "Built responsive interfaces with React.js, Redux and Material UI.",
      "Cut load times by up to 25% with AMP, lazy loading and caching.",
    ],
    stack: ["React", "Redux", "MUI", "Nginx"],
  },
  {
    company: "Nenu Tech",
    role: "Full Stack Engineer",
    period: "Jan 2019 — Aug 2021 · Sargodha",
    points: [
      "Delivered 10+ custom MERN applications with 100% client satisfaction.",
      "Integrated Stripe, PayPal and Google Maps; deployed on AWS and DigitalOcean.",
    ],
    stack: ["MongoDB", "Express", "React", "Node.js"],
  },
];

export const navLinks = [
  { href: "#work", label: "Work" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];
