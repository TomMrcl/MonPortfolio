"use client";

import { Monitor, ShoppingCart, Code, Mail, Gift, CreditCard, ShieldCheck, Wrench, Star } from 'lucide-react';

export function Services() {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const services = [
    {
      icon: Monitor,
      title: 'Site vitrine',
      price: 'À partir de 299€',
      payment: 'Ou 3x 100€ sans frais',
      description: 'Site web professionnel pour présenter votre activité et attirer de nouveaux clients.',
      features: ['Design responsive', 'Optimisé SEO', 'Formulaire de contact', '1er mois de maintenance offert'],
      highlight: false
    },
    {
      icon: ShoppingCart,
      title: 'Site e-commerce',
      price: 'À partir de 599€',
      payment: 'Ou 3x 200€ sans frais',
      description: 'Boutique en ligne complète pour vendre vos produits avec paiement sécurisé.',
      features: ['Panier d\'achat', 'Paiement en ligne', 'Gestion des stocks', '1er mois de maintenance offert'],
      highlight: true // ✅ Populaire
    },
    {
      icon: Code,
      title: 'Site personnalisé',
      price: 'Sur devis',
      payment: 'Paiement flexible possible',
      description: 'Application web sur mesure selon vos besoins spécifiques et votre secteur.',
      features: ['Fonctionnalités avancées', 'Intégrations API', 'Support technique', '1er mois de maintenance offert'],
      highlight: false
    }
  ];

  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Titre */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl text-foreground mb-4">
            Mes services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Des solutions web adaptées à vos besoins et votre budget, 
            du simple site vitrine aux applications complexes.
          </p>
        </div>

        {/* 3 offres principales */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {services.map((service, index) => (
            <div 
              key={index} 
              className={`relative bg-card border rounded-xl p-8 transition-all duration-300 flex justify-between flex-col ${
                service.highlight 
                  ? 'border-purple-500 shadow-xl scale-105 z-10' 
                  : 'border-border hover:shadow-lg dark:hover:shadow-purple-900/20 hover:-translate-y-1'
              }`}
            >
              {/* ✅ Badge Populaire */}
              {service.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-sm font-medium px-4 py-1 rounded-full flex items-center gap-2 shadow-md">
                  <Star size={14} className="text-yellow-300" />
                  Populaire
                </div>
              )}

              {/* Icône */}
              <div className={`w-16 h-16 rounded-lg flex items-center justify-center mb-6 ${
                service.highlight 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
              }`}>
                <service.icon size={28} />
              </div>

              <h3 className="text-xl text-foreground mb-2">{service.title}</h3>
              
              <div className="mb-4">
                <div className={`text-2xl font-bold ${service.highlight ? 'text-purple-600' : 'text-purple-600 dark:text-purple-400'}`}>
                  {service.price}
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                  <CreditCard size={16} className="text-purple-500" />
                  {service.payment}
                </div>
              </div>
              
              <p className="text-muted-foreground mb-6">{service.description}</p>

              <ul className="space-y-2 mb-8">
                {service.features.map((feature, featureIndex) => (
                  <li 
                    key={featureIndex} 
                    className={`flex items-center ${
                      feature.includes('maintenance') 
                        ? 'font-medium text-purple-600 dark:text-purple-400' 
                        : 'text-muted-foreground'
                    }`}
                  >
                    <div className="w-1.5 h-1.5 bg-purple-400 dark:bg-purple-500 rounded-full mr-3"></div>
                    {feature.includes('maintenance') && <Gift size={16} className="mr-2" />}
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                onClick={scrollToContact}
                className={`w-full px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                  service.highlight 
                    ? 'bg-purple-600 text-white hover:bg-purple-700' 
                    : 'bg-secondary border border-border text-purple-600 dark:text-purple-400 hover:bg-accent'
                }`}
              >
                <Mail size={18} />
                Demander un devis
              </button>
            </div>
          ))}
        </div>

        {/* 4e card - Maintenance */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border border-purple-300 dark:border-purple-700 rounded-xl p-8 text-center shadow-lg">
            <div className="flex justify-center mb-4">
              <div className="bg-purple-600 text-white w-16 h-16 rounded-lg flex items-center justify-center">
                <Wrench size={28} />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-2">Maintenance mensuelle</h3>
            <p className="text-purple-600 dark:text-purple-400 text-xl font-bold mb-2">
              A partir de 15€ / mois
            </p>
            <p className="text-muted-foreground mb-6">
              Après le 1er mois offert, bénéficiez d’une maintenance continue pour garder votre site à jour et sécurisé.
            </p>
            <ul className="space-y-2 mb-2 text-left max-w-sm mx-auto">
              <li className="flex items-center text-muted-foreground">
                <ShieldCheck size={18} className="text-purple-500 mr-2" /> Mises à jour régulières
              </li>
              <li className="flex items-center text-muted-foreground">
                <ShieldCheck size={18} className="text-purple-500 mr-2" /> Corrections de bugs & sécurité
              </li>
              <li className="flex items-center text-muted-foreground">
                <ShieldCheck size={18} className="text-purple-500 mr-2" /> Petites modifications incluses
              </li>
            </ul>

          </div>
        </div>
      </div>
    </section>
  );
}
