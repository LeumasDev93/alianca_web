export interface ImagemProfile {
    id: number;
    documentId: string;
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number;
    height: number;
    formats: {
      thumbnail: {
        name: string;
        hash: string;
        ext: string;
        mime: string;
        path: string | null;
        width: number;
        height: number;
        size: number;
        sizeInBytes: number;
        url: string;
      };
      small?: {
        name: string;
        hash: string;
        ext: string;
        mime: string;
        path: string | null;
        width: number;
        height: number;
        size: number;
        sizeInBytes: number;
        url: string;
      };
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string | null;
    provider: string;
    provider_metadata: null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  }
  
  export type ColaboardorsData = {
    id: number;
    documentId: string;
    nome: string;
    biografia: string;
    cargo: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string;
    foto_perfil: ImagemProfile[];
    localizations: LocalizationData[];
  }; 

  export type ServicosData = {
    id: number;
    documentId: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    icon: ImagemProfile[];
  }; 

  type AliancaDigital = {
    id: number;
    nome: string;
    link: string;
    canal_digital: string;
  }

  type LinksUteis = {
    id: number;
    nome: string;
    link: string;
  }

  type RedeSociais = {
    id: number;
    nome: string;
    url: string;
    icon: IconData[];
  }

  type IconData = {
    name: string;
    url: string;
  }

  interface dias_uteis {
    id: number;
    diasUteis: string;
  }

  export type ContactInfosData = {
    id: number;
    documentId: string;
    telefone1: string;
    telefone2: string;
    latitude: string;
    adress: string;
    email: string;
    messageWhatspp: string;
    contactoWhatsapp: string;
    dias_uteis: string;
    longitude: string;
    cidade: string;
    pais: string;
    horarios: dias_uteis[];
    alianca_digitals: AliancaDigital[];
    link_utels: LinksUteis[];
    rede_socials: RedeSociais[];
  }; 
  
  export type PartenrsData = {
    id: number;
    documentId: string;
    name: string;
    descricao: string;
    cargo: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string;
    logo_parceiro: ImagemProfile[];
    localizations: LocalizationData[];
  };

  export type BannerData = {
    id: number;
    title: string;
    description: string;
    banner_img: ImagemProfile[];
    category: string;
  };
  
  export type ButtonData = {
    id: number;
    label: string;
    category: string;
  };
  
  interface LocalizationData {
    id: number;
    locale: string;
    publishedAt: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export type APIResponse<T> = {
    data: T[];
    meta: {
      pagination: {
        page: number;
        pageSize: number;
        pageCount: number;
        total: number;
      };
    };
  };