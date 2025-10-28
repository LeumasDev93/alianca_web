"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";

// Narrow data coming from server to the fields we actually use in this component
type Testemunho = {
  id: number;
  nome: string;
  descricao: string;
  avaliacao: number;
  localizacao: string;
  createdAt: string;
  foto: { url: string };
};

interface DepoimentsProps {
  testemunhos: Testemunho[];
  baseImageUrl: string;
}

export default function Depoiments({
  testemunhos,
  baseImageUrl,
}: DepoimentsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [groupSize, setGroupSize] = useState(1);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setGroupSize(1);
      } else if (window.innerWidth < 1024) {
        setGroupSize(2);
      } else {
        setGroupSize(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalGroups = Math.ceil(testemunhos.length / groupSize);

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
    }, 9000);
    return () => clearInterval(interval);
  }, [currentIndex, totalGroups, updateProgress]);

  const visibleServices = testemunhos.slice(
    currentIndex * groupSize,
    currentIndex * groupSize + groupSize
  );

  const renderStars = (stars: number) => {
    const fullStars = Math.floor(stars);
    const hasHalfStar = stars % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <>
        {Array.from({ length: fullStars }).map((_, index) => (
          <FaStar key={`full-${index}`} className="text-red-700" />
        ))}
        {hasHalfStar && <FaStarHalfAlt className="text-red-700" />}
        {Array.from({ length: emptyStars }).map((_, index) => (
          <FaRegStar key={`empty-${index}`} className="text-red-700" />
        ))}
      </>
    );
  };

  if (isLoading) {
    return <div className="text-center py-8">Carregando dados...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="relative flex flex-col items-center w-full h-full px-4 py-10 bg-[#F4F2F2]">
      {testemunhos.length > 0 && (
        <h1 className="text-center text-xl md:text-3xl font-bold mb-6 text-[#002256]">
          O que os clientes dizem sobre nós
        </h1>
      )}

      {/* Botão esquerdo */}
      {totalGroups > 1 && (
        <button
          onClick={() =>
            setCurrentIndex((prev) => (prev - 1 + totalGroups) % totalGroups)
          }
          className="absolute left-0 sm:left-4 md:left-8 xl:left-20 top-1/2 transform -translate-y-1/2 bg-white p-2 xl:p-3 rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
          aria-label="Anterior"
        >
          <FaChevronLeft className="text-[#002256] text-sm xl:text-xl" />
        </button>
      )}

      {/* Cards */}
      <div className="flex flex-col items-center gap-6 w-full max-w-6xl">
        <div className="flex flex-wrap justify-center gap-6 w-full">
          {visibleServices.map((testemunho) => (
            <div
              key={testemunho.id}
              className="flex flex-col justify-between bg-white w-full md:w-[45%] lg:w-[30%] px-6 py-4 rounded-2xl shadow-md"
            >
              {/* Topo: imagem e nome */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Image
                    src={`${baseImageUrl}${testemunho.foto.url}`}
                    alt={testemunho.nome || "Foto do cliente"}
                    className="rounded-full w-10 h-10"
                    width={40}
                    height={40}
                  />
                  <p className="text-sm font-semibold text-gray-700">
                    {testemunho.nome}
                  </p>
                </div>
                <p className="text-xs text-gray-500 whitespace-nowrap">
                  {new Date(testemunho.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Depoimento */}
              <blockquote className="italic text-gray-800 text-sm md:text-base leading-relaxed mb-4">
                “{testemunho.descricao}”
              </blockquote>

              {/* Localização e avaliação */}
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>{testemunho.localizacao}</span>
                <span className="text-red-700 flex">
                  {renderStars(testemunho.avaliacao)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {testemunhos.length > 0 && (
          <div className="w-full max-w-6xl px-4">
            <div className="w-full h-2 bg-[#e2e0e0] rounded-full overflow-hidden mt-4">
              <div
                className="h-full bg-[#002256] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
      {totalGroups > 1 && (
        <button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % totalGroups)}
          className="absolute right-0 sm:right-4 md:right-8 xl:right-20 top-1/2 transform -translate-y-1/2 bg-white p-2 xl:p-3 rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
          aria-label="Próximo"
        >
          <FaChevronRight className="text-[#002256] text-sm xl:text-xl" />
        </button>
      )}
    </div>
  );
}
