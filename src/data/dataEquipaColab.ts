import { StaticImageData } from "next/image";
import ImageColaborator from "@/assets/images/colaborator.png";


const createSlug = (title: string): string => {
    return title
      .toLowerCase() // Converte para minúsculas
      .replace(/ /g, "-") // Substitui espaços por hífens
      .replace(/[^\w-]+/g, ""); // Remove caracteres não alfanuméricos, exceto hífens
  };

  
export interface CardsEquipType {
    id: string;
    image_Colaborator?: StaticImageData;
    title_equipa?: string,
    ocupation_colab?: string,
    name_colab?: string,
    bio_colaborator?: string,
    slug: string;
    description_equipa: string
  }
  
 export const cardsEquipData: CardsEquipType[] = [
    {
      id: "1",
      image_Colaborator: ImageColaborator,
      ocupation_colab: "Consultora",
      name_colab: "Loisa Siqueira",
      bio_colaborator: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
      title_equipa: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
      slug: createSlug("Conheca a nossa equipa"),
      description_equipa: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates voluptatibus cupiditate accusamus, ad quis dolores minima exercitationem saepe similique et eveniet esse pariatur aperiam laudantium provident omnis, quidem temporibus officiis.",

    
    },
    {
      id: "2",
      image_Colaborator: ImageColaborator,
      ocupation_colab: "Consultora",
      name_colab: "Loisa Siqueira",
      bio_colaborator: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
      title_equipa: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
      slug: createSlug("Conheca a nossa equipa"),
      description_equipa: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates voluptatibus cupiditate accusamus, ad quis dolores minima exercitationem saepe similique et eveniet esse pariatur aperiam laudantium provident omnis, quidem temporibus officiis.",

    },
    {
      id: "3",
      image_Colaborator: ImageColaborator,
      ocupation_colab: "Consultora",
      name_colab: "Loisa Siqueira",
      bio_colaborator: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
      title_equipa: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
      slug: createSlug("Conheca a nossa equipa"),
      description_equipa: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates voluptatibus cupiditate accusamus, ad quis dolores minima exercitationem saepe similique et eveniet esse pariatur aperiam laudantium provident omnis, quidem temporibus officiis.",

     
    },
    {
      id: "4",
      image_Colaborator: ImageColaborator,
      ocupation_colab: "Consultora",
      name_colab: "Loisa Siqueira",
      bio_colaborator: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates voluptatibus cupiditate accusamus,  ad quis dolores minima exercitationem saepe similique.",
      title_equipa: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
      slug: createSlug("Conheca a nossa equipa"),
      description_equipa: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates voluptatibus cupiditate accusamus, ad quis dolores minima exercitationem saepe similique et eveniet esse pariatur aperiam laudantium provident omnis, quidem temporibus officiis.",

     
    },
    {
      id: "5",
      image_Colaborator: ImageColaborator,
      ocupation_colab: "Consultora",
      name_colab: "Loisa Siqueira",
      bio_colaborator: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
      title_equipa: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
      slug: createSlug("Conheca a nossa equipa"),
      description_equipa: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.  ad quis dolores minima exercitationem saepe similique et eveniet esse pariatur aperiam laudantium provident omnis, quidem temporibus officiis.",

    },
    {
      id: "6",
      image_Colaborator: ImageColaborator,
      ocupation_colab: "Consultora",
      name_colab: "Loisa Siqueira",
      bio_colaborator: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
      title_equipa: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
      slug: createSlug("Conheca a nossa equipa"),
      description_equipa: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates voluptatibus cupiditate accusamus, ad quis dolores minima exercitationem saepe similique et eveniet esse pariatur aperiam laudantium provident omnis, quidem temporibus officiis.",

    },
    {
      id: "7",
      image_Colaborator: ImageColaborator,
      ocupation_colab: "Consultora",
      name_colab: "Loisa Siqueira",
      bio_colaborator: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
      title_equipa: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
      slug: createSlug("Conheca a nossa equipa"),
      description_equipa: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates voluptatibus cupiditate accusamus, ad quis dolores minima exercitationem saepe similique et eveniet esse pariatur aperiam laudantium provident omnis, quidem temporibus officiis.",

    },
    {
      id: "8",
      image_Colaborator: ImageColaborator,
      ocupation_colab: "Consultora",
      name_colab: "Loisa Siqueira",
      bio_colaborator: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
      title_equipa: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
      slug: createSlug("Conheca a nossa equipa"),
      description_equipa: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates voluptatibus cupiditate accusamus, ad quis dolores minima exercitationem saepe similique et eveniet esse pariatur aperiam laudantium provident omnis, quidem temporibus officiis.",

    },
    {
      id: "9",
      image_Colaborator: ImageColaborator,
      ocupation_colab: "Consultora",
      name_colab: "Loisa Siqueira",
      bio_colaborator: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
      title_equipa: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
      slug: createSlug("Conheca a nossa equipa"),
      description_equipa: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates voluptatibus cupiditate accusamus, ad quis dolores minima exercitationem saepe similique et eveniet esse pariatur aperiam laudantium provident omnis, quidem temporibus officiis.",

    },
    {
      id: "10",
      image_Colaborator: ImageColaborator,
      ocupation_colab: "Consultora",
      name_colab: "Loisa Siqueira",
      bio_colaborator: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
      title_equipa: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
      slug: createSlug("Conheca a nossa equipa"),
      description_equipa: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates voluptatibus cupiditate accusamus, ad quis dolores minima exercitationem saepe similique et eveniet esse pariatur aperiam laudantium provident omnis, quidem temporibus officiis.",

    },
   
  ];