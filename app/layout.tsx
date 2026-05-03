import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "../components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tommarchal.fr";

export const metadata: Metadata = {
  title: "Tom Marchal - Développeur Web Freelance spécialisé en React",
  description:
    "Développeur web freelance spécialisé en React. Je crée des sites modernes, rapides et sur mesure pour aider les entreprises à renforcer leur présence en ligne.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Tom Marchal - Développeur Web Freelance spécialisé en React",
    description:
      "Développeur web freelance spécialisé en React. Sites modernes, rapides et sur mesure.",
    url: siteUrl,
    siteName: "Tom Marchal",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tom Marchal - Développeur Web Freelance",
    description:
      "Développeur web freelance spécialisé en React. Sites modernes, rapides et sur mesure.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
