/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Logotipo from "@/assets/images/alianca.png";
import { useRouter } from "next/navigation";
import { LiaSpinnerSolid } from "react-icons/lia";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

type DestaqueData = {
  id: number;
  titulo: string;
  nome_botao: string;
  imagem?: { url: string } | null;
  documentId?: string;
  layout?: string;
  isNoticia?: boolean;
  descricao?: string;
};

interface NovidadesAllianceProps {
  destaques: DestaqueData[];
  baseImageUrl: string;
}

export default function NovidadesAlliance({
  destaques,
  baseImageUrl,
}: NovidadesAllianceProps) {
  const [selectedButtonId, setSelectedButtonId] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [groupSize, setGroupSize] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingButtons, setLoadingButtons] = useState<{
    [key: number]: boolean;
  }>({});
  const [error, setError] = useState<string | null>(null);

  // Log para debug das imagens
  useEffect(() => {
    console.log("🔵 NovidadesAlliance - destaques recebidos:", destaques);
    console.log("🔵 NovidadesAlliance - baseImageUrl:", baseImageUrl);
  }, [destaques, baseImageUrl]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setGroupSize(1);
      } else if (window.innerWidth < 768) {
        setGroupSize(2);
      } else if (window.innerWidth < 1024) {
        setGroupSize(3);
      } else if (window.innerWidth < 1280) {
        setGroupSize(3);
      } else {
        setGroupSize(4);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalGroups = Math.ceil(destaques.length / groupSize);

  const updateProgress = useCallback(() => {
    const newProgress = ((currentIndex + 1) / totalGroups) * 100;
    setProgress(newProgress);
  }, [currentIndex, totalGroups]);

  useEffect(() => {
    updateProgress();
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % totalGroups;
        updateProgress();
        return newIndex;
      });
    }, 6000);
    return () => clearInterval(interval);
  }, [currentIndex, totalGroups, updateProgress]);

  const visibleServices = destaques.slice(
    currentIndex * groupSize,
    currentIndex * groupSize + groupSize
  );

  const router = useRouter();

  const handleButtonClick = (item: DestaqueData) => {
    setLoadingButtons((prev) => ({ ...prev, [item.id]: true }));

    console.log('🔵 NovidadesAlliance - Click em item:', {
      id: item.id,
      documentId: item.documentId,
      isNoticia: item.isNoticia,
      layout: item.layout,
      titulo: item.titulo
    });

    setTimeout(() => {
      // Se for notícia, navegar para noticia-detalhes
      if (item.isNoticia && item.documentId) {
        const url = `/noticia-detalhes/${item.documentId}`;
        console.log('✅ Navegando para:', url);
        router.push(url);
      }
      // Se for página, navegar com layout específico
      else if (!item.isNoticia && item.documentId && item.layout) {
        const url = `/${item.layout}/${item.documentId}`;
        console.log('✅ Navegando para:', url);
        router.push(url);
      } 
      // Fallback para details-submenus
      else if (item.documentId) {
        const url = `/details-submenus/${item.documentId}`;
        console.log('✅ Navegando para:', url);
        router.push(url);
      } 
      // Fallback antigo
      else {
        const url = `/destaque-details/${item.id}`;
        console.log('⚠️ Usando fallback, navegando para:', url);
        router.push(url);
      }
      setSelectedButtonId(item.id);
      setLoadingButtons((prev) => ({ ...prev, [item.id]: false }));
    }, 2000);
  };

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

  return (
    <div className="flex flex-col items-center w-full h-full px-4 sm:px-8 bg-[#F4F2F2]">
      {destaques.length > 0 ? (
        <h1 className="md:text-3xl text-xl font-bold text-center mb-6 text-[#002256]">
          Novidades Aliança
        </h1>
      ) : null}

      <div className="relative w-full max-w-screen-2xl mx-auto">
        {destaques.length > groupSize && (
          <button
            onClick={handlePrev}
            className="absolute left-0 sm:left-4 md:left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 xl:p-3 rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
            aria-label="Anterior"
          >
            <FaChevronLeft className="text-[#002256] text-sm xl:text-xl" />
          </button>
        )}

        <div className="flex flex-col items-center justify-center xl:gap-6 w-full px-8 sm:px-0">
          <div className="flex items-center justify-center gap-4 sm:gap-6 w-full max-w-6xl mx-auto">
            {visibleServices.map((card) => (
              <div
                key={card.id}
                className="flex flex-col items-center text-center bg-white rounded-xl w-full sm:w-[250px] xl:w-[300px] xl:h-[420px] min-h-[320px] shadow-md p-2 sm:p-3 xl:p-4"
              >
                <div className="relative w-full h-40 md:h-60 min-h-[160px]">
                  {card.imagem?.url && (
                    <Image
                      src={`${baseImageUrl}${card.imagem.url}`}
                      alt={card.titulo || "Produto sem título"}
                      fill
                      quality={100}
                      className="rounded-xl object-cover"
                    />
                  )}
                  <div className="absolute -bottom-4 left-0 right-0 flex justify-center">
                    <div className="w-8 h-8 bg-white rounded-full p-0.5">
                      <Image
                        src={Logotipo}
                        alt={card.titulo}
                        width={100}
                        height={100}
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 w-full flex-grow flex flex-col justify-between">
                  <div>
                    <h2 className="text-[#002256] text-sm xl:text-lg font-semibold px-2 mb-2 line-clamp-2">
                      {card.titulo || "Sem Título"}
                    </h2>
                    {card.descricao && (
                      <p className="text-gray-600 text-xs xl:text-sm px-2 line-clamp-3">
                        {card.descricao}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  className={`mt-4 py-2 px-4 sm:px-6 font-bold rounded hover:bg-[#002256] hover:text-white flex items-center justify-center text-sm xl:text-lg ${
                    selectedButtonId === card.id
                      ? "bg-[#002256] text-white"
                      : "bg-white text-[#002256] border border-[#002256]"
                  }`}
                  onClick={() => handleButtonClick(card)}
                  disabled={loadingButtons[card.id]}
                >
                  {loadingButtons[card.id] ? (
                    <LiaSpinnerSolid className="animate-spin mr-2" />
                  ) : null}
                  {card.nome_botao || "Clique aqui"}
                </button>
              </div>
            ))}
          </div>

          {destaques.length > groupSize && (
            <div className="w-full max-w-6xl px-4 sm:px-8">
              <div className="w-full h-2 bg-[#e2e0e0] rounded-lg overflow-hidden mt-4">
                <div
                  className="h-full bg-[#002256] transition-all duration-[500ms]"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {destaques.length > groupSize && (
          <button
            onClick={handleNext}
            className="absolute right-0 sm:right-4 md:right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 xl:p-3 rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
            aria-label="Próximo"
          >
            <FaChevronRight className="text-[#002256] text-sm xl:text-xl" />
          </button>
        )}
      </div>
    </div>
  );
}
