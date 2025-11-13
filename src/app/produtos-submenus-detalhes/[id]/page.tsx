/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { LoadingSpinner } from "@/components/Loading";
import ErrorFallback from "@/components/ErrorFallback";
import FloatingButtons from "@/components/FloatingButtons";
import { STRAPI_URL, STRAPI_TOKEN } from "@/data/service/axios";
import { FaCheck, FaPhone, FaArrowRight } from "react-icons/fa";

// Interfaces para a nova API
interface BannerImage {
  id: number;
  url: string;
  alternativeText: string | null;
  width: number;
  height: number;
}

// Interface para rich text do Strapi (blocks format)
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
  banner?: {
    id: number;
    title: string;
    description: string;
    image?: BannerImage;
    video?: any;
  };
  session?: SessionItem[];
  pages?: RelatedPage[];
}

interface PageAPIResponse {
  data: PageData;
  meta?: any;
}

// Função para extrair planos da descrição
const extractPlansFromDescription = (description: RichTextNode[]): Array<{ emoji: string; title: string; description: string; }> => {
  const plans: Array<{ emoji: string; title: string; description: string; }> = [];
  let currentPlan: { emoji: string; title: string; description: string; } | null = null;

  description.forEach((block) => {
    if (block.type === 'paragraph') {
      const text = block.children?.map(child => child.text).join('') || '';
      
      // Se começar com 🔹, é um título de plano
      if (text.startsWith('🔹')) {
        // Salvar plano anterior se existir
        if (currentPlan) {
          plans.push(currentPlan);
        }
        // Criar novo plano
        currentPlan = {
          emoji: text.includes('Segura') ? '🛡️' : text.includes('Tranquila') ? '✨' : '👑',
          title: text.replace('🔹', '').trim(),
          description: ''
        };
      } else if (currentPlan && text.trim() && !text.startsWith('Os nossos planos') && !text.startsWith('Porquê escolher')) {
        // Adicionar descrição ao plano atual
        if (currentPlan.description) {
          currentPlan.description += ' ' + text.trim();
        } else {
          currentPlan.description = text.trim();
        }
      }
    }
  });

  // Adicionar último plano
  if (currentPlan) {
    plans.push(currentPlan);
  }

  return plans;
};

// Função para extrair benefícios da descrição
const extractBenefitsFromDescription = (description: RichTextNode[]): string[] => {
  const benefits: string[] = [];
  
  description.forEach((block) => {
    if (block.type === 'paragraph') {
      const text = block.children?.map(child => child.text).join('') || '';
      
      // Se começar com · ou •, é um benefício
      if (text.startsWith('·') || text.startsWith('•')) {
        benefits.push(text.replace(/^[·•]\s*/, '').trim());
      }
    }
  });

  return benefits;
};

// Função para extrair introdução (texto antes dos planos)
const extractIntroFromDescription = (description: RichTextNode[]): string => {
  let intro = '';
  
  for (const block of description) {
    if (block.type === 'paragraph') {
      const text = block.children?.map(child => child.text).join('') || '';
      
      // Parar ao encontrar "Os nossos planos"
      if (text.includes('Os nossos planos')) {
        break;
      }
      
      // Ignorar parágrafos vazios e título
      if (text.trim() && !text.startsWith('🔹')) {
        if (intro) intro += ' ';
        intro += text.trim();
      }
    }
  }
  
  return intro;
};

// Função para renderizar rich text do Strapi
const renderRichText = (description: RichTextNode[]): JSX.Element => {
  return (
    <>
      {description.map((block, index) => {
        if (block.type === 'paragraph') {
          const text = block.children?.map(child => child.text).join('') || '';
          
          // Se for um emoji + título (🔹 Aliança ...)
          if (text.startsWith('🔹')) {
            return (
              <h3 key={index} className="text-xl font-bold text-[#002256] mt-6 mb-2">
                {text}
              </h3>
            );
          }
          
          // Parágrafos normais
          return text.trim() ? (
            <p key={index} className="text-gray-700 leading-relaxed mb-3">
              {text}
            </p>
          ) : null;
        }
        return null;
      })}
    </>
  );
};

