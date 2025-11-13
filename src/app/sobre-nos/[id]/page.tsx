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
  FaShieldAlt,
  FaUsers,
  FaAward,
  FaHandshake,
  FaLightbulb,
  FaHeart
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

// Função para extrair parágrafos de rich text
const extractParagraphs = (description: RichTextNode[]): string[] => {
  const paragraphs: string[] = [];
  
  description.forEach((block) => {
    if (block.type === 'paragraph') {
      const text = block.children?.map(child => child.text).join('') || '';
      if (text.trim()) {
        paragraphs.push(text.trim());
      }
    }
  });
  
  return paragraphs;
};

// Componente de card de destaque
const HighlightCard = ({ icon: Icon, title, description }: { 
  icon: any; 
  title: string; 
  description: string;
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-t-4 border-[#B7021C]">
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#002256] to-[#B7021C] flex items-center justify-center mb-4 shadow-lg">
          <Icon className="text-white text-2xl" />
        </div>
        <h3 className="text-xl font-bold text-[#002256] mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
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

export default function SobreNos() {
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
        
        console.log('🔍 Buscando página Sobre Nós:', url);
        
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

  // Extrair conteúdo da primeira session
  const mainSession = pageData.session?.[0];
  const paragraphs = mainSession?.description ? extractParagraphs(mainSession.description) : [];

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
              {pageData.resume || "Conheça mais sobre a Aliança Seguros"}
            </p>
          </div>
        </div>
      </section>

      {/* Seção Principal - Quem Somos */}
      <section className="py-12 md:py-20 px-4 md:px-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="w-full">
            <div className="border-l-4 border-[#B7021C] pl-6 mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-[#002256]">
                {mainSession?.title || pageData.title}
              </h2>
            </div>

            <div className="space-y-6">
              {paragraphs.map((paragraph, index) => (
                <p key={index} className="text-gray-700 text-lg leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Destaques */}
      <section className="py-12 md:py-20 px-4 md:px-10 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#002256] mb-4">
              Nossos <span className="text-[#B7021C]">Diferenciais</span>
            </h2>
            <p className="text-gray-600 text-lg">
              O que nos torna únicos no mercado
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <HighlightCard
              icon={FaShieldAlt}
              title="Proteção Completa"
              description="Soluções de seguros personalizadas para cada necessidade, com coberturas amplas e assistência 24h."
            />
            <HighlightCard
              icon={FaUsers}
              title="Foco no Cliente"
              description="Atendimento humanizado e próximo, sempre pensando na melhor experiência para você."
            />
            <HighlightCard
              icon={FaLightbulb}
              title="Inovação"
              description="Tecnologia de ponta e processos digitais para tornar sua vida mais simples."
            />
            <HighlightCard
              icon={FaHandshake}
              title="Confiança"
              description="Transparência e ética em todas as nossas relações, construindo parcerias duradouras."
            />
            <HighlightCard
              icon={FaAward}
              title="Excelência"
              description="Compromisso com a qualidade em cada detalhe, do atendimento à resolução de sinistros."
            />
            <HighlightCard
              icon={FaHeart}
              title="Comprometimento"
              description="Dedicação em proteger o que é mais importante para você e sua família."
            />
          </div>
        </div>
      </section>

      {/* Seção de Páginas Relacionadas */}
      {pageData.pages && pageData.pages.length > 0 && (
        <section className="py-12 md:py-20 px-4 md:px-10 bg-white">
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

      {/* CTA Section */}
      <section className="py-16 md:py-20 px-4 md:px-10 bg-gradient-to-r from-[#002256] to-[#B7021C]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Pronto para Proteger o que Importa?
              </h2>
              <p className="text-white/90 text-lg leading-relaxed mb-6">
                Descubra nossas soluções de seguros e encontre a proteção ideal para você, sua família ou empresa.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => router.push('/')}
                  className="bg-white text-[#002256] hover:bg-gray-100 font-bold py-3 px-8 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  Nossos Produtos
                </button>
                <button
                  onClick={() => router.push('/simulacao')}
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#002256] font-bold py-3 px-8 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  Fazer Simulação
                </button>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-4">Nossa Promessa</h3>
              <p className="text-white/90 text-lg leading-relaxed">
                Seguros que descomplicam a sua vida, com atendimento próximo, processos transparentes e soluções que realmente protegem.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

