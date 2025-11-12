/* eslint-disable @typescript-eslint/no-explicit-any */
export const revalidate = 60;

import Banner from "@/components/banner/banner";
import ButtonHelp from "@/components/buttonHelp";
import FloatingButtons from "@/components/FloatingButtons";
import Depoiments from "@/components/depoiments";
import FeaturedAlliance from "@/components/FeaturedAlliance";
import NewsAlliance from "@/components/newsAlliance";
import { Service } from "@/components/services";
import SessionRefresher from "../components/SessionRefresher";
import { STRAPI_URL, STRAPI_TOKEN } from "@/data/service/axios";

async function fetchPageDetails(documentId: string): Promise<any> {
  const url = `${STRAPI_URL}/api/pages/${documentId}?populate[banner][fields]=title,description&populate[fields]=resume`;
  console.log("🔵 Fetching page details:", url);
  
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
    next: { revalidate: 60 },
  });
  
  if (!res.ok) {
    console.error("❌ Page details fetch error:", res.status, res.statusText);
    return null;
  }
  
  const json = await res.json();
  return json.data;
}

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
  const url = `${STRAPI_URL}/api/home-page?populate[sessions][populate][0]=itens&populate[sessions][populate][itens][populate][1]=button&populate[sessions][populate][itens][populate][2]=image_presentation&populate[sessions][populate][itens][populate][3]=video_presentation&populate[sessions][populate][itens][populate][4]=page`;
  
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
    next: { revalidate: 60 },
  });
  
  if (!res.ok) {
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

  // Mapear banners da nova API - buscar detalhes da página
  const bannersWithDetails = await Promise.all(
    bannersData.map(async (item: any) => {
      const pageDocId = item.banner?.button?.page?.documentId;
      let pageDetails = null;
      
      if (pageDocId) {
        pageDetails = await fetchPageDetails(pageDocId);
      }
      
      return {
        id: item.id,
        category: pageDetails?.resume || item.banner?.button?.page?.resume || "",
        titulo: pageDetails?.banner?.title || item.banner?.title || "",
        description: pageDetails?.banner?.description || item.banner?.description || "",
        banner_img: item.banner?.image || null,
        banner_video: item.banner?.video || null,
        url_botton: item.banner?.button?.link || "#",
        order: 0,
      };
    })
  );

  // Mapear seções da nova API
  const produtosSection = homeData.sessions?.find((s: any) => s.layout === "Produtos");
  const novidadesSection = homeData.sessions?.find((s: any) => s.layout === "Novidades");
  
  // Mapear produtos - buscar detalhes de cada página
  const servicosWithDetails = await Promise.all(
    (produtosSection?.itens || []).map(async (item: any) => {
      const pageDocId = item.page?.documentId;
      let pageDetails = null;
      
      if (pageDocId) {
        pageDetails = await fetchPageDetails(pageDocId);
      }
      
      return {
        id: item.id,
        title: pageDetails?.banner?.title || item.page?.resume || "Produto",
        description: pageDetails?.banner?.description || "",
        icon: item.image_presentation ? [{ url: item.image_presentation.url }] : [],
      };
    })
  );

  // Mapear notícias - buscar detalhes de cada página
  const noticiasWithDetails = await Promise.all(
    (novidadesSection?.itens || []).map(async (item: any) => {
      const pageDocId = item.page?.documentId;
      let pageDetails = null;
      
      if (pageDocId) {
        pageDetails = await fetchPageDetails(pageDocId);
      }
      
      return {
        id: item.id,
        titulo: pageDetails?.banner?.title || item.page?.resume || "Notícia",
        paragrafo1: pageDetails?.banner?.description || "",
        video_url: item.url_video || "", // URL YouTube (prioritário)
        video_local: item.video_presentation ? `${STRAPI_URL}${item.video_presentation.url}` : null, // Vídeo local
        imagem_capa: item.image_presentation || null,
        layout: "default",
      };
    })
  );

  console.log("🔵 Banners processados:", bannersWithDetails);
  console.log("🔵 Servicos processados:", servicosWithDetails);
  console.log("🔵 Noticias processadas:", noticiasWithDetails);

  return (
    <div className="">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <Banner banners={bannersWithDetails} baseImageUrl={STRAPI_URL} />
        <FeaturedAlliance destaques={[]} baseImageUrl={STRAPI_URL} />
        <NewsAlliance noticias={noticiasWithDetails} baseImageUrl={STRAPI_URL} />
        <Service servicos={servicosWithDetails} baseImageUrl={STRAPI_URL} />
        <Depoiments testemunhos={[]} baseImageUrl={STRAPI_URL} />
        <ButtonHelp />
        <FloatingButtons />
      </main>
      <SessionRefresher />
    </div>
  );
}
