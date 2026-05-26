import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DiagAutoSN - Plateforme automobile pour ateliers et flottes",
  description:
    "Diagnostic automobile, carnet de sante vehicule, suivi atelier et pilotage de flotte pour le marche senegalais.",
  metadataBase: new URL("https://diagautosn.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
