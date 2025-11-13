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
  FaBuilding,
  FaMapMarkerAlt,
  FaIdCard,
  FaFileContract,
  FaMoneyBillWave,
  FaBriefcase
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

interface DadoEmpresa {
  label: string;
  value: string;
}

// Função para extrair dados da empresa
const extractDadosEmpresa = (description: RichTextNode[]): DadoEmpresa[] => {
  const dados: DadoEmpresa[] = [];
  
  description.forEach((block) => {
    if (block.type === 'paragraph') {
      const text = block.children?.map(child => child.text).join('') || '';
      const trimmedText = text.trim();
      
      if (trimmedText && trimmedText.includes(':')) {
        const parts = trimmedText.split(':');
        if (parts.length >= 2) {
          dados.push({
            label: parts[0].trim(),
            value: parts.slice(1).join(':').trim()
          });
        }
      }
    }
  });
  
  return dados;
};

// Função para obter ícone baseado no label
const getIconForLabel = (label: string): any => {
  const labelLower = label.toLowerCase();
  if (labelLower.includes('denominação') || labelLower.includes('denominacao')) return FaBuilding;
  if (labelLower.includes('sede')) return FaMapMarkerAlt;
  if (labelLower.includes('nif')) return FaIdCard;
  if (labelLower.includes('pessoa') || labelLower.includes('coletiva')) return FaFileContract;
  if (labelLower.includes('objeto')) return FaBriefcase;
  if (labelLower.includes('capital')) return FaMoneyBillWave;
  return FaBuilding;
};

// Componente de card de dado
const DadoCard = ({ dado, icon: Icon }: { dado: DadoEmpresa; icon: any }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-l-4 border-[#B7021C]">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#002256] to-[#B7021C] flex items-center justify-center shadow-md">
            <Icon className="text-white text-xl" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-[#B7021C] mb-2 uppercase tracking-wide">
            {dado.label}
          </h3>
          <p className="text-gray-800 text-lg leading-relaxed font-medium">
            {dado.value}
          </p>
        </div>
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

export default function DadosEmpresa() {
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
        
        console.log('🔍 Buscando página Dados da Empresa:', url);
        
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

  // Extrair dados da empresa
  const mainSession = pageData.session?.[0];
  const dadosEmpresa = mainSession?.description ? extractDadosEmpresa(mainSession.description) : [];

  console.log('🔵 Dados da Empresa extraídos:', dadosEmpresa);

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
              {pageData.resume || "Informações legais e corporativas da Aliança Seguros"}
            </p>
          </div>
        </div>
      </section>

      {/* Seção de Dados da Empresa */}
      {dadosEmpresa.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 border-l-4 border-[#B7021C] pl-6">
              <h2 className="text-3xl md:text-4xl font-bold text-[#002256] mb-4">
                Informações <span className="text-[#B7021C]">Corporativas</span>
              </h2>
              <p className="text-gray-600 text-lg">
                Dados legais e registrais da empresa
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dadosEmpresa.map((dado, index) => (
                <DadoCard
                  key={index}
                  dado={dado}
                  icon={getIconForLabel(dado.label)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Imagem Institucional */}
      {mainSession?.image && (
        <section className="py-12 md:py-16 px-4 md:px-10 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={`${STRAPI_URL}${mainSession.image.url}`}
                alt={mainSession.title || pageData.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-8">
                <div className="text-white">
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">Aliança Seguros</h3>
                  <p className="text-white/90">Confiança, Segurança e Compromisso</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Seção de Páginas Relacionadas */}
      {pageData.pages && pageData.pages.length > 0 && (
        <section className="py-12 md:py-20 px-4 md:px-10 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <div className="border-l-4 border-[#B7021C] pl-4">
                <h2 className="text-3xl md:text-4xl font-bold text-[#002256]">
                  Informações <span className="text-[#B7021C]">Institucionais</span>
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

      {/* Nota Legal */}
      <section className="py-12 px-4 md:px-10 bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border-l-4 border-[#002256]">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-[#002256] flex items-center justify-center">
                  <FaFileContract className="text-white text-xl" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#002256] mb-3">Informação Legal</h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  Todos os dados apresentados estão em conformidade com a legislação vigente em Cabo Verde e foram registrados nos órgãos competentes. A Aliança Seguros opera de acordo com as normas da Autoridade de Supervisão de Seguros e Fundos de Pensões de Cabo Verde.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 px-4 md:px-10 bg-gradient-to-r from-[#002256] to-[#B7021C]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Transparência e Credibilidade
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-7xl mx-auto leading-relaxed">
            A Aliança Seguros é uma empresa legalmente constituída e regulamentada, comprometida com a transparência e o cumprimento de todas as normas do setor segurador.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/')}
              className="bg-white text-[#002256] hover:bg-gray-100 font-bold py-3 px-8 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Conheça Nossos Produtos
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

