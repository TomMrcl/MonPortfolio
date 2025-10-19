/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // important pour ton toggle dark/light
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ta couleur mauve "soft"
        mauve: {
          50: "#f5e6ff",
          100: "#e0bfff",
          200: "#cb99ff",
          300: "#b573ff",
          400: "#9f4dff",
          500: "#8927ff", // couleur principale
          600: "#6e1fcc",
          700: "#531799",
          800: "#381066",
          900: "#1d0833",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // police par défaut
      },
    },
  },
  plugins: [],
};
