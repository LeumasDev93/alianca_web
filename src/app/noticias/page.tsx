"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { STRAPI_URL, STRAPI_TOKEN } from "@/data/service/axios";
import { LoadingSpinner } from "@/components/Loading";
import FloatingButtons from "@/components/FloatingButtons";
import { FaCalendar, FaArrowRight, FaClock, FaFilter } from "react-icons/fa";

interface RichTextNode {
  type: string;
  children?: Array<{
    type: string;
    text?: string;
  }>;
}

interface Noticia {
  id: number;
  documentId: string;
  title: string;
  resume: string | null;
  description: RichTextNode[];
  notice_date: string;
  order: number;
  url_video: string | null;
  image?: {
    url: string;
    alternativeText?: string;
  };
  createdAt: string;
}

// Extrair primeiro parágrafo da descrição
const extractFirstParagraph = (description: RichTextNode[]): string => {
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

// Formatar data
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-PT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(date);
};

// Card de Notícia em Destaque
const FeaturedNewsCard = ({ noticia, onClick }: { noticia: Noticia; onClick: () => void }) => {
  const firstParagraph = extractFirstParagraph(noticia.description);
  
  return (
    <div
      onClick={onClick}
      className="group relative bg-white rounded-2xl shadow-2xl overflow-hidden cursor-pointer hover:shadow-3xl transition-all duration-500 border-2 border-gray-100 hover:border-[#B7021C]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Imagem */}
        <div className="relative h-64 lg:h-96 bg-gradient-to-br from-[#002256] to-[#B7021C]">
          {noticia.image?.url ? (
            <Image
              src={`${STRAPI_URL}${noticia.image.url}`}
              alt={noticia.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-white/20 text-6xl">📰</div>
            </div>
          )}
          <div className="absolute top-4 left-4">
            <span className="px-4 py-2 bg-[#B7021C] text-white text-xs font-bold rounded-full shadow-lg">
              EM DESTAQUE
            </span>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6 lg:p-10 flex flex-col justify-center">
          <div className="flex items-center gap-3 text-gray-500 text-sm mb-4">
            <FaCalendar className="text-[#B7021C]" />
            <span>{formatDate(noticia.notice_date)}</span>
          </div>

          <h2 className="text-2xl lg:text-4xl font-bold text-[#002256] mb-4 group-hover:text-[#B7021C] transition-colors duration-300 line-clamp-3">
            {noticia.title}
          </h2>

          <p className="text-gray-600 text-base lg:text-lg leading-relaxed mb-6 line-clamp-4">
            {firstParagraph}
          </p>

          <div className="flex items-center text-[#B7021C] font-semibold text-base group-hover:gap-3 transition-all">
            <span>Ler notícia completa</span>
            <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Card de Notícia Normal
const NewsCard = ({ noticia, onClick }: { noticia: Noticia; onClick: () => void }) => {
  const firstParagraph = extractFirstParagraph(noticia.description);
  
  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-xl shadow-lg hover:shadow-2xl overflow-hidden cursor-pointer transition-all duration-300 border border-gray-200 hover:border-[#B7021C] h-full flex flex-col"
    >
      {/* Imagem */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
        {noticia.image?.url ? (
          <Image
            src={`${STRAPI_URL}${noticia.image.url}`}
            alt={noticia.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-gray-300 text-5xl">📰</div>
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-gray-500 text-xs mb-3">
          <FaCalendar className="text-[#B7021C]" />
          <span>{formatDate(noticia.notice_date)}</span>
        </div>

        <h3 className="text-lg font-bold text-[#002256] mb-3 group-hover:text-[#B7021C] transition-colors line-clamp-2">
          {noticia.title}
        </h3>

        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
          {firstParagraph}
        </p>

        <div className="flex items-center text-[#B7021C] font-semibold text-sm group-hover:gap-2 transition-all mt-auto pt-3 border-t border-gray-100">
          <span>Leia mais</span>
          <FaArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};

export default function NoticiasPage() {
  const router = useRouter();
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchNoticias = async () => {
      setIsLoading(true);
      try {
        const url = `${STRAPI_URL}/api/noticias?populate=image&sort=notice_date:desc`;
        console.log('🔍 Buscando notícias:', url);

        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Erro: ${response.status}`);
        }

        const json = await response.json();
        console.log('✅ Notícias recebidas:', json.data?.length);
        setNoticias(json.data || []);
      } catch (error) {
        console.error('❌ Erro ao buscar notícias:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNoticias();
  }, []);

  // Filtrar notícias por período
  const filterByPeriod = (noticias: Noticia[]) => {
    if (selectedPeriod === "all") return noticias;

    const now = new Date();
    const filtered = noticias.filter((noticia) => {
      const noticiaDate = new Date(noticia.notice_date);
      const diffTime = Math.abs(now.getTime() - noticiaDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      switch (selectedPeriod) {
        case "7days":
          return diffDays <= 7;
        case "30days":
          return diffDays <= 30;
        case "3months":
          return diffDays <= 90;
        default:
          return true;
      }
    });

    return filtered;
  };

  const filteredNoticias = filterByPeriod(noticias);
  const featuredNews = filteredNoticias[0];
  const otherNews = filteredNoticias.slice(1);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <FloatingButtons />

      {/* Hero Banner */}
      <section className="relative w-full h-[30vh] md:h-[35vh] mt-14 md:mt-20 flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#002256] to-[#B7021C]">
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
              <li className="text-white font-semibold">Notícias</li>
            </ol>
          </nav>

          <div className="max-w-7xl">
            <div className="inline-block mb-4">
              <span className="px-4 py-1.5 bg-white text-[#002256] text-sm font-semibold rounded-full">
                Institucional
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-2xl mb-4 leading-tight">
              Notícias
            </h1>
            <p className="text-lg md:text-xl text-white/95 drop-shadow-lg font-light leading-relaxed">
              Fique por dentro das últimas novidades da Aliança Seguros
            </p>
          </div>
        </div>
      </section>

      {/* Filtros */}
      <section className="py-6 px-4 md:px-10 bg-white border-b-2 border-gray-200 sticky top-14 md:top-20 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FaFilter className="text-[#002256] text-xl" />
              <span className="text-lg font-semibold text-[#002256]">
                Filtrar por período:
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedPeriod("all")}
                className={`px-5 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
                  selectedPeriod === "all"
                    ? "bg-[#B7021C] text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setSelectedPeriod("7days")}
                className={`px-5 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
                  selectedPeriod === "7days"
                    ? "bg-[#B7021C] text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Últimos 7 dias
              </button>
              <button
                onClick={() => setSelectedPeriod("30days")}
                className={`px-5 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
                  selectedPeriod === "30days"
                    ? "bg-[#B7021C] text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Últimos 30 dias
              </button>
              <button
                onClick={() => setSelectedPeriod("3months")}
                className={`px-5 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
                  selectedPeriod === "3months"
                    ? "bg-[#B7021C] text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Últimos 3 meses
              </button>
            </div>
          </div>

          {/* Contador de resultados */}
          <div className="mt-4 text-sm text-gray-600">
            {filteredNoticias.length} notícia{filteredNoticias.length !== 1 ? 's' : ''} encontrada{filteredNoticias.length !== 1 ? 's' : ''}
          </div>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <section className="py-12 md:py-16 px-4 md:px-10">
        <div className="max-w-7xl mx-auto">
          {/* Notícia em Destaque */}
          {featuredNews && (
            <div className="mb-16">
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-[#002256] mb-2">
                  Notícia em <span className="text-[#B7021C]">Destaque</span>
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-[#B7021C] to-transparent"></div>
              </div>
              
              <FeaturedNewsCard
                noticia={featuredNews}
                onClick={() => router.push(`/noticia-detalhes/${featuredNews.documentId}`)}
              />
            </div>
          )}

          {/* Outras Notícias */}
          {otherNews.length > 0 && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-[#002256] mb-2">
                  Todas as <span className="text-[#B7021C]">Notícias</span>
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-[#B7021C] to-transparent"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherNews.map((noticia) => (
                  <NewsCard
                    key={noticia.documentId}
                    noticia={noticia}
                    onClick={() => router.push(`/noticia-detalhes/${noticia.documentId}`)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Mensagem quando não há notícias */}
          {filteredNoticias.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-block p-6 rounded-full bg-gray-100 mb-6">
                <FaClock className="text-gray-400 text-5xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-3">
                Nenhuma notícia encontrada
              </h3>
              <p className="text-gray-500 mb-6">
                Não há notícias no período selecionado.
              </p>
              <button
                onClick={() => setSelectedPeriod("all")}
                className="px-6 py-3 bg-[#B7021C] text-white font-semibold rounded-full hover:bg-[#950119] transition-all"
              >
                Ver todas as notícias
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 md:py-20 px-4 md:px-10 bg-gradient-to-br from-[#002256] to-[#001a40]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Quer receber nossas novidades?
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Siga-nos nas redes sociais e fique por dentro de tudo!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => window.open('https://www.facebook.com/share/1Bb6oJkgt8/', '_blank')}
              className="px-8 py-3 bg-white text-[#002256] font-bold rounded-full hover:bg-gray-100 transition-all duration-300 shadow-xl hover:scale-105"
            >
              Facebook
            </button>
            <button
              onClick={() => window.open('https://www.instagram.com/alianca.cv', '_blank')}
              className="px-8 py-3 bg-[#B7021C] text-white font-bold rounded-full hover:bg-[#950119] transition-all duration-300 shadow-xl hover:scale-105"
            >
              Instagram
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

