"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaExclamationTriangle, FaHome, FaRedo, FaPhone } from "react-icons/fa";
import IconWhatsapp from "@/assets/Icones/whatsapp.png";
import { STRAPI_URL, STRAPI_TOKEN } from "@/data/service/axios";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [contactInfo, setContactInfo] = useState({
    telefone1: "",
    telefone2: "",
    whatsapp: "2389838822",
  });

  useEffect(() => {
    console.error("Erro capturado:", error);

    // Buscar dados de contato
    const fetchContactInfo = async () => {
      try {
        const url = `${STRAPI_URL}/api/footer?populate[itens][populate][0]=itens`;
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
            whatsapp: "2389838822",
          });
        }
      } catch (err) {
        setContactInfo({
          telefone1: "(+238) 260 89 00",
          telefone2: "(+238) 260 89 01",
          whatsapp: "2389838822",
        });
      }
    };

    fetchContactInfo();
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Card Principal */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
          {/* Ícone de Erro Animado */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping"></div>
              <div className="relative bg-gradient-to-br from-red-500 to-red-600 text-white rounded-full p-6 shadow-xl">
                <FaExclamationTriangle size={48} />
              </div>
            </div>
          </div>

          {/* Título */}
          <h1 className="text-3xl md:text-4xl font-bold text-[#002256] mb-4">
            Ops! Algo deu errado
          </h1>

          {/* Descrição */}
          <p className="text-gray-600 text-lg mb-2">
            Encontramos um problema ao carregar esta página.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            Não se preocupe, nossa equipe já foi notificada e está trabalhando para resolver.
          </p>

          {/* Detalhes do Erro (apenas em desenvolvimento) */}
          {process.env.NODE_ENV === "development" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-left">
              <p className="text-sm font-mono text-red-800 break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-red-600 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center">
            <button
              onClick={reset}
              className="group w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 bg-[#B7021C] hover:bg-[#950119] text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
            >
              <FaRedo className="group-hover:rotate-180 transition-transform duration-500 text-base sm:text-lg" />
              Tentar Novamente
            </button>

            <Link
              href="/"
              className="w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 bg-[#002256] hover:bg-[#001a40] text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
            >
              <FaHome className="text-base sm:text-lg" />
              Voltar ao Início
            </Link>
          </div>
        </div>

        {/* Informações de Contato */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-3">
            Precisa de ajuda imediata?
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center items-stretch sm:items-center">
            <a
              href={`tel:${contactInfo.telefone1.replace(/\s/g, "")}`}
              className="flex items-center justify-center gap-2 text-[#B7021C] hover:text-[#950119] font-semibold hover:underline transition-colors py-2 text-sm sm:text-base"
            >
              <FaPhone className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="truncate">{contactInfo.telefone1 || "Carregando..."}</span>
            </a>
            <span className="hidden sm:inline text-gray-400">|</span>
            <a
              href={`https://wa.me/${contactInfo.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-[#25D366] hover:text-[#1da851] font-semibold hover:underline transition-colors py-2 text-sm sm:text-base"
            >
              <Image 
                src={IconWhatsapp} 
                alt="WhatsApp" 
                width={14}
                height={14}
                className="w-3 h-3 sm:w-4 sm:h-4"
              />
              WhatsApp
            </a>
          </div>
        </div>

        {/* Mensagem de Suporte */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Aliança Seguros • Sempre ao seu lado
          </p>
        </div>
      </div>
    </div>
  );
}

