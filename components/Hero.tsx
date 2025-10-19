"use client";

import { ArrowRight } from 'lucide-react';

export function Hero() {
  const scrollToServices = () => {
    const element = document.getElementById('services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-background dark:from-purple-950/20 dark:to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl text-foreground mb-6 leading-tight">
            Développeur web{' '}
            <span className="text-purple-600 dark:text-purple-400">freelance</span>
            <br />
            <span className="text-2xl sm:text-3xl lg:text-4xl text-foreground/80">
              je crée des sites modernes, rapides et sur mesure.
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Spécialisé en React et technologies modernes, j'aide les entreprises à développer leur présence digitale avec des solutions performantes et élégantes.
          </p>
          
          <button 
            onClick={scrollToServices}
            className="inline-flex items-center gap-2 bg-purple-600 dark:bg-purple-500 text-white px-8 py-4 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-all duration-300 hover:shadow-lg hover:shadow-purple-200 dark:hover:shadow-purple-900/50 group"
          >
            Voir mes services
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          {/* Abstract illustration */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-300/20 to-pink-300/20 dark:from-purple-700/20 dark:to-pink-700/20 rounded-full blur-3xl"></div>
            <div className="relative grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div className="h-20 bg-gradient-to-br from-purple-200 to-purple-300 dark:from-purple-800 dark:to-purple-700 rounded-lg opacity-60"></div>
              <div className="h-24 bg-gradient-to-br from-purple-300 to-purple-400 dark:from-purple-700 dark:to-purple-600 rounded-lg opacity-80"></div>
              <div className="h-16 bg-gradient-to-br from-purple-200 to-purple-300 dark:from-purple-800 dark:to-purple-700 rounded-lg opacity-70"></div>
              <div className="h-16 bg-gradient-to-br from-purple-400 to-purple-500 dark:from-purple-600 dark:to-purple-500 rounded-lg opacity-60"></div>
              <div className="h-20 bg-gradient-to-br from-purple-300 to-purple-400 dark:from-purple-700 dark:to-purple-600 rounded-lg opacity-90"></div>
              <div className="h-24 bg-gradient-to-br from-purple-200 to-purple-300 dark:from-purple-800 dark:to-purple-700 rounded-lg opacity-70"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
