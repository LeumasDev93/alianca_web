/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MdClose } from "react-icons/md";
import { RiMenu2Line } from "react-icons/ri";
import { usePathname, useRouter } from "next/navigation";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

import LogoAlianca from "@/assets/images/AlincaSeguros.png";
import { ModalContact } from "./modalContact";
import { BASE_IMAGE_URL } from "@/data/service/axios";
import { PhoneIcon, LockKeyhole } from "lucide-react";

type HeaderSubmenu = {
  id: number;
  name: string;
  link: string;
  documentId?: string | null;
  layout?: string | null;
  icon?: { url: string; alt?: string } | null;
};

type HeaderTopico = {
  id: number;
  title: string;
  order: number;
  icon: { url: string; alt?: string } | null;
  submenus: HeaderSubmenu[];
};

type HeaderMenu = {
  id: number;
  name: string;
  path: string;
  order?: number;
  topicos: HeaderTopico[];
};

type SocialIcon = { id: number; url: string; icon: { url: string }[] };

export default function Header({
  menus,
  socialIcons,
}: {
  menus: HeaderMenu[];
  socialIcons: SocialIcon[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [hoveredMenu, setHoveredMenu] = useState<HeaderMenu | null>(null);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const openContactModal = () => {
    setIsContactModalOpen(true);
    setIsOpen(false);
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
  };

  const toggleMenu = (menuName: string) => {
    setExpandedMenu(expandedMenu === menuName ? null : menuName);
  };

  const isSubmenuActive = (link: string, id: number) => {
    const currentPath = pathname
      .split(/[#?]/)[0]
      .replace(/\/+/g, "/")
      .replace(/\/$/, "");

    const pathParts = link.split("/");
    const basePath = pathParts[0];

    return currentPath === `/${basePath}/${id}`;
  };

  const isMenuActive = (menuPath: string, topicos: HeaderTopico[]) => {
    const currentPath = pathname.replace(/\/+$/, "");
    const normalizedMenuPath = menuPath.replace(/\/+$/, "");

    if (currentPath === normalizedMenuPath) return true;

    return topicos.some((topico) =>
      topico.submenus.some((submenu) => {
        const normalizedSubmenuLink = submenu.link.replace(/\/+$/, "");
        return currentPath === `${normalizedSubmenuLink}/${submenu.id}`;
      })
    );
  };

  const handleButtonClick = (submenu: HeaderSubmenu, menuName?: string) => {
    // Se tiver documentId e layout, usar o layout especificado
    if (submenu.documentId && submenu.layout) {
      const finalPath = `/${submenu.layout}/${submenu.documentId}`;
      router.push(finalPath);
      setIsOpen(false);
      setHoveredMenu(null);
      return;
    }

    // Se tiver documentId mas sem layout, usar details-submenus como padrão
    if (submenu.documentId) {
      const finalPath = `/details-submenus/${submenu.documentId}`;
      router.push(finalPath);
      setIsOpen(false);
      setHoveredMenu(null);
      return;
    }

    // Se o link não for "#", navegar
    if (submenu.link && submenu.link !== "#") {
      // Se for link externo (começa com http), abrir em nova aba
      if (submenu.link.startsWith('http')) {
        window.open(submenu.link, '_blank', 'noopener,noreferrer');
      } else {
        router.push(submenu.link);
      }
      setIsOpen(false);
      setHoveredMenu(null);
      return;
    }

    // Se não tiver destino válido, apenas fechar o menu
    setIsOpen(false);
    setHoveredMenu(null);
  };

  // Social icons are provided by parent via props (static)

  return (
    <header className="bg-white shadow-md fixed top-0 w-full md:h-20 h-14 z-50 px-4 sm:px-6 lg:px-20">
      <div className="flex justify-between items-center h-full max-w-7xl mx-auto">
        {/* Logo - Sempre à esquerda */}
        <div className="flex items-center h-full">
          <Link href="/" className="text-white text-center flex items-center">
            <Image
              src={LogoAlianca}
              alt="Logo"
              width={160}
              height={56}
              className="w-24 h-8 sm:w-28 sm:h-10 lg:w-36 lg:h-12"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex h-full">
          {menus.map((menu) => (
            <div
              key={menu.id}
              className="relative group h-full"
              onMouseEnter={() => setHoveredMenu(menu)}
              onMouseLeave={() => setHoveredMenu(null)}
            >
              <Link
                href={menu.path}
                className={`
                  flex items-center h-full font-bold text-blue-950 text-sm lg:text-lg px-6 transition
                  hover:text-white hover:bg-[#B7021C]
                  ${
                    isMenuActive(menu.path, menu.topicos)
                      ? "bg-[#B7021C] text-white "
                      : ""
                  }
                  ${
                    hoveredMenu?.id === menu.id
                      ? "bg-[#B7021C] text-white "
                      : ""
                  }
                `}
              >
                <span>{menu.name}</span>
                {menu.topicos &&
                  menu.topicos.length > 0 &&
                  (hoveredMenu?.id === menu.id ? (
                    <FaChevronUp className="w-4 h-4 ml-1 transition-transform" />
                  ) : (
                    <FaChevronDown className="w-4 h-4 ml-1 transition-transform" />
                  ))}
              </Link>
            </div>
          ))}
        </nav>

        {/* Botão Portal - Desktop */}
        <Link 
          href="https://portal-myalianca.vercel.app" 
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-sm lg:text-base bg-gray-200 text-[#002256] hover:bg-gray-300 transition-all duration-300 group"
        >
          <LockKeyhole className="w-4 h-4 lg:w-5 lg:h-5" />
          <span className="relative inline-block text-[#B7021C]">
            My<span className="text-[#002256]">Aliança</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#002256] via-purple-600 to-[#B7021C] group-hover:w-full transition-all duration-500 ease-out"></span>
          </span>
        </Link>

        {/* Botão Menu - Mobile (à direita) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-700 focus:outline-none p-2"
        >
          <RiMenu2Line size={28} />
        </button>

        {/* Desktop Dropdown Menu */}
        <div
          className={`absolute left-0 right-0 top-16 sm:top-16 lg:top-20 shadow-xl w-full ${
            hoveredMenu && hoveredMenu.topicos.length > 0 ? "block" : "hidden"
          }`}
          onMouseEnter={() => setHoveredMenu(hoveredMenu)}
          onMouseLeave={() => setHoveredMenu(null)}
        >
          {hoveredMenu && (
            <div className="bg-[#F4F2F2] w-full border-b-2 border-b-red-900">
              {/* Container com largura máxima */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-4 md:gap-6 lg:gap-8 py-6 sm:py-8 pb-8 sm:pb-10 pointer-events-auto">
                  {hoveredMenu.topicos?.map((topico) => {
                    // Verificar se é um link direto (1 submenu com o mesmo título)
                    const isDirectLink = topico.submenus?.length === 1 && topico.submenus[0].name === topico.title;
                    
                    if (isDirectLink) {
                      // Renderizar apenas o link, sem título de tópico
                      const submenu = topico.submenus[0];
                      return (
                        <div key={topico.id} className="group">
                          <button
                            onClick={() => handleButtonClick(submenu, hoveredMenu?.name)}
                            className={`
                              flex items-center gap-2 w-full text-left 
                              px-2 py-2
                              text-sm md:text-base font-semibold
                              transition-colors duration-300
                              relative
                              ${
                                isSubmenuActive(submenu.link, submenu.id)
                                  ? "text-[#B7021C]"
                                  : "text-blue-950 hover:text-[#B7021C] hover:font-semibold"
                              }`}
                          >
                            {submenu.icon && (
                              <Image
                                src={submenu.icon.url}
                                alt={submenu.icon.alt || submenu.name}
                                width={20}
                                height={20}
                                className="w-5 h-5 flex-shrink-0"
                              />
                            )}
                            <span className="relative inline-block pb-2">
                              {submenu.name}
                              <span className="absolute bottom-0 left-0 h-[2px] w-full bg-blue-900/30"></span>
                              <span className={`absolute bottom-0 left-0 h-[2px] bg-[#B7021C] transition-all duration-500 ease-out ${
                                isSubmenuActive(submenu.link, submenu.id) ? "w-full" : "w-0 group-hover:w-full"
                              }`}></span>
                            </span>
                          </button>
                        </div>
                      );
                    }

                    // Renderizar normalmente com título e submenus
                    return (
                      <div key={topico.id} className="space-y-2 sm:space-y-3">
                        {/* Título do Tópico com Ícone - Responsivo */}
                        <div className="flex items-center space-x-2 w-full">
                          {topico.icon && (
                            <Image
                              src={topico.icon.url}
                              alt={topico.icon.alt || topico.title}
                              width={20}
                              height={20}
                              className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
                            />
                          )}
                          <h3 className="font-semibold text-blue-950 text-xs sm:text-sm md:text-base lg:text-lg">
                            {topico.title}
                          </h3>
                        </div>

                        {/* Lista de Submenus - Responsivo */}
                        {topico.submenus?.length > 0 && (
                          <ul className="space-y-1 sm:space-y-2">
                            {topico.submenus.map((submenu) => (
                              <li key={submenu.id} className="group">
                                <button
                                  onClick={() =>
                                    handleButtonClick(submenu, hoveredMenu?.name)
                                  }
                                  className={`
                          flex items-center gap-2 w-full text-left 
                          px-2 py-1 
                          text-xs sm:text-sm md:text-[0.9rem] 
                          transition-colors duration-300
                          ${
                            isSubmenuActive(submenu.link, submenu.id)
                              ? "font-sans text-[#B7021C]"
                              : "text-blue-950 hover:text-[#B7021C] hover:font-semibold"
                          }`}
                                >
                                  {submenu.icon && (
                                    <Image
                                      src={submenu.icon.url}
                                      alt={submenu.icon.alt || submenu.name}
                                      width={16}
                                      height={16}
                                      className="w-4 h-4 flex-shrink-0"
                                    />
                                  )}
                                  <span className="relative inline-block pb-1">
                                    {submenu.name}
                                    <span className="absolute bottom-0 left-0 h-[1px] w-full bg-blue-900/30"></span>
                                    <span className={`absolute bottom-0 left-0 h-[2px] bg-[#B7021C] transition-all duration-500 ease-out ${
                                      isSubmenuActive(submenu.link, submenu.id) ? "w-full" : "w-0 group-hover:w-full"
                                    }`}></span>
                                  </span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden fixed top-0 left-0 h-full bg-white shadow-2xl w-72 sm:w-80 flex flex-col z-50 overflow-hidden">
            {/* Header do Menu */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <Link href="/" onClick={() => setIsOpen(false)}>
                <Image
                  src={LogoAlianca}
                  alt="Logo"
                  width={160}
                  height={56}
                  className="w-28 h-10"
                />
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-[#B7021C] transition-colors p-2"
              >
                <MdClose className="text-3xl" />
              </button>
            </div>

            {/* Botão Portal - Mobile */}
            <div className="px-4 pt-3 pb-2">
              <Link 
                href="https://portal-myalianca.vercel.app" 
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-gray-100 to-gray-200 text-[#002256] hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-md"
              >
                <LockKeyhole className="w-5 h-5" />
                <span className="text-[#B7021C]">
                  My<span className="text-[#002256]">Aliança</span>
                </span>
              </Link>
            </div>

            <div className="w-full h-0.5 bg-[#002256] my-2"></div>

            <div className="flex-1 overflow-y-auto pb-20">
              <div className="space-y-2">
                {menus.map((menu) => (
                  <div key={menu.id} className="relative">
                    {menu.topicos.length > 0 ? (
                      <>
                        <button
                          onClick={() => toggleMenu(menu.name)}
                          className={`flex justify-between items-center w-full text-blue-950 py-3 px-4 hover:text-white hover:bg-[#B7021C] hover:rounded-lg hover:font-semibold transition ${
                            isMenuActive(menu.path, menu.topicos)
                              ? "bg-[#B7021C] text-white font-semibold"
                              : ""
                          }`}
                        >
                          <span>{menu.name}</span>
                          <span>{expandedMenu === menu.name ? "−" : "+"}</span>
                        </button>

                        {expandedMenu === menu.name && (
                          <div className="pl-4 mt-1 space-y-2">
                            {menu.topicos.map((topico) => {
                              // Verificar se é um link direto (1 submenu com o mesmo título)
                              const isDirectLink = topico.submenus?.length === 1 && topico.submenus[0].name === topico.title;
                              
                              if (isDirectLink) {
                                // Renderizar apenas o link, sem título de tópico
                                const submenu = topico.submenus[0];
                                return (
                                  <div key={topico.id} className="group">
                                    <button
                                      onClick={() => handleButtonClick(submenu, menu.name)}
                                      className={`flex items-center gap-2 w-full text-left py-2 px-2 text-blue-950 hover:text-[#B7021C] transition-colors duration-300 font-medium ${
                                        isSubmenuActive(submenu.link, submenu.id)
                                          ? "text-[#B7021C] font-semibold"
                                          : ""
                                      }`}
                                    >
                                      {submenu.icon && (
                                        <Image
                                          src={submenu.icon.url}
                                          alt={submenu.icon.alt || submenu.name}
                                          width={18}
                                          height={18}
                                          className="w-4.5 h-4.5 flex-shrink-0"
                                        />
                                      )}
                                      <span className="relative inline-block pb-1">
                                        {submenu.name}
                                        <span className="absolute bottom-0 left-0 h-[1px] w-full bg-blue-900/30"></span>
                                        <span className={`absolute bottom-0 left-0 h-[1px] bg-[#B7021C] transition-all duration-500 ease-out ${
                                          isSubmenuActive(submenu.link, submenu.id) ? "w-full" : "w-0 group-hover:w-full"
                                        }`}></span>
                                      </span>
                                    </button>
                                  </div>
                                );
                              }

                              // Renderizar normalmente com título e submenus
                              return (
                                <div key={topico.id} className="space-y-1">
                                  <div className="flex items-center pl-2">
                                    {topico.icon && (
                                      <Image
                                        src={topico.icon.url}
                                        alt={topico.title}
                                        width={20}
                                        height={20}
                                        className="mr-2"
                                        onError={(e) => {
                                          (
                                            e.target as HTMLImageElement
                                          ).style.display = "none";
                                        }}
                                      />
                                    )}
                                    <span className="font-medium text-blue-950">
                                      {topico.title}
                                    </span>
                                  </div>

                                  <ul className="pl-8 space-y-1">
                                    {topico.submenus.map((submenu) => (
                                      <li key={submenu.id} className="group">
                                        <button
                                          onClick={() =>
                                            handleButtonClick(submenu, menu.name)
                                          }
                                          className={`flex items-center gap-2 w-full text-left py-1 px-2 text-blue-950 hover:text-[#B7021C] transition-colors duration-300 ${
                                            isSubmenuActive(
                                              submenu.link,
                                              submenu.id
                                            )
                                              ? "text-[#B7021C] font-medium"
                                              : ""
                                          }`}
                                        >
                                          {submenu.icon && (
                                            <Image
                                              src={submenu.icon.url}
                                              alt={submenu.icon.alt || submenu.name}
                                              width={14}
                                              height={14}
                                              className="w-3.5 h-3.5 flex-shrink-0"
                                            />
                                          )}
                                          <span className="relative inline-block pb-1">
                                            {submenu.name}
                                            <span className="absolute bottom-0 left-0 h-[1px] w-full bg-blue-900/30"></span>
                                            <span className={`absolute bottom-0 left-0 h-[1px] bg-[#B7021C] transition-all duration-500 ease-out ${
                                              isSubmenuActive(submenu.link, submenu.id) ? "w-full" : "w-0 group-hover:w-full"
                                            }`}></span>
                                          </span>
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={menu.path}
                        onClick={() => setIsOpen(false)}
                        className={`block w-full text-blue-950 py-3 px-4 hover:text-white hover:bg-[#B7021C] hover:rounded-lg hover:font-semibold transition ${
                          isMenuActive(menu.path, menu.topicos)
                            ? "bg-[#B7021C] text-white font-semibold"
                            : ""
                        }`}
                      >
                        {menu.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer do Menu Mobile */}
            <div className="border-t border-gray-200 bg-gray-50">
              <div className="px-4 py-4">
                {/* Contactos */}
                <div className="mb-3">
                  <button
                    onClick={openContactModal}
                    className="text-sm text-blue-950 font-semibold hover:text-[#B7021C] underline transition-colors"
                  >
                    Contactos
                  </button>
                </div>

                {/* Redes Sociais */}
                <div className="mb-3">
                  <h3 className="text-sm font-bold mb-2 text-blue-950">
                    Siga-nos
                  </h3>
                  <div className="flex items-center gap-3">
                    {socialIcons?.map((socias) => (
                      <Link
                        key={socias.id}
                        onClick={() => setIsOpen(false)}
                        href={socias.url}
                        className="bg-gray-200 hover:bg-gray-300 p-2 rounded-lg transition-all duration-200 hover:scale-110"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Image
                          src={`${BASE_IMAGE_URL}${socias.icon[0]?.url}`}
                          alt="Social Icon"
                          width={24}
                          height={24}
                          className="w-6 h-6"
                        />
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Copyright */}
                <p className="text-xs text-gray-600 leading-relaxed">
                  Copyright © {currentYear} Aliança Seguros.<br />
                  Todos os direitos reservados
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {isContactModalOpen && (
        <ModalContact telefone1="" telefone2="" onClose={closeContactModal} />
      )}
    </header>
  );
}
