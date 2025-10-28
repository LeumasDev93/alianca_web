import { StaticImageData } from "next/image";
import LogoParceiro from "@/assets/images/parceria.jpeg";


const createSlug = (title: string): string => {
    return title
      .toLowerCase() // Converte para minúsculas
      .replace(/ /g, "-") // Substitui espaços por hífens
      .replace(/[^\w-]+/g, ""); // Remove caracteres não alfanuméricos, exceto hífens
  };

  
export interface CardsPartnerType {
    id: string;
    title_equipa: string;
    logo_partner: StaticImageData;
    name_partner: string,
    slug: string;
    description_partner: string,
    description_equipa: string,
  }
  
 export const cardsPartner: CardsPartnerType[] = [
    {
      id: "1",
      logo_partner: LogoParceiro,
      title_equipa: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
      name_partner: "XPTO",
      slug: createSlug("Certificacoes e Parceiros"),
      description_partner: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
      description_equipa: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates voluptatibus cupiditate accusamus, ad quis dolores minima exercitationem saepe similique et eveniet esse pariatur aperiam laudantium provident omnis, quidem temporibus officiis.",

    
    },
    {
      id: "2",
      logo_partner: LogoParceiro,
      title_equipa: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
      name_partner: "XPTO",
      slug: createSlug("Certificacoes e Parceiros"),
      description_partner: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
      description_equipa: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates voluptatibus cupiditate accusamus, ad quis dolores minima exercitationem saepe similique et eveniet esse pariatur aperiam laudantium provident omnis, quidem temporibus officiis.",

    },
    {
      id: "3",
      logo_partner: LogoParceiro,
      title_equipa: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
      name_partner: "XPTO",
      slug: createSlug("Certificacoes e Parceiros"),
      description_partner: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
      description_equipa: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates voluptatibus cupiditate accusamus, ad quis dolores minima exercitationem saepe similique et eveniet esse pariatur aperiam laudantium provident omnis, quidem temporibus officiis.",

     
    },
    {
      id: "4",
      logo_partner: LogoParceiro,
      title_equipa: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
      name_partner: "XPTO",
      slug: createSlug("Certificacoes e Parceiros"),
      description_partner: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
      description_equipa: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates voluptatibus cupiditate accusamus, ad quis dolores minima exercitationem saepe similique et eveniet esse pariatur aperiam laudantium provident omnis, quidem temporibus officiis.",

     
    },
    {
      id: "5",
      logo_partner: LogoParceiro,
      title_equipa: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
      name_partner: "XPTO",
      slug: createSlug("Certificacoes e Parceiros"),
      description_partner: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
      description_equipa: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates voluptatibus cupiditate accusamus, ad quis dolores minima exercitationem saepe similique et eveniet esse pariatur aperiam laudantium provident omnis, quidem temporibus officiis.",

    },
    {
      id: "6",
      logo_partner: LogoParceiro,
      title_equipa: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
      name_partner: "XPTO",
      slug: createSlug("Certificacoes e Parceiros"),
      description_partner: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
      description_equipa: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates voluptatibus cupiditate accusamus, ad quis dolores minima exercitationem saepe similique et eveniet esse pariatur aperiam laudantium provident omnis, quidem temporibus officiis.",

    },
    {
      id: "7",
      logo_partner: LogoParceiro,
      title_equipa: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
      name_partner: "XPTO",
      slug: createSlug("Certificacoes e Parceiros"),
      description_partner: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
      description_equipa: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates voluptatibus cupiditate accusamus, ad quis dolores minima exercitationem saepe similique et eveniet esse pariatur aperiam laudantium provident omnis, quidem temporibus officiis.",

    },
    {
      id: "8",
      logo_partner: LogoParceiro,
      title_equipa: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
      name_partner: "XPTO",
      slug: createSlug("Certificacoes e Parceiros"),
      description_partner: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
      description_equipa: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates voluptatibus cupiditate accusamus, ad quis dolores minima exercitationem saepe similique et eveniet esse pariatur aperiam laudantium provident omnis, quidem temporibus officiis.",

    },
    
   
  ];

  