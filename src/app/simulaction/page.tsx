"use client";

import Image from "next/image";
// Header and Footer are now rendered globally in layout with static data
import ButtonBackToPrevious from "@/components/buttonBackToPrev";
import ButtonHelp from "@/components/buttonHelp";
import { useEffect, useState } from "react";
import { LiaSpinnerSolid } from "react-icons/lia";
import { apiAlianca } from "@/data/service/axios";
import { APIResponse } from "@/types/typesData";
import { LoadingSpinner } from "@/components/Loading";
import { ErrorMessage } from "@/components/ErroMessage";
import { useRouter } from "next/navigation";

interface SimulationsData {
  titulo_paragrafo1: string;
  descricao_paragrafo1: string;
  titulo_paragrafo2: string;
  descricao_paragrafo2: string;
  titulo_paragrafo3: string;
  descricao_paragrafo3: string;
  id: number;
}

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setDataIsLoading] = useState(true);
  const [card, setCard] = useState<SimulationsData[]>([]);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const [insuranceType, setInsuranceType] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type");

    if (type) {
      setInsuranceType(type);
      console.log("Tipo de seguro:", type);
    }
  }, []);

  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push(`/simulactionDetails?type=${insuranceType}`);
      //window.location.href = "/simulactionDetails";
    }, 2000);
  };

  useEffect(() => {
    const fetchDatas = async () => {
      setDataIsLoading(true);
      try {
        const response = await apiAlianca.get<APIResponse<SimulationsData>>(
          `/simulacaos?populate=*`
        );
        setCard(response.data.data);
        console.log(response.data.data, "dados");
      } catch (error) {
        setError("Erro ao carregar dados. Tente novamente mais tarde.");
        console.error("Error fetching destaques:", error);
      } finally {
        setDataIsLoading(false);
      }
    };

    fetchDatas();
  }, []);

  return (
    <main className="flex flex-col gap-8 row-start-2 overflow-y-hidden">
      <ButtonBackToPrevious />

      <ButtonHelp />
      <div className="flex flex-col mt-10 mb-5 md:mb-20">
        <div className="flex justify-between md:h-[300px] bg-[#C41E3A] ">
          <div className="container md:mx-auto h-full flex flex-col justify-center mt-12 md:mt-0 font-thin text-white">
            <h1 className="text-2xl md:text-5xl font-bold md:mb-4 text-center">
              Bem-Vindo
            </h1>
            <h2 className="text-xl md:text-4xl text-center">
              Simulador Automóvel
            </h2>
          </div>
          <Image
            src="https://st2.depositphotos.com/1441511/5482/i/450/depositphotos_54821609-stock-photo-happy-man-inside-car-of.jpg"
            alt="Driver"
            width={500}
            height={300}
            objectFit="cover"
            className="md:h-full h-32 w-60 md:w-[800px] rounded-l-full"
          />
        </div>

        {isDataLoading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <ErrorMessage error={error} />
        ) : (
          <div className="flex flex-col justify-center items-center px-5 md:px-10">
            {card.map((item) => (
              <div
                key={item.id}
                className="w-full flex flex-col md:items-left bg-[#dcd9d9] mt-10 px-5 md:px-10 py-4 rounded-lg border-2 border-[#cfcece] shadow-xl"
              >
                <span className="text-xl font-semibold text-blue-950">
                  {item.titulo_paragrafo1}
                </span>
                <p className="text-justify font-sans md:text-xl mt-4 text-blue-950">
                  {item.descricao_paragrafo1}
                </p>
              </div>
            ))}

            <div className="mx-auto px-4 md:py-8 flex justify-center w-full mt-8">
              <button
                onClick={handleClick}
                className="bg-red-700 text-white text-justify text-xl font-sans px-8 py-2 rounded hover:bg-red-800 transition-all duration-300 flex items-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <LiaSpinnerSolid className="animate-spin h-5 w-5 text-white" />
                    Aguarde...
                  </>
                ) : (
                  <span>
                    Simule e contrate{" "}
                    <span className="underline font-semibold">Agora</span>
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
