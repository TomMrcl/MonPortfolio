import { Github, Linkedin, Instagram } from "lucide-react";

const navLinks = [
  { label: "Accueil", href: "#hero" },
  { label: "Mes services", href: "#services" },
  { label: "Mes projets", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 text-white py-12 border-t border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            {/* Logo et description */}
            <div>
              <div className="text-xl text-white mb-4">Tom Marchal</div>
              <p className="text-zinc-400 leading-relaxed">
                Développeur web freelance spécialisé en React. Créateur de sites
                modernes et performants.
              </p>
            </div>

            {/* Liens rapides */}
            <div>
              <h3 className="font-mono text-sm tracking-widest text-purple-400 mb-4">
                // LIENS RAPIDES
              </h3>
              <nav aria-label="Liens rapides">
                <ul className="space-y-2">
                  {navLinks.map(({ label, href }) => (
                    <li key={href}>
                      <a
                        href={href}
                        className="text-zinc-400 hover:text-purple-400 transition-colors"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Réseaux sociaux */}
            <div>
              <h3 className="font-mono text-sm tracking-widest text-purple-400 mb-4">
                // ME SUIVRE
              </h3>
              <div className="flex justify-center md:justify-start space-x-4">
                <a
                  href="https://www.linkedin.com/in/tom-marchal-a41b5b299/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-zinc-400 hover:text-purple-400 hover:bg-white/10 transition-all"
                >
                  <Linkedin size={20} />
                </a>
                <a
                  href="https://github.com/TomMrcl"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-zinc-400 hover:text-purple-400 hover:bg-white/10 transition-all"
                >
                  <Github size={20} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-zinc-400 hover:text-purple-400 hover:bg-white/10 transition-all"
                >
                  <Instagram size={20} />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-zinc-400">
              © {currentYear} Tom Marchal. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
