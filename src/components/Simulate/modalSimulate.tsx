"use client";

import { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { LiaSpinnerSolid } from "react-icons/lia";

export function ModalSimulate({ onClose }: { onClose: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("1"); 

  const handleClick = () => {
    setIsLoading(true);
    
    const params = new URLSearchParams();
    params.append('type', selectedOption);
    // Aqui você pode usar o selectedOption
    console.log("Tipo de seguro selecionado:", selectedOption);
    
    // Simulação de chamada API com o valor selecionado
    setTimeout(() => {
      setIsLoading(false);
      // Redirecionar com o parâmetro
      window.location.href = `/simulaction?${params.toString()}`;
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
      <div className="relative bg-white p-10 rounded-md shadow-lg z-60 flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-black"
        >
          <IoCloseOutline className="w-6 h-6" />
        </button>
        <div className="flex justify-center w-full mb-4 font-bold">
          <p className="text-red-800 text-2xl font-serif uppercase">
            Simulador
          </p>
        </div>
        <div className="flex justify-center items-center text-center w-60 font-semibold mt-4">
          <h1 className="text-red-800 text-xl font-serif">
            Simule uma Cotação
          </h1>
        </div>

        <div className="flex justify-center items-center text-center w-60 font-serif mt-10">
          <select
            id="type" 
            name="type" 
            title="Selecione o tipo de seguro"
            className="w-60 px-2 py-4 border text-gray-700 border-gray-400 rounded-md focus:outline-none"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option value="1">Automóvel</option>
          </select>
        </div>

        <div className="flex justify-center w-full mt-10 font-semibold">
          <button
            onClick={handleClick}
            className="bg-red-800 text-white text-lg font-serif py-2 px-4 rounded-md shadow-md hover:bg-red-900 transition-all duration-300 flex items-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <LiaSpinnerSolid className="animate-spin w-5 h-5" />
                Aguarde...
              </>
            ) : (
              "Quero simular"
            )}
          </button>
        </div>
        {/* <div className="flex justify-center items-center w-32 mt-5">
          <Link
            href=""
            className="bg-gray-100 border border-red-700 text-center text-red-700 text-sm font-semibold py-2 px-4 rounded-md shadow-md hover:bg-gray-200 transition-all duration-300"
          >
            Recuperar Simulação
          </Link>
        </div> */}
      </div>
    </div>
  );
}
