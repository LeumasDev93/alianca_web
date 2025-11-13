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
  FaCalendar,
  FaUser,
  FaShareAlt,
  FaClock
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

interface NoticiaData {
  id: number;
  documentId: string;
  title: string;
  resume: string | null;
  description: RichTextNode[];
  notice_date: string;
  order: number;
  url_video: string | null;
  image?: BannerImage;
}

// Função para extrair parágrafos
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

// Função para formatar data
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  });
};

export default function NoticiaDetalhes() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.id as string;
  const [noticiaData, setNoticiaData] = useState<NoticiaData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const url = `${STRAPI_URL}/api/noticias/${documentId}?populate[0]=image`;
        
        console.log('🔍 Buscando notícia:', url);
        
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Erro ao buscar notícia: ${response.status}`);
        }

        const json = await response.json();
        
        if (json.data) {
          setNoticiaData(json.data);
        } else {
          setError("Nenhum dado encontrado.");
        }
      } catch (error) {
        console.error('Erro:', error);
        setError("Erro ao carregar notícia. Tente novamente mais tarde.");
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

  if (error || !noticiaData) {
    return (
      <ErrorFallback 
        error={error || "Não foi possível carregar a notícia."}
        resetErrorBoundary={() => window.location.reload()}
      />
    );
  }

  const paragraphs = extractParagraphs(noticiaData.description);
  const firstParagraph = paragraphs[0] || '';
  const restParagraphs = paragraphs.slice(1);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <FloatingButtons />

      {/* Hero Banner com Info da Notícia */}
      <section className="relative w-full bg-gradient-to-br from-[#002256] to-[#B7021C] mt-14 md:mt-20">
        <div className="max-w-4xl mx-auto px-4 md:px-10 py-12 md:py-16">
          {/* Breadcrumb */}
          <div className="mb-6">
            <button 
              onClick={() => router.push('/')}
              className="text-white/80 hover:text-white text-sm flex items-center gap-2 transition-colors"
            >
              <FaArrowRight className="rotate-180" />
              <span>Voltar para Notícias</span>
            </button>
          </div>

          {/* Título */}
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            {noticiaData.title}
          </h1>

          {/* Resumo */}
          {firstParagraph && (
            <p className="text-lg md:text-xl text-white/90 mb-6 leading-relaxed italic">
              {firstParagraph}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <FaCalendar className="text-white" />
              <span>{formatDate(noticiaData.notice_date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaUser className="text-white" />
              <span>Aliança Seguros</span>
            </div>
            <div className="flex items-center gap-2">
              <FaClock className="text-white" />
              <span>{Math.ceil(paragraphs.join(' ').length / 1000)} min de leitura</span>
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <article className="py-12 md:py-16 px-4 md:px-10">
        <div className="max-w-4xl mx-auto">
          {/* Imagem Principal (se existir) */}
          {noticiaData.image && (
            <div className="relative w-full h-64 md:h-96 mb-8 rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={`${STRAPI_URL}${noticiaData.image.url}`}
                alt={noticiaData.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Vídeo (se existir) */}
          {noticiaData.url_video && (
            <div className="mb-8 rounded-2xl overflow-hidden shadow-xl">
              <div className="relative w-full aspect-video">
                <iframe
                  src={noticiaData.url_video.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                  title={noticiaData.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
          )}

          {/* Texto da Notícia */}
          <div className="prose prose-lg max-w-none">
            {restParagraphs.map((paragraph, index) => (
              <p key={index} className="text-gray-700 text-lg leading-relaxed mb-6 text-justify">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Compartilhar */}
          <div className="mt-12 pt-8 border-t-2 border-gray-200">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h3 className="text-xl font-bold text-[#002256]">Compartilhe esta notícia</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: noticiaData.title,
                        text: firstParagraph,
                        url: window.location.href,
                      });
                    }
                  }}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#002256] to-[#B7021C] text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <FaShareAlt />
                  <span>Compartilhar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* CTA Section */}
      <section className="py-16 md:py-20 px-4 md:px-10 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#002256] mb-6">
            Fique por Dentro das Novidades
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Acompanhe as últimas notícias e atualizações da Aliança Seguros
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-[#002256] to-[#B7021C] text-white hover:from-[#001a40] hover:to-[#950119] font-bold py-3 px-8 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Ver Mais Notícias
          </button>
        </div>
      </section>
    </div>
  );
}

