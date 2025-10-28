/* eslint-disable @typescript-eslint/no-explicit-any */
import Header from "@/components/header";
import { API_TOKEN_PROD, BASE_IMAGE_URL } from "@/data/service/axios";
import { APIResponse } from "@/types/typesData";

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

export default async function HeaderServer() {
  const [socialInfoArr, menusRaw] = await Promise.all([
    fetchFromApi<any>("/contact-infos?populate[rede_socials][populate]=icon"),
    fetchFromApi<any>(
      "/menus?populate[topico_sub_menus][populate][0]=icon&populate[topico_sub_menus][populate][1]=submenus"
    ),
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

  return <Header menus={menusProcessed as any} socialIcons={socialIcons} />;
}
