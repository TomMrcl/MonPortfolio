"use client";

import { ExternalLink, ArrowRight } from 'lucide-react';

export function Projects() {
  const projects = [
    {
      title: 'Qwenta - Menu Maker',
      description: 'Planification d’un site web complet avec spécifications techniques et gestion de projet.',
      image: '/qwentaimg.webp',
      tags: ['Gestion de projet', 'Spécifications', 'UX/UI'],
      link: 'https://github.com/TomMrcl/Qwenta'
    },
    {
      title: 'Kasa - Plateforme de location immobilière',
      description: 'Application affichant des logements avec informations détaillées à partir d’un fichier JSON.',
      image: '/kasaimg.webp',
      tags: ['React', 'JSON', 'Composants dynamiques'],
      link: 'https://kasa-roan-beta.vercel.app/'
    },
    {
      title: 'ArgentBank - Banque en ligne',
      description: "Implémenter le front-end d'une application bancaire avec React",
      image: '/ArgentBankimg.webp',
      tags: ['React', 'Redux', 'Front-end'],
      link: 'https://github.com/TomMrcl/ArgentBank'
    },
    {
      title: 'ohmyfood - Restauration',
      description: 'Site “mobile first” qui répertorie les menus de restaurants gastronomiques.',
      image: '/shémaomf.webp',
      tags: ['Responsive', 'Animations', 'Mobile first'],
      link: 'https://tommrcl.github.io/ohmyfood/'
    }
  ];

  return (
    <section id="projects" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl text-foreground mb-4">
            Mes projets
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez quelques réalisations qui illustrent mon savoir-faire 
            et ma passion pour le développement web moderne.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {projects.map((project, index) => (
            <div key={index} className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl dark:hover:shadow-purple-900/20 transition-all duration-300 hover:-translate-y-2">
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl text-foreground mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* Bouton vers le projet */}
                <a 
                  href={project.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors group/btn"
                >
                  Voir le projet
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>
        
        {/* Bouton global vers ton GitHub */}
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
