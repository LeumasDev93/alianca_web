/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { APIResponse } from "@/components/TopicsAlianca";
import { apiAlianca, BASE_IMAGE_URL } from "@/data/service/axios";
import { LoadingSpinner } from "@/components/Loading";
import Link from "next/link";
import { ErrorMessage } from "@/components/ErroMessage";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ButtonHelp from "@/components/buttonHelp";
import ButtonContact from "@/components/buttonContact";
import ButtonSimulate from "@/components/buttonSimulate";
import { LiaSpinnerSolid } from "react-icons/lia";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { MarkdownRenderer } from "@/lib/markdown";

interface ImageFormat {
  url: string;
  width: number;
  height: number;
  size: number;
  sizeInBytes: number;
}

interface NoticiaImage {
  id: number;
  url: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail: ImageFormat;
    large?: ImageFormat;
    medium?: ImageFormat;
    small: ImageFormat;
  };
}

interface NoticiasDataDetailhes {
  id: number;
  titulo: string;
  descricao: string;
  citacao: string;
  subTitle: string;
  paragrafo_1: string;
  imagem_1?: NoticiaImage[];
  banner_imagem?: NoticiaImage[];
  servico?: {
    titulo: string;
    description: string;
    url_botton: string;
  };
  paragrafo?: {
    id: number;
    documentId: string;
    titulo: string;
    texto: string;
  };
}

