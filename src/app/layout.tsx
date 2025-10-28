/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import NextAuthSessionProvider from "@/providers/sessionProvider";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { APIResponse } from "@/types/typesData";
import { API_TOKEN_PROD, BASE_IMAGE_URL } from "@/data/service/axios";

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

export const revalidate = 60;

async function fetchFromApi<T>(path: string): Promise<T[]> {
  const res = await fetch(`https://gestao.aliancaseguros.cv/api${path}`, {
    headers: { Authorization: `Bearer ${API_TOKEN_PROD}` },
    next: { revalidate: 60 },
  });
  if (!res.ok) return [] as T[];
  const json = (await res.json()) as APIResponse<T>;
  return json.data as unknown as T[];
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [socialInfoArr, menusRaw, contactInfoArr] = await Promise.all([
    fetchFromApi<any>("/contact-infos?populate[rede_socials][populate]=icon"),
    fetchFromApi<any>(
      "/menus?populate[topico_sub_menus][populate][0]=icon&populate[topico_sub_menus][populate][1]=submenus"
    ),
    fetchFromApi<any>("/contact-infos?populate=*"),
  ]);

  const menusProcessed = (menusRaw as any[]).map((menu) => ({
    id: menu.id,
    name: menu.nome,
    path: menu.url,
    order: menu.order,
    topicos: (menu.topico_sub_menus || []).map((t: any) => ({
      id: t.id,
      title: t.titulo,
      order: t.order || 0,
      icon: t.icon
        ? { url: `${BASE_IMAGE_URL}${t.icon.url}`, alt: t.icon.alternativeText }
        : null,
      submenus: (t.submenus || []).map((s: any) => ({
        id: s.id,
        name: s.nome,
        path: s.url,
        order: s.order || 0,
        description: s.descricao,
      })),
    })),
  }));

  const socialIcons = (socialInfoArr?.[0]?.rede_socials || []).map(
    (s: any) => ({
      id: s.id,
      url: s.url,
      icon: s.icon,
    })
  );

  return (
    <html lang="pt" className={`${montserrat.variable}`}>
      <body className="font-sans antialiased">
        <NextAuthSessionProvider>
          <Header menus={menusProcessed as any} socialIcons={socialIcons} />
          {children}
          <Footer
            contactInfo={(contactInfoArr as any)?.[0] || null}
            socialInfo={(socialInfoArr as any)?.[0] || null}
          />
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
