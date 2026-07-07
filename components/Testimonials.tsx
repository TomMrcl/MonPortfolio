import { Quote, Star } from "lucide-react";

// Contenu provisoire — à remplacer par de vrais avis clients (BordDeRive, Coach Pierre, Atelier Altaïr...)
const testimonials = [
  {
    quote:
      "Avant, je devais éplucher plusieurs sites et forums différents pour trouver les bons spots, la météo et suivre mes prises. Avec BordDeRive, tout est enfin regroupé au même endroit.",
    author: "Julien",
    project: "Pêcheur, utilisateur BordDeRive",
  },
  {
    quote:
      "Résultat professionnel, délais respectés, et une vraie écoute de mes besoins en tant qu'indépendant.",
    author: "Pierre",
    project: "Coach sportif — pierremoureau.fr",
  },
  {
    quote:
      "Un accompagnement sur mesure, du premier échange à la mise en ligne. Exactement ce qu'il me fallait.",
    author: "Atelier Altaïr",
    project: "atelieraltair.com",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 scroll-mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 max-w-3xl">
          <p className="font-mono text-sm tracking-widest text-purple-600 dark:text-purple-400 mb-3">
            // AVIS CLIENTS
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
            Ce que disent mes clients
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Quelques retours des indépendants et entreprises qui m&apos;ont fait
            confiance.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl p-6 shadow-sm"
            >
              <Quote size={24} className="text-purple-300 dark:text-purple-700 mb-4" />

              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star
                    key={starIndex}
                    size={14}
                    className="text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>

              <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6 flex-1">
                « {testimonial.quote} »
              </p>

              <div>
                <div className="font-semibold text-zinc-900 dark:text-white text-sm">
                  {testimonial.author}
                </div>
                <div className="font-mono text-xs text-zinc-500 dark:text-zinc-500">
                  {testimonial.project}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