interface Topico {
  id: number;
  documentId: string;
  titulo: string;
  subtitulo: string | null;
  descricao: string | null;
  nome_botao: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  imagem_capa: {
    id: number;
    documentId: string;
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number;
    height: number;
    formats: {
      thumbnail: ImageFormat;
      small: ImageFormat;
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
  };
}

const TopicoCard = ({ topico }: { topico: Topico }) => {
  const router = useRouter();

  const [loadingButtons, setLoadingButtons] = useState<{
    [key: number]: boolean;
  }>({});

  const handleNoticiaClick = (id: number) => {
    setLoadingButtons((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      router.push(`/noticia-details/${id}`);
      setLoadingButtons((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const imageUrl = topico.imagem_capa?.formats?.small?.url
    ? `${BASE_IMAGE_URL}${topico.imagem_capa.formats.small.url}`
    : "https://via.placeholder.com/300x200";

  return (
    <Link
      href=""
      onClick={(e) => {
        e.preventDefault();
        handleNoticiaClick(topico.id);
      }}
      className={`flex items-center ${
        loadingButtons ? "justify-center" : ""
      } bg-white hover:bg-slate-300 rounded-lg shadow-md overflow-hidden md:w-auto h-16 transition-colors duration-200`}
    >
      {loadingButtons[topico.id] ? (
        <LiaSpinnerSolid className="animate-spin mr-2 text-[#002256] text-xl" />
      ) : (
        <>
          <div className="relative w-16 h-full flex-shrink-0">
            <Image
              src={imageUrl}
              alt={topico.titulo}
              width={100}
              height={100}
              quality={100}
              priority
              className="h-full w-full object-cover"
            />
          </div>
          <div className="p-2 flex-1">
            <h3 className="text-sm font-semibold text-blue-950 line-clamp-2">
              {topico.titulo}
            </h3>
            <p className="text-sm text-black font-serif line-clamp-2 overflow-hidden text-ellipsis">
              {topico.subtitulo}
            </p>
          </div>
        </>
      )}
    </Link>
  );
};

const NoticiaSection = ({
  item,
  topicos,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
  loading,
}: {
  item: NoticiasDataDetailhes;
  topicos: Topico[];
  onNext: () => void;
  onPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
  loading: boolean;
}) => {
  return (
    <div key={item.id} className="w-full">
      <section
        className="relative w-full h-[30vh] md:h-[50vh] mt-14 md:mt-24 flex items-center justify-center"
        style={{
          backgroundImage:
            item.banner_imagem && item.banner_imagem.length > 0
              ? `url(${BASE_IMAGE_URL}${item.banner_imagem[0].url})`
              : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

        <div className="relative z-10 text-center px-4">
          <h1 className="text-2xl md:text-5xl font-bold text-white drop-shadow-lg">
            {item.titulo}
          </h1>
          <span className="text-white text.xs sm:text-sm">{item.subTitle}</span>
        </div>
      </section>

      <section className="py-4 md:py-8 px-4 md:px-10 md:mb-10">
        <div className="flex flex-col md:flex-row ">
          <div className="w-full md:w-[80%] md:border-r md:border-gray-300 md:pr-6">
            {item.paragrafo && (
              <>
                <div className="w-full flex flex-col md:items-left ">
                  <p className="text-justify font-sans md:text-2xl text-gray-700 border-l-4 border-l-red-900 pl-4">
                    {(() => {
                      const words = item.paragrafo?.titulo.split(" ");
                      const lastTwo = words?.splice(-2).join(" ");
                      return (
                        <>
                          {words?.join(" ")} <strong>{lastTwo}</strong>
                        </>
                      );
                    })()}
                  </p>
                </div>
                {item.descricao && (
                  <div className="w-full flex flex-col md:items-left ">
                    <p className="text-justify font-sans text-sm xl:text-lg text-gray-700 mt-5">
                      {item?.descricao}
                    </p>
                  </div>
                )}
              </>
            )}

            <div className="flex md:flex-row flex-col md:space-x-10 mt-10">
              <div className="flex flex-col w-full sm:w-[70%] lg:w-[60%] bg-white rounded-xl shadow-xl">
                {item.paragrafo && (
                  <div
                    key={item.paragrafo.id}
                    className="w-full flex flex-col md:items-left mt-10 px-5 md:px-10"
                  >
                    <div className="text-justify font-sans md:text-lg text-gray-700">
                      <MarkdownRenderer
                        key={item.paragrafo.id}
                        content={item.paragrafo.texto}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center w-full sm:w-[30%] lg:w-[40%]">
                {item.imagem_1?.map((image, index) => (
                  <div key={index} className="flex justify-center">
                    <Image
                      src={`${BASE_IMAGE_URL}${image.url}`}
                      alt={image.alternativeText || "Imagem"}
                      className="rounded-lg object-cover w-full h-auto max-h-[600px]"
                      width={800}
                      height={600}
                      quality={100}
                      layout="responsive"
                      priority
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,..."
                      onError={(e) => {
                        console.error("Erro ao carregar a imagem:", e);
                        e.currentTarget.src =
                          "https://via.placeholder.com/600x400";
                      }}
                    />
                  </div>
                ))}

                {item?.citacao && (
                  <div className="w-full px-5 md:px-10 mt-4">
                    <p className="text-justify italic font-sans text-sm text-gray-700">
                      {item.citacao}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-full md:w-2/6 mt-10 md:pl-6">
            <h2 className="text-lg md:text-xl font-bold text-blue-950 mb-6">
              Tópicos Relacionados
            </h2>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-6">
                {topicos
                  .filter((topico) => topico.id !== item.id)
                  .map((topico) => (
                    <TopicoCard key={topico.id} topico={topico} />
                  ))}
              </div>
              {(hasNext || hasPrevious) && (
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    onClick={onPrevious}
                    disabled={!hasPrevious || loading}
                    className="flex justify-center items-center px-4 py-2 bg-[#002256] text-white rounded-lg hover:bg-[#060c14] disabled:bg-[#2f415c]"
                  >
                    <FaChevronLeft size={20} />
                    <span className="text-sm">Anterior</span>
                  </button>
                  <button
                    onClick={onNext}
                    disabled={!hasNext || loading}
                    className="flex justify-center items-center px-4 py-2 bg-[#002256] text-white rounded-lg hover:bg-[#060c14] disabled:bg-[#2f415c]"
                  >
                    <span className="text-sm">Próximo</span>
                    <FaChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default function NoticiaDetails() {
  const params = useParams();
  const id = params.id;
  const [card, setCard] = useState<NoticiasDataDetailhes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [topicos, setTopicos] = useState<Topico[]>([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função para carregar os detalhes da notícia
  const fetchDatas = async () => {
    setIsLoading(true);
    try {
      const response = await apiAlianca.get<APIResponse<NoticiasDataDetailhes>>(
        `/detalhes-noticias?filters[noticia][id][$eq]=${id}&populate=*`
      );
      setCard(response.data.data);
    } catch (error) {
      setError("Erro ao carregar dados. Tente novamente mais tarde.");
      //console.error("Error fetching destaques:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para carregar tópicos
  const fetchTopicos = async (page: number) => {
    setLoading(true);
    try {
      const response = await apiAlianca.get<{ data: Topico[] }>(
        `/noticias?populate=*&pagination[page]=${page}&pagination[pageSize]=4&filters[id][$ne]=${id}`
      );
      if (response.data.data.length > 0) {
        setTopicos(response.data.data);
        setHasNext(response.data.data.length === 4);
        setHasPrevious(page > 1);
      } else {
        setHasNext(false);
      }
    } catch (error) {
      // console.error("Erro ao carregar tópicos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Carrega os dados iniciais
  useEffect(() => {
    if (id) {
      fetchDatas();
      fetchTopicos(1);
    }
  }, [id]);

  // Função para carregar a próxima página
  const handleNext = () => {
    const nextPage = page + 1;
    fetchTopicos(nextPage);
    setPage(nextPage);
  };

  // Função para carregar a página anterior
  const handlePrevious = () => {
    const previousPage = page - 1;
    fetchTopicos(previousPage);
    setPage(previousPage);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <ButtonHelp />
      <main className="flex-grow flex flex-col items-center">
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage error={error} />
        ) : card.length === 0 ? (
          <ErrorMessage error="Nenhum dado encontrado." />
        ) : (
          <div className="flex flex-col items-center justify-center w-full">
            {card.map((item) => (
              <NoticiaSection
                key={item.id}
                item={item}
                topicos={topicos}
                onNext={handleNext}
                onPrevious={handlePrevious}
                hasNext={hasNext}
                hasPrevious={hasPrevious}
                loading={loading}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
