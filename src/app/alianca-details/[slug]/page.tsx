"use client";

import ButtonBackToPrevious from "@/components/buttonBackToPrev";
import ButtonContact from "@/components/buttonContact";
import ButtonHelp from "@/components/buttonHelp";
import ButtonSimulate from "@/components/buttonSimulate";
// Header and Footer are provided by the root layout
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { APIResponse, TopicosAliancaData } from "@/components/TopicsAlianca";
import { apiAlianca, BASE_IMAGE_URL } from "@/data/service/axios";
import { ColaboardorsData, PartenrsData } from "@/types/typesData";
import { FaSpinner } from "react-icons/fa";
import { LoadingSpinner } from "@/components/Loading";
import { ErrorMessage } from "@/components/ErroMessage";

export default function AliancaDetails() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [card, setCard] = useState<TopicosAliancaData[]>([]);
  const [colaboradors, setColaboradors] = useState<ColaboardorsData[]>([]);
  const [partners, setPartners] = useState<PartenrsData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDatas = async () => {
      setIsLoading(true);
      try {
        // Filtra os dados pelo ID dinamicamente
        const response = await apiAlianca.get<APIResponse<TopicosAliancaData>>(
          `/topicos-aliancas?filters[id][$eq]=${id}&populate=*`
        );
        setCard(response.data.data);
      } catch (error) {
        setError("Erro ao carregar dados. Tente novamente mais tarde.");
        //console.error("Error fetching destaques:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDatas();
  }, [id]);

  useEffect(() => {
    const fetchColaboradors = async () => {
      setIsLoading(true);
      try {
        // Filtra os dados pelo ID dinamicamente
        const response = await apiAlianca.get<APIResponse<ColaboardorsData>>(
          "/colaboradors?populate=*"
        );
        setColaboradors(response.data.data);
      } catch (error) {
        setError("Erro ao carregar dados. Tente novamente mais tarde.");
        //console.error("Error fetching colaboradors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchColaboradors();
  }, []);

  useEffect(() => {
    const fetchPartners = async () => {
      setIsLoading(true);
      try {
        const response = await apiAlianca.get<APIResponse<PartenrsData>>(
          "/parceiros?populate=*"
        );
        setPartners(response.data.data);
      } catch (error) {
        setError("Erro ao carregar dados. Tente novamente mais tarde.");
        //console.error("Error fetching parceiros:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const selectedCard = useMemo(
    () => card.find((item) => item.id === Number(id)),
    [id, card]
  );

  return (
    <main className="flex flex-col gap-8 row-start-2 items-center justify-center w-full">
      {/* Header provided by layout */}
      {!selectedCard ? (
        <div className="flex flex-col items-center justify-center md:my-48 w-full py-10 bg-[#F4F2F2]">
          {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage error={error} />
        ) : card.length === 0 ? (
          <ErrorMessage error="Nenhum dado encontrado." />
        ) : null}
        </div>
      ) : (
        <div className="flex flex-col gap-8 items-center justify-center w-full">
          {selectedCard.imagem_banner?.length > 0 ? (
            selectedCard.imagem_banner.map((image) => (
              <section
                key={image.id}
                className="relative w-full h-40 sm:h-52 md:h-96 flex items-center justify-center"
                style={{
                  backgroundImage: image.url
                    ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${BASE_IMAGE_URL}${image.url})`
                    : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="text-center mt-8 md:mt-0">
                  <h1 className="text-lg sm:text-2xl md:text-6xl font-bold text-white">
                    {selectedCard.titulo}
                  </h1>
                </div>
              </section>
            ))
          ) : (
            <section className="w-full h-40 sm:h-52 md:h-96 flex items-center justify-center bg-gray-200">
              <p className="text-lg text-gray-500">Imagem não disponível</p>
            </section>
          )}

          {selectedCard.type_section === "AboutSection" && (
            <div className="flex flex-col items-center justify-center mb-10">
              <AboutSection card={selectedCard} />
            </div>
          )}
          {selectedCard.type_section === "TeamSection" && (
            <div className="flex flex-col items-center justify-center w-full mb-20">
              <TeamSection cardAbout={selectedCard} cardEquip={colaboradors} />
            </div>
          )}
          {selectedCard.type_section === "PartnerSection" && (
            <div className="flex flex-col items-center justify-center w-full mb-20">
              <PartnerSection cardPartner={selectedCard} partners={partners} />
            </div>
          )}
           {selectedCard.type_section === "OtherSection" && (
            <div className="flex flex-col items-center justify-center w-full mb-20">
              <OtherSection cardPartner={selectedCard} partners={partners} />
            </div>
          )}
        </div>
      )}
      <ButtonBackToPrevious />
      <ButtonHelp />

      {/* Footer provided by layout */}
    </main>
  );
}

const AboutSection = ({ card }: { card: TopicosAliancaData }) => (
  <>
    <div className="flex flex-col items-center justify-center w-[90%] md:mb-10 mb-5">
      <h2 className="text-lg sm:text-2xl font-bold text-[#002256]">
        {card.titulo}
      </h2>
      <p className="text-center text-[#030303] w-full sm:w-[80%] md:w-[600px] mt-4 sm:mt-8">
        {card.detalhes}
      </p>
    </div>

    <div className="flex flex-col gap-4 w-full px-4 sm:px-0">
      <div className="flex flex-col md:flex-row">
        <div className="bg-black flex-1 h-40 sm:h-52 md:h-[450px] relative -z-50">
          <Image
            src={`${BASE_IMAGE_URL}${card.imagem_banner[0]?.url}`}
            alt=""
            className="w-full h-full object-cover"
            width={1000}
            height={600}
            quality={90}
            objectFit="cover"
          />
        </div>

        <div className="bg-[#B7021C] flex-1 h-40 sm:h-52 md:h-[450px] flex items-center justify-center p-4 sm:p-10 md:px-20 md:py-10 relative -z-50">
          <div className="hidden md:flex w-8 h-8 md:w-16 md:h-16 items-center absolute -left-8 bg-[#B7021C] rotate-45 transform rounded-sm" />
          <p className="text-sm sm:text-base md:text-lg line-clamp-4 md:line-clamp-none text-white">
            {card.paragrafo2}
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row relative md:-mt-4">
        <div className="bg-[#002256] flex-1 h-40 sm:h-52 md:h-[450px] flex items-center justify-center p-4 sm:p-10 md:px-20 md:py-10 relative">
          <div className="hidden md:flex w-8 h-8 md:w-16 md:h-16 absolute -right-8 bg-[#002256] rotate-45 transform rounded-sm z-10" />
          <p className="text-sm sm:text-base md:text-lg line-clamp-4 md:line-clamp-none text-white">
            {card.paragrafo1}
          </p>
        </div>

        <div className="bg-black flex-1 h-40 sm:h-52 md:h-[450px] relative">
          <Image
            src={`${BASE_IMAGE_URL}${card.imagem_capa[0]?.url}`}
            alt="Image Banner"
            className="w-full h-full object-cover"
            width={1000}
            height={600}
            quality={90}
            objectFit="cover"
          />
        </div>
      </div>
    </div>
  </>
);

const TeamSection = ({
  cardEquip,
  cardAbout,
}: {
  cardEquip: ColaboardorsData[];
  cardAbout: TopicosAliancaData;
}) => (
  <div className="flex flex-col items-center justify-center w-full px-4 sm:px-8">
    {/* Título e descrição */}
    <div className="flex flex-col items-center justify-center w-full max-w-4xl">
      <h2 className="text-lg sm:text-2xl font-bold text-[#002256]">
        {cardAbout.titulo}
      </h2>
      <p className="text-center text-[#030303] w-full sm:w-[80%] md:w-[600px] mt-4 sm:mt-8">
        {cardAbout.detalhes}
      </p>
    </div>

    {/* Grid de membros da equipe */}
    <div className="grid gap-10 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full max-w-6xl mt-10">
      {cardEquip.map((itens) => (
        <TeamMember key={itens.id} cardEquip={itens} />
      ))}
    </div>
  </div>
);

const TeamMember = ({ cardEquip }: { cardEquip: ColaboardorsData }) => (
  <div className="flex flex-col items-center justify-center w-full">
    <div className="group w-36 h-36 md:w-52 md:h-52 relative [perspective:1000px]">
      <div className="relative w-full h-full rounded-xl bg-transparent [transform-style:preserve-3d] transition-transform duration-700 group-hover:[transform:rotateY(180deg)]">
        {/* Frente do cartão (foto do colaborador) */}
        <div className="absolute w-full h-full rounded-xl bg-[#002256] [backface-visibility:hidden] flex flex-col items-center justify-end">
          {cardEquip.foto_perfil && cardEquip.foto_perfil[0]?.url ? (
            <Image
              src={`${BASE_IMAGE_URL}${cardEquip.foto_perfil[0].url}`}
              alt={`Imagem do colaborador ${cardEquip.nome}`}
              className="w-52 h-48 md:w-72 md:h-64 rounded-b-xl absolute object-cover"
              width={160}
              height={150}
              quality={90}
              objectFit="cover"
            />
          ) : (
            <span className="text-white text-sm">Imagem não disponível</span>
          )}
        </div>

        {/* Verso do cartão (biografia) */}
        <div className="absolute w-full h-full rounded-xl bg-[#002256] [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col items-center justify-center p-4">
          <p className="text-center text-sm text-white">
            {cardEquip.biografia || "Biografia não disponível."}
          </p>
        </div>
      </div>
    </div>

    {/* Nome e cargo do colaborador */}
    <div className="flex flex-col items-center mt-4">
      <span className="font-bold text-black">
        {cardEquip.nome || "Nome não disponível"}
      </span>
      <span className="text-black">
        {cardEquip.cargo || "cargo não disponível"}
      </span>
    </div>
  </div>
);

const PartnerSection = ({
  cardPartner,
  partners,
}: {
  cardPartner: TopicosAliancaData;
  partners: PartenrsData[];
}) => (
  <>
    <div className="flex flex-col items-center justify-center w-[90%] mb-20">
      <h2 className="text-lg sm:text-2xl font-bold text-[#002256]">
        {cardPartner?.titulo}
      </h2>
      <p className="text-center text-[#030303] w-full sm:w-[80%] md:w-[600px] mt-4 sm:mt-8">
        {cardPartner?.detalhes}
      </p>
    </div>
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-lg sm:text-xl font-bold md:text-2xl text-[#002256]">
        Certificações
      </h2>
      <div className="grid gap-10 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 justify-center mb-60"></div>
    </div>
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-lg sm:text-xl font-bold md:text-2xl text-[#002256]">
        Parcerias
      </h2>
    </div>
    <div className="grid gap-10 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 justify-center my-10">
      {partners.map((partnerData, index) => (
        <Partner key={partnerData.id || index} partnerData={partnerData} />
      ))}
    </div>
  </>
);

const Partner = ({ partnerData }: { partnerData: PartenrsData }) => {

  const imageUrl = partnerData.logo_parceiro
    ? `${BASE_IMAGE_URL}${partnerData.logo_parceiro[0].url}`
    : null;

  return (
    <div className="flex flex-col items-center justify-center ">
      <div className="w-40 h-40 relative shadow-xl p-4 rounded-lg bg-white">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`Imagem do colaborador ${partnerData.name}`}
            width={100}
            height={100}
            quality={100}
            className="w-full h-full"
          />
        ) : (
          <span className="text-white text-sm">Imagem não disponível</span>
        )}
      </div>

      <div className="flex flex-col items-center w-40 mt-4">
        <span className="font-bold text-black">
          {partnerData.name || "Nome não disponível"}
        </span>
        <span className="text-black text-center text-sm">
          {partnerData.descricao || "Ocupação não disponível"}
        </span>
      </div>
    </div>
  );
};


const OtherSection = ({
  cardPartner,
  partners,
}: {
  cardPartner: TopicosAliancaData;
  partners: PartenrsData[];
}) => (
  <>
    <div className="flex flex-col items-center justify-center w-[90%] mb-20">
      <div className="flex items-center justify-center py-4 px-8 bg-[#dbdada] rounded-xl shadow-xl">
        <h2 className="text-lg sm:text-2xl font-bold text-[#002256]">
          Informações em breve
        </h2>
      </div>
    </div>
    
  </>
);