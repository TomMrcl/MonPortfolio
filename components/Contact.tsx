"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Send, Mail, MessageCircle, CheckCircle2 } from "lucide-react";

type FormData = {
  name: string;
  email: string;
  message: string;
};

const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

const inputBase =
  "w-full px-4 py-3 bg-white dark:bg-zinc-900 border rounded-lg focus:outline-none focus:ring-2 transition-colors text-zinc-900 dark:text-white";
const inputOk =
  "border-zinc-300 dark:border-white/10 focus:border-purple-400 dark:focus:border-purple-500 focus:ring-purple-100 dark:focus:ring-purple-900/50";
const inputErr =
  "border-red-400 dark:border-red-500 focus:border-red-400 focus:ring-red-100 dark:focus:ring-red-900/50";

function fieldClass(hasError: boolean) {
  return `${inputBase} ${hasError ? inputErr : inputOk}`;
}

export function Contact() {
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ mode: "onTouched" });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setSubmitStatus("success");
        reset();
        setTimeout(() => setSubmitStatus("idle"), 4000);
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    }
  };

  return (
    <section
      id="contact"
      className="py-20 scroll-mt-16"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto relative">
          <div className="mb-16 max-w-3xl">
            <p className="font-mono text-sm tracking-widest text-purple-600 dark:text-purple-400 mb-3">
              // CONTACT
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
              Contact
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Besoin d'un site ou d'une refonte ? Contactez-moi !
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 mt-2">
              Je réponds généralement dans les 24h.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Formulaire */}
            <div className="relative">
              {submitStatus === "success" && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg whitespace-nowrap">
                  <CheckCircle2 size={20} />
                  <span>Message envoyé avec succès !</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
                {/* Nom */}
                <div>
                  <label htmlFor="name" className="block text-zinc-900 dark:text-white mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Votre nom"
                    className={fieldClass(!!errors.name)}
                    {...register("name", {
                      required: "Le nom est requis.",
                      validate: (v) =>
                        v.trim().length >= 2 || "Le nom doit contenir au moins 2 caractères.",
                    })}
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-sm text-red-500 dark:text-red-400">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-zinc-900 dark:text-white mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="votre@email.com"
                    className={fieldClass(!!errors.email)}
                    {...register("email", {
                      required: "L'adresse email est requise.",
                      pattern: {
                        value: EMAIL_REGEX,
                        message: "Adresse email invalide (ex: nom@domaine.fr).",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-sm text-red-500 dark:text-red-400">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-zinc-900 dark:text-white mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    placeholder="Décrivez votre projet..."
                    className={`${fieldClass(!!errors.message)} resize-none`}
                    {...register("message", {
                      required: "Le message est requis.",
                      validate: (v) =>
                        v.trim().length >= 20 || "Le message doit faire au moins 20 caractères.",
                    })}
                  />
                  {errors.message && (
                    <p className="mt-1.5 text-sm text-red-500 dark:text-red-400">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-purple-600 dark:bg-purple-500 text-white px-8 py-4 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-all duration-300 hover:shadow-lg hover:shadow-purple-200 dark:hover:shadow-purple-900/50 flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Send
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                  {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
                </button>

                {submitStatus === "error" && (
                  <p className="text-red-600 dark:text-red-400 text-center">
                    Une erreur est survenue. Merci de réessayer.
                  </p>
                )}
              </form>
            </div>

            {/* Infos de contact */}
            <div className="space-y-8">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-purple-100 dark:bg-purple-900/30 w-12 h-12 rounded-lg flex items-center justify-center">
                    <Mail size={24} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Email</h3>
                    <p className="text-zinc-600 dark:text-zinc-400">tomarchal02@gmail.com</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-purple-100 dark:bg-purple-900/30 w-12 h-12 rounded-lg flex items-center justify-center">
                    <MessageCircle size={24} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Réponse rapide</h3>
                    <p className="text-zinc-600 dark:text-zinc-400">Réponse sous 24h maximum</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-600 to-purple-700 dark:from-purple-700 dark:to-purple-800 rounded-xl p-8 text-white">
                <h3 className="text-lg font-semibold mb-4">Prêt à démarrer votre projet ?</h3>
                <p className="text-purple-100 dark:text-purple-200 leading-relaxed">
                  Que ce soit pour un site vitrine, une boutique en ligne ou une
                  application sur mesure, je suis là pour vous accompagner dans
                  votre transformation digitale.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