// Componente de card de plano
const PlanCard = ({ emoji, title, description, isHighlighted }: { 
  emoji: string; 
  title: string; 
  description: string; 
  isHighlighted?: boolean;
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-xl p-6 transition-all duration-300 transform hover:-translate-y-2 border-2 ${
      isHighlighted ? 'border-[#B7021C] shadow-2xl scale-105' : 'border-gray-200 hover:border-[#002256]'
    }`}>
      <div className="text-4xl mb-4">{emoji}</div>
      <h3 className="text-2xl font-bold text-[#002256] mb-3">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      {isHighlighted && (
        <div className="mt-4 inline-block bg-[#B7021C] text-white text-xs font-bold px-3 py-1 rounded-full">
          MAIS POPULAR
        </div>
      )}
    </div>
  );
};

// Componente de card de página relacionada
const RelatedPageCard = ({ page, onClick }: { page: RelatedPage; onClick: () => void }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg shadow-md hover:shadow-xl p-6 transition-all duration-300 cursor-pointer group border border-gray-200 hover:border-[#B7021C]"
    >
      <div className="flex flex-col sm:flex-row h-full items-center justify-center gap-4">
        {/* Ícone */}
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
        <div className="flex flex-col items-center justify-center"> 
          <h3 className="text-lg font-bold text-[#002256] mb-2 group-hover:text-[#B7021C] transition-colors">
            {page.title}
          </h3>
          
          {/* Descrição */}
          <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
            {page.description}
          </p>
          
          {/* Link */}
          <div className="flex items-center text-[#B7021C] font-semibold text-sm group-hover:gap-2 transition-all">
            <span>Ver mais</span>
            <FaArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
       
      </div>
    </div>
  );
};


export default function ParticulareSubmenuDetails() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.id as string;
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [footerData, setFooterData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Buscar dados da página (incluindo páginas relacionadas)
        const url = `${STRAPI_URL}/api/pages/${documentId}?populate[0]=image&populate[1]=pages&populate[2]=session.image&populate[3]=pages.image`;
        
        console.log('🔍 Buscando página:', url);
        
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
          cache: "no-store",
        });

        console.log('📡 Status da resposta:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Erro ao buscar página:', response.status);
          console.error('❌ Body:', errorText);
          throw new Error(`Erro ao buscar página: ${response.status}`);
        }

        const json = await response.json();
        
        if (json.data) {
          setPageData(json.data);
        } else {
          setError("Nenhum dado encontrado.");
        }

        // Buscar dados do footer
        const footerUrl = `${STRAPI_URL}/api/footer?populate=*`;
        const footerResponse = await fetch(footerUrl, {
          headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
          cache: "no-store",
        });

        if (footerResponse.ok) {
          const footerJson = await footerResponse.json();
          setFooterData(footerJson.data);
        }
      } catch (error) {
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
        error={error || "Não foi possível carregar as informações deste produto."}
        resetErrorBoundary={() => window.location.reload()}
      />
    );
  }

  // Extrair dados da descrição
  const description = pageData.session?.[0]?.description || [];
  const plans = extractPlansFromDescription(description);
  const benefits = extractBenefitsFromDescription(description);
  const intro = extractIntroFromDescription(description);
  const subtitle = description[0]?.children?.[0]?.text || pageData.description;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <FloatingButtons />

      {/* Hero Banner Section */}
      <section
        className="relative w-full h-[30vh] md:h-[40vh] mt-14 md:mt-20 flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: pageData.session?.[0]?.image
            ? `url(${STRAPI_URL}${pageData.session[0].image.url})`
            : "linear-gradient(135deg, #002256 0%, #0047AB 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
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
                  Produtos
                </button>
              </li>
              <li>/</li>
              <li className="text-white font-semibold">{pageData.title}</li>
            </ol>
          </nav>

          <div className="max-w-7xl">
            <div className="inline-block mb-4">
              <span className="px-4 py-1.5 bg-[#B7021C] text-white text-sm font-semibold rounded-full">
                Produtos
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-2xl mb-4 leading-tight">
              {pageData.title}
            </h1>
            <p className="text-lg md:text-xl text-white/95 drop-shadow-lg font-light leading-relaxed mb-6">
              {subtitle}
            </p>
            <button className="bg-white text-[#002256] hover:bg-gray-100 font-bold py-4 px-10 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2">
              <span>Contrate Agora</span>
              <FaArrowRight className="text-sm" />
            </button>
          </div>
        </div>
      </section>


      {/* Conteúdo Principal */}
      <section className="py-12 md:py-20 px-4 md:px-10 bg-gray-50">
        <div className="max-w-7xl mx-auto">
            {/* Coluna Principal */}
            <div className="lg:col-span-2">
              <div className="">
                <h2 className="text-2xl md:text-3xl font-bold text-[#002256] mb-6 border-l-4 border-[#B7021C] pl-4">
                  Sobre o {pageData.title}
                </h2>
                
                {pageData.session && pageData.session.length > 0 && pageData.session[0].description ? (
                  <div className="prose prose-lg max-w-none">
                    {renderRichText(pageData.session[0].description)}
                  </div>
                ) : (
                  <div className="text-gray-600">
                    <p>{pageData.description || "Informações não disponíveis."}</p>
                  </div>
                )}
              </div>
            </div>
        </div>
      </section>
      {/* Benefícios Section */}
      <section className="py-12 md:py-20 px-4 md:px-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#002256] mb-4">
              Porquê escolher o <span className="text-[#B7021C]">{pageData.title}?</span>
            </h2>
            <p className="text-gray-600 text-lg">
              {pageData.description || "Proteção completa e tranquilidade para você"}
            </p>
          </div>

          {benefits.length > 0 && (
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <FaCheck className="text-green-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Seção de Planos */}
      {plans.length > 0 && (
        <section className="py-12 md:py-20 px-4 md:px-10 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#002256] mb-4">
                Nossos <span className="text-[#B7021C]">Planos</span>
              </h2>
              <p className="text-gray-600 text-lg">
                {intro || "Escolha o plano que melhor se adapta às suas necessidades"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan, index) => (
                <PlanCard
                  key={index}
                  emoji={plan.emoji}
                  title={plan.title}
                  description={plan.description}
                  isHighlighted={index === 1}
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
                  Tópicos <span className="text-[#B7021C]">Relacionados</span>
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

