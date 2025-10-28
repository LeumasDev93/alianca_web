"use client";

import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import ProductsTab from "@/components/Simulation/ProductsTab";
import { IoCloseOutline } from "react-icons/io5";
import { LiaSpinnerSolid } from "react-icons/lia";

export function ModalSimulate({ onClose }: { onClose: () => void }) {
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);
  const { products, loading, error } = useProducts();

  const handleSelectProduct = (product: { productId: string }) => {
    setLoadingProductId(product.productId);
    window.location.href = `/simulaction?productId=${product.productId}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
      <div className="relative bg-white p-6 md:p-10 rounded-md shadow-lg z-60 flex flex-col items-center max-w-5xl w-full">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-black"
        >
          <IoCloseOutline className="w-6 h-6" />
        </button>
        <div className="flex justify-center w-full mb-4 font-bold">
          <p className="text-blue-950 text-2xl font-serif uppercase">
            Simulador
          </p>
        </div>
        <div className="flex justify-center items-center text-center w-full font-semibold mt-2">
          <h1 className="text-blue-950 text-xl font-serif">Escolha um produto para simular</h1>
        </div>

        <div className="w-full mt-6">
          <ProductsTab
            loading={loading}
            error={error}
            products={products}
            onSelect={handleSelectProduct as any}
            loadingProductId={loadingProductId}
          />
        </div>
      </div>
    </div>
  );
}
