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
  CalendarDays,
  Wallet,
} from "lucide-react";

type PaymentMode = "unique" | "monthly";

// Paliers de prix mini du marché freelance FR — servent de base au simulateur
const projectTypes = [
  { id: "landing", label: "Landing page (1 page)", price: 499 },
  { id: "vitrine5", label: "Site vitrine (jusqu'à 5 pages)", price: 799 },
  { id: "vitrine10", label: "Site vitrine (jusqu'à 10 pages)", price: 1199 },
  { id: "ecommerce", label: "E-commerce / boutique en ligne", price: 1499 },
];

export function Services() {
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("unique");
  const [months, setMonths] = useState(12);
  const [selectedType, setSelectedType] = useState(projectTypes[1].id);

  const selectedProject =
    projectTypes.find((type) => type.id === selectedType) ?? projectTypes[1];

  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  const services = [
    {
      icon: ShoppingCart,
      title: "Visibilité Google",
      price: "À partir de 199€",
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
      price: "À partir de 499€",
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
    <section id="services" className="py-20 scroll-mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Titre */}
        <div className="mb-10 max-w-3xl">
          <p className="font-mono text-sm tracking-widest text-purple-600 dark:text-purple-400 mb-3">
            // MES SERVICES
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
            Mes services
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Des solutions web adaptées à vos besoins et votre budget, du simple
            site vitrine aux applications complexes.
          </p>
        </div>

        {/* Toggle global — glissière fluide */}
        <div className="flex flex-col items-center gap-2 mb-12">
          <p className="text-xs text-zinc-500 dark:text-zinc-500 uppercase tracking-widest font-medium">
            Mode de paiement
          </p>

          {/* Conteneur du toggle */}
          <div className="relative inline-grid grid-cols-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl p-1 w-72 sm:w-80">
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
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
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
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              <CalendarDays size={14} />
              Mensuel
            </button>
          </div>

          {/* Sous-label contextuel */}
          <p className="text-xs text-purple-600 dark:text-purple-400 h-4 transition-opacity duration-300">
            {paymentMode === "monthly"
              ? "Vous devenez propriétaire au dernier versement"
              : "Acompte 30% à la signature, solde à la livraison"}
          </p>
        </div>

        {/* Offre(s) — 3 cartes en paiement unique, simulateur en mensuel */}
        {paymentMode === "unique" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            {services.map((service, index) => (
              <div
                key={index}
                className={`relative bg-white dark:bg-zinc-900 border rounded-xl p-6 lg:p-8 shadow-sm transition-all duration-300 flex justify-between flex-col ${
                  service.highlight
                    ? "border-purple-500 shadow-xl lg:scale-105 lg:z-10"
                    : "border-zinc-200 dark:border-white/10 hover:shadow-lg dark:hover:shadow-purple-900/20 hover:-translate-y-1"
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

                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">{service.title}</h3>

                <div className="mb-4">
                  <div
                    className={`text-2xl font-bold ${
                      service.highlight
                        ? "text-purple-600"
                        : "text-purple-600 dark:text-purple-400"
                    }`}
                  >
                    {service.price}
                  </div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-2 mt-1">
                    <CreditCard size={14} className="text-purple-500 shrink-0" />
                    Acompte 30% à la signature, solde à la livraison
                  </div>
                </div>

                <p className="text-zinc-600 dark:text-zinc-400 mb-6">{service.description}</p>

                <ul className="space-y-2 mb-8">
                  {service.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className={`flex items-center ${
                        feature.includes("maintenance")
                          ? "font-medium text-purple-600 dark:text-purple-400"
                          : "text-zinc-600 dark:text-zinc-400"
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
                  className={`w-full px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                    service.highlight
                      ? "bg-purple-600 dark:bg-purple-500 text-white hover:bg-purple-700 dark:hover:bg-purple-600 hover:shadow-lg hover:shadow-purple-200 dark:hover:shadow-purple-900/50"
                      : "bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-purple-600 dark:text-purple-400 hover:bg-zinc-200 dark:hover:bg-white/10"
                  }`}
                >
                  <Mail size={18} />
                  Démarrer mon projet
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12 items-stretch">
            {/* Sélecteur de prestation */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl p-6 lg:p-8 shadow-sm">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">
                Quel type de projet ?
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                Sélectionnez pour estimer un prix de départ
              </p>

              <div className="space-y-3">
                {projectTypes.map((type) => (
                  <label
                    key={type.id}
                    className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-colors ${
                      selectedType === type.id
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                        : "border-zinc-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-purple-700"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="projectType"
                        checked={selectedType === type.id}
                        onChange={() => setSelectedType(type.id)}
                        className="accent-purple-600"
                      />
                      <span className="text-sm text-zinc-900 dark:text-white">{type.label}</span>
                    </span>
                    <span className="text-sm font-bold text-purple-600 dark:text-purple-400 whitespace-nowrap">
                      À partir de {type.price}€
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Simulateur de mensualités */}
            <div className="relative bg-white dark:bg-zinc-900 border border-purple-500 rounded-xl p-6 lg:p-8 shadow-xl">
              <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-6 bg-purple-600 text-white mx-auto">
                <Monitor size={28} />
              </div>

              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white text-center mb-1">
                {selectedProject.label}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-center mb-8">
                Choisissez votre durée de paiement
              </p>

              <input
                type="range"
                min={1}
                max={12}
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
                className="w-full accent-purple-600"
                aria-label="Nombre de mensualités"
              />
              <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-8 mt-2">
                <span>1 fois</span>
                <span>12 mois</span>
              </div>

              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 whitespace-nowrap">
                  {months === 1
                    ? `À partir de ${selectedProject.price}€`
                    : `À partir de ${Math.ceil(selectedProject.price / months)}€/mois`}
                </div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                  {months === 1 ? "Paiement en 1 fois" : `sur ${months} mensualités`}
                </div>
              </div>

              <p className="flex items-center justify-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-500 mb-8">
                <CreditCard size={14} className="text-purple-500 shrink-0" />
                À partir de {selectedProject.price}€ au total, sans frais supplémentaires
              </p>

              <button
                onClick={scrollToContact}
                className="w-full px-6 py-3 rounded-lg flex items-center justify-center gap-2 bg-purple-600 dark:bg-purple-500 text-white hover:bg-purple-700 dark:hover:bg-purple-600 hover:shadow-lg hover:shadow-purple-200 dark:hover:shadow-purple-900/50 transition-all duration-300"
              >
                <Mail size={18} />
                Démarrer mon projet
              </button>
            </div>
          </div>
        )}

        {/* Carte Maintenance */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border border-purple-300 dark:border-purple-700 rounded-xl p-8 text-center shadow-lg">
            <div className="flex justify-center mb-4">
              <div className="bg-purple-600 text-white w-16 h-16 rounded-lg flex items-center justify-center">
                <Wrench size={28} />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-2">
              Maintenance mensuelle
            </h3>
            <p className="text-purple-600 dark:text-purple-400 text-xl font-bold mb-2">
              Adaptée à votre budget
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              Bénéficiez d&apos;une maintenance continue
              pour garder votre site à jour et sécurisé.
            </p>
            <p className="flex items-center justify-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <ShieldCheck size={16} className="text-purple-500 shrink-0" />
              Hébergement inclus · Support prioritaire · Corrections de bugs &amp; sécurité
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
