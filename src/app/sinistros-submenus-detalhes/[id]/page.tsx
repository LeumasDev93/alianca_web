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
  FaPhone, 
  FaArrowRight, 
  FaCheckCircle, 
  FaFileAlt, 
  FaSearch, 
  FaClock,
  FaWhatsapp,
  FaShieldAlt
} from "react-icons/fa";

// Interfaces para a nova API
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
  session?: SessionItem[];
  pages?: RelatedPage[];
}

// Função para renderizar rich text
const renderRichText = (description: RichTextNode[]): string[] => {
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

// Componente de card de etapa
const StepCard = ({ number, title, description, icon: Icon }: { 
  number: string; 
  title: string; 
  description: string;
  icon: any;
}) => {
  return (
    <div className="group relative bg-white rounded-2xl shadow-lg p-6 md:p-8 hover:shadow-2xl transition-all duration-500 border-l-4 border-[#B7021C] overflow-hidden">
      {/* Efeito de fundo ao hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#B7021C]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10 flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#002256] to-[#B7021C] flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
            {number}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <Icon className="text-[#B7021C] text-2xl group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-xl md:text-2xl font-bold text-[#002256] group-hover:text-[#B7021C] transition-colors duration-300">
              {title}
            </h3>
          </div>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

// Componente de card de benefício
const BenefitCard = ({ icon: Icon, title, description }: { 
  icon: any; 
  title: string; 
  description: string;
}) => {
  return (
    <div className="group relative bg-white rounded-2xl p-6 md:p-8 hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-[#B7021C] overflow-hidden">
      {/* Efeito de gradiente ao hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#002256]/5 via-transparent to-[#B7021C]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#002256] to-[#B7021C] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
          <Icon className="text-white text-3xl" />
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-[#002256] mb-3 group-hover:text-[#B7021C] transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-600 text-base leading-relaxed">
          {description}
        </p>
      </div>
      
      {/* Linha decorativa no hover */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#002256] via-[#B7021C] to-[#002256] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
    </div>
  );
};

// Componente de card de página relacionada
const RelatedPageCard = ({ page, onClick }: { page: RelatedPage; onClick: () => void }) => {
  return (
    <div 
      onClick={onClick}
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 md:p-8 transition-all duration-500 cursor-pointer border-2 border-gray-100 hover:border-[#B7021C] overflow-hidden"
    >
      {/* Fundo animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#002256]/5 to-[#B7021C]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10 flex flex-col h-full items-center justify-between gap-4 min-h-[280px]">
        {/* Ícone */}
        {page.image ? (
          <div className="mb-4">
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border-2 border-[#B7021C] group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-md">
              <Image
                src={`${STRAPI_URL}${page.image.url}`}
                alt={page.title}
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#002256] to-[#B7021C] flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
              <FaFileAlt className="text-white text-3xl" />
            </div>
          </div>
        )}

        {/* Conteúdo */}
        <div className="flex-1 flex flex-col items-center justify-center text-center w-full"> 
          <h3 className="text-lg md:text-xl font-bold text-[#002256] mb-3 group-hover:text-[#B7021C] transition-colors duration-300 line-clamp-2">
            {page.title}
          </h3>
          
          <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4 line-clamp-3">
            {page.resume}
          </p>
        </div>

        {/* Botão Ver Mais */}
        <div className="mt-auto pt-4 w-full border-t-2 border-gray-100 group-hover:border-[#B7021C]/30 transition-colors duration-300">
          <div className="flex items-center justify-center text-[#B7021C] font-semibold text-sm md:text-base group-hover:gap-3 transition-all">
            <span>Ver mais</span>
            <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform duration-300" />
          </div>
        </div>
      </div>

      {/* Barra animada no topo */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#002256] via-[#B7021C] to-[#002256] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
    </div>
  );
};

export default function SinistrosSubmenuDetails() {
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
        const url = `${STRAPI_URL}/api/pages/${documentId}?populate[0]=image&populate[1]=pages&populate[2]=session.image&populate[3]=pages.image`;
        
        console.log('🔍 Buscando página de sinistros:', url);
        
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

  const contentParagraphs = pageData.session?.[0]?.description 
    ? renderRichText(pageData.session[0].description) 
    : [];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <FloatingButtons />

      {/* Hero Banner com Breadcrumb */}
      <section
        className="relative w-full h-[30vh] md:h-[40vh] mt-14 md:mt-20 flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: pageData.session?.[0]?.image
            ? `url(${STRAPI_URL}${pageData.session[0].image.url})`
            : "linear-gradient(135deg, #002256 0%, #B7021C 100%)",
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
                  Sinistros
                </button>
              </li>
              <li>/</li>
              <li className="text-white font-semibold">{pageData.title}</li>
            </ol>
          </nav>

          <div className="max-w-7xl">
            <div className="inline-block mb-4">
              <span className="px-4 py-1.5 bg-[#B7021C] text-white text-sm font-semibold rounded-full">
                Sinistros
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

      {/* Quick Info Cards */}
      <section className="py-8 px-4 md:px-10 bg-white -mt-16 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 - Atendimento */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-xl border-2 border-gray-100 hover:border-[#B7021C] transition-all duration-300 group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#002256] to-[#B7021C] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <FaPhone className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#002256] mb-1">Atendimento Rápido</h3>
                  <p className="text-gray-600 text-sm">Resposta em até 24 horas</p>
                </div>
              </div>
            </div>

            {/* Card 2 - Digital */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-xl border-2 border-gray-100 hover:border-[#B7021C] transition-all duration-300 group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#002256] to-[#B7021C] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <FaWhatsapp className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#002256] mb-1">100% Digital</h3>
                  <p className="text-gray-600 text-sm">Acompanhe pelo WhatsApp</p>
                </div>
              </div>
            </div>

            {/* Card 3 - Segurança */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-xl border-2 border-gray-100 hover:border-[#B7021C] transition-all duration-300 group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#002256] to-[#B7021C] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <FaShieldAlt className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#002256] mb-1">Total Segurança</h3>
                  <p className="text-gray-600 text-sm">Processo confiável</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo Principal */}
      {contentParagraphs.length > 0 && (
        <section className="py-12 md:py-20 px-4 md:px-10 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto">
            {/* Título da Seção */}
            <div className="text-left mb-12">
              <div className="inline-block mb-4">
                <span className="px-5 py-2 bg-white text-[#002256] text-sm font-semibold rounded-full border-2 border-[#002256]/20 shadow-sm">
                  Informações Importantes
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-[#002256] mb-2">
                Sobre <span className="text-[#B7021C]">este Serviço</span>
              </h2>
            </div>

            {/* Conteúdo em card destacado */}
            <div className="relative">
              <div className="bg-white rounded-3xl p-6 md:p-12 border-l-4 border-[#B7021C] shadow-2xl">
                <div className="prose prose-lg max-w-none">
                  {contentParagraphs.map((paragraph, index) => (
                    <p key={index} className="text-gray-700 text-base md:text-lg leading-relaxed mb-6 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
              
              {/* Elemento decorativo */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#B7021C]/10 rounded-full blur-2xl"></div>
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-[#002256]/10 rounded-full blur-2xl"></div>
            </div>
          </div>
        </section>
      )}

      {/* Seção de Etapas do Processo */}
      <section className="py-16 md:py-24 px-4 md:px-10 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="px-5 py-2 bg-[#002256]/10 text-[#002256] text-sm font-semibold rounded-full border-2 border-[#002256]/20">
                Como Funciona
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-[#002256] mb-4">
              Etapas do <span className="text-[#B7021C]">Processo</span>
            </h2>
            <p className="text-gray-600 text-lg md:text-xl max-w-7xl mx-auto">
              Siga estas etapas simples para comunicar e acompanhar seu sinistro de forma rápida e eficiente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <StepCard
              number="1"
              title="Comunique a ocorrência"
              description="Entre em contato através dos nossos canais para comunicar o sinistro. Você receberá um número de protocolo para acompanhamento."
              icon={FaPhone}
            />
            <StepCard
              number="2"
              title="Vistoria"
              description="Caso necessário, será agendada uma vistoria do veículo ou local. A vistoria pode ser presencial ou digital."
              icon={FaSearch}
            />
            <StepCard
              number="3"
              title="Documentação"
              description="Envie os documentos necessários através dos nossos canais digitais de forma rápida e segura."
              icon={FaFileAlt}
            />
            <StepCard
              number="4"
              title="Análise e Resposta"
              description="Nossa equipe analisará o processo e retornará com o resultado em até 2 dias úteis."
              icon={FaClock}
            />
          </div>

          {/* Linha do tempo visual */}
          <div className="mt-12 flex justify-center">
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <div className="w-10 h-10 rounded-full bg-[#002256] text-white flex items-center justify-center font-bold shadow-lg">1</div>
              <div className="w-12 h-1 bg-gradient-to-r from-[#002256] to-[#B7021C] hidden md:block"></div>
              <div className="w-10 h-10 rounded-full bg-[#002256] text-white flex items-center justify-center font-bold shadow-lg">2</div>
              <div className="w-12 h-1 bg-gradient-to-r from-[#002256] to-[#B7021C] hidden md:block"></div>
              <div className="w-10 h-10 rounded-full bg-[#002256] text-white flex items-center justify-center font-bold shadow-lg">3</div>
              <div className="w-12 h-1 bg-gradient-to-r from-[#002256] to-[#B7021C] hidden md:block"></div>
              <div className="w-10 h-10 rounded-full bg-[#B7021C] text-white flex items-center justify-center font-bold shadow-lg">4</div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Benefícios */}
      <section className="py-16 md:py-24 px-4 md:px-10 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Elementos decorativos de fundo */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#B7021C]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#002256]/5 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="px-5 py-2 bg-[#B7021C]/10 text-[#B7021C] text-sm font-semibold rounded-full border-2 border-[#B7021C]/20">
                Vantagens
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-[#002256] mb-4">
              Nossos <span className="text-[#B7021C]">Diferenciais</span>
            </h2>
            <p className="text-gray-600 text-lg md:text-xl max-w-7xl mx-auto">
              Conte com o melhor atendimento e suporte do mercado
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BenefitCard
              icon={FaShieldAlt}
              title="Atendimento 24h"
              description="Nossa equipe está disponível 24 horas por dia, 7 dias por semana para atendê-lo em qualquer emergência."
            />
            <BenefitCard
              icon={FaCheckCircle}
              title="Processo Rápido"
              description="Análise e resposta em até 2 dias úteis após envio da documentação completa. Sem burocracia."
            />
            <BenefitCard
              icon={FaWhatsapp}
              title="Canais Digitais"
              description="Acompanhe todo o processo pelo WhatsApp, app ou portal online com total transparência."
            />
          </div>
        </div>
      </section>

      {/* Seção de Páginas Relacionadas */}
      {pageData.pages && pageData.pages.length > 0 && (
        <section className="py-16 md:py-24 px-4 md:px-10 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <div className="inline-block mb-4">
                <span className="px-5 py-2 bg-[#002256]/10 text-[#002256] text-sm font-semibold rounded-full border-2 border-[#002256]/20">
                  Explore Mais
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-[#002256] mb-2">
                Outros <span className="text-[#B7021C]">Serviços</span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-[#B7021C] to-transparent"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
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

