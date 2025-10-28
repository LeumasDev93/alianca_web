/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
// Header and Footer are provided by the root layout
import { LoadingSpinner } from "@/components/Loading";
import Link from "next/link";
import { ErrorMessage } from "@/components/ErroMessage";
import ButtonHelp from "@/components/buttonHelp";
import FloatingButtons from "@/components/FloatingButtons";
import { apiAlianca, BASE_IMAGE_URL } from "@/data/service/axios";
import { FaChevronLeft, FaChevronRight, FaImage } from "react-icons/fa";
import { LiaSpinnerSolid } from "react-icons/lia";
import ImageDefault from "@/assets/images/default-image.jpg";
import { MarkdownRenderer } from "@/lib/markdown";

interface ImageCapa {
  id: number;
  documentId: string;
  name: string;
  url: string;
}

interface Paragrafo {
  id: number;
  titulo: string;
  texto: string;
  image_capa: ImageCapa[];
}

interface ImageFormat {
  url: string;
  width: number;
  height: number;
  size: number;
  sizeInBytes: number;
}

interface BannerImage {
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

interface Artigo {
  id: number;
  titulo: string;
  descricao: string;
  descricao_2: string;
  subTitle: string;
  banner_img: BannerImage;
  paragrafos: Paragrafo[];
  imagem_1: BannerImage;
}

interface ArtigoAPIResponse {
  data: Artigo[];
  meta?: any;
}

interface Topico {
  id: number;
  nome: string;
  descricao: string;
  imagen_capa: BannerImage[];
  order: number;
}

const TopicoCard = ({ topico }: { topico: Topico }) => {
  const router = useRouter();

  const [loadingButtons, setLoadingButtons] = useState<{
    [key: number]: boolean;
  }>({});

  const handleNoticiaClick = (id: number) => {
    setLoadingButtons((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      router.push(`/details-submenus/${id}`);
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
          {topico.imagen_capa ? (
            <div className="relative w-16 h-full flex-shrink-0">
              <Image
                src={`${BASE_IMAGE_URL}${topico.imagen_capa[0].url}`}
                alt={topico.nome}
                width={100}
                height={100}
                quality={100}
                priority
                onError={(e) => {
                  console.error("Erro ao carregar a imagem:", e);
                  e.currentTarget.src = "https://via.placeholder.com/300x200";
                }}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="relative w-16 h-full flex-shrink-0">
              <Image
                src={ImageDefault}
                alt="Imagem padrão"
                width={100}
                height={100}
                quality={100}
                priority
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div className="p-2 flex-1">
            <h3 className="text-sm font-bold text-blue-950 line-clamp-2 mb-1">
              {topico.nome}
            </h3>
            <p className="text-sm text-black font-serif line-clamp-2 overflow-hidden text-ellipsis">
              {topico.descricao}
            </p>
          </div>
        </>
      )}
    </Link>
  );
};

const ArtigoSection = ({
  artigo,
  topicosRelacionados,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
  loading,
}: {
  artigo: Artigo;
  topicosRelacionados: Topico[];
  onNext: () => void;
  onPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
  loading: boolean;
}) => {
  const router = useRouter();

  function handleAbout() {
    router.push("");
  }

  return (
    <div key={artigo.id} className="w-full">
      <section
        className="relative w-full h-[30vh] md:h-[50vh] mt-14 md:mt-24 flex items-center justify-center"
        style={{
          backgroundImage: artigo.banner_img
            ? `url(${BASE_IMAGE_URL}${artigo.banner_img.url})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

        <div className="relative z-10 text-center px-4">
          <h1 className="text-2xl md:text-5xl font-bold text-white drop-shadow-lg">
            {artigo.titulo}
          </h1>
          <span>{artigo.subTitle}</span>
        </div>
      </section>

      <section className="py-4 md:py-8 px-4 md:px-10 mb-20">
        <div className="flex flex-col md:flex-row md:mt-10">
          <div className="w-full md:w-[80%] md:border-r md:border-red-900 md:pr-6">
            {artigo.descricao && (
              <div className="w-full flex flex-col md:items-left ">
                <p className="text-justify font-sans md:text-2xl text-gray-700 border-l-4 border-l-red-900 pl-4">
                  {artigo.descricao}
                </p>
                <p className="text-justify font-sans text-sm md:text-lg text-gray-700">
                  {artigo.descricao_2}
                </p>
              </div>
            )}
            <div className="flex md:flex-row flex-col md:space-x-10 md:mt-10 items-start">
              {artigo.paragrafos?.map((paragrafo) => (
                <button
                  onClick={handleAbout}
                  key={paragrafo.id}
                  className="group bg-white w-full md:w-[450px] rounded-lg shadow-lg mb-6 transition-all duration-300 hover:shadow-2xl hover:border-b-4 hover:border-b-red-900 flex flex-col"
                >
                  {/* Imagem */}
                  {paragrafo.image_capa?.map((image) => (
                    <div key={image.id}>
                      <Image
                        src={`${BASE_IMAGE_URL}${image.url}`}
                        alt="Imagem do parágrafo"
                        width={800}
                        height={450}
                        className="w-full rounded-t-lg"
                      />
                    </div>
                  ))}

                  {/* Texto */}
                  <div className="text-justify font-sans md:text-lg text-gray-700 px-5 py-4">
                    <MarkdownRenderer
                      key={paragrafo.id}
                      content={paragrafo.texto}
                    />
                  </div>

                  {/* Ícone */}
                  <div className="p-4 flex justify-start">
                    <FaChevronRight
                      size={20}
                      className="text-blue-950 transition-transform duration-300 group-hover:translate-x-2"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="w-full md:w-2/6 mt-10 md:pl-6">
            <h2 className="text-lg md:text-xl font-bold text-blue-950 mb-6">
              Tópicos Relacionados
            </h2>

            <div className="flex flex-col gap-6">
              {topicosRelacionados.map((topico) => (
                <TopicoCard key={topico.id} topico={topico} />
              ))}
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
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default function AliancaAboutUsDetails() {
  const params = useParams();
  const id = params.id;
  const [artigo, setArtigo] = useState<Artigo | null>(null);
  const [topicosRelacionados, setTopicosRelacionados] = useState<Topico[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const artigoResponse = await apiAlianca.get<ArtigoAPIResponse>(
          `/detalhes-submenus?filters[submenu][id][$eq]=${id}&populate[paragrafos][populate]=image_capa&populate=banner_img`
        );

        if (artigoResponse.data.data?.length > 0) {
          setArtigo(artigoResponse.data.data[0]);
        } else {
          setError("Nenhum dado encontrado.");
        }
      } catch (error) {
        setError("Erro ao carregar artigo. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchTopicos = async (page: number) => {
    setLoading(true);
    try {
      const response = await apiAlianca.get<{ data: Topico[] }>(
        `/submenus?populate=*&pagination[page]=${page}&pagination[pageSize]=8`
      );
      if (response.data.data.length > 0) {
        const sortedMenus = [...response.data.data].sort(
          (a, b) => a.order - b.order
        );
        setTopicosRelacionados(sortedMenus);
        setHasNext(response.data.data.length === 8);
        setHasPrevious(page > 1);
      } else {
        setHasNext(false);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopicos(1);
  }, []);

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
      {/* Header provided by layout */}
      <ButtonHelp />
      <FloatingButtons />
      <main className="flex-grow flex flex-col items-center">
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage error={error} />
        ) : !artigo ? (
          <ErrorMessage error="Nenhum dado encontrado." />
        ) : (
          <div className="flex flex-col items-center justify-center w-full">
            <ArtigoSection
              artigo={artigo}
              topicosRelacionados={topicosRelacionados}
              onNext={handleNext}
              onPrevious={handlePrevious}
              hasNext={hasNext}
              hasPrevious={hasPrevious}
              loading={loading}
            />
          </div>
        )}
      </main>
      {/* Footer provided by layout */}
    </div>
  );
}
