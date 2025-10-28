import useSWR from 'swr';
import { apiAlianca, BASE_IMAGE_URL } from '@/data/service/axios';

interface BannerData {
  category: string;
  titulo: string;
  description: string;
  banner_img?: { url: string };
  url_botton: string;
  order: number;
  id: number;
}

const fetcher = async (url: string): Promise<BannerData[]> => {
  const response = await apiAlianca.get<{ data: BannerData[] }>(url);
  return response.data.data.sort((a, b) => a.order - b.order);
};

export const useBannerData = () => {
  const { data, error, isLoading } = useSWR<BannerData[]>(
    '/banners?populate=*',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 3600000, // 1 hora
      dedupingInterval: 300000, // 5 minutos
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  );

  const getImageUrl = (banner: BannerData) => {
    if (!banner?.banner_img?.url) return '';
    return `${BASE_IMAGE_URL}${banner.banner_img.url}`;
  };

  return {
    banners: data || [],
    isLoading,
    error,
    getImageUrl,
  };
};