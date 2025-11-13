"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FaExclamationCircle, FaHome, FaRedo, FaPhone } from "react-icons/fa";
import IconWhatsapp from "@/assets/Icones/whatsapp.png";
import { STRAPI_URL, STRAPI_TOKEN } from "@/data/service/axios";

interface ErrorFallbackProps {
  error?: string;
  resetErrorBoundary?: () => void;
}

export default function ErrorFallback({ 
  error = "Não foi possível carregar esta página.",
  resetErrorBoundary 
}: ErrorFallbackProps) {
  const router = useRouter();
  const [contactInfo, setContactInfo] = useState<{
    telefone1: string;
    telefone2: string;
    whatsapp: string;
  }>({
    telefone1: "",
    telefone2: "",
    whatsapp: "",
  });

  useEffect(() => {
    // Buscar dados de contato do Footer
    const fetchContactInfo = async () => {
      try {
        const url = `${STRAPI_URL}/api/footer?populate[itens][populate][0]=itens&populate[itens][populate][itens][populate][1]=icon`;
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
          cache: "no-store",
        });

        if (res.ok) {
          const json = await res.json();
          const contactSection = json.data?.itens?.find((item: any) => item.title === "Contactos");
          const telefones = contactSection?.itens?.find((i: any) => i.title?.includes("(+238)"))?.title || "";
          const [tel1, tel2] = telefones.split(" / ");

          setContactInfo({
            telefone1: tel1?.trim() || "(+238) 260 89 00",
            telefone2: tel2?.trim() || "",
            whatsapp: "2389838822", // Número do WhatsApp
          });
        }
      } catch (error) {
        console.error("Erro ao buscar contatos:", error);
        // Valores padrão em caso de erro
        setContactInfo({
          telefone1: "(+238) 260 89 00",
          telefone2: "(+238) 260 89 01",
          whatsapp: "2389838822",
        });
      }
    };

    fetchContactInfo();
  }, []);

  const handleRetry = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Card Principal com Animação */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center animate-fade-in">
          {/* Ícone de Erro Grande e Animado */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              {/* Pulso de fundo */}
              <div className="absolute inset-0 bg-orange-500/20 rounded-full animate-ping"></div>
              
              {/* Círculo principal */}
              <div className="relative bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-full p-8 shadow-2xl">
                <FaExclamationCircle size={64} className="animate-pulse" />
              </div>
            </div>
          </div>

          {/* Título */}
          <h1 className="text-3xl md:text-4xl font-bold text-[#002256] mb-4">
            Algo deu errado
          </h1>

          {/* Descrição do Erro */}
          <div className="mb-8">
            <p className="text-gray-600 text-lg mb-3">
              {error}
            </p>
            <p className="text-gray-500 text-sm">
              Desculpe o inconveniente. Por favor, tente novamente ou volte à página inicial.
            </p>
          </div>

          {/* Caixa de Informação */}
          <div className="bg-blue-50 border-l-4 border-[#002256] rounded-lg p-6 mb-8 text-left">
            <div className="flex items-start gap-3">
              <div className="bg-[#002256] text-white rounded-full p-2 flex-shrink-0">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[#002256] mb-2">
                  O que você pode fazer:
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-[#B7021C] mt-1">•</span>
                    <span>Verificar sua conexão com a internet</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#B7021C] mt-1">•</span>
                    <span>Tentar recarregar a página</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#B7021C] mt-1">•</span>
                    <span>Voltar à página inicial e navegar novamente</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center mb-6">
            <button
              onClick={handleRetry}
              className="group w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-[#B7021C] to-[#950119] hover:from-[#950119] hover:to-[#7a0115] text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
            >
              <FaRedo className="group-hover:rotate-180 transition-transform duration-500 text-base sm:text-lg" />
              <span>Tentar Novamente</span>
            </button>

            <button
              onClick={handleGoHome}
              className="w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-[#002256] to-[#0047AB] hover:from-[#001a40] hover:to-[#003380] text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
            >
              <FaHome className="text-base sm:text-lg" />
              <span>Voltar ao Início</span>
            </button>
          </div>

          {/* Linha Divisória */}
          <div className="border-t border-gray-200 my-6"></div>

          {/* Informações de Contato */}
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-3 font-semibold">
              Precisa de ajuda imediata?
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center items-stretch sm:items-center">
              <a
                href={`tel:${contactInfo.telefone1.replace(/\s/g, "")}`}
                className="group flex items-center justify-center gap-2 bg-gray-100 hover:bg-[#002256] text-[#002256] hover:text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base"
              >
                <FaPhone className="group-hover:rotate-12 transition-transform text-sm sm:text-base" />
                <span className="font-semibold truncate">
                  {contactInfo.telefone1 || "Carregando..."}
                </span>
              </a>
              
              {contactInfo.telefone2 && (
                <a
                  href={`tel:${contactInfo.telefone2.replace(/\s/g, "")}`}
                  className="group flex items-center justify-center gap-2 bg-gray-100 hover:bg-[#002256] text-[#002256] hover:text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base"
                >
                  <FaPhone className="group-hover:rotate-12 transition-transform text-sm sm:text-base" />
                  <span className="font-semibold truncate">{contactInfo.telefone2}</span>
                </a>
              )}
              
              <a
                href={`https://wa.me/${contactInfo.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1da851] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base"
              >
                <Image 
                  src={IconWhatsapp} 
                  alt="WhatsApp" 
                  width={18}
                  height={18}
                  className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform"
                />
                <span className="font-semibold">WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Aliança Seguros © {new Date().getFullYear()} • Sempre ao seu lado
          </p>
        </div>
      </div>
    </div>
  );
}

