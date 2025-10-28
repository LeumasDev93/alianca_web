import React from "react";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";

interface BannerControlsProps {
  onPrev: () => void;
  onNext: () => void;
}

const BannerControls: React.FC<BannerControlsProps> = ({ onPrev, onNext }) => {
  return (
    <>
      {/* Botão de navegação para o slide anterior */}
      <div className="absolute inset-y-0 left-0 md:left-4 flex items-center z-30">
        <button
          onClick={onPrev}
          className="rounded-full bg-transparent backdrop-blur-sm hover:bg-black/50 text-white shadow-lg hover:shadow-xl transform transition-transform hover:scale-110 p-2 focus:outline-none focus:ring-2 focus:ring-white/60"
        >
          <FaChevronLeft className="w-4 h-4 md:h-8 md:w-8" />
        </button>
      </div>

      {/* Botão de navegação para o próximo slide */}
      <div className="absolute inset-y-0 right-0 md:right-4 flex items-center z-20">
        <button
          onClick={onNext}
          className="rounded-full bg-transparent backdrop-blur-sm hover:bg-black/50 text-white shadow-lg hover:shadow-xl transform transition-transform hover:scale-110 p-2 focus:outline-none focus:ring-2 focus:ring-white/60"
        >
          <FaChevronRight className="w-4 h-4 md:h-8 md:w-8" />
        </button>
      </div>
    </>
  );
};

export default BannerControls;
