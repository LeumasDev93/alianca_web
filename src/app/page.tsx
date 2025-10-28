/* eslint-disable @typescript-eslint/no-explicit-any */
export const revalidate = 60;

import Banner from "@/components/banner/banner";
import ButtonHelp from "@/components/buttonHelp";
import ButtonSimulate from "@/components/buttonSimulate";
import Depoiments from "@/components/depoiments";
import FeaturedAlliance from "@/components/FeaturedAlliance";
import NewsAlliance from "@/components/newsAlliance";
import { Service } from "@/components/services";
import SessionRefresher from "../components/SessionRefresher";
import { APIResponse } from "@/types/typesData";
import { API_TOKEN_PROD, BASE_IMAGE_URL } from "@/data/service/axios";

type BannerItem = {
  id: number;
  category: string;
  titulo: string;
  description: string;
  banner_img?: { url: string };
  url_botton: string;
  order: number;
};

type DestaqueData = {
  id: number;
  titulo: string;
  nome_botao: string;
  imagem?: { url: string } | null;
};

type NoticiasData = {
  id: number;
  titulo: string;
  paragrafo1: string;
  video_url?: string;
  imagem_capa?: { url: string };
  layout: string;
};

type ServicosDataLocal = {
  id: number;
  title: string;
  icon?: { url: string }[];
};

type TestemunhoDataLocal = any;

async function fetchFromApi<T>(path: string): Promise<T[]> {
  const res = await fetch(`https://gestao.aliancaseguros.cv/api${path}`, {
    headers: {
      Authorization: `Bearer ${API_TOKEN_PROD}`,
    },
    // Ensure ISR caching
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    return [] as T[];
  }
  const json = (await res.json()) as APIResponse<T>;
  return json.data;
}

export default async function Home() {
  const [banners, destaques, noticias, servicos, testemunhos] =
    await Promise.all([
      fetchFromApi<BannerItem>("/banners?populate=*"),
      fetchFromApi<DestaqueData>("/destaques?populate=*"),
      fetchFromApi<NoticiasData>("/noticias?populate=*&sort=order:asc"),
      fetchFromApi<ServicosDataLocal>("/servicos?populate=*&sort=ordem:ASC"),
      fetchFromApi<TestemunhoDataLocal>("/testemunhos?populate=*"),
    ]);

  return (
    <div className="">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <Banner banners={banners} baseImageUrl={BASE_IMAGE_URL} />
        <FeaturedAlliance destaques={destaques} baseImageUrl={BASE_IMAGE_URL} />
        <NewsAlliance noticias={noticias} baseImageUrl={BASE_IMAGE_URL} />
        <Service servicos={servicos} baseImageUrl={BASE_IMAGE_URL} />
        <Depoiments testemunhos={testemunhos} baseImageUrl={BASE_IMAGE_URL} />
        <ButtonHelp />
        <ButtonSimulate />
      </main>
      <SessionRefresher />
    </div>
  );
}
