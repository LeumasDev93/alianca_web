"use client";

import Image from "next/image";
import IconSimulateWhite from "@/assets/Icones/Simular_Icone.png";
import IconSimulateBlue from "@/assets/Icones/Simular_Icone.svg";
import { ModalSimulate } from "./Simulate/modalSimulate";
import { useState } from "react";
export default function ButtonSimulate() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Função para abrir o modal
  const handleSimulate = () => {
    setIsModalOpen(true);
  };

  // Função para fechar o modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={handleSimulate}
        className="fixed top-40 md:top-40 right-2 z-[1000] p-4 md:p-4 bg-blue-950 hover:bg-white hover:border border-blue-950 rounded-xl shadow-lg transition-all duration-300 ease-in-out w-10 h-10 md:w-20 md:h-20 flex flex-col items-center justify-center group"
      >
        <div className="flex items-center justify-center md:relative w-4 h-3 md:w-8 md:h-8">
          {/* Imagem padrão */}
          <Image
            src={IconSimulateWhite}
            alt="Simular"
            className="absolute w-6 h-6 md:w-8 md:h-8 transition-opacity duration-300 opacity-100 group-hover:opacity-0"
          />

          {/* Imagem ao passar o mouse */}
          <Image
            src={IconSimulateBlue}
            alt="Simular Hover"
            className="absolute w-6 h-6 md:w-8 md:h-8 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          />
        </div>
        {/* Texto que muda junto com a imagem */}
        <span className="text-xs text-white mt-1 hidden md:flex transition-colors duration-300 group-hover:text-[#002256]">
          Simular
        </span>
      </button>
      {isModalOpen && <ModalSimulate onClose={handleCloseModal} />}
    </>
  );
}
