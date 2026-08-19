import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wob Knaap · artikelen en notities",
  description: "Columns en notities van Wob Knaap over studentenleven, onderwijs, technologie en Eindhoven.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
