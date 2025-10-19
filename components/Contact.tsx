"use client";

import { useState } from "react";
import { Send, Mail, MessageCircle, CheckCircle2 } from "lucide-react";

export function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("https://formspree.io/f/mgvnqaqg", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setStatus("success");
        form.reset();

        // Le badge disparaît après 4s
        setTimeout(() => setStatus("idle"), 4000);
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-purple-50 to-background dark:from-purple-950/10 dark:to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl text-foreground mb-4">
              Contact
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Besoin d'un site ou d'une refonte ? Contactez-moi !
            </p>
            <p className="text-muted-foreground mt-2">
              Je réponds généralement dans les 24h.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Formulaire */}
            <div className="relative">
              {/* Badge de succès */}
              {status === "success" && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg animate-fade-in">
                  <CheckCircle2 size={20} />
                  <span>Message envoyé avec succès !</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-foreground mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-purple-400 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/50 transition-colors text-black"
                    placeholder="Votre nom"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-foreground mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-purple-400 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/50 transition-colors text-black"
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-foreground mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-purple-400 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/50 transition-colors resize-none text-black"
                    placeholder="Décrivez votre projet..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full bg-purple-600 dark:bg-purple-500 text-white px-8 py-4 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-all duration-300 hover:shadow-lg hover:shadow-purple-200 dark:hover:shadow-purple-900/50 flex items-center justify-center gap-2 group"
                >
                  <Send size={20} className="group-hover:translate-x-1 transition-transform" />
                  {status === "sending" ? "Envoi..." : "Envoyer le message"}
                </button>

                {status === "error" && (
                  <p className="mt-4 text-red-600 dark:text-red-400 text-center">
                    ❌ Une erreur est survenue. Merci de réessayer.
                  </p>
                )}
              </form>
            </div>

            {/* Infos de contact */}
            <div className="space-y-8">
              <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-purple-100 dark:bg-purple-900/30 w-12 h-12 rounded-lg flex items-center justify-center">
                    <Mail size={24} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg text-foreground">Email</h3>
                    <p className="text-muted-foreground">tomarchal02@gmail.com</p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-purple-100 dark:bg-purple-900/30 w-12 h-12 rounded-lg flex items-center justify-center">
                    <MessageCircle size={24} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg text-foreground">Réponse rapide</h3>
                    <p className="text-muted-foreground">Réponse sous 24h maximum</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-600 to-purple-700 dark:from-purple-700 dark:to-purple-800 rounded-xl p-8 text-white">
                <h3 className="text-lg mb-4">Prêt à démarrer votre projet ?</h3>
                <p className="text-purple-100 dark:text-purple-200 leading-relaxed">
                  Que ce soit pour un site vitrine, une boutique en ligne ou une application sur mesure, 
                  je suis là pour vous accompagner dans votre transformation digitale.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
