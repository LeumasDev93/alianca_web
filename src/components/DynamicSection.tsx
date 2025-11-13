"use client";
import Image from "next/image";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LiaSpinnerSolid } from "react-icons/lia";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface DynamicItem {
  id: number;
  title?: string;
  description?: string;
  image?: { url: string } | null;
  video?: string | null;
  presentation_mode?: string | null;
  button?: {
    description: string;
    link?: string;
    documentId?: string | null;
    layout?: string | null;
    isNoticia?: boolean;
  };
}

interface DynamicSectionProps {
  title: string;
  items: DynamicItem[];
  baseImageUrl: string;
  layout?: string;
}

export default function DynamicSection({
  title,
  items,
  baseImageUrl,
  layout = "default",
}: DynamicSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadingButtons, setLoadingButtons] = useState<{ [key: number]: boolean }>({});
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerPage(3);
      } else if (window.innerWidth >= 768) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalGroups = Math.ceil(items.length / itemsPerPage);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalGroups - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalGroups);
  };

  const getVisibleItems = useCallback(() => {
    if (items.length <= itemsPerPage) return items;
    
    const start = currentIndex * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [items, currentIndex, itemsPerPage]);

  const handleButtonClick = (item: DynamicItem) => {
    if (!item.button) return;
    
    setLoadingButtons((prev) => ({ ...prev, [item.id]: true }));

    console.log('🔵 DynamicSection - Click:', {
      title,
      layout,
      item_id: item.id,
      documentId: item.button.documentId,
      isNoticia: item.button.isNoticia,
      item_layout: item.button.layout
    });

    setTimeout(() => {
      if (item.button) {
        // Se tiver link direto
        if (item.button.link) {
          console.log('✅ Navegando para link direto:', item.button.link);
          // Se for link externo, abrir em nova aba
          if (item.button.link.startsWith('http')) {
            window.open(item.button.link, '_blank');
          } else {
            router.push(item.button.link);
          }
        }
        // Se for notícia
        else if (item.button.isNoticia && item.button.documentId) {
          const url = `/noticia-detalhes/${item.button.documentId}`;
          console.log('✅ Navegando para notícia:', url);
          router.push(url);
        }
        // Se for página com layout
        else if (item.button.documentId && item.button.layout) {
          const url = `/${item.button.layout}/${item.button.documentId}`;
          console.log('✅ Navegando para página:', url);
          router.push(url);
        }
        // Fallback
        else if (item.button.documentId) {
          const url = `/details-submenus/${item.button.documentId}`;
          console.log('✅ Navegando para details:', url);
          router.push(url);
        }
      }
      
      setLoadingButtons((prev) => ({ ...prev, [item.id]: false }));
    }, 1000);
  };

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  if (items.length === 0) return null;

  return (
    <div className="w-full bg-white py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título da Seção */}
        <h2 className="text-2xl md:text-3xl font-bold text-[#002256] text-center mb-8">
          {title}
        </h2>

        {/* Container dos Cards */}
        <div className="relative flex items-center justify-center">
          {/* Botão Anterior */}
          {items.length > itemsPerPage && (
            <button
              onClick={handlePrev}
              className="absolute left-0 z-10 p-2 rounded-full bg-white hover:bg-gray-100 shadow-lg transition-all"
              aria-label="Anterior"
            >
              <FaChevronLeft className="text-[#002256] text-xl" />
            </button>
          )}

          {/* Grid de Cards */}
          <div className="w-full max-w-6xl overflow-hidden px-12">
            <div
              className="grid gap-6 transition-transform duration-500"
              style={{
                gridTemplateColumns: `repeat(${itemsPerPage}, minmax(0, 1fr))`,
              }}
            >
              {getVisibleItems().map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Imagem ou Vídeo */}
                  <div className="relative w-full h-48 md:h-64 bg-gradient-to-br from-gray-100 to-gray-200">
                    {item.video && getYouTubeId(item.video) ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${getYouTubeId(item.video)}`}
                        title={item.title || "Vídeo"}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    ) : item.image?.url ? (
                      <Image
                        src={`${baseImageUrl}${item.image.url}`}
                        alt={item.title || "Imagem"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                        <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm">Sem imagem</span>
                      </div>
                    )}
                  </div>

                  {/* Conteúdo */}
                  <div className="p-4 md:p-6">
                    {/* Título */}
                    {item.title && (
                      <h3 className="text-lg md:text-xl font-bold text-[#002256] mb-3 line-clamp-2">
                        {item.title}
                      </h3>
                    )}

                    {/* Descrição */}
                    {item.description && (
                      <p className="text-sm md:text-base text-gray-600 mb-4 line-clamp-3">
                        {item.description}
                      </p>
                    )}

                    {/* Botão */}
                    {item.button && (
                      <button
                        onClick={() => handleButtonClick(item)}
                        disabled={loadingButtons[item.id]}
                        className="w-full py-2 px-4 bg-gradient-to-r from-[#002256] to-[#B7021C] hover:from-[#001a40] hover:to-[#950119] text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        {loadingButtons[item.id] ? (
                          <LiaSpinnerSolid className="animate-spin text-xl" />
                        ) : (
                          item.button.description || "Ver mais"
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botão Próximo */}
          {items.length > itemsPerPage && (
            <button
              onClick={handleNext}
              className="absolute right-0 z-10 p-2 rounded-full bg-white hover:bg-gray-100 shadow-lg transition-all"
              aria-label="Próximo"
            >
              <FaChevronRight className="text-[#002256] text-xl" />
            </button>
          )}
        </div>

        {/* Indicadores */}
        {items.length > itemsPerPage && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalGroups }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-[#B7021C] w-8"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Ir para página ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

