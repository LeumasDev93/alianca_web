"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Logotipo from "@/assets/images/alianca.png";
import Link from "next/link";
import { apiAlianca, BASE_IMAGE_URL } from "@/data/service/axios";
import { LiaSpinnerSolid } from "react-icons/lia";
import { LoadingSpinner } from "./Loading";
import { ErrorMessage } from "./ErroMessage";

interface ImagemCapa {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail: {
      name: string;
      hash: string;
      ext: string;
      mime: string;
      path: string | null;
      width: number;
      height: number;
      size: number;
      sizeInBytes: number;
      url: string;
    };
    small?: {
      name: string;
      hash: string;
      ext: string;
      mime: string;
      path: string | null;
      width: number;
      height: number;
      size: number;
      sizeInBytes: number;
      url: string;
    };
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}
interface ImagemColab {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail: {
      name: string;
      hash: string;
      ext: string;
      mime: string;
      path: string | null;
      width: number;
      height: number;
      size: number;
      sizeInBytes: number;
      url: string;
    };
    small?: {
      name: string;
      hash: string;
      ext: string;
      mime: string;
      path: string | null;
      width: number;
      height: number;
      size: number;
      sizeInBytes: number;
      url: string;
    };
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}
interface ImagemBanner {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail: {
      name: string;
      hash: string;
      ext: string;
      mime: string;
      path: string | null;
      width: number;
      height: number;
      size: number;
      sizeInBytes: number;
      url: string;
    };
    small?: {
      name: string;
      hash: string;
      ext: string;
      mime: string;
      path: string | null;
      width: number;
      height: number;
      size: number;
      sizeInBytes: number;
      url: string;
    };
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export type TopicosAliancaData = {
  id: number;
  documentId: string;
  titulo: string;
  botao_text: string;
  botao_link: string;
  paragrafo1: string;
  paragrafo2: string;
  slug: string;
  type_section: string;
  detalhes: string;
  cargo_colab: string;
  nome_colab: string;
  bio_colaborator: string;
  publicado_em: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  imagem_capa: ImagemCapa[];
  imagem_banner: ImagemBanner[];
  image_Colaborator: ImagemColab[];
  localizations: LocalizationData[];
};

interface LocalizationData {
  id: number;
  locale: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export type APIResponse<T> = {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};
export default function TopicAlianca() {
  const [selectedButtonId, setSelectedButtonId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topics, setTopics] = useState<TopicosAliancaData[]>([]);
  const [loadingButtons, setLoadingButtons] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await apiAlianca.get<APIResponse<TopicosAliancaData>>(
          "/topicos-aliancas?populate=*"
        );
        setTopics(response.data.data);
      } catch (error) {
        setError("Erro ao carregar dados. Tente novamente mais tarde.");
        console.error("Error fetching destaques:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleButtonClick = (id: number) => {
    setLoadingButtons((prev) => ({ ...prev, [id]: true })); 

    setTimeout(() => {
      setSelectedButtonId(id);
      setLoadingButtons((prev) => ({ ...prev, [id]: false })); 
    }, 2000); 
  };
  
  const createSlug = (title: string): string => {
    return title
      .toLowerCase() // Converte para minúsculas
      .normalize("NFD") // Remove acentos (normaliza caracteres Unicode)
      .replace(/[\u0300-\u036f]/g, "") // Remove diacríticos (acentos, cedilhas, etc.)
      .replace(/ /g, "-") // Substitui espaços por hífens
      .replace(/[^\w-]+/g, "") // Remove caracteres não alfanuméricos, exceto hífens
      .replace(/^-+/, "") // Remove hífens no início
      .replace(/-+$/, ""); // Remove hífens no final
  };

  return (
    <div className="flex flex-col items-center justify-center md:my-28 w-full py-10 bg-[#F4F2F2]">
      {/* Título */}
      <h1 className="md:text-3xl text-xl font-bold mt-14 mb-8 md:mt-0 text-center text-[#002256]">
        A Aliança
      </h1>

     {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage error={error} />
      ) : topics.length === 0 ? (
        <ErrorMessage error="Nenhum dado encontrado." />
      ) : (
      <div className="flex flex-wrap justify-center items-center gap-8 w-full max-w-6xl px-4">
        {topics.map((card) => {
          console.log(card.imagem_capa[0].url);
          return (
            <div
              key={card.id}
              className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center text-center w-full md:w-64 h-full min-h-[420px]"
            >
            {/* Imagem - Container com altura fixa */}
            <div className="relative w-full h-40 md:h-60 min-h-[160px]">
              <Image
                src={`${BASE_IMAGE_URL}${card.imagem_capa[0].url}`}
                alt={card.titulo || "Produto sem título"}
                fill
                quality={100}
                className="rounded-xl object-cover"
              />
              <div className="absolute -bottom-4 left-0 right-0 flex justify-center">
                <div className="w-8 h-8 bg-white rounded-full p-0.5">
                  <Image
                    src={Logotipo}
                    alt="Logotipo da Aliança"
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>
          
            {/* Título - Com altura mínima fixa */}
            <div className="mt-6 w-full min-h-[60px] flex items-center justify-center">
              <h2 className="text-[#002256] md:text-lg font-semibold leading-tight px-2">
                {card.titulo}
              </h2>
            </div>
          
              <Link
                href={{
                  pathname: `/alianca-details/${createSlug(card.slug)}`, 
                  query: { id: card.id }, 
                }}
                className={`mt-4 mb-5 py-2 px-6 font-bold rounded transition-colors flex items-center justify-center ${
                  selectedButtonId === card.id
                    ? "bg-[#002256] text-white"
                    : "bg-white text-[#002256] border border-[#002256] hover:bg-[#002256] hover:text-white"
                }`}
                aria-pressed={selectedButtonId === card.id}
                onClick={() => handleButtonClick(card.id)}
              >
                {loadingButtons[card.id] ? ( 
                  <LiaSpinnerSolid className="animate-spin mr-2" />
                ) : null}
                {card.botao_text || "Clique aqui"}
              </Link>
          </div>
          );
        })}
      </div>
      )}
    </div>
  );
}
