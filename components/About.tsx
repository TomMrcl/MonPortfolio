// Utilisation d'une image placeholder plus simple pour éviter les problèmes de chargement

import Image from "next/image";

export function About() {
  return (
    <section
      id="about"
      className="py-20 scroll-mt-16"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <div className="w-48 h-48 mx-auto md:mx-0 mb-8 relative">
                <div className="w-full h-full rounded-full shadow-lg flex items-center justify-center overflow-hidden object-cover ring-4 ring-purple-300 dark:ring-purple-800">
                  <Image
                    src="/Moi2.png"
                    alt="avatar"
                    width={300}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400/20 to-transparent"></div>
              </div>
            </div>

            <div>
              <p className="font-mono text-sm tracking-widest text-purple-600 dark:text-purple-400 mb-3">
                // À PROPOS
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white mb-6">
                À propos
              </h2>

              <p className="text-lg text-zinc-800 dark:text-zinc-200 mb-6 leading-relaxed">
                Je suis{" "}
                <span className="text-purple-600 dark:text-purple-400">
                  Tom
                </span>
                , développeur web passionné spécialisé en React. J'aide les
                indépendants et petites entreprises à avoir une présence en
                ligne moderne et efficace.
              </p>

              <p className="text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
                Titulaire d'un Titre RNCP Niveau 5 Développeur Web et Web
                Mobile, je poursuivrai ma formation dès septembre avec un
                RNCP Niveau 6 Développeur Java pour évoluer vers un profil
                full-stack complet. Je me concentre sur la création de sites
                performants, accessibles et parfaitement adaptés aux besoins
                de mes clients, avec une approche qui combine rigueur
                technique et design élégant.
              </p>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl p-4 shadow-sm">
                  <div className="text-2xl text-purple-600 dark:text-purple-400 mb-2">
                    30+
                  </div>
                  <div className="text-zinc-600 dark:text-zinc-400">Projets réalisés</div>
                </div>
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl p-4 shadow-sm">
                  <div className="text-2xl text-purple-600 dark:text-purple-400 mb-2">
                    3+
                  </div>
                  <div className="text-zinc-600 dark:text-zinc-400">
                    Années d'expérience
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
