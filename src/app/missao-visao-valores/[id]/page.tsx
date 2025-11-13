/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { LoadingSpinner } from "@/components/Loading";
import ErrorFallback from "@/components/ErrorFallback";
import FloatingButtons from "@/components/FloatingButtons";
import { STRAPI_URL, STRAPI_TOKEN } from "@/data/service/axios";
import { 
  FaArrowRight,
  FaBullseye,
  FaEye,
  FaHeart,
  FaUsers,
  FaAward,
  FaHandshake
} from "react-icons/fa";

// Interfaces
interface BannerImage {
  id: number;
  url: string;
  alternativeText: string | null;
  width: number;
  height: number;
}

interface RichTextNode {
  type: string;
  children?: Array<{
    type: string;
    text?: string;
    bold?: boolean;
    italic?: boolean;
  }>;
  level?: number;
  format?: string;
}

interface SessionItem {
  id: number;
  title?: string;
  subtitle?: string;
  description?: RichTextNode[];
  image?: BannerImage;
  isActive?: boolean;
}

interface RelatedPage {
  id: number;
  documentId: string;
  title: string;
  resume: string;
  layout: string;
  description: string;
  image?: BannerImage;
}

interface PageData {
  id: number;
  documentId: string;
  title: string;
  resume: string;
  layout: string;
  description: string;
  image?: BannerImage;
  session?: SessionItem[];
  pages?: RelatedPage[];
}

// Função para extrair texto de rich text
const extractText = (description: RichTextNode[]): string => {
  let text = '';
  
  description.forEach((block) => {
    if (block.type === 'paragraph') {
      const paragraphText = block.children?.map(child => child.text).join('') || '';
      if (paragraphText.trim()) {
        if (text) text += ' ';
        text += paragraphText.trim();
      }
    }
  });
  
  return text;
};

// Função para extrair lista de valores
const extractListItems = (description: RichTextNode[]): string[] => {
  const items: string[] = [];
  
  description.forEach((block) => {
    if (block.type === 'list') {
      block.children?.forEach((listItem: any) => {
        if (listItem.type === 'list-item') {
          const text = listItem.children?.map((child: any) => child.text).join('') || '';
          if (text.trim()) {
            items.push(text.trim());
          }
        }
      });
    }
  });
  
  return items;
};

// Função para extrair subtítulo da descrição de valores (primeiro parágrafo)
const extractValoresSubtitle = (description: RichTextNode[]): string => {
  for (const block of description) {
    if (block.type === 'paragraph') {
      const text = block.children?.map(child => child.text).join('') || '';
      if (text.trim()) {
        return text.trim();
      }
    }
  }
  return '';
};

// Componente de card de valor
const ValueCard = ({ icon: Icon, value }: { icon: any; value: string }) => {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border-l-4 border-[#B7021C] hover:shadow-lg transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#002256] to-[#B7021C] flex items-center justify-center">
            <Icon className="text-white text-xl" />
          </div>
        </div>
        <p className="text-gray-700 leading-relaxed pt-2">{value}</p>
      </div>
    </div>
  );
};

