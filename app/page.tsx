import Hero from "@/components/Hero";
import TechMarquee from "@/components/TechMarquee";
import Stats from "@/components/Stats";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <TechMarquee />
      <About />
      <Stats />
      <Projects />
      <Skills />
      <Experience />
      <Contact />
    </>
  );
}
