"use client";

import Image from "next/image";
import IconContactWhite from "@/assets/Icones/Contactar_Icone.png";
import IconContactBlue from "@/assets/Icones/Contactar_Icone.svg";
import { ModalContact } from "./modalContact"; // Supondo que você tenha um componente de modal
import { useState } from "react";

export default function ButtonContact() {
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar a visibilidade do modal

  // Função para abrir o modal
  const handleModalContact = () => {
    setIsModalOpen(true);
  };

  // Função para fechar o modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={handleModalContact}
        className="fixed top-[470px] md:top-96 right-0.5 p-4 md:p-4 bg-blue-900 hover:bg-white hover:border border-blue-950 rounded-xl shadow-lg transition-all duration-300 ease-in-out w-10 h-10 md:w-20 md:h-20 flex flex-col items-center justify-center group"
      >
        <div className="flex items-center justify-center md:relative w-4 h-4 md:w-8 md:h-8">
          {/* Imagem padrão */}
          <Image
            src={IconContactWhite}
            alt="Simular"
            className="absolute w-6 h-6 md:w-8 md:h-8 transition-opacity duration-300 opacity-100 group-hover:opacity-0"
          />

          {/* Imagem ao passar o mouse */}
          <Image
            src={IconContactBlue}
            alt="Simular Hover"
            className="absolute w-6 h-6 md:w-8 md:h-8 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          />
        </div>
        {/* Texto que muda junto com a imagem */}
        <span className="text-xs text-white mt-1 hidden md:flex transition-colors duration-300 group-hover:text-[#002256]">
          Contactar
        </span>
      </button>

      {isModalOpen && <ModalContact onClose={handleCloseModal} telefone1="" telefone2=""/>}
    </>
  );
}
