"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  FaClock,
  FaEnvelope,
  FaMapLocationDot,
  FaPhone,
} from "react-icons/fa6";
import { ModalContact } from "./modalContact";
import { BASE_IMAGE_URL } from "@/data/service/axios";
import { FaMapMarkerAlt } from "react-icons/fa";

interface FooterProps {
  contactInfo: {
    telefone1?: string;
    telefone2?: string;
    email?: string;
    adress?: string;
    horarios?: { id: number; diasUteis: string }[];
    link_utels?: { id: number; nome: string; link: string }[];
  } | null;
  socialInfo: {
    rede_socials?: {
      id: number;
      nome: string;
      url: string;
      icon: { url: string }[];
    }[];
  } | null;
}

export default function Footer({ contactInfo, socialInfo }: FooterProps) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const openContactModal = () => setIsContactModalOpen(true);
  const closeContactModal = () => setIsContactModalOpen(false);

  return (
    <footer className="bg-[#292929] text-white py-4 md:py-8 px-6 lg:px-20 w-full border-t-2 border-t-[#B7021C]">
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 md:gap-6">
        <div className="flex flex-col min-h-[120px] w-full md:w-auto mb-2">
          <div className="mt-4 md:mt-6 space-y-3">
            <h3 className="text-lg font-bold mb-3">
              Horário de funcionamento:
            </h3>
            <div className="flex items-center space-x-4">
              <FaClock className="text-gray-300 size-6" />
              <div className="flex-col">
                {contactInfo?.horarios?.map((time) => (
                  <p key={time.id} className="text-sm text-gray-300">
                    {time.diasUteis}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Seção de Contactos */}
        <div className="flex flex-col text-left mt-6 min-h-[120px] w-full sm:w-auto">
          <h3 className="text-lg font-bold mb-3">Contactos</h3>
          <ul className="text-sm text-gray-300 space-y-3">
            <li className="flex items-center space-x-4 cursor-pointer">
              <FaPhone className="text-gray-300 size-5" />
              <p className="text-sm font-semibold">
                {contactInfo?.telefone1} / {contactInfo?.telefone2}
              </p>
            </li>
            <li>
              <div
                className="flex items-center space-x-4 cursor-pointer"
                onClick={openContactModal}
              >
                <FaEnvelope className="text-gray-300 size-5" />
                <p className="text-sm text-gray-300">{contactInfo?.email}</p>
              </div>
            </li>

            <li className="flex items-center space-x-4 cursor-pointer">
              <FaMapMarkerAlt className="text-gray-300 size-5" />
              <p className="text-sm text-gray-300">{contactInfo?.adress}</p>
            </li>
            <li className="flex items-center space-x-4">
              <FaMapLocationDot className="text-gray-300 size-5" />
              <Link
                href="/mapa"
                target="_blank"
                className="underline text-xs text-gray-300"
              >
                Ver no mapa
              </Link>
            </li>
          </ul>
        </div>
        {/* Seção de Links Úteis */}
        <div className="flex flex-col text-left mt-6 min-h-[120px] w-full sm:w-auto">
          <h3 className="text-lg font-bold mb-3">Links Úteis</h3>
          <ul className="text-sm text-gray-300 space-y-2">
            {contactInfo?.link_utels?.map((link) => (
              <li key={link.id}>
                <Link
                  href={link.link}
                  className="hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.nome}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Seção de Redes Sociais */}
        <div className="flex flex-col mt-6 min-h-[120px] w-full sm:w-auto">
          <h3 className="text-lg font-bold mb-3">Siga-nos</h3>
          <ul className="flex items-center md:space-x-4">
            {socialInfo?.rede_socials?.map((social) => (
              <li key={social.id}>
                <Link
                  href={social.url}
                  className="hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={`${BASE_IMAGE_URL}${social.icon[0]?.url}`}
                    alt={social.nome}
                    width={28}
                    height={28}
                    className="rounded-full w-10 h-10"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="text-center mt-10">
        <p className="text-xs md:text-sm text-gray-400">
          Copyright © {new Date().getFullYear()} Aliança Seguros. Todos os
          direitos reservados
        </p>
      </div>

      {isContactModalOpen && (
        <ModalContact
          onClose={closeContactModal}
          telefone1={contactInfo?.telefone1 || ""}
          telefone2={contactInfo?.telefone2 || ""}
        />
      )}
    </footer>
  );
}
