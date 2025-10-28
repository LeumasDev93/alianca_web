import React, { useState, useEffect } from "react";
import { LoadingSpinner } from "../Loading";
import { IoCloseOutline } from "react-icons/io5";
import LogoAlianca from "@/assets/images/AlincaSeguros.png";
import Image from "next/image";

interface TaxData {
  [key: string]: number;
}

interface InstallmentValue {
  name: string;
  value: number;
  taxes: TaxData;
}

interface SimulationProps {
  simulationResult?: InstallmentValue[] | null;
  currencySymbol?: string;
  isLoading?: boolean;
}

// Funções auxiliares fora do componente
function formatTaxLabel(taxKey: string): string {
  const parts = taxKey.split(" - ");
  const sigla = parts[0];
  
  if (parts.length >= 2) {
    const primeiraPalavra = parts[1].split(' ')[0];
    return `${sigla} - ${primeiraPalavra}`;
  }
  
  return sigla;
}

function getPlanTitle(planCode: string): string {
  switch (planCode) {
    case "A": return "ANUAL";
    case "S": return "SEMESTRAL";
    case "T": return "TRIMESTRAL";
    case "M": return "MENSAL";
    default: return planCode;
  }
}

const formatCVECurrency = (value: number) => {
  return value.toLocaleString('pt-PT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

export const Simulation: React.FC<SimulationProps> = ({ 
  simulationResult = null, 
  currencySymbol = "CVE",
  isLoading = false
}) => {
  // Estados
  const [localLoading, setLocalLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [alert, setAlert] = useState(false);
  const [modalResult, setModalResult] = useState(false);

  // Efeitos
  useEffect(() => {
    setLocalLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (simulationResult && simulationResult.length > 0) {
      const annualIndex = simulationResult.findIndex(item => 
        item.name.toLowerCase().includes("anual") || 
        item.name.toLowerCase().includes("annual") ||
        getPlanTitle(item.name) === "ANUAL"
      );
      setSelectedIndex(annualIndex !== -1 ? annualIndex : 0);
    }
  }, [simulationResult]);

  // Handlers
  const handleOpenDialog = (index: number) => {
    setAlert(true);
    setSelectedIndex(index);
  };

  const handleResult = () => {
    setModalResult(true);
    setAlert(false);
  }
  // Renderização condicional
  if (localLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (!simulationResult || simulationResult.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhum dado de simulação disponível
      </div>
    );
  }

  const taxKeys = simulationResult.length > 0 
    ? Object.keys(simulationResult[0].taxes) 
    : [];

  return (
    <div className="flex flex-col items-center space-y-8 w-96 md:w-[900px] md:max-w-[1000px]">
      <div className="flex w-full ">
        <p className="text-lg font-semibold text-[#1a3c63] w-full text-center">
          Seleciona o Fracionamento que você quer pagar. Entraremos em contacto para mais informação e contratação
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-14 ">
        {simulationResult.map((installment, index) => (
          <button 
            key={index} 
            onClick={() => handleOpenDialog(index)}
            className={`${selectedIndex === index ? "bg-[#002B5B]" : "bg-white"} py-1 px-3 md:py-2 md:px-6 rounded-2xl border border-[#002B5B] shadow-xl transition-colors duration-200`}
          >
            <div className="mb-4 mt-2">
              <div className={`text-center ${selectedIndex === index ? "text-white" : "text-[#002B5B]"} font-semibold text-sm md:text-lg`}>
                {getPlanTitle(installment.name)}
              </div>
            </div>
            <div className={`font-bold text-sm md:text-xl text-center ${selectedIndex === index ? "text-white" : "text-[#002B5B]"}`}>
              {formatCVECurrency(installment.value)} {currencySymbol}
            </div>
          </button>
        ))}
      </div>

      {alert && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-40">
        <div className="relative border-2 border-[#14355c] bg-white w-auto h-auto md:min-h-[300px] md:max-h-[80vh] flex flex-col justify-between rounded-lg shadow-lg z-60 overflow-y-auto">
          {/* Conteúdo superior */}
          <div className="px-6 py-4 md:px-12 md:py-8">
            <button
              onClick={() => setAlert(false)}
              className="absolute top-4 right-4 text-gray-700 hover:text-black"
            >
              <IoCloseOutline className="w-6 h-6" />
            </button>
            
            <div className="flex items-center justify-center">
              <Image
                src={LogoAlianca}
                alt="Logo"
                width={160}
                height={56}
                className="w-24 h-8 lg:w-32 lg:h-12"
              />
            </div>
            <div className="flex flex-col items-center justify-center space-y-8 mt-6">
              <span className="text-sm md:text-lg font-semibold text-[#1a3c63]">
                Deseja selecionar este Fracionamento?
              </span>
              <span className="font-medium text-[#002B5B] bg-[#f0efef] p-3 shadow-lg rounded-lg">
                {selectedIndex !== null && simulationResult && simulationResult[selectedIndex] ? (
                  <>
                    {getPlanTitle(simulationResult[selectedIndex].name)}   
                    {" - "} 
                    {formatCVECurrency(simulationResult[selectedIndex].value)} 
                    {" "} 
                    {currencySymbol}
                  </>
                ) : "Nenhum plano selecionado"}
              </span>
            </div>
          </div>
      
          <div className="sticky bottom-0 bg-white px-8 pb-4">
            <div className="flex justify-between">
              <button onClick={handleResult} className="md:py-2 py-1 px-8 md:px-16 rounded-xl bg-[#14355c] text-white hover:font-semibold hover:bg-[#102235] transition-colors">
                Sim
              </button>
              <button 
                onClick={() => setAlert(false)} 
                className="md:py-2 py-1 px-3 md:px-6 rounded-xl border-2 border-[#14355c] text-[#14355c] hover:font-semibold hover:bg-gray-100 transition-colors"
              >
                Selecionar outro
              </button>
            </div>
          </div>
        </div>
      </div>
      )}

      {modalResult && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-40">
          <div className="relative border-2 border-[#14355c] bg-white w-auto h-auto md:min-h-[300px] md:max-h-[80vh] flex flex-col justify-between rounded-lg shadow-lg z-60 overflow-y-auto">
            {/* Conteúdo superior */}
            <div className="px-6 py-4 md:px-12 md:py-8">
              <div className="flex items-center justify-center">
                <Image
                  src={LogoAlianca}
                  alt="Logo"
                  width={160}
                  height={56}
                  className="w-24 h-8 lg:w-32 lg:h-12"
                />
              </div>
              <div className="flex flex-col items-center justify-center space-y-1 mt-6">
                <span className="text-lg md:text-xl font-bold text-[#1a3c63] ">
                  Obrigado Pela Preferência
                </span>
                <span className="font-semibold text-sm md:text-lg text-[#002B5B] ]">
                  Entraremos em contacto Brevemente
                </span>
              </div>
            </div>
        
            <div className="sticky bottom-0 bg-white px-8 p-4">
              <div className="flex justify-center">
                <button onClick={() => setModalResult(false)} className="py-1 md:py-2 px-8 md:px-16 rounded-xl bg-[#14355c] hover:font-semibold text-white hover:bg-[#102235] transition-colors">
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};