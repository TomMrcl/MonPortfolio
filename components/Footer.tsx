"use client";

import { Github, Linkedin, Instagram, Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-900 dark:bg-black text-white py-12 border-t border-zinc-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            {/* Logo et description */}
            <div>
              <div className="text-xl text-white mb-4">
                Tom Marchal
              </div>
              <p className="text-gray-400 leading-relaxed">
                Développeur web freelance spécialisé en React. 
                Créateur de sites modernes et performants.
              </p>
            </div>

            {/* Liens rapides */}
            <div>
              <h3 className="text-lg text-white mb-4">Liens rapides</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })}
                  className="block text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Accueil
                </button>
                <button 
                  onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                  className="block text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Mes services
                </button>
                <button 
                  onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                  className="block text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Mes projets
                </button>
                <button 
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="block text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Contact
                </button>
              </div>
            </div>

            {/* Réseaux sociaux */}
            <div>
              <h3 className="text-lg text-white mb-4">Me suivre</h3>
              <div className="flex justify-center md:justify-start space-x-4">
                <a 
                  href="https://www.linkedin.com/in/tom-marchal-a41b5b299/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-purple-400 hover:bg-gray-700 transition-all"
                >
                  <Linkedin size={20} />
                </a>
                <a 
                  href="https://github.com/TomMrcl" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-purple-400 hover:bg-gray-700 transition-all"
                >
                  <Github size={20} />
                </a>
                <a 
                  href="https://instagram.com"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-purple-400 hover:bg-gray-700 transition-all"
                >
                  <Instagram size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Séparateur */}
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <p className="text-gray-400 flex items-center gap-2">
                © {currentYear} Tom Marchal. Fait avec <Heart size={16} className="text-red-500" /> 
              </p>
              <p className="text-gray-500 text-sm mt-2 sm:mt-0">
                Développé avec React & TailwindCSS
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}