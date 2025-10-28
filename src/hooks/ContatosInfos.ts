import useSWR from 'swr';
import { apiAlianca } from '@/data/service/axios';
import { ContactInfosData } from '@/types/typesData';

const fetcher = async (url: string) => {
  const response = await apiAlianca.get(url);
  return response.data.data[0]; // Retorna o primeiro item do array
};

export const useFooterData = () => {
  const { data: contactData, error: contactError, isLoading: isLoadingContact } = useSWR<ContactInfosData>(
    '/contact-infos?populate=*',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 3600000, // 1 hora
    }
  );

  const { data: socialData, error: socialError, isLoading: isLoadingSocial } = useSWR<ContactInfosData>(
    '/contact-infos?populate[rede_socials][populate]=icon',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 3600000,
    }
  );

  return {
    contactInfo: contactData,
    socialInfo: socialData,
    isLoading: isLoadingContact || isLoadingSocial,
    error: contactError || socialError,
  };
};