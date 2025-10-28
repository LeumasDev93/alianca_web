import { StaticImageData } from "next/image";
import FamiliySeguros from "@/assets/images/seguro-familiar.webp";
import EquipaSeguros from "@/assets/images/equipasegura.jpg";
import ParceiroSeguros from "@/assets/images/parceria.jpeg";
import ImageColaborator from "@/assets/images/colaborator.png";


const createSlug = (title: string): string => {
    return title
      .toLowerCase() // Converte para minúsculas
      .replace(/ /g, "-") // Substitui espaços por hífens
      .replace(/[^\w-]+/g, ""); // Remove caracteres não alfanuméricos, exceto hífens
  };

  
export interface CardsType {
    id: string;
    title: string;
    title_about?: string;
    description: string;
    details: string;
    image: StaticImageData;
    imageBanner: StaticImageData;
    image_Colaborator?: StaticImageData;
    slug: string;
    buttonText: string,
    buttonLink: string,
    description_about1: string,
    description_about2: string,
    description_equipa?: string,
    title_equipa?: string,
    ocupation_colab?: string,
    name_colab?: string,
    bio_colaborator?: string,
  }
  
 export const cardsData: CardsType[] = [
    {
      id: "1",
      image: FamiliySeguros,
      imageBanner: FamiliySeguros,
      buttonText: "Saber mais",
      buttonLink: "#",
      title: "Sobre a Aliança Seguros",
      description_about1: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates voluptatibus cupiditate accusamus, ad quis dolores minima exercitationem saepe similique et eveniet esse pariatur aperiam laudantium provident omnis, quidem temporibus officiis.",
      description_about2: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates voluptatibus cupiditate accusamus, ad quis dolores minima exercitationem saepe similique et eveniet esse pariatur aperiam laudantium provident omnis, quidem temporibus officiis.",
      title_about: "A Fundação",
      description: "Conheça mais sobre nossos serviços e soluções.",
      details: "Informações detalhadas sobre a Aliança Seguros.",
      slug: createSlug("Sobre a Alianca Seguros"),
    },
    {
      id: "2",
      image: EquipaSeguros,
      imageBanner: EquipaSeguros,
      image_Colaborator: ImageColaborator,
      ocupation_colab: "Consultora",
      name_colab: "Loisa Siqueira",
      buttonText: "Saber mais",
      bio_colaborator: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
      buttonLink: "#",
      title: "Conheça a nossa equipa",
      title_equipa: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
      description_about1: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates voluptatibus cupiditate accusamus, ad quis dolores minima exercitationem saepe similique et eveniet esse pariatur aperiam laudantium provident omnis, quidem temporibus officiis.",
      description_about2: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates voluptatibus cupiditate accusamus, ad quis dolores minima exercitationem saepe similique et eveniet esse pariatur aperiam laudantium provident omnis, quidem temporibus officiis.",
      description: "Saiba mais sobre nossa equipe de profissionais.",
      description_equipa: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates voluptatibus cupiditate accusamus, ad quis dolores minima exercitationem saepe similique et eveniet esse pariatur aperiam laudantium provident omnis, quidem temporibus officiis.",
      details: "Nossa equipe está pronta para atendê-lo da melhor maneira.",
      slug: createSlug("Conheca a nossa equipa"),
    },
    {
      id: "3",
      image: ParceiroSeguros,
      imageBanner: ParceiroSeguros,
      buttonText: "Saber mais",
      buttonLink: "#",
      title: "Certificações e Parceiros",
      description_about1: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates voluptatibus cupiditate accusamus, ad quis dolores minima exercitationem saepe similique et eveniet esse pariatur aperiam laudantium provident omnis, quidem temporibus officiis.",
      description_about2: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates voluptatibus cupiditate accusamus, ad quis dolores minima exercitationem saepe similique et eveniet esse pariatur aperiam laudantium provident omnis, quidem temporibus officiis.",
      description:
        "Veja os parceiros e certificações que garantem nossa qualidade.",
      details: "Informações detalhadas sobre nossas certificações e parcerias.",
      slug: createSlug("Certificacoes e Parceiros"),
    },
  ];