"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { APIResponse } from "@/components/TopicsAlianca";
import { apiAlianca, BASE_IMAGE_URL } from "@/data/service/axios";
import { LiaSpinnerSolid } from "react-icons/lia";
import Link from "next/link";
import { LoadingSpinner } from "@/components/Loading";
import { ErrorMessage } from "@/components/ErroMessage";
import ButtonHelp from "@/components/buttonHelp";
import { MarkdownRenderer } from "@/lib/markdown";

interface Topico {
  id: number;
  imagen_capa: BannerImage[];
  nome: string;
  descricao: string;
}

// interface Submenu {
//   id: number;
//   nome: string;
//   descricao: string | null;
//   imagen_capa: Array<{
//     id: number;
//     url: string;
//   }>;
// }

interface ImageFormat {
  url: string;
  width: number;
  height: number;
  size: number;
  sizeInBytes: number;
}

interface BannerImage {
  id: number;
  url: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail: ImageFormat;
    large?: ImageFormat;
    medium?: ImageFormat;
    small: ImageFormat;
  };
}

interface BannerDataDetailhes {
  titulo: string;
  descricao: string;
  paragrafo_1: string;
  subTitle: string;
  descricao_2: string;
  banner?: {
    titulo: string;
    description: string;
    url_botton: string;
  };
  paragrafos?: {
    id: number;
    documentId: string;
    titulo: string;
    texto: string;
    text_lis: TextListaData[];
  }[];
  id: number;
}

interface TextListaData {
  id: number;
  lista: string;
}

