import type { Metadata } from "next";
import { Fraunces, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display-loaded",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body-loaded",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-loaded",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DiagAutoSN — Ta voiture te parle. On t'aide à comprendre.",
  description:
    "À Dakar depuis 2018 : un boîtier connecté qui anticipe les pannes et un garage de confiance dans ta poche. Pour propriétaires et ateliers du Sénégal.",
  metadataBase: new URL("https://diagautosn.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
