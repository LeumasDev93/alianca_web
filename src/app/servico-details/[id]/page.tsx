/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { APIResponse } from "@/components/TopicsAlianca";
import { apiAlianca, BASE_IMAGE_URL } from "@/data/service/axios";
import Image from "next/image";
import { LoadingSpinner } from "@/components/Loading";
import Link from "next/link";
import ButtonHelp from "@/components/buttonHelp";
import ErrorFallback from "@/components/ErrorFallback";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { ImagemProfile } from "@/types/typesData";
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

interface ServicoImage {
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

interface Paragrafo {
  id: number;
  documentId: string;
  titulo: string;
  texto: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
}

interface ServicoDataDetailhes {
  id: number;
  titulo: string;
  descricao: string | null;
  descricao_2: string;
  createdAt: string;
  subTitle: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  icon: ServicoImage;
  servico: {
    id: number;
    documentId: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
  banner_imagem: ServicoImage[];
  paragrafos: Paragrafo[];
  imagem_1: ServicoImage[];
}

interface RichTextParagraphProps {
  paragrafos: Paragrafo[];
}
interface Topico {
  id: number;
  documentId: string;
  title: string;
  descricao: string;
  icon: ImagemProfile[];
}

const TopicoCard = ({ topico }: { topico: Topico }) => {
  const router = useRouter();
  const [loadingButtons, setLoadingButtons] = useState<{
    [key: number]: boolean;
  }>({});

  const handleNoticiaClick = (id: number) => {
    setLoadingButtons((prev) => ({ ...prev, [id]: true }));

    setTimeout(() => {
      router.push(`/servico-details/${id}`);
      setLoadingButtons((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

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
          <div className="relative w-12 h-10 flex-shrink-0 px-2">
            {topico.icon && (
              <Image
                src={`${BASE_IMAGE_URL}${topico.icon[0].url}`}
                alt={topico.title || "servico sem título"}
                className="w-full h-full"
                width={100}
                height={100}
              />
            )}
          </div>
          <div className="p-2 flex-1">
            <h3 className="text-sm font-bold text-blue-950 line-clamp-2 mb-1">
              {topico.title}
            </h3>
            <p className="text-sm text-black font-serif">{topico.descricao}</p>
          </div>
        </>
      )}
    </Link>
  );
};
const ServicoSection = ({
  item,
  topicos,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
  loading,
}: {
  item: ServicoDataDetailhes;
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

      <section className="py-4 md:py-8 px-4 md:px-10">
        <div className="flex flex-col md:flex-row ">
          <div className="w-full md:w-[80%] md:border-r md:border-gray-300 md:pr-6">
            {item.paragrafos && (
              <>
                <div className="w-full flex flex-col md:items-left ">
                  <p className="text-justify font-sans md:text-2xl text-gray-700 border-l-4 border-l-red-900 pl-4">
                    {(() => {
                      const words = item.paragrafos[0]?.titulo.split(" ");
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
                {item.paragrafos?.map((paragrafo) => (
                  <div
                    key={paragrafo.id}
                    className="w-full flex flex-col md:items-left mt-10 px-5 md:px-10"
                  >
                    <div className="text-justify font-sans md:text-lg text-gray-700">
                      <MarkdownRenderer
                        key={paragrafo.id}
                        content={paragrafo.texto}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-center w-full sm:w-[30%] lg:w-[40%]">
                {item.imagem_1?.map((image, index) => (
                  <Image
                    key={index}
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
                ))}

                {item?.descricao_2 && (
                  <div className="w-full px-5 md:px-10 mt-4">
                    <p className="text-justify font-sans text-sm text-gray-700">
                      {item.descricao_2}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-full md:w-2/6 mt-10 md:pl-6">
            <h2 className="text-lg md:text-xl font-bold text-blue-950 mb-6">
              Outros Serviços
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
                    className="flex justify-center items-center px-4 py-2 bg-[#002256] text-white rounded-lg hover:bg-[#060c14] disabled:bg-[#2f415c] transition-colors"
                  >
                    <FaChevronLeft size={20} />
                    <span className="text-sm">Anterior</span>
                  </button>
                  <button
                    onClick={onNext}
                    disabled={!hasNext || loading}
                    className="flex justify-center items-center px-4 py-2 bg-[#002256] text-white rounded-lg hover:bg-[#060c14] disabled:bg-[#2f415c] transition-colors"
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

export default function NoticiasDetails() {
  const params = useParams();
  const id = params.id;
  const [card, setCard] = useState<ServicoDataDetailhes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [topicos, setTopicos] = useState<Topico[]>([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDatas = async () => {
    setIsLoading(true);
    try {
      const response = await apiAlianca.get<APIResponse<ServicoDataDetailhes>>(
        `/detalhes-servicos?filters[servico][id][$eq]=${id}&populate=*`
      );
      setCard(response.data.data);
      console.log(response.data.data, "dados");
    } catch (error) {
      setError("Erro ao carregar dados. Tente novamente mais tarde.");
      //console.error("Error fetching destaques:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTopicos = async (page: number) => {
    setLoading(true);
    try {
      const response = await apiAlianca.get<{ data: Topico[] }>(
        `/servicos?populate=*&pagination[page]=${page}&pagination[pageSize]=4&filters[id][$ne]=${id}`
      );
      if (response.data.data.length > 0) {
        setTopicos(response.data.data);
        setHasNext(response.data.data.length === 4);
        setHasPrevious(page > 1);
      } else {
        setHasNext(false);
      }
    } catch (error) {
      //console.error("Erro ao carregar tópicos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDatas();
      fetchTopicos(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleNext = () => {
    const nextPage = page + 1;
    fetchTopicos(nextPage);
    setPage(nextPage);
  };

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
          <ErrorFallback error={error} resetErrorBoundary={() => window.location.reload()} />
        ) : card.length === 0 ? (
          <ErrorFallback error="Nenhum dado encontrado." resetErrorBoundary={() => window.location.reload()} />
        ) : (
          <div className="flex flex-col items-center justify-center w-full">
            {card.map((item) => (
              <ServicoSection
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
