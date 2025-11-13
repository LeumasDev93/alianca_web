/* eslint-disable @typescript-eslint/no-explicit-any */
import Footer from "@/components/footer";
import { STRAPI_URL, STRAPI_TOKEN } from "@/data/service/axios";

export const revalidate = 60;

async function fetchFooterData(): Promise<any> {
  const url = `${STRAPI_URL}/api/footer?populate[itens][populate][0]=itens&populate[itens][populate][itens][populate][1]=icon`;
  
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
    next: { revalidate: 60 },
  });
  
  if (!res.ok) {
    return null;
  }
  
  const json = await res.json();
  return json.data;
}

export default async function FooterServer() {
  const footerData = await fetchFooterData();
  
  if (!footerData) {
    return (
      <Footer
        contactInfo={null}
        socialInfo={null}
      />
    );
  }

  // Mapear dados da nova API para o formato esperado pelo Footer
  const horarioSection = footerData.itens?.find((item: any) => item.title === "Horário de Funcionamento");
  const contactSection = footerData.itens?.find((item: any) => item.title === "Contactos");
  const linksSection = footerData.itens?.find((item: any) => item.title === "Links Úteis");
  const socialSection = footerData.itens?.find((item: any) => item.title === "Siga-nos");

  const contactInfo = {
    telefone1: contactSection?.itens?.find((i: any) => i.title?.includes("(+238)"))?.title?.split(" / ")[0] || "",
    telefone2: contactSection?.itens?.find((i: any) => i.title?.includes("(+238)"))?.title?.split(" / ")[1] || "",
    email: contactSection?.itens?.find((i: any) => i.title?.includes("@"))?.title || "",
    adress: contactSection?.itens?.find((i: any) => i.title?.includes("Achada"))?.title || "",
    horarios: horarioSection?.itens?.map((item: any) => ({
      id: item.id,
      diasUteis: item.title,
    })) || [],
    link_utels: linksSection?.itens?.map((item: any) => ({
      id: item.id,
      nome: item.title,
      link: item.link,
    })) || [],
  };

  const socialInfo = {
    rede_socials: socialSection?.itens?.map((item: any) => {
      return {
        id: item.id,
        nome: item.title,
        url: item.link,
        icon: item.icon ? [{ url: item.icon.url }] : [], // Apenas o path, footer.tsx vai concatenar com STRAPI_URL
      };
    }) || [],
  };

  return (
    <Footer
      contactInfo={contactInfo}
      socialInfo={socialInfo}
    />
  );
}
