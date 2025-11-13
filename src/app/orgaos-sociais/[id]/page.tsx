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
  FaUsers,
  FaUserTie,
  FaBalanceScale,
  FaUserShield
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

interface OrgaoMembro {
  cargo: string;
  nome: string;
}

interface OrgaoSocial {
  titulo: string;
  membros: OrgaoMembro[];
}

// Função para extrair órgãos sociais da descrição
const extractOrgaosSociais = (description: RichTextNode[]): OrgaoSocial[] => {
  const orgaos: OrgaoSocial[] = [];
  let currentOrgao: OrgaoSocial | null = null;
  
  description.forEach((block) => {
    if (block.type === 'paragraph') {
      const text = block.children?.map(child => child.text).join('') || '';
      const trimmedText = text.trim();
      
      // Se não começar com · ou •, é um título de órgão
      if (trimmedText && !trimmedText.startsWith('·') && !trimmedText.startsWith('•')) {
        // Salvar órgão anterior se existir
        if (currentOrgao) {
          orgaos.push(currentOrgao);
        }
        // Criar novo órgão
        currentOrgao = {
          titulo: trimmedText,
          membros: []
        } as OrgaoSocial;
      } 
      // Se começar com · ou •, é um membro
      else if (trimmedText && (trimmedText.startsWith('·') || trimmedText.startsWith('•'))) {
        const membroText = trimmedText.replace(/^[·•]\s*/, '');
        const parts = membroText.split(':');
        
        if (parts.length >= 2 && currentOrgao) {
          currentOrgao.membros.push({
            cargo: parts[0].trim(),
            nome: parts.slice(1).join(':').trim()
          } as OrgaoMembro);
        }
      }
    }
  });
  
  // Adicionar último órgão
  if (currentOrgao) {
    orgaos.push(currentOrgao);
  }
  
  return orgaos;
};

// Componente de card de órgão social
const OrgaoCard = ({ orgao, icon: Icon }: { orgao: OrgaoSocial; icon: any }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border-t-4 border-[#B7021C] hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#002256] to-[#B7021C] flex items-center justify-center shadow-lg">
          <Icon className="text-white text-2xl" />
        </div>
        <h3 className="text-2xl font-bold text-[#002256]">{orgao.titulo}</h3>
      </div>

      <div className="space-y-4">
        {orgao.membros.map((membro, index) => (
          <div key={index} className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg border-l-4 border-[#B7021C] hover:shadow-md transition-all duration-300">
            <p className="text-sm font-semibold text-[#B7021C] mb-1">{membro.cargo}</p>
            <p className="text-lg font-medium text-gray-800">{membro.nome}</p>
          </div>
        ))}
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

export default function OrgaosSociais() {
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
        
        console.log('🔍 Buscando página Órgãos Sociais:', url);
        
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

  // Extrair órgãos sociais da primeira session
  const mainSession = pageData.session?.[0];
  const orgaosSociais = mainSession?.description ? extractOrgaosSociais(mainSession.description) : [];

  // Ícones para cada tipo de órgão
  const getIconForOrgao = (titulo: string): any => {
    const tituloLower = titulo.toLowerCase();
    if (tituloLower.includes('assembleia')) return FaUsers;
    if (tituloLower.includes('administração') || tituloLower.includes('administracao')) return FaUserTie;
    if (tituloLower.includes('fiscal')) return FaBalanceScale;
    return FaUserShield;
  };

  console.log('🔵 Órgãos Sociais extraídos:', orgaosSociais);

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
              {pageData.resume || "Conheça a estrutura organizacional da Aliança Seguros"}
            </p>
          </div>
        </div>
      </section>


      {/* Seção de Órgãos Sociais */}
      {orgaosSociais.length > 0 && (
        <section className="py-8 md:py-10 px-4 md:px-10 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-left mb-12 border-l-4 border-[#B7021C] pl-4">
              <h2 className="text-3xl md:text-4xl font-bold text-[#002256] mb-4">
                Estrutura <span className="text-[#B7021C]">Organizacional</span>
              </h2>
              <p className="text-gray-600 text-lg">
                Conheça os membros que compõem nossos órgãos sociais
              </p>
            </div>

            <div className="space-y-8">
              {orgaosSociais.map((orgao, index) => (
                <OrgaoCard
                  key={index}
                  orgao={orgao}
                  icon={getIconForOrgao(orgao.titulo)}
                />
              ))}
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

