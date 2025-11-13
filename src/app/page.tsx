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
  console.log("🔵 Banners fetching from:", url);
  
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
    next: { revalidate: 60 },
  });
  
  if (!res.ok) {
    console.error("❌ Banners fetch error:", res.status, res.statusText);
    return [];
  }
  
  const json = await res.json();
  console.log("🔵 Banners data received:", JSON.stringify(json.data, null, 2));
  return json.data || [];
}

async function fetchHomePageData(): Promise<any> {
  // URL exata fornecida pelo usuário
  const url = `${STRAPI_URL}/api/home-page?populate[sessions][populate][0]=itens&populate[sessions][populate][itens][populate][1]=button&populate[sessions][populate][itens][populate][2]=image_presentation&populate[sessions][populate][itens][populate][3]=video_presentation&populate[sessions][populate][itens][populate][4]=button.page&populate[sessions][populate][itens][populate][5]=button.noticia`;
  
  console.log("🔵 HomePage fetching from:", url);
  
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
    next: { revalidate: 60 },
  });
  
  if (!res.ok) {
    console.error("❌ HomePage fetch error:", res.status, res.statusText);
    return null;
  }
  
  const json = await res.json();
  console.log("🔵 HomePage data received:", JSON.stringify(json.data, null, 2));
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

      console.log('🔵 Mapeando item dinâmico:', {
        id: result.id,
        title: result.title,
        tem_imagem: !!result.image,
        tem_video: !!result.video,
        tem_button: !!result.button,
        presentation_mode: result.presentation_mode,
        documentId: result.button?.documentId || 'null',
        direct_link: result.button?.link || 'null'
      });

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
    
    console.log('🔵 Processando Novidade:', {
      id: item.id,
      titulo_item: item.title,
      botao: item.button?.description,
      hasNoticia,
      hasPage,
      descricao: descricao ? descricao.substring(0, 50) + '...' : '(vazio)',
      documentId: hasNoticia ? item.button.noticia.documentId : (hasPage ? item.button.page.documentId : null)
    });
    
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
    
    console.log('🔵 Novidade mapeada:', {
      id: result.id,
      tem_imagem: !!result.imagem,
      imagem_url: result.imagem?.url || 'null'
    });
    
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
    
    console.log('🔵 Processando Destaque:', {
      id: item.id,
      titulo_item: item.title,
      presentation_mode: item.presentation_mode,
      hasNoticia,
      hasPage,
      button_noticia_completo: item.button?.noticia ? 'SIM' : 'NÃO',
      noticia_documentId: item.button?.noticia?.documentId || 'null',
      paragrafo1: paragrafo1 ? paragrafo1.substring(0, 50) + '...' : '(vazio)',
      video_url: item.url_video,
      documentId: hasNoticia ? item.button.noticia.documentId : (hasPage ? item.button.page.documentId : null)
    });
    
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
    
    console.log('🔵 Destaque mapeado:', {
      id: result.id,
      tem_imagem: !!result.imagem_capa,
      imagem_url: result.imagem_capa?.url || 'null',
      tem_video: !!result.video_url,
      presentation_mode: result.presentation_mode
    });
    
    return result;
  });

  // Renderizar seções dinamicamente (mantém EXATA ordem da API)
  const renderSections = () => {
    const sections: JSX.Element[] = [];
    const renderedSpecificLayouts = new Map<string, number>(); // Layout -> primeira ocorrência (id)

    homeData.sessions?.forEach((session: any, index: number) => {
      if (!session.isActive) return;

      console.log(`🔵 Processando seção ${index + 1}:`, {
        id: session.id,
        title: session.title,
        layout: session.layout,
        ordem_api: index + 1
      });

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
        console.log('✅ Renderizado: NovidadesAlliance (componente específico)');
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
        console.log('✅ Renderizado: DestaqueAlliance (componente específico)');
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
        console.log('✅ Renderizado: Service (componente específico)');
      }
      // Qualquer outra seção (duplicata ou layout desconhecido) usa DynamicSection
      else {
        const dynamicItems = mapDynamicSectionItems(session.itens || []);
        
        console.log('✅ Renderizado: DynamicSection', {
          title: session.title,
          layout: session.layout,
          items: dynamicItems.length,
          is_duplicate: renderedSpecificLayouts.has(session.layout)
        });

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

    console.log(`🔵 Total de seções renderizadas: ${sections.length}`);
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
