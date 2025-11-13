/* eslint-disable @typescript-eslint/no-explicit-any */
export const revalidate = 60;

import Banner from "@/components/banner/banner";
// import ButtonHelp from "@/components/buttonHelp";
import FloatingButtons from "@/components/FloatingButtons";
import Depoiments from "@/components/depoiments";
import NovidadesAlliance from "@/components/NovidadesAlliance";
import DestaqueAlliance from "@/components/destaqueAlliance";
import { Service } from "@/components/services";
import DynamicSection from "@/components/DynamicSection";
import SessionRefresher from "../components/SessionRefresher";
import { STRAPI_URL, STRAPI_TOKEN } from "@/data/service/axios";

async function fetchBannersData(): Promise<any[]> {
  const url = `${STRAPI_URL}/api/banners?populate[banner][populate][0]=image&populate[banner][populate][1]=video&populate[banner][populate][2]=button&populate[banner][populate][3]=button.page`;
  
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
    next: { revalidate: 60 },
  });
  
  if (!res.ok) {
    return [];
  }
  
  const json = await res.json();
  return json.data || [];
}

async function fetchHomePageData(): Promise<any> {
  // URL exata fornecida pelo usuário
  const url = `${STRAPI_URL}/api/home-page?populate[sessions][populate][0]=itens&populate[sessions][populate][itens][populate][1]=button&populate[sessions][populate][itens][populate][2]=image_presentation&populate[sessions][populate][itens][populate][3]=video_presentation&populate[sessions][populate][itens][populate][4]=button.page&populate[sessions][populate][itens][populate][5]=button.noticia`;
  
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
    next: { revalidate: 60 },
  });
  
  if (!res.ok) {
    return null;
  }
  
  const json = await res.json();
  return json.data;
}

