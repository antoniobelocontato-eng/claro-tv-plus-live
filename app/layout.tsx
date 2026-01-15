import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Claro TV+ Live",
  description: "Top 3 filmes e séries por streaming (Semana/Mês) - FlixPatrol",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
