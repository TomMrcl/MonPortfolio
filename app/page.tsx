import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { Projects } from "../components/Projects";
import { Testimonials } from "../components/Testimonials";
import { Services } from "../components/Services";
import { Process } from "../components/Process";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

export default function Home() {
  return (
    <main>
      <Header />
      <div className="relative overflow-hidden bg-white dark:bg-zinc-950 transition-colors">
        {/* Halos violets décoratifs — répartis sur toute la hauteur */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-[-8%] left-[-12%] w-[550px] h-[550px] rounded-full bg-purple-300/40 dark:bg-purple-700/25 blur-[120px]" />
          <div className="absolute top-[14%] right-[-14%] w-[480px] h-[480px] rounded-full bg-purple-200/45 dark:bg-purple-800/20 blur-[120px]" />
          <div className="absolute top-[38%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-300/35 dark:bg-purple-900/25 blur-[130px]" />
          <div className="absolute top-[62%] right-[-12%] w-[550px] h-[550px] rounded-full bg-purple-200/40 dark:bg-purple-700/20 blur-[120px]" />
          <div className="absolute top-[86%] left-[-8%] w-[500px] h-[500px] rounded-full bg-purple-300/35 dark:bg-purple-800/20 blur-[120px]" />
        </div>

        <Hero />
        <About />
        <Projects />
        <Testimonials />
        <Services />
        <Process />
        <Contact />
      </div>
      <Footer />
    </main>
  );
}
