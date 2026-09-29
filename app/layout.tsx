import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wob Knaap · artikelen en projecten",
  description: "Columns, essays en projecten over technologie, onderwijs, beleid, studentenleven en andere onderwerpen.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
