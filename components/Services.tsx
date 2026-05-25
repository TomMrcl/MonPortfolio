"use client";

import { useState } from "react";
import {
  Monitor,
  ShoppingCart,
  Code,
  Mail,
  Gift,
  CreditCard,
  ShieldCheck,
  Wrench,
  Star,
  Check,
  CalendarDays,
  Wallet,
} from "lucide-react";

type PaymentMode = "unique" | "monthly";

export function Services() {
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("unique");

  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  const services = [
    {
      icon: ShoppingCart,
      title: "Visibilité Google",
      price: "À partir de 299€",
      monthly: {
        price: "25€/mois",
        duration: "pendant 12 mois",
        after: "puis 25€/mois maintenance",
      },
      description:
        "Optimisez votre présence sur Google pour apparaître en premier dans votre ville.",
      features: [
        "Optimisation Google Business",
        "Configuration SEO locale",
        "Conseils avis clients",
      ],
      highlight: false,
    },
    {
      icon: Monitor,
      title: "Site Web Professionnel",
      price: "À partir de 899€",
      monthly: {
        price: "60€/mois",
        duration: "pendant 15 mois",
        after: "puis 25€/mois maintenance",
      },
      description:
        "Site web professionnel pour présenter votre activité et attirer de nouveaux clients.",
      features: [
        "Design responsive",
        "Optimisé SEO",
        "Formulaire de contact",
      ],
      highlight: true,
    },
    {
      icon: Code,
      title: "Application Web Sur Mesure",
      price: "Sur devis",
      monthly: {
        price: "Mensualités adaptées",
        duration: "à votre projet",
        after: null,
      },
      description:
        "Développement full-stack (React, Node.js, SQL) pour des projets ambitieux : espace client, système de réservation, tableau de bord, base de données.",
      features: [
        "Front-end React / Next.js",
        "Back-end & base de données SQL",
        "Espace client & authentification",

      ],
      highlight: false,
    },
  ];

  return (
    <section id="services" className="py-20 scroll-mt-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Titre */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl text-foreground mb-4">
            Mes services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Des solutions web adaptées à vos besoins et votre budget, du simple
            site vitrine aux applications complexes.
          </p>
        </div>

        {/* Toggle global — glissière fluide */}
        <div className="flex flex-col items-center gap-2 mb-12">
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
            Mode de paiement
          </p>

          {/* Conteneur du toggle */}
          <div className="relative inline-grid grid-cols-2 bg-card border border-border rounded-xl p-1 w-72 sm:w-80">
            {/* Glissière de fond — se déplace selon le mode actif */}
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg bg-purple-600 shadow-lg transition-transform duration-300 ease-in-out ${
                paymentMode === "monthly" ? "translate-x-[calc(100%+8px)]" : "translate-x-0"
              }`}
            />

            {/* Bouton Paiement unique */}
            <button
              onClick={() => setPaymentMode("unique")}
              className={`relative z-10 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors duration-300 ${
                paymentMode === "unique"
                  ? "text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Wallet size={14} />
              Unique
            </button>

            {/* Bouton Mensuel */}
            <button
              onClick={() => setPaymentMode("monthly")}
              className={`relative z-10 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors duration-300 ${
                paymentMode === "monthly"
                  ? "text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <CalendarDays size={14} />
              Mensuel
            </button>
          </div>

          {/* Sous-label contextuel */}
          <p className="text-xs text-purple-400 h-4 transition-opacity duration-300">
            {paymentMode === "monthly"
              ? "Vous devenez propriétaire au dernier versement"
              : "Acompte 30% à la signature, solde à la livraison"}
          </p>
        </div>

        {/* 3 offres principales */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {services.map((service, index) => (
            <div
              key={index}
              className={`relative bg-card border rounded-xl p-6 lg:p-8 transition-all duration-300 flex justify-between flex-col ${
                service.highlight
                  ? "border-purple-500 shadow-xl lg:scale-105 lg:z-10"
                  : "border-border hover:shadow-lg dark:hover:shadow-purple-900/20 hover:-translate-y-1"
              }`}
            >
              {/* Badge Populaire */}
              {service.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-sm font-medium px-8 py-1 rounded-full flex items-center gap-2 shadow-md">
                  <Star size={14} className="text-yellow-300" />
                  Populaire
                </div>
              )}

              {/* Icône */}
              <div
                className={`w-16 h-16 rounded-lg flex items-center justify-center mb-6 ${
                  service.highlight
                    ? "bg-purple-600 text-white"
                    : "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                }`}
              >
                <service.icon size={28} />
              </div>

              <h3 className="text-xl text-foreground mb-2">{service.title}</h3>

              {/* Bloc prix — crossfade entre les deux modes */}
              <div className="mb-4 relative min-h-[80px]">
                {/* Mode paiement unique */}
                <div
                  className={`transition-opacity duration-300 ${
                    paymentMode === "unique"
                      ? "opacity-100"
                      : "opacity-0 absolute inset-0 pointer-events-none"
                  }`}
                >
                  <div
                    className={`text-2xl font-bold ${
                      service.highlight
                        ? "text-purple-600"
                        : "text-purple-600 dark:text-purple-400"
                    }`}
                  >
                    {service.price}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                    <CreditCard size={14} className="text-purple-500 shrink-0" />
                    Acompte 30% à la signature, solde à la livraison
                  </div>
                </div>

                {/* Mode mensuel */}
                <div
                  className={`transition-opacity duration-300 ${
                    paymentMode === "monthly"
                      ? "opacity-100"
                      : "opacity-0 absolute inset-0 pointer-events-none"
                  }`}
                >
                  <div
                    className={`text-2xl font-bold ${
                      service.highlight
                        ? "text-purple-600"
                        : "text-purple-600 dark:text-purple-400"
                    }`}
                  >
                    {service.monthly.price}
                  </div>
                  <div className="text-sm text-muted-foreground mt-0.5">
                    {service.monthly.duration}
                  </div>
                  {service.monthly.after && (
                    <div className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                      <CreditCard size={14} className="text-purple-500 shrink-0" />
                      {service.monthly.after}
                    </div>
                  )}
                  <div className="text-xs text-purple-400 font-medium mt-2 flex items-center gap-1">
                    <Check size={12} className="shrink-0" />
                    Propriétaire au dernier versement
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground mb-6">{service.description}</p>

              <ul className="space-y-2 mb-8">
                {service.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className={`flex items-center ${
                      feature.includes("maintenance")
                        ? "font-medium text-purple-600 dark:text-purple-400"
                        : "text-muted-foreground"
                    }`}
                  >
                    <div className="w-1.5 h-1.5 bg-purple-400 dark:bg-purple-500 rounded-full mr-3 shrink-0" />
                    {feature.includes("maintenance") && (
                      <Gift size={16} className="mr-2 shrink-0" />
                    )}
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={scrollToContact}
                className={`w-full px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                  service.highlight
                    ? "bg-purple-600 text-white hover:bg-purple-700"
                    : "bg-secondary border border-border text-purple-600 dark:text-purple-400 hover:bg-accent"
                }`}
              >
                <Mail size={18} />
                Démarrer mon projet
              </button>
            </div>
          ))}
        </div>

        {/* Encart comparatif dynamique — suit le toggle */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="bg-purple-950 border border-purple-700 rounded-xl p-6 shadow-lg">

            {/* Titre fixe */}
            <p className="text-center text-purple-300/70 text-xs uppercase tracking-widest font-medium mb-5">
              Pourquoi choisir un site sur mesure ?
            </p>

            {/* Conteneur à hauteur fixe pour éviter le saut de layout lors du fade */}
            <div className="relative">

              {/* ── Table mode PAIEMENT UNIQUE ── */}
              <div
                className={`transition-opacity duration-300 ${
                  paymentMode === "unique"
                    ? "opacity-100 relative"
                    : "opacity-0 absolute inset-0 pointer-events-none"
                }`}
              >
                {/* Accroche */}
                <p className="text-center text-white font-semibold text-base mb-4">
                  Payez une fois, c&apos;est à vous pour toujours.
                </p>
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left pb-3 w-2/4" />
                      <th className="text-center pb-3 w-1/4">
                        <span className="text-white font-semibold bg-purple-700/50 px-3 py-1 rounded-full text-xs">
                          Avec moi
                        </span>
                      </th>
                      <th className="text-center pb-3 text-purple-400/70 font-medium text-xs w-1/4">
                        Shopify
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-purple-800/50">
                      <td className="py-3 text-purple-300">Coût total sur 3 ans</td>
                      <td className="py-3 text-center font-bold text-white">899€ + maintenance</td>
                      <td className="py-3 text-center text-purple-400/60">~1 044€ et ça continue</td>
                    </tr>
                    {/* Ligne clé — Propriétaire */}
                    <tr className="border-t border-purple-700 bg-purple-800/30">
                      <td className="py-3 pl-3 rounded-l-lg font-bold text-white">Propriétaire</td>
                      <td className="py-3 text-center font-bold text-green-400">✓ Oui</td>
                      <td className="py-3 text-center text-red-400 rounded-r-lg font-medium">✗ Jamais</td>
                    </tr>
                    <tr className="border-t border-purple-800/50">
                      <td className="py-3 text-purple-300">Commission sur ventes</td>
                      <td className="py-3 text-center font-bold text-green-400">✓ 0%</td>
                      <td className="py-3 text-center text-red-400">✗ jusqu&apos;à 2%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* ── Table mode MENSUEL ── */}
              <div
                className={`transition-opacity duration-300 ${
                  paymentMode === "monthly"
                    ? "opacity-100 relative"
                    : "opacity-0 absolute inset-0 pointer-events-none"
                }`}
              >
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left pb-3 w-2/4" />
                      <th className="text-center pb-3 w-1/4">
                        <span className="text-white font-semibold bg-purple-700/50 px-3 py-1 rounded-full text-xs">
                          Avec moi
                        </span>
                      </th>
                      <th className="text-center pb-3 text-purple-400/70 font-medium text-xs w-1/4">
                        Shopify
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-purple-800/50">
                      <td className="py-3 text-purple-300">Mensualité</td>
                      <td className="py-3 text-center font-bold text-white">X€/mois</td>
                      <td className="py-3 text-center text-purple-400/60">29€/mois</td>
                    </tr>
                    {/* Ligne clé — Propriétaire */}
                    <tr className="border-t border-purple-700 bg-purple-800/30">
                      <td className="py-3 pl-3 rounded-l-lg font-bold text-white">Propriétaire</td>
                      <td className="py-3 text-center font-bold text-green-400">✓ Oui</td>
                      <td className="py-3 text-center text-red-400 rounded-r-lg font-medium">✗ Jamais</td>
                    </tr>
                    <tr className="border-t border-purple-800/50">
                      <td className="py-3 text-purple-300">Commission sur ventes</td>
                      <td className="py-3 text-center font-bold text-green-400">✓ 0%</td>
                      <td className="py-3 text-center text-red-400">✗ 0,5% à 2%</td>
                    </tr>
                    <tr className="border-t border-purple-800/50">
                      <td className="py-3 text-purple-300">Gestion du contenu</td>
                      <td className="py-3 text-center font-bold text-green-400">✓ CMS simple inclus</td>
                      <td className="py-3 text-center text-green-400">✓ Oui</td>
                    </tr>
                    <tr className="border-t border-purple-800/50">
                      <td className="py-3 text-purple-300">Support</td>
                      <td className="py-3 text-center font-bold text-green-400">✓ Humain, en français</td>
                      <td className="py-3 text-center text-red-400">✗ Anglais, ticketing</td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </div>

        {/* Carte Maintenance */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border border-purple-300 dark:border-purple-700 rounded-xl p-8 text-center shadow-lg">
            <div className="flex justify-center mb-4">
              <div className="bg-purple-600 text-white w-16 h-16 rounded-lg flex items-center justify-center">
                <Wrench size={28} />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-2">
              Maintenance mensuelle
            </h3>
            <p className="text-purple-600 dark:text-purple-400 text-xl font-bold mb-2">
              Adaptée à votre budget
            </p>
            <p className="text-muted-foreground mb-6">
              Bénéficiez d&apos;une maintenance continue
              pour garder votre site à jour et sécurisé.
            </p>
            <ul className="space-y-2 mb-2 text-left max-w-sm mx-auto">
              <li className="flex items-center text-muted-foreground">
                <ShieldCheck size={18} className="text-purple-500 mr-2" />
                Hébergement inclus
              </li>
              <li className="flex items-center text-muted-foreground">
                <ShieldCheck size={18} className="text-purple-500 mr-2" />
                Support prioritaire
              </li>
              <li className="flex items-center text-muted-foreground">
                <ShieldCheck size={18} className="text-purple-500 mr-2" />
                Corrections de bugs &amp; sécurité
              </li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}