const TopicoCard = ({ topico }: { topico: Topico }) => {
  const router = useRouter();
  const [loadingButtons, setLoadingButtons] = useState<{
    [key: number]: boolean;
  }>({});

  const handleNoticiaClick = (id: number) => {
    setLoadingButtons((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      router.push(`/details-submenus/${id}`);
      setLoadingButtons((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  return (
    <Link
      href=""
      onClick={(e) => {
        e.preventDefault();
        handleNoticiaClick(topico.id);
      }}
      className={`flex items-center ${
        loadingButtons[topico.id] ? "justify-center" : ""
      } bg-white hover:bg-slate-300 rounded-lg shadow-md overflow-hidden md:w-auto h-16 transition-colors duration-200`}
    >
      {loadingButtons[topico.id] ? (
        <LiaSpinnerSolid className="animate-spin mr-2 text-[#002256] text-xl" />
      ) : (
        <>
          <div className="relative w-16 h-full flex-shrink-0">
            {topico.imagen_capa?.map((image) => (
              <Image
                key={image.id}
                src={`${BASE_IMAGE_URL}${image.url}`}
                alt={topico.nome}
                width={100}
                height={100}
                quality={100}
                priority
                className="h-full w-full object-cover"
              />
            ))}
          </div>
          <div className="p-2 flex-1">
            <h3 className="text-sm font-semibold text-blue-950 line-clamp-2">
              {topico.nome}
            </h3>
            {topico.descricao && (
              <p className="text-sm font-serif text-black line-clamp-2 overflow-hidden text-ellipsis">
                {topico.descricao}
              </p>
            )}
          </div>
        </>
      )}
    </Link>
  );
};

const BannerSection = ({
  item,
  topicos,
  bannerImages,
  contentImages,
}: {
  item: BannerDataDetailhes;
  topicos: Topico[];
  bannerImages: BannerImage[];
  contentImages: BannerImage[];
}) => (
  <div key={item.id} className="w-full">
    <section
      className="relative w-full h-[30vh] md:h-[50vh] mt-14 md:mt-24 flex items-center justify-center"
      style={{
        backgroundImage:
          bannerImages.length > 0
            ? `url(${BASE_IMAGE_URL}${bannerImages[0].url})`
            : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

      <div className="relative z-10 text-center px-4">
        <h1 className="text-2xl md:text-5xl font-bold text-white drop-shadow-lg">
          {item.titulo}
        </h1>
        <span className="text-white text.xs sm:text-sm">{item.subTitle}</span>
      </div>
    </section>

    <section className="py-4 md:py-8 px-4 md:px-10">
      <div className="flex flex-col md:flex-row md:mt-10">
        <div className="w-full md:w-[80%] md:border-r md:border-gray-300 md:pr-6">
          {item.paragrafos && (
            <>
              <div className="w-full flex flex-col md:items-left ">
                <p className="text-justify font-sans md:text-2xl text-gray-700 border-l-4 border-l-red-900 pl-4">
                  {(() => {
                    const words = item.paragrafos[0]?.titulo.split(" ");
                    const lastTwo = words?.splice(-2).join(" ");
                    return (
                      <>
                        {words?.join(" ")} <strong>{lastTwo}</strong>
                      </>
                    );
                  })()}
                </p>
              </div>
              {item.descricao && (
                <div className="w-full flex flex-col md:items-left ">
                  <p className="text-justify font-sans text-sm xl:text-lg text-gray-700 mt-5">
                    {item?.descricao}
                  </p>
                </div>
              )}
            </>
          )}

          <div className="flex md:flex-row flex-col md:space-x-10 mt-10">
            <div className="flex flex-col w-full sm:w-[70%] lg:w-[60%] bg-white rounded-xl shadow-xl">
              {item.paragrafos?.map((paragrafo) => (
                <div
                  key={paragrafo.id}
                  className="w-full flex flex-col md:items-left mt-10 px-5 md:px-10"
                >
                  <div className="text-justify font-sans md:text-lg text-gray-700">
                    <MarkdownRenderer
                      key={paragrafo.id}
                      content={paragrafo.texto}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col items-center w-full sm:w-[30%] lg:w-[40%] xl:w-[50%]">
              {contentImages.map((image, index) => (
                <div key={index} className="flex justify-center">
                  <Image
                    src={`${BASE_IMAGE_URL}${image.url}`}
                    alt={image.alternativeText || "Imagem"}
                    className="rounded-lg object-cover w-full h-auto max-h-[600px]"
                    width={800}
                    height={600}
                    quality={100}
                    layout="responsive"
                    priority
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,..."
                    onError={(e) => {
                      console.error("Erro ao carregar a imagem:", e);
                      e.currentTarget.src =
                        "https://via.placeholder.com/600x400";
                    }}
                  />
                </div>
              ))}
              {item?.descricao_2 && (
                <div className="w-full px-5 md:px-10 mt-4">
                  <p className="text-justify font-sans text-sm text-gray-700">
                    {item.descricao_2}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full md:w-2/6 mt-10 md:pl-6">
          <h2 className="text-lg md:text-xl font-bold text-blue-950 mb-6">
            Tópicos Relacionados
          </h2>
          <div className="flex flex-col gap-6">
            {topicos.map((topico) => (
              <TopicoCard key={topico.id} topico={topico} />
            ))}
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default function BannerDetails() {
  const params = useParams();
  const id = params.id;
  const [card, setCard] = useState<BannerDataDetailhes[]>([]);
  const [topicos, setTopicos] = useState<Topico[]>([]);
  const [bannerImages, setBannerImages] = useState<BannerImage[]>([]);
  const [contentImages, setContentImages] = useState<BannerImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const detailsResponse = await apiAlianca.get<
          APIResponse<BannerDataDetailhes>
        >(
          `/detalhes-banners?filters[banner][id][$eq]=${id}&populate[paragrafos][populate]=text_lis`
        );
        setCard(detailsResponse.data.data);

        const bannerResponse = await apiAlianca.get<
          APIResponse<{ imagem_banner: BannerImage[] }>
        >(`/detalhes-banners?filters[banner][id][$eq]=${id}&populate=*`);
        setBannerImages(
          bannerResponse.data.data.flatMap((item) => item.imagem_banner || [])
        );

        const contentResponse = await apiAlianca.get<
          APIResponse<{ imagem_1: BannerImage[] }>
        >(`/detalhes-banners?filters[banner][id][$eq]=${id}&populate=*`);
        setContentImages(
          contentResponse.data.data.flatMap((item) => item.imagem_1 || [])
        );

        // 4. Fetch related topics (versão simplificada)
        const topicsResponse = await apiAlianca.get(
          `/detalhes-banners?filters[banner][id][$eq]=${id}&populate[submenus][populate]=*`
        );
        const submenus = topicsResponse.data.data[0]?.submenus;
        setTopicos(submenus);
      } catch (error) {
        setError("Erro ao carregar dados. Tente novamente mais tarde.");
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  return (
    <div className="flex flex-col min-h-screen">
      <ButtonHelp />
      <main className="flex-grow flex flex-col items-center">
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage error={error} />
        ) : card.length === 0 ? (
          <ErrorMessage error="Nenhum dado encontrado." />
        ) : (
          <div className="flex flex-col items-center justify-center w-full">
            {card.map((item) => (
              <BannerSection
                key={item.id}
                item={item}
                topicos={topicos}
                bannerImages={bannerImages}
                contentImages={contentImages}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
