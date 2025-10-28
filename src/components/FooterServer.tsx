/* eslint-disable @typescript-eslint/no-explicit-any */
import Footer from "@/components/footer";
import { API_TOKEN_PROD } from "@/data/service/axios";
import { APIResponse } from "@/types/typesData";

export const revalidate = 60;

async function fetchFromApi<T>(path: string): Promise<T[]> {
  const res = await fetch(`https://gestao.aliancaseguros.cv/api${path}`, {
    headers: { Authorization: `Bearer ${API_TOKEN_PROD}` },
    next: { revalidate: 60 },
  });
  if (!res.ok) return [] as T[];
  const json = (await res.json()) as APIResponse<T>;
  return json.data as unknown as T[];
}

export default async function FooterServer() {
  const [contactInfoArr, socialInfoArr] = await Promise.all([
    fetchFromApi<any>("/contact-infos?populate=*"),
    fetchFromApi<any>("/contact-infos?populate[rede_socials][populate]=icon"),
  ]);

  return (
    <Footer
      contactInfo={(contactInfoArr as any)?.[0] || null}
      socialInfo={(socialInfoArr as any)?.[0] || null}
    />
  );
}
