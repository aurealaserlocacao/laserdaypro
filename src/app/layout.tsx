import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = { width: "device-width", initialScale: 1, maximumScale: 5 };

export const metadata: Metadata = {
  title: {
    default: "Laser Day Pro | Gestão de clínicas",
    template: "%s | Laser Day Pro",
  },
  description: "Gestão de agenda, clientes e operação para clínicas de depilação a laser.",
  applicationName: "Laser Day Pro",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}