/* eslint-disable @typescript-eslint/no-explicit-any */
import Footer from "@/components/footer";
import { STRAPI_URL, STRAPI_TOKEN } from "@/data/service/axios";

export const revalidate = 60;

async function fetchFooterData(): Promise<any> {
  const url = `${STRAPI_URL}/api/footer?populate[itens][populate][0]=itens&populate[itens][populate][itens][populate][1]=icon`;
  console.log("🔵 Footer fetching from:", url);
  console.log("🔵 STRAPI_URL:", STRAPI_URL);
  console.log("🔵 STRAPI_TOKEN exists:", !!STRAPI_TOKEN);
  
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
    next: { revalidate: 60 },
  });
  
  if (!res.ok) {
    console.error("❌ Footer fetch error:", res.status, res.statusText);
    console.error("❌ URL tentada:", url);
    return null;
  }
  
  console.log("✅ Footer fetch success!");
  const json = await res.json();
  console.log("🔵 Footer JSON completo:", JSON.stringify(json, null, 2));
  return json.data;
}

export default async function FooterServer() {
  console.log("🔵 FooterServer: Iniciando...");
  const footerData = await fetchFooterData();
  
  if (!footerData) {
    console.log("❌ FooterServer: Nenhum dado recebido!");
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

  console.log("🔵 Social Section:", JSON.stringify(socialSection, null, 2));

  const socialInfo = {
    rede_socials: socialSection?.itens?.map((item: any) => {
      console.log(`🔵 Processando social item: ${item.title}, icon:`, item.icon);
      return {
        id: item.id,
        nome: item.title,
        url: item.link,
        icon: item.icon ? [{ url: item.icon.url }] : [], // Apenas o path, footer.tsx vai concatenar com STRAPI_URL
      };
    }) || [],
  };

  console.log("🔵 FooterServer: Contact Info processado:", JSON.stringify(contactInfo, null, 2));
  console.log("🔵 FooterServer: Social Info processado:", JSON.stringify(socialInfo, null, 2));

  return (
    <Footer
      contactInfo={contactInfo}
      socialInfo={socialInfo}
    />
  );
}