export default async function Home() {
  const [bannersData, homeData] = await Promise.all([
    fetchBannersData(),
    fetchHomePageData(),
  ]);
  
  if (!homeData) {
    return (
      <div className="">
        <main className="flex flex-col gap-8 row-start-2 items-center">
          <p>Carregando...</p>
        </main>
      </div>
    );
  }

  // Mapear banners da nova API - usar dados diretos sem fetchPageDetails
  const bannersWithDetails = bannersData.map((item: any) => {
    return {
      id: item.id,
      category: item.banner?.button?.page?.resume || "",
      titulo: item.banner?.title || "",
      description: item.banner?.description || "",
      banner_img: item.banner?.image || null,
      banner_video: item.banner?.video || null,
      url_botton: item.banner?.button?.link || "#",
      order: 0,
    };
  });

  // Função genérica para mapear itens de qualquer seção
  const mapDynamicSectionItems = (items: any[]) => {
    return items.map((item: any) => {
      const hasNoticia = !!item.button?.noticia;
      const hasPage = !!item.button?.page;
      const hasDirectLink = !!item.button?.link && item.button.link !== '#';
      
      // Extrair descrição
      let description = '';
      if (hasNoticia) {
        description = item.button.noticia.description?.[0]?.children?.[0]?.text || '';
      } else if (hasPage) {
        description = item.button.page.resume || '';
      }

      const result = {
        id: item.id,
        title: item.title || "",
        description,
        image: item.image_presentation?.url ? item.image_presentation : null,
        video: item.url_video || null,
        presentation_mode: item.presentation_mode || null,
        button: item.button ? {
          description: item.button.description || "Ver mais",
          link: hasDirectLink ? item.button.link : undefined,
          documentId: hasNoticia ? item.button.noticia?.documentId : item.button.page?.documentId,
          layout: hasPage ? item.button.page?.layout : null,
          isNoticia: hasNoticia,
        } : undefined,
      };

      return result;
    });
  };

  // Mapear seções conhecidas (mantém compatibilidade)
  const produtosSection = homeData.sessions?.find((s: any) => s.layout === "Produtos");
  const novidadesSection = homeData.sessions?.find((s: any) => s.layout === "Novidades");
  const destaquesSection = homeData.sessions?.find((s: any) => s.layout === "Destaques");
  
  // Mapear produtos - usar dados diretos da API
  const servicosWithDetails = (produtosSection?.itens || []).map((item: any) => {
    return {
      id: item.id,
      title: item.title || item.button?.page?.title || "Produto", // Título direto do item
      description: item.button?.page?.resume || "", // Descrição da página
      icon: item.image_presentation?.url ? [{ url: item.image_presentation.url }] : [],
      documentId: item.button?.page?.documentId || null,
      layout: item.button?.page?.layout || null,
    };
  });

  // Mapear novidades - verificar se é notícia ou página
  const novidadesWithDetails = (novidadesSection?.itens || []).map((item: any) => {
    const hasNoticia = !!item.button?.noticia;
    const hasPage = !!item.button?.page;
    
    // Extrair descrição
    let descricao = '';
    if (hasNoticia) {
      descricao = item.button.noticia.description?.[0]?.children?.[0]?.text || '';
    } else if (hasPage) {
      descricao = item.button.page.resume || '';
    }
    
    const result = {
      id: item.id,
      titulo: item.title || "Novidade", // Título direto do item
      nome_botao: item.button?.description || "Ver mais",
      imagem: item.image_presentation && item.image_presentation.url ? item.image_presentation : null,
      documentId: hasNoticia ? item.button.noticia.documentId : (hasPage ? item.button.page.documentId : null),
      isNoticia: hasNoticia,
      layout: hasPage ? item.button.page.layout : null,
      descricao: descricao,
    };
    
    return result;
  });

  // Mapear destaques - verificar se é notícia ou página
  const destaquesWithDetails = (destaquesSection?.itens || []).map((item: any) => {
    const hasNoticia = !!item.button?.noticia;
    const hasPage = !!item.button?.page;
    
    // Extrair primeiro parágrafo da descrição
    let paragrafo1 = '';
    if (hasNoticia) {
      paragrafo1 = item.button.noticia.description?.[0]?.children?.[0]?.text || '';
    } else if (hasPage) {
      paragrafo1 = item.button.page.resume || '';
    }
    
    const result = {
      id: item.id,
      titulo: item.title || "Destaque", // Título direto do item
      paragrafo1: paragrafo1, // Descrição do button.noticia ou button.page
      video_url: item.url_video || "", // URL YouTube do item
      imagem_capa: item.image_presentation && item.image_presentation.url ? item.image_presentation : null,
      layout: "default",
      documentId: hasNoticia ? item.button.noticia.documentId : (hasPage ? item.button.page.documentId : null),
      isNoticia: hasNoticia,
      page_layout: hasPage ? item.button.page.layout : null,
      presentation_mode: item.presentation_mode || "left", // ← Campo para controlar posição
    };
    
    return result;
  });

  // Renderizar seções dinamicamente (mantém EXATA ordem da API)
  const renderSections = () => {
    const sections: JSX.Element[] = [];
    const renderedSpecificLayouts = new Map<string, number>(); // Layout -> primeira ocorrência (id)

    homeData.sessions?.forEach((session: any, index: number) => {
      if (!session.isActive) return;

      // Primeira ocorrência de "Novidades" usa componente específico
      if (session.layout === 'Novidades' && !renderedSpecificLayouts.has('Novidades')) {
        renderedSpecificLayouts.set('Novidades', session.id);
        sections.push(
          <NovidadesAlliance
            key={`novidades-${session.id}`}
            destaques={novidadesWithDetails}
            baseImageUrl={STRAPI_URL}
          />
        );
      }
      // Primeira ocorrência de "Destaques" usa componente específico
      else if (session.layout === 'Destaques' && !renderedSpecificLayouts.has('Destaques')) {
        renderedSpecificLayouts.set('Destaques', session.id);
        sections.push(
          <DestaqueAlliance
            key={`destaques-${session.id}`}
            noticias={destaquesWithDetails}
            baseImageUrl={STRAPI_URL}
          />
        );
      }
      // Primeira ocorrência de "Produtos" usa componente específico
      else if (session.layout === 'Produtos' && !renderedSpecificLayouts.has('Produtos')) {
        renderedSpecificLayouts.set('Produtos', session.id);
        sections.push(
          <Service
            key={`produtos-${session.id}`}
            servicos={servicosWithDetails}
            baseImageUrl={STRAPI_URL}
          />
        );
      }
      // Qualquer outra seção (duplicata ou layout desconhecido) usa DynamicSection
      else {
        const dynamicItems = mapDynamicSectionItems(session.itens || []);

        sections.push(
          <DynamicSection
            key={`dynamic-${session.id}`}
            title={session.title}
            items={dynamicItems}
            baseImageUrl={STRAPI_URL}
            layout={session.layout}
          />
        );
      }
    });

    return sections;
  };

  return (
    <div className="">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <Banner banners={bannersWithDetails} baseImageUrl={STRAPI_URL} />
        {renderSections()}
        <Depoiments testemunhos={[]} baseImageUrl={STRAPI_URL} />
        {/* <ButtonHelp /> */}
        <FloatingButtons />
      </main>
      <SessionRefresher />
    </div>
  );
}
