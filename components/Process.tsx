import { MessageCircle, FileText, Code2, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: MessageCircle,
    title: "Premier échange",
    description:
      "On discute de votre projet, vos besoins et votre budget — par mail ou en visio.",
  },
  {
    number: "02",
    icon: FileText,
    title: "Devis & validation",
    description:
      "Je vous envoie un devis clair et détaillé, on ajuste ensemble si besoin.",
  },
  {
    number: "03",
    icon: Code2,
    title: "Développement",
    description:
      "Je code votre site avec des points d'étape réguliers pour suivre l'avancement.",
  },
  {
    number: "04",
    icon: Rocket,
    title: "Livraison & mise en ligne",
    description: "Tests, mise en ligne, et prise en main de votre nouveau site.",
  },
];

export function Process() {
  return (
    <section id="process" className="py-20 scroll-mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 max-w-3xl">
          <p className="font-mono text-sm tracking-widest text-purple-600 dark:text-purple-400 mb-3">
            // COMMENT ÇA SE PASSE
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
            Un déroulé simple, de A à Z
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Pas de surprise : voici exactement comment se passe la collaboration,
            du premier contact à la mise en ligne.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-3xl font-bold text-purple-200 dark:text-purple-900">
                  {step.number}
                </span>
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <step.icon size={20} />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
