// Utilisation d'une image placeholder plus simple pour éviter les problèmes de chargement

import Image from "next/image";


export function About() {
  return (
    <section
      id="about"
      className="py-20 bg-gradient-to-br from-purple-50 to-background dark:from-purple-950/10 dark:to-background"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <div className="w-48 h-48 mx-auto md:mx-0 mb-8 relative">
                <div className="w-full h-full rounded-full shadow-lg flex items-center justify-center overflow-hidden object-cover ring-4 ring-mauve-300 ">
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
              <h2 className="text-3xl sm:text-4xl text-foreground mb-6">
                À propos
              </h2>

              <p className="text-lg text-foreground/90 mb-6 leading-relaxed">
                Je suis{" "}
                <span className="text-purple-600 dark:text-purple-400">
                  Tom
                </span>
                , développeur web passionné spécialisé en React. J'aide les
                indépendants et petites entreprises à avoir une présence en
                ligne moderne et efficace.
              </p>

              <p className="text-muted-foreground mb-8 leading-relaxed">
                Avec plusieurs années d'expérience dans le développement web, je
                me concentre sur la création de sites performants, accessibles
                et parfaitement adaptés aux besoins de mes clients. Mon approche
                combine technique moderne et design élégant pour des résultats
                qui marquent.
              </p>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
                  <div className="text-2xl text-purple-600 dark:text-purple-400 mb-2">
                    15+
                  </div>
                  <div className="text-muted-foreground">Projets réalisés</div>
                </div>
                <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
                  <div className="text-2xl text-purple-600 dark:text-purple-400 mb-2">
                    2+
                  </div>
                  <div className="text-muted-foreground">
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
