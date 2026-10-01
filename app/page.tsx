import Hero from "@/components/Hero";
import TechMarquee from "@/components/TechMarquee";
import Stats from "@/components/Stats";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import JsonLd from "@/components/JsonLd";
import { profilePageJsonLd } from "@/lib/seo";

export default function Home() {
  return (
    <>
      <JsonLd data={profilePageJsonLd()} />
      <Hero />
      <TechMarquee />
      <About />
      <Stats />
      <Projects />
      <Skills />
      <Experience />
      <Blog />
      <Contact />
    </>
  );
}
