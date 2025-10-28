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

type HeaderSubmenu = {
  id: number;
  name: string;
  path: string;
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

  const isSubmenuActive = (path: string, id: number) => {
    const currentPath = pathname
      .split(/[#?]/)[0]
      .replace(/\/+/g, "/")
      .replace(/\/$/, "");

    const pathParts = path.split("/");
    const basePath = pathParts[0];

    return currentPath === `/${basePath}/${id}`;
  };

  const isMenuActive = (menuPath: string, topicos: HeaderTopico[]) => {
    const currentPath = pathname.replace(/\/+$/, "");
    const normalizedMenuPath = menuPath.replace(/\/+$/, "");

    if (currentPath === normalizedMenuPath) return true;

    return topicos.some((topico) =>
      topico.submenus.some((submenu) => {
        const normalizedSubmenuPath = submenu.path.replace(/\/+$/, "");
        return currentPath === `${normalizedSubmenuPath}/${submenu.id}`;
      })
    );
  };

  const handleButtonClick = (path: string, id: number) => {
    const cleanPath = path.split(/[#?]/)[0];
    const normalizedPath = cleanPath.replace(/\/+/g, "/").replace(/\/$/, "");

    const pathParts = normalizedPath.split("/");
    const basePath = pathParts[0];

    const finalPath = `/${basePath}/${id}`;

    router.push(finalPath);
    setIsOpen(false);
  };

  // Social icons are provided by parent via props (static)

  return (
    <header className="bg-white shadow-md fixed md:py-3 top-0 w-full md:h-24 h-14 z-50">
      <div className="flex justify-between items-center px-4 sm:px-8 lg:px-20">
        <div className="flex md:space-x-3 justify-between items-center py-3 md:py-0 w-full md:w-auto">
          <div className="md:hidden ">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 focus:outline-none"
            >
              <RiMenu2Line size={30} />
            </button>
          </div>
          <div className="flex justify-end">
            <Link href="/" className="text-white text-center">
              <Image
                src={LogoAlianca}
                alt="Logo"
                width={160}
                height={56}
                className="w-24 h-8 lg:w-40 lg:h-14"
              />
            </Link>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 h-full">
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
                  flex items-center font-bold text-blue-950 text-sm lg:text-lg py-7 px-4 transition
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

        <div
          className={`flex items-center space-x-4 md:space-x-8 ${
            isOpen ? "hidden" : ""
          }`}
        >
          {/* Ícones opcionais podem ser adicionados aqui */}
        </div>

        {/* Desktop Dropdown Menu */}
        <div
          className={`absolute left-1/2 top-16 sm:top-20 lg:top-24 transform -translate-x-1/2 shadow-xl w-full ${
            hoveredMenu && hoveredMenu.topicos.length > 0 ? "block" : "hidden"
          }`}
          onMouseEnter={() => setHoveredMenu(hoveredMenu)}
          onMouseLeave={() => setHoveredMenu(null)}
        >
          {hoveredMenu && (
            <div className="bg-[#F4F2F2] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-4 md:gap-6 lg:gap-8 p-4 sm:p-6 pb-6 sm:pb-10 pointer-events-auto w-full px-4 sm:px-8 md:px-12 lg:px-20 xl:px-32 border-b-2 border-b-red-900">
              {hoveredMenu.topicos?.map((topico) => (
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
                        <li key={submenu.id}>
                          <button
                            onClick={() =>
                              handleButtonClick(submenu.path, submenu.id)
                            }
                            className={`
                    block w-full text-left 
                    px-2 py-1 
                    text-xs sm:text-sm md:text-[0.9rem] 
                    transition 
                    border-b border-blue-900/30 hover:border-red-900 
                    ${
                      isSubmenuActive(submenu.path, submenu.id)
                        ? "font-sans text-[#B7021C] border-b-[#B7021C]"
                        : "text-blue-950 hover:text-red-700"
                    }`}
                          >
                            {submenu.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="sm:hidden md:hidden fixed top-0 left-0 h-full bg-white p-3 shadow-md w-64 flex flex-col">
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-700 absolute top-4 right-4"
            >
              <MdClose className="text-2xl" />
            </button>

            <div>
              <Link href="/" className="text-white text-center">
                <Image
                  src={LogoAlianca}
                  alt="Logo"
                  width={160}
                  height={56}
                  className="w-24 h-8 lg:w-40 lg:h-14"
                />
              </Link>
            </div>

            <div className="w-ful h-0.5 bg-[#002256] my-3"></div>

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
                            {menu.topicos.map((topico) => (
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
                                    <li key={submenu.id}>
                                      <button
                                        onClick={() =>
                                          handleButtonClick(
                                            submenu.path,
                                            submenu.id
                                          )
                                        }
                                        className={`block w-full text-left py-1 px-2 text-blue-950 hover:text-[#B7021C] transition ${
                                          isSubmenuActive(
                                            submenu.path,
                                            submenu.id
                                          )
                                            ? "text-[#B7021C] font-medium"
                                            : ""
                                        }`}
                                      >
                                        {submenu.name}
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
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

            <div className="w-ful h-0.5 bg-[#002256]"></div>
            <div className="w-full px-4 py-4 text-left">
              <div className="flex flex-col mb-4">
                <ul className="text-sm text-blue-950 font-semibold space-y-1">
                  <li>
                    <button
                      onClick={openContactModal}
                      className="hover:text-blue-900 underline"
                    >
                      Contactos
                    </button>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col mb-4">
                <h3 className="text-sm font-bold mb-2 text-left text-blue-950">
                  Siga-nos
                </h3>
                <ul className="flex items-center justify-center text-sm space-x-4">
                  {socialIcons?.map((socias) => (
                    <li key={socias.id} className="bg-gray-400 p-2 rounded-xl ">
                      <Link
                        onClick={() => setIsOpen(false)}
                        href={socias.url}
                        className="hover:text-blue-950 bg-blue-950"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Image
                          src={`${BASE_IMAGE_URL}${socias.icon[0]?.url}`}
                          alt="Social Icon"
                          width={28}
                          height={28}
                          className="rounded-full w-6 h-6 text-blue-900"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-xs text-gray-900">
                Copyright © {currentYear} Aliança Seguros. Todos os direitos
                reservados
              </p>
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
