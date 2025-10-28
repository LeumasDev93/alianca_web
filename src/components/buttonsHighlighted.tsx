"use client";

import { useState, useEffect } from "react";
import { apiAlianca } from "@/data/service/axios";
import { APIResponse } from "./TopicsAlianca";

type ButtonData = {
  id: number;
  label: string;
  category: string;
};

type ButtonsProps = {
  highlightedCategory: string;
  setHighlightedCategory: (category: string) => void;
};

export default function Buttons({
  highlightedCategory,
  setHighlightedCategory,
}: ButtonsProps) {
  const [buttons, setButtons] = useState<ButtonData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchButtons = async () => {
      setIsLoading(true);
      try {
        const response = await apiAlianca.get<APIResponse<ButtonData>>(
          "/buttons?populate=*"
        );
        setButtons(response.data.data);
      } catch (error) {
        setError("Erro ao carregar banners. Tente novamente mais tarde.");
        //console.error("Error fetching destaques:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchButtons();
  }, []);

  if (isLoading) return <div className="text-white">Carregando botões...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex flex-wrap gap-4 justify-center mt-10 md:mt-20">
      {buttons.map((button) => (
        <button
          key={button.id}
          onClick={() => setHighlightedCategory(button.category)}
          className={`relative px-4 py-2 md:px-6 md:py-4 font-semibold mb-5 md:mb-0 rounded-lg transition-colors text-sm md:text-base w-auto ${
            highlightedCategory === button.category
              ? "bg-[#B7021C] text-white flex-row items-center justify-around"
              : "bg-white text-blue-900 hover:bg-[#B7021C] hover:text-white"
          }`}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
}
