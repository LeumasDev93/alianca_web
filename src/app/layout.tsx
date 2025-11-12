/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import NextAuthSessionProvider from "@/providers/sessionProvider";
import HeaderServer from "@/components/HeaderServer";
import FooterServer from "@/components/FooterServer";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alianca",
  description: "Website Seguradora Alianca",
};

export const revalidate = 60; // Revalidate every 60 seconds (ISR)

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" className={`${montserrat.variable}`}>
      <body className="font-sans antialiased">
        <NextAuthSessionProvider>
          <HeaderServer />
          {children}
          <FooterServer />
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
