import Image from "next/image";
import { ExternalLink, ArrowRight } from "lucide-react";

export function Projects() {
  const projects = [
    {
      title: "BordDeRive",
      domain: "bordderive.fr",
      description:
        "Plateforme freemium pour pêcheurs : spots, carnet de pêche, rapports IA hebdo.",
      image: "/BordDeRive1.PNG",
      tags: ["react", "supabase", "stripe"],
      link: "https://bordderive.fr",
    },
    {
      title: "Coach Pierre",
      domain: "pierremoureau.fr",
      description:
        "Site vitrine pour un coach sportif personnel : présentation, programmes et prise de contact.",
      image: "/PierreM1.PNG",
      tags: ["next.js", "tailwind", "resend"],
      link: "https://pierremoureau.fr",
    },
    {
      title: "Atelier Altaïr",
      domain: "atelieraltair.com",
      description:
        "Vitrine en ligne pour un atelier créatif : présentation des créations et prise de contact.",
      image: "/AtelierAltair1.PNG",
      tags: ["next.js", "tailwind", "framer motion"],
      link: "https://atelieraltair.com",
    },
    {
      title: "Qwenta",
      domain: "github.com/TomMrcl/Qwenta",
      description:
        "Planification d'un site web complet avec spécifications techniques et gestion de projet.",
      image: "/qwentaimg.webp",
      tags: ["gestion de projet", "spécifications", "ux/ui"],
      link: "https://github.com/TomMrcl/Qwenta",
    },
  ];

  return (
    <section id="projects" className="py-20 scroll-mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 max-w-3xl">
          <p className="font-mono text-sm tracking-widest text-purple-600 dark:text-purple-400 mb-3">
            // MES PROJETS
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
            Une vitrine, pas un empilement de captures
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Chaque projet dans une fenêtre de navigateur miniature — même
            traitement, quel que soit le format original de la capture
            d&apos;écran.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group rounded-xl overflow-hidden border border-zinc-200 dark:border-white/10 shadow-sm hover:shadow-xl dark:hover:shadow-purple-900/20 transition-all duration-300 hover:-translate-y-2"
            >
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-white/5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-2 font-mono text-xs text-zinc-500 truncate">
                  {project.domain}
                </span>
              </div>

              {/* Screenshot */}
              <div className="relative h-56 sm:h-64 overflow-hidden bg-zinc-100 dark:bg-zinc-950">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-6 bg-white dark:bg-zinc-900">
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {project.title}
                </h3>

                <p className="text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed text-[15px]">
                  {project.description}
                </p>

                <p className="font-mono text-sm text-purple-600 dark:text-purple-400 mb-4">
                  {project.tags.join(" · ")}
                </p>

                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors text-sm font-medium group/btn"
                >
                  Voir le projet
                  <ArrowRight
                    size={16}
                    className="group-hover/btn:translate-x-1 transition-transform"
                  />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="https://github.com/TomMrcl"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-purple-600 dark:bg-purple-500 text-white px-8 py-4 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-all duration-300 hover:shadow-lg hover:shadow-purple-200 dark:hover:shadow-purple-900/50"
          >
            <ExternalLink size={20} />
            Voir tous mes projets
          </a>
        </div>
      </div>
    </section>
  );
}
