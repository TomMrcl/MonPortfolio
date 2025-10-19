"use client";

import { useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div
            className="text-lg font-medium text-foreground cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            onClick={() => scrollToSection("hero")}
          >
            Tom Marchal
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("hero")}
              className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              Accueil
            </button>
            <button
              onClick={() => scrollToSection("projects")}
              className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              Mes projets
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              Mes services
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              Contact
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-secondary hover:bg-accent transition-colors"
              aria-label="Toggle theme"
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
              aria-label="Toggle theme"
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
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => scrollToSection("hero")}
                className="text-left text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors py-2"
              >
                Accueil
              </button>
              <button
                onClick={() => scrollToSection("projects")}
                className="text-left text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors py-2"
              >
                Mes projets
              </button>
              <button
                onClick={() => scrollToSection("services")}
                className="text-left text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors py-2"
              >
                Mes services
              </button>

              <button
                onClick={() => scrollToSection("contact")}
                className="text-left text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors py-2"
              >
                Contact
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
