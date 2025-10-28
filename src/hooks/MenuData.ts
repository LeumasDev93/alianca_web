// hooks/useMenuData.ts
import { useEffect, useState } from "react";
import { apiAlianca, BASE_IMAGE_URL } from "@/data/service/axios";

interface Icon {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  width: number;
  height: number;
  size: number;
  url: string;
}

interface MenuItem {
  id: number;
  documentId: string;
  nome: string;
  menu_id: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  url: string;
  order: number;
  topico_sub_menus?: TopicoItem[];
  localizations: any[];
}

interface TopicoItem {
  id: number;
  documentId: string;
  titulo: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  order?: number;
  icon?: Icon;
  submenus?: SubmenuItem[];
  menu?: {
    id: number;
    documentId: string;
    nome: string;
  };
}

interface SubmenuItem {
  id: number;
  documentId: string;
  nome: string;
  url: string;
  order: number;
  descricao: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
}

export interface Menu {
  id: number;
  name: string;
  path: string;
  order: number;
  topicos: Topico[];
}

export interface Topico {
  id: number;
  title: string;
  order: number;
  icon: {
    url: string;
    alt?: string;
  } | null;
  submenus: Submenu[];
}

interface Submenu {
  id: number;
  name: string;
  path: string;
  order: number;
  description?: string;
}

interface UseMenuDataResult {
  menus: Menu[];
  isLoading: boolean;
  error: Error | null;
  refreshMenuData: () => Promise<void>;
}

export const useMenuData = (): UseMenuDataResult => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAndProcessMenuData = async (): Promise<Menu[]> => {
    const menusResponse = await apiAlianca.get<{ data: MenuItem[] }>("/menus", {
      params: {
        populate: {
          topico_sub_menus: {
            populate: ["icon", "submenus"]
          }
        }
      }
    });

    const allMenus = menusResponse.data.data;
    const mainMenus = allMenus
      .filter(menu => !menu.menu_id || menu.menu_id === "menu")
      .sort((a, b) => a.order - b.order);

    return mainMenus.map(menu => {
      const processedTopicos: Topico[] = (menu.topico_sub_menus || [])
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map(topico => ({
          id: topico.id,
          title: topico.titulo,
          order: topico.order || 0,
          icon: topico.icon ? {
            url: `${BASE_IMAGE_URL}${topico.icon.url}`,
            alt: topico.icon.alternativeText || undefined
          } : null,
          submenus: (topico.submenus || [])
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map(submenu => ({
              id: submenu.id,
              name: submenu.nome,
              path: submenu.url,
              order: submenu.order || 0,
              description: submenu.descricao
            }))
        }));

      return {
        id: menu.id,
        name: menu.nome,
        path: menu.url,
        order: menu.order,
        topicos: processedTopicos
      };
    });
  };

  const loadMenuData = async () => {
    try {
      // Verificar cache
      const cachedData = localStorage.getItem('menuData');
      const cachedTimestamp = localStorage.getItem('menuDataTimestamp');
      const cacheDuration = 3600000; // 1 hora em milissegundos
      const now = new Date().getTime();

      if (cachedData && cachedTimestamp) {
        const parsedCache = JSON.parse(cachedData);
        const cacheAge = now - parseInt(cachedTimestamp);

        // Usar cache se ainda for válido
        if (cacheAge < cacheDuration && Array.isArray(parsedCache) && parsedCache.length > 0) {
          setMenus(parsedCache);
          setIsLoading(false);
          return;
        }
      }

      // Buscar dados frescos da API
      const freshData = await fetchAndProcessMenuData();
      
      // Atualizar cache
      localStorage.setItem('menuData', JSON.stringify(freshData));
      localStorage.setItem('menuDataTimestamp', now.toString());

      setMenus(freshData);
    } catch (err) {
      setError(err as Error);
      //console.error("Erro ao carregar dados do menu:", err);
      
      // Tentar fallback para cache mesmo que expirado
      const cachedData = localStorage.getItem('menuData');
      if (cachedData) {
        try {
          const parsedCache = JSON.parse(cachedData);
          if (Array.isArray(parsedCache) && parsedCache.length > 0) {
            setMenus(parsedCache);
          }
        } catch (e) {
         // console.error("Erro ao analisar cache:", e);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const refreshMenuData = async () => {
    try {
      setIsLoading(true);
      const freshData = await fetchAndProcessMenuData();
      
      // Atualizar cache
      const now = new Date().getTime();
      localStorage.setItem('menuData', JSON.stringify(freshData));
      localStorage.setItem('menuDataTimestamp', now.toString());

      setMenus(freshData);
    } catch (err) {
      setError(err as Error);
     // console.error("Erro ao atualizar dados do menu:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMenuData();
  }, []);

  return { menus, isLoading, error, refreshMenuData };
};