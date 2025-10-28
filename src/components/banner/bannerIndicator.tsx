import React from "react";
import { motion } from "framer-motion";

interface BannerIndicatorsProps {
  totalSlides: number;
  currentIndex: number;
  interval: number;
  onSlideChange: (index: number) => void;
}

const BannerIndicators: React.FC<BannerIndicatorsProps> = ({
  totalSlides,
  currentIndex,
  interval,
  onSlideChange,
}) => {
  return (
    <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
      {Array.from({ length: totalSlides }).map((_, index) => (
        <button
          key={index}
          onClick={() => onSlideChange(index)}
          className={`relative h-2 rounded-full transition-all duration-300 overflow-hidden group ${
            index === currentIndex
              ? "w-8 bg-white"
              : "w-2 bg-white/40 hover:bg-white/70"
          }`}
          aria-label={`Go to slide ${index + 1}`}
        >
          {index === currentIndex && (
            <motion.div
              className="absolute left-0 top-0 h-full bg-white/50"
              initial={{ width: "0%" }}
              animate={{
                width: "100%",
                transition: { duration: interval / 1000, ease: "linear" },
              }}
            />
          )}
          {/* Hover preview line */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100">
            <div className="absolute left-0 top-0 h-full w-0 group-hover:w-full bg-white/30 transition-all duration-300" />
          </div>
        </button>
      ))}
    </div>
  );
};

export default BannerIndicators;
