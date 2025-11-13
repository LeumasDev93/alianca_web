"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaSearch, FaHome, FaArrowLeft, FaPhone } from "react-icons/fa";
import IconWhatsapp from "@/assets/Icones/whatsapp.png";
import { STRAPI_URL, STRAPI_TOKEN } from "@/data/service/axios";

export default function NotFound() {
  const [contactInfo, setContactInfo] = useState({
    telefone1: "",
    whatsapp: "2389838822",
  });

  useEffect(() => {
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
          const [tel1] = telefones.split(" / ");

          setContactInfo({
            telefone1: tel1?.trim() || "(+238) 260 89 00",
            whatsapp: "2389838822",
          });
        }
      } catch (error) {
        setContactInfo({
          telefone1: "(+238) 260 89 00",
          whatsapp: "2389838822",
        });
      }
    };

    fetchContactInfo();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-3xl w-full">
        {/* Card Principal */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center overflow-hidden relative">
          {/* Decoração de fundo */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#002256] via-[#B7021C] to-[#002256]"></div>

          {/* Número 404 Grande */}
          <div className="relative mb-6">
            <h1 className="text-[120px] md:text-[180px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#002256] to-[#0047AB] leading-none select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white rounded-full p-4 shadow-xl">
                <FaSearch className="text-[#B7021C]" size={40} />
              </div>
            </div>
          </div>

          {/* Título e Descrição */}
          <h2 className="text-2xl md:text-3xl font-bold text-[#002256] mb-4">
            Página Não Encontrada
          </h2>
          <p className="text-gray-600 text-lg mb-2">
            A página que você está procurando não existe ou foi movida.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            Verifique se o endereço está correto ou tente uma das opções abaixo.
          </p>

          {/* Links Úteis */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-[#002256] mb-4">
              Páginas Populares
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/"
                className="text-left p-3 bg-white rounded-lg hover:bg-blue-50 hover:shadow-md transition-all duration-300 border border-gray-200"
              >
                <span className="text-[#002256] font-semibold hover:text-[#B7021C]">
                  🏠 Página Inicial
                </span>
              </Link>
              <Link
                href="/simulaction"
                className="text-left p-3 bg-white rounded-lg hover:bg-blue-50 hover:shadow-md transition-all duration-300 border border-gray-200"
              >
                <span className="text-[#002256] font-semibold hover:text-[#B7021C]">
                  🧮 Simulação
                </span>
              </Link>
              <Link
                href="/mapa"
                className="text-left p-3 bg-white rounded-lg hover:bg-blue-50 hover:shadow-md transition-all duration-300 border border-gray-200"
              >
                <span className="text-[#002256] font-semibold hover:text-[#B7021C]">
                  📍 Nossas Lojas
                </span>
              </Link>
              <Link
                href="/alianca"
                className="text-left p-3 bg-white rounded-lg hover:bg-blue-50 hover:shadow-md transition-all duration-300 border border-gray-200"
              >
                <span className="text-[#002256] font-semibold hover:text-[#B7021C]">
                  ℹ️ Sobre Nós
                </span>
              </Link>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center">
            <button
              onClick={() => window.history.back()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-[#002256] font-bold py-3 px-6 sm:px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
            >
              <FaArrowLeft className="text-base sm:text-lg" />
              Voltar
            </button>

            <Link
              href="/"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#002256] to-[#0047AB] hover:from-[#001a40] hover:to-[#003380] text-white font-bold py-3 px-6 sm:px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
            >
              <FaHome className="text-base sm:text-lg" />
              Ir para Home
            </Link>
          </div>
        </div>

        {/* Informações de Ajuda */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-3">
            Não encontrou o que procura?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center">
            <a
              href={`tel:${contactInfo.telefone1.replace(/\s/g, "")}`}
              className="flex items-center justify-center gap-2 text-[#B7021C] hover:text-[#950119] font-semibold hover:underline transition-colors text-sm sm:text-base"
            >
              <span className="bg-[#B7021C]/10 p-1.5 sm:p-2 rounded-full">
                <FaPhone className="w-3 h-3 sm:w-4 sm:h-4 text-[#B7021C]" />
              </span>
              <span className="truncate">{contactInfo.telefone1 || "Carregando..."}</span>
            </a>
            <span className="hidden sm:inline text-gray-400">•</span>
            <a
              href={`https://wa.me/${contactInfo.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-[#25D366] hover:text-[#1da851] font-semibold hover:underline transition-colors text-sm sm:text-base"
            >
              <span className="bg-[#25D366]/10 p-1.5 sm:p-2 rounded-full">
                <Image 
                  src={IconWhatsapp} 
                  alt="WhatsApp" 
                  width={14}
                  height={14}
                  className="w-3 h-3 sm:w-4 sm:h-4"
                />
              </span>
              WhatsApp
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Aliança Seguros © {new Date().getFullYear()} • Todos os direitos reservados
          </p>
        </div>
      </div>
    </div>
  );
}

