/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LiaSpinnerSolid } from "react-icons/lia";
import { FaChevronLeft, FaChevronRight, FaNewspaper, FaArrowRight } from "react-icons/fa";

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

interface NoticiasData {
  id: number;
  documentId: string;
  titulo: string;
  subtitulo: string;
  paragrafo1: string;
  paragrafo2: string;
  paragrafo3: string;
  layout: string;
  noticia_id: string;
  publicado_em: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  imagem_capa: ImagemCapa;
  video_url: string;
  order: number;
  localizations: LocalizationData[];
}

interface LocalizationData {
  id: number;
  locale: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

interface NoticiasLight {
  id: number;
  titulo: string;
  paragrafo1: string;
  video_url?: string;
  imagem_capa?: { url: string };
  layout: string;
  documentId?: string;
  page_layout?: string;
  isNoticia?: boolean;
  presentation_mode?: string | null;
}

export default function DestaqueAlliance({
  noticias,
  baseImageUrl,
}: {
  noticias: NoticiasLight[];
  baseImageUrl: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingButtons, setLoadingButtons] = useState<{
    [key: number]: boolean;
  }>({});
  const [error, setError] = useState<string | null>(null);

  const [progress, setProgress] = useState(0);
  const groupSize = 2;
  const totalGroups = Math.ceil(noticias.length / groupSize);

  // Log para debug
  useEffect(() => {
    console.log("🔵 DestaqueAlliance - noticias recebidas:", noticias);
    console.log("🔵 DestaqueAlliance - baseImageUrl:", baseImageUrl);
  }, [noticias, baseImageUrl]);

  const updateProgress = useCallback(() => {
    const newProgress = ((currentIndex + 1) / totalGroups) * 100;
    setProgress(newProgress);
  }, [currentIndex, totalGroups]);

  useEffect(() => {
    if (noticias.length === 0) return;

    updateProgress();
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % totalGroups;
        updateProgress();
        return newIndex;
      });
    }, 9000);
    return () => clearInterval(interval);
  }, [currentIndex, totalGroups, updateProgress, noticias.length]);

  const visibleServices = noticias.slice(
    currentIndex * groupSize,
    currentIndex * groupSize + groupSize
  );

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalGroups - 1 : prevIndex - 1
    );
    setProgress(
      (((currentIndex - 1 + totalGroups) % totalGroups) / totalGroups) * 100
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalGroups);
    setProgress((((currentIndex + 1) % totalGroups) / totalGroups) * 100);
  };

  const handleButtonClick = (noticia: NoticiasLight) => {
    setLoadingButtons((prev) => ({ ...prev, [noticia.id]: true }));

    console.log('🔵 DestaqueAlliance - Click em notícia:', {
      id: noticia.id,
      documentId: noticia.documentId,
      isNoticia: noticia.isNoticia,
      page_layout: noticia.page_layout,
      titulo: noticia.titulo
    });

    setTimeout(() => {
      // Se for notícia, navegar para noticia-detalhes
      if (noticia.isNoticia && noticia.documentId) {
        const url = `/noticia-detalhes/${noticia.documentId}`;
        console.log('✅ Navegando para:', url);
        router.push(url);
      }
      // Se for página, navegar com layout específico
      else if (!noticia.isNoticia && noticia.documentId && noticia.page_layout) {
        const url = `/${noticia.page_layout}/${noticia.documentId}`;
        console.log('✅ Navegando para:', url);
        router.push(url);
      } 
      // Fallback para details-submenus
      else if (noticia.documentId) {
        const url = `/details-submenus/${noticia.documentId}`;
        console.log('✅ Navegando para:', url);
        router.push(url);
      } 
      // Fallback antigo
      else {
        const url = `/noticia-details/${noticia.id}`;
        console.log('⚠️ Usando fallback, navegando para:', url);
        router.push(url);
      }
      setLoadingButtons((prev) => ({ ...prev, [noticia.id]: false }));
    }, 2000);
  };

  const getYouTubeId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  return (
    <div className="flex flex-col items-center w-full h-full p-4 bg-[#F4F2F2] relative">
      <h1 className="md:text-3xl text-xl font-bold text-center mb-4 text-[#002256]">
        Aliança em Destaque
      </h1>
      
      <Link 
        href="/noticias"
        className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#002256] to-[#B7021C] hover:from-[#001a40] hover:to-[#950119] text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 mb-8"
      >
        <FaNewspaper className="text-lg group-hover:rotate-12 transition-transform duration-300" />
        <span>Ver todas as notícias</span>
        <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-300" />
      </Link>

      <div className="flex flex-col items-center gap-6 w-full lg:max-w-6xl px-6 md:px-4">
        {totalGroups > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-5 md:left-10 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white p-2 md:p-3 rounded-full shadow-md hover:bg-gray-100 transition-colors"
            aria-label="Anterior"
          >
            <FaChevronLeft className="text-[#002256] text-sm md:text-xl" />
          </button>
        )}
        {visibleServices.map((noticia) => {
          // Determinar ordem: "left" = imagem à esquerda, "right" = imagem à direita
          const isImageRight = noticia.presentation_mode === "right";
         
          
          return (
          <div
            key={noticia.id}
            className={`flex flex-col md:flex-row ${
              isImageRight ? "md:flex-row-reverse" : ""
            } gap-4 transition-opacity duration-500 opacity-100`}
          >
            <div className="md:w-[580px] lg:w-[780px] h-auto rounded-xl overflow-hidden shadow-lg relative aspect-video">
              {noticia.video_url ? (
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(
                    noticia.video_url
                  )}`}
                  title={noticia.titulo || "Vídeo da notícia"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              ) : noticia.imagem_capa?.url ? (
                <Image
                  src={`${baseImageUrl}${noticia.imagem_capa.url}`}
                  alt={noticia.titulo || "Produto sem título"}
                  objectFit="cover"
                  layout="fill"
                  quality={75}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                  <span>Sem mídia disponível</span>
                </div>
              )}
            </div>
            <div className="bg-[#e2e0e0] rounded-xl p-4 md:p-10 flex flex-col justify-between md:w-1/2 shadow-md">
              <h2 className="text-xl text-left font-semibold text-[#002256] mb-4">
                {noticia.titulo}
              </h2>
              <p className="text-gray-700 text-justify mb-4">
                {noticia.paragrafo1}
              </p>
              <button
                onClick={() => handleButtonClick(noticia)}
                disabled={loadingButtons[noticia.id]}
                className="flex justify-center items-center transition-all duration-300 ease-in-out transform hover:bg-blue-950 hover:text-white border-2 border-blue-950 text-blue-950 hover:border-transparent px-8 py-2 rounded-lg w-fit self-end text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-950 focus:ring-opacity-50"
              >
                {loadingButtons[noticia.id] ? (
                  <LiaSpinnerSolid className="animate-spin mr-2" />
                ) : null}
                Ler mais
              </button>
            </div>
          </div>
          );
        })}

        {totalGroups > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-5 md:right-10 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white p-2 md:p-3 rounded-full shadow-md hover:bg-gray-100 transition-colors"
            aria-label="Próximo"
          >
            <FaChevronRight className="text-[#002256] text-sm md:text-xl" />
          </button>
        )}
        {totalGroups > 1 && (
          <div className="w-full md:w-96 h-2 bg-[#e2e0e0] rounded-lg overflow-hidden mt-4">
            <div
              className="h-full bg-[#002256] transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}
