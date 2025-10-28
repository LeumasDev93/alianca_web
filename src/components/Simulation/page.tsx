import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { useProducts } from "@/hooks/useProducts";
// SimulationForm não é mais usado aqui; navegação vai para /simulaction
import ProductsTab from "./ProductsTab";
// Removed MySimulationsTab per requirement: only products and step form
import { Product } from "@/types/typesData";
import Image from "next/image";

import { LoadingContainer } from "../ui/loading-container";
import EmptyState from "./Form/EmptyState";
import { FaExclamationTriangle } from "react-icons/fa";

export default function SimulationScreen() {
  const { products, loading, error } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState("types");

  const bannerImages = [
    {
      src: "https://st2.depositphotos.com/1441511/5482/i/450/depositphotos_54821609-stock-photo-happy-man-inside-car-of.jpg",
      alt: "Driver",
      title: "Bem-Vindo",
      subtitle: "Simulador Automóvel",
    },
    {
      src: "https://www.bradescoseguros.com.br/wcm/connect/3f53cb34-1619-445b-9a9d-cba6f6445e0a/central-segunda-via-boleto-bradesco-seguros1920x280.jpg?MOD=AJPERES&CACHEID=ROOTWORKSPACE-3f53cb34-1619-445b-9a9d-cba6f6445e0a-ow7qyi9",
      alt: "Couple with car",
      title: "Financiamento Facilitado",
      subtitle: "Condições especiais para você",
    },
    {
      src: "https://www.bradescoseguros.com.br/wcm/connect/602bcf7d-dd6e-4cea-8357-dfb5ee661b85/SAUD0117_Goias_Banner_Saude_01_1920x600_V5_040625.jpg?MOD=AJPERES&CACHEID=ROOTWORKSPACE-602bcf7d-dd6e-4cea-8357-dfb5ee661b85-puZPcK0",
      alt: "Family with car",
      title: "Para Toda Família",
      subtitle: "As melhores opções para seu estilo de vida",
    },
  ];

  const handleCloseForm = () => {
    setSelectedProduct(null);
    setActiveTab("types");
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === bannerImages.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [bannerImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === bannerImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? bannerImages.length - 1 : prev - 1
    );
  };

  return (
    <div className="items-center justify-center min-h-screen">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Banner removido, listando apenas os produtos */}
        <TabsContent
          value="types"
          className="bg-white flex flex-col rounded-b-lg shadow-xl px-3 sm:px-4 md:px-6 xl:p-8 py-6 sm:py-8 md:py-10"
        >
          {
            <>
              <p className="text-[#002256] mb-4 sm:mb-6 text-left text-sm sm:text-base">
                Escolha um Produto e faça uma simulação.
              </p>

              {loading && (
                <LoadingContainer message="CARREGANDO SIMULAÇÕES..." />
              )}
              {error && (
                <div className="flex items-center gap-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                  <FaExclamationTriangle className="h-5 w-5 text-red-600" />
                  <p className="text-sm font-medium">
                    Erro ao carregar os produtos. Tente novamente mais tarde.
                  </p>
                </div>
              )}
              {products.length < 1 && (
                <EmptyState
                  message="Nenhuma simulação encontrada!"
                  showFilter={false}
                />
              )}

              {products && products.length > 0 && (
                <ProductsTab
                  loading={loading}
                  error={error}
                  products={products}
                  onSelect={(p) => {
                    window.location.href = `/simulaction?productId=${p.productId}`;
                  }}
                />
              )}
            </>
          }
        </TabsContent>

        {/* Removed MySimulations tab content */}
      </Tabs>
    </div>
  );
}
