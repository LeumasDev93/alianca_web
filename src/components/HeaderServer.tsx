/* eslint-disable @typescript-eslint/no-explicit-any */
import Header from "@/components/header";
import { STRAPI_URL, STRAPI_TOKEN, BASE_IMAGE_URL } from "@/data/service/axios";
import { APIResponse } from "@/types/typesData";

export const revalidate = 60; // Revalidate every 60 seconds (ISR)

async function fetchFromApi<T>(path: string): Promise<T[]> {
  const url = `${STRAPI_URL}/api${path}`;
  console.log("🔵 Fetching from:", url);
  
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
    next: { revalidate: 60 }, // Cache for 60 seconds
  });
  
  if (!res.ok) {
    console.error("❌ Fetch error:", res.status, res.statusText);
    return [] as T[];
  }
  
  const json = (await res.json()) as APIResponse<T>;
  return json.data as unknown as T[];
}

export default async function HeaderServer() {
  
  // Buscar apenas menus - contact-infos não existe na nova API
  const menusRaw = await fetchFromApi<any>("/menus?populate[submenu][populate][0]=menus&populate[submenu][populate][1]=icon");


  const menusProcessed = (menusRaw as any[]).map((menu) => ({
    id: menu.id,
    name: menu.title,
    path: menu.link,
    order: menu.order || 0,
    topicos: (menu.submenu || []).map((submenu: any, index: number) => ({
      id: submenu.id,
      title: submenu.title,
      order: index,
      icon: submenu.icon
        ? { 
            url: `${STRAPI_URL}${submenu.icon.url}`, 
            alt: submenu.icon.alternativeText || submenu.title 
          }
        : null,
      submenus: (submenu.menus || []).map((item: any) => ({
        id: item.id,
        name: item.title,
        path: item.link,
        order: 0,
      })),
    })),
  }));

  // Social icons vazios por enquanto - contact-infos não existe na nova API
  const socialIcons: any[] = [];

  return <Header menus={menusProcessed as any} socialIcons={socialIcons} />;
}
