import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdfkit lit ses fontes AFM depuis node_modules à l'exécution — ne pas bundler
  serverExternalPackages: ["pdfkit"],
};

export default nextConfig;
