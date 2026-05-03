"use client";

import { useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const navLinks = [
  { label: "Accueil", href: "#hero" },
  { label: "Mes projets", href: "#projects" },
  { label: "Mes services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a
            href="#hero"
            className="text-lg font-medium text-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            Tom Marchal
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                {label}
              </a>
            ))}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-secondary hover:bg-accent transition-colors"
              aria-label="Basculer le thème"
            >
              {theme === "dark" ? (
                <Sun size={20} className="text-foreground" />
              ) : (
                <Moon size={20} className="text-foreground" />
              )}
            </button>
          </nav>

          {/* Mobile Menu and Theme Buttons */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-secondary hover:bg-accent transition-colors"
              aria-label="Basculer le thème"
            >
              {theme === "dark" ? (
                <Sun size={20} className="text-foreground" />
              ) : (
                <Moon size={20} className="text-foreground" />
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border" aria-label="Menu mobile">
            <div className="flex flex-col space-y-3">
              {navLinks.map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors py-2"
                >
                  {label}
                </a>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