// Componente de página relacionada
const RelatedPageCard = ({ page, onClick }: { page: RelatedPage; onClick: () => void }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg shadow-md hover:shadow-xl p-6 transition-all duration-300 cursor-pointer group border border-gray-200 hover:border-[#B7021C]"
    >
      <div className="flex flex-col h-full items-center justify-center gap-4">
        {page.image && (
          <div className="mb-4">
            <div className="relative w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border-2 border-[#B7021C] group-hover:scale-110 transition-transform duration-300">
              <Image
                src={`${STRAPI_URL}${page.image.url}`}
                alt={page.title}
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
          </div>
        )}
        <div className="flex flex-col items-center justify-center text-center"> 
          <h3 className="text-lg font-bold text-[#002256] mb-2 group-hover:text-[#B7021C] transition-colors">
            {page.title}
          </h3>
          
          <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
            {page.resume}
          </p>
          
          <div className="flex items-center text-[#B7021C] font-semibold text-sm group-hover:gap-2 transition-all">
            <span>Ver mais</span>
            <FaArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function MissaoVisaoValores() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.id as string;
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const url = `${STRAPI_URL}/api/pages/${documentId}?populate[0]=image&populate[1]=pages&populate[2]=session.image&populate[3]=pages.image`;
        
        console.log('🔍 Buscando página MVV:', url);
        
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Erro ao buscar página: ${response.status}`);
        }

        const json = await response.json();
        
        if (json.data) {
          setPageData(json.data);
        } else {
          setError("Nenhum dado encontrado.");
        }
      } catch (error) {
        console.error('Erro:', error);
        setError("Erro ao carregar página. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    if (documentId) {
      fetchData();
    }
  }, [documentId]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !pageData) {
    return (
      <ErrorFallback 
        error={error || "Não foi possível carregar as informações."}
        resetErrorBoundary={() => window.location.reload()}
      />
    );
  }

  // Extrair sessions específicas
  const missaoSession = pageData.session?.find(s => s.title?.toLowerCase() === 'missão' || s.title?.toLowerCase() === 'missao');
  const visaoSession = pageData.session?.find(s => s.title?.toLowerCase() === 'visão' || s.title?.toLowerCase() === 'visao');
  const valoresSession = pageData.session?.find(s => s.title?.toLowerCase() === 'valores');

  // Extrair textos
  const missaoText = missaoSession?.description ? extractText(missaoSession.description) : '';
  const visaoText = visaoSession?.description ? extractText(visaoSession.description) : '';
  const valoresList = valoresSession?.description ? extractListItems(valoresSession.description) : [];
  const valoresSubtitle = valoresSession?.description ? extractValoresSubtitle(valoresSession.description) : '';

  // Ícones para os valores
  const valorIcons = [FaHeart, FaUsers, FaHandshake, FaAward, FaBullseye, FaEye];

  console.log('🔵 Missão:', missaoText);
  console.log('🔵 Visão:', visaoText);
  console.log('🔵 Valores:', valoresList);
  console.log('🔵 Valores Subtitle:', valoresSubtitle);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <FloatingButtons />

      {/* Hero Banner */}
      <section className="relative w-full h-[30vh] md:h-[40vh] mt-14 md:mt-20 flex items-center justify-center overflow-hidden">
        {pageData.image ? (
          <Image
            src={`${STRAPI_URL}${pageData.image.url}`}
            alt={pageData.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#002256] to-[#B7021C]"></div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-r from-[#002256]/90 via-[#002256]/70 to-[#B7021C]/60 z-0"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-10 w-full">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center gap-2 text-white/70 text-sm">
              <li>
                <button onClick={() => router.push('/')} className="hover:text-white transition-colors">
                  Início
                </button>
              </li>
              <li>/</li>
              <li>
                <button onClick={() => router.push('/')} className="hover:text-white transition-colors">
                  Institucional
                </button>
              </li>
              <li>/</li>
              <li className="text-white font-semibold">{pageData.title}</li>
            </ol>
          </nav>

          <div className="max-w-7xl">
            <div className="inline-block mb-4">
              <span className="px-4 py-1.5 bg-[#B7021C] text-white text-sm font-semibold rounded-full">
                Institucional
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-2xl mb-4 leading-tight">
              {pageData.title}
            </h1>
            <p className="text-lg md:text-xl text-white/95 drop-shadow-lg font-light leading-relaxed">
              {pageData.resume}
            </p>
          </div>
        </div>
      </section>

      {/* Navegação por Tabs - Apenas se houver sessions */}
      {(missaoSession || visaoSession || valoresSession) && (
        <section className="bg-white border-b-2 border-gray-200 sticky top-14 md:top-20 z-40">
          <div className="max-w-7xl mx-auto px-4 md:px-10">
            <div className="flex gap-2 md:gap-6 overflow-x-auto py-4">
              {missaoSession && (
                <button 
                  onClick={() => document.getElementById('missao')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className="group whitespace-nowrap px-4 py-2 text-sm md:text-base font-semibold text-[#002256] hover:text-[#B7021C] transition-colors relative"
                >
                  <span className="relative inline-block pb-1">
                    {missaoSession.title}
                    <span className="absolute bottom-0 left-0 h-[2px] w-full bg-blue-900/30"></span>
                    <span className="absolute bottom-0 left-0 h-[2px] bg-[#B7021C] transition-all duration-500 ease-out w-0 group-hover:w-full"></span>
                  </span>
                </button>
              )}
              {visaoSession && (
                <button 
                  onClick={() => document.getElementById('visao')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className="group whitespace-nowrap px-4 py-2 text-sm md:text-base font-semibold text-[#002256] hover:text-[#B7021C] transition-colors relative"
                >
                  <span className="relative inline-block pb-1">
                    {visaoSession.title}
                    <span className="absolute bottom-0 left-0 h-[2px] w-full bg-blue-900/30"></span>
                    <span className="absolute bottom-0 left-0 h-[2px] bg-[#B7021C] transition-all duration-500 ease-out w-0 group-hover:w-full"></span>
                  </span>
                </button>
              )}
              {valoresSession && (
                <button 
                  onClick={() => document.getElementById('valores')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className="group whitespace-nowrap px-4 py-2 text-sm md:text-base font-semibold text-[#002256] hover:text-[#B7021C] transition-colors relative"
                >
                  <span className="relative inline-block pb-1">
                    {valoresSession.title}
                    <span className="absolute bottom-0 left-0 h-[2px] w-full bg-blue-900/30"></span>
                    <span className="absolute bottom-0 left-0 h-[2px] bg-[#B7021C] transition-all duration-500 ease-out w-0 group-hover:w-full"></span>
                  </span>
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Seção Missão */}
      {missaoSession && (
        <section id="missao" className="py-12 md:py-20 px-4 md:px-10 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {missaoSession.image && (
                <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-xl order-2 lg:order-1">
                  <Image
                    src={`${STRAPI_URL}${missaoSession.image.url}`}
                    alt={missaoSession.title || "Missão"}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="order-1 lg:order-2 h-64 md:h-96 flex flex-col justify-center">
                <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 md:p-8 border-l-4 border-[#002256] shadow-lg flex flex-col justify-center h-full">
                  <h2 className="text-2xl md:text-3xl font-bold text-[#002256] mb-4">{missaoSession.title}</h2>
                  <p className="text-gray-700 leading-relaxed text-lg md:text-xl italic">
                    "{missaoText}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Seção Visão */}
      {visaoSession && (
        <section id="visao" className="py-12 md:py-20 px-4 md:px-10 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-64 md:h-96 flex flex-col justify-center">
                <div className="bg-gradient-to-br from-red-50 to-white rounded-xl p-6 md:p-8 border-l-4 border-[#B7021C] shadow-lg flex flex-col justify-center h-full">
                  <h2 className="text-2xl md:text-3xl font-bold text-[#002256] mb-4">{visaoSession.title}</h2>
                  <p className="text-gray-700 leading-relaxed text-lg md:text-xl italic">
                    "{visaoText}"
                  </p>
                </div>
              </div>
              {visaoSession.image && (
                <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src={`${STRAPI_URL}${visaoSession.image.url}`}
                    alt={visaoSession.title || "Visão"}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Seção Valores */}
      {valoresSession && valoresList.length > 0 && (
        <section id="valores" className="py-12 md:py-20 px-4 md:px-10 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#002256] mb-4">
                {valoresSession.title || "Nossos"} <span className="text-[#B7021C]">Valores</span>
              </h2>
              {valoresSubtitle && (
                <p className="text-gray-600 text-lg">
                  {valoresSubtitle}
                </p>
              )}
            </div>

            {valoresSession.image && (
              <div className="relative w-full h-64 md:h-96 mb-12 rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src={`${STRAPI_URL}${valoresSession.image.url}`}
                  alt={valoresSession.title || "Nossos Valores"}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {valoresList.map((valor, index) => (
                <ValueCard
                  key={index}
                  icon={valorIcons[index % valorIcons.length]}
                  value={valor}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Seção de Páginas Relacionadas */}
      {pageData.pages && pageData.pages.length > 0 && (
        <section className="py-12 md:py-20 px-4 md:px-10 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <div className="border-l-4 border-[#B7021C] pl-4">
                <h2 className="text-3xl md:text-4xl font-bold text-[#002256]">
                  Conheça Mais <span className="text-[#B7021C]">Sobre Nós</span>
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pageData.pages.map((page) => (
                <RelatedPageCard
                  key={page.documentId}
                  page={page}
                  onClick={() => {
                    const finalPath = page.layout ? `/${page.layout}/${page.documentId}` : `/details-submenus/${page.documentId}`;
                    router.push(finalPath);
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

