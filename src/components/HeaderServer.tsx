/* eslint-disable @typescript-eslint/no-explicit-any */
import Header from "@/components/header";
import { STRAPI_URL, STRAPI_TOKEN, BASE_IMAGE_URL } from "@/data/service/axios";
import { APIResponse } from "@/types/typesData";

export const revalidate = 60; // Revalidate every 60 seconds (ISR)

async function fetchFromApi<T>(path: string): Promise<T[]> {
  const url = `${STRAPI_URL}/api${path}`;
  
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
    next: { revalidate: 60 }, // Cache for 60 seconds
  });
  
  if (!res.ok) {
    return [] as T[];
  }
  
  const json = (await res.json()) as APIResponse<T>;
  return json.data as unknown as T[];
}

export default async function HeaderServer() {
  
  // Buscar menus com page e icons incluídos no populate - populate deep
  const menusRaw = await fetchFromApi<any>("/menus?sort=order:asc&populate[icon][fields][0]=url&populate[icon][fields][1]=alternativeText&populate[page]=true&populate[submenu][populate][icon][fields][0]=url&populate[submenu][populate][icon][fields][1]=alternativeText&populate[submenu][populate][page]=true&populate[submenu][populate][menus][populate][icon][fields][0]=url&populate[submenu][populate][menus][populate][icon][fields][1]=alternativeText&populate[submenu][populate][menus][populate][page]=true");


  const menusProcessed = (menusRaw as any[]).map((menu) => ({
    id: menu.id,
    documentId: menu.documentId,
    name: menu.title,
    path: menu.link || "#",
    order: menu.order || 0,
    topicos: (menu.submenu || []).map((submenu: any, index: number) => {
      // Se menus estiver vazio, o próprio submenu é o link direto
      const hasDirectLink = !submenu.menus || submenu.menus.length === 0;
      

      if (hasDirectLink) {
        // Submenu sem menus: criar um único item clicável
        return {
          id: submenu.id,
          title: submenu.title,
          order: index,
          icon: submenu.icon
            ? { 
                url: `${STRAPI_URL}${submenu.icon.url}`, 
                alt: submenu.icon.alternativeText || submenu.title 
              }
            : null,
          submenus: [{
            id: submenu.id,
            name: submenu.title,
            link: submenu.link || "#",
            documentId: submenu.page?.documentId || null,
            layout: submenu.page?.layout || null,
            icon: submenu.icon
              ? { 
                  url: `${STRAPI_URL}${submenu.icon.url}`, 
                  alt: submenu.icon.alternativeText || submenu.title 
                }
              : null,
            order: 0,
          }],
        };
      }

      // Submenu com menus: processar normalmente
      return {
        id: submenu.id,
        title: submenu.title,
        order: index,
        icon: submenu.icon
          ? { 
              url: `${STRAPI_URL}${submenu.icon.url}`, 
              alt: submenu.icon.alternativeText || submenu.title 
            }
          : null,
        submenus: (submenu.menus || []).map((item: any) => {
          const hasPage = !!item.page;
          const documentId = item.page?.documentId || null;
          const layout = item.page?.layout || null;
          const hasIcon = !!item.icon;
          
          return {
            id: item.id,
            name: item.title,
            link: item.link || "#",
            documentId: documentId,
            layout: layout,
            icon: hasIcon ? { 
              url: `${STRAPI_URL}${item.icon.url}`, 
              alt: item.icon.alternativeText || item.title 
            } : null,
            order: 0,
          };
        }),
      };
    }),
  }));

  const socialIcons: any[] = [];

  return <Header menus={menusProcessed as any} socialIcons={socialIcons} />;
}
