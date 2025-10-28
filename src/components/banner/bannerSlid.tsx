/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface BannerSlideProps {
  image: string;
  title?: string;
  subtitle?: string;
  currentIndex: number;
  direction: number;
  isActive: boolean;
  previousIndex: number;
  onclick?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

const BannerSlide: React.FC<BannerSlideProps> = ({
  image,
  title,
  subtitle,
  direction,
  isActive,
  previousIndex,
  onclick,
  onSwipeLeft,
  onSwipeRight,
}) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const img = new Image();
    img.src = image;
    img.onload = () => {
      setDimensions({
        width: img.width,
        height: img.height,
      });
    };
  }, [image]);

  const slideVariants = {
    enter: () => ({
      opacity: 0,
      zIndex: 0,
    }),
    center: {
      zIndex: 1,
      opacity: 1,
      transition: {
        opacity: { duration: 0.6, ease: "linear" },
      },
    },
    exit: () => ({
      zIndex: 0,
      opacity: 0,
      transition: {
        opacity: { duration: 0.6, ease: "linear" },
      },
    }),
  };

  const textVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] },
    },
    exit: {
      y: -30,
      opacity: 0,
      transition: { duration: 0.6, ease: [0.2, 0.65, 0.3, 0.9] },
    },
  };

  // Aspect ratio para desktop e altura fixa para mobile
  const aspectRatio =
    dimensions.width > 0 ? (dimensions.height / dimensions.width) * 100 : 56.25;

  const handleDragEnd = (_e: any, info: { offset: { x: number } }) => {
    if (info.offset.x < -50) {
      if (onSwipeLeft) onSwipeLeft();
    }
    if (info.offset.x > 50) {
      if (onSwipeRight) onSwipeRight();
    }
  };

  return (
    <motion.div
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate={isActive ? "center" : "exit"}
      exit="exit"
      className="relative w-full h-full"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      whileDrag={{ scale: 0.98 }}
      onDragEnd={handleDragEnd}
    >
      {/* Contêiner principal responsivo */}
      <div className="relative w-full h-full">
        {/* Imagem de fundo */}
        <div
          className={`absolute inset-0 bg-center bg-no-repeat 
      lg:bg-cover
      md:bg-cover
      sm:bg-contain`}
          style={{ backgroundImage: `url(${image})` }}
          role="img"
          aria-label={title || "Banner"}
        />

        {/* Overlays (reduzidas para evitar flash) */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Conteúdo */}
        <motion.div
          className="absolute inset-0 flex flex-col justify-center items-center text-center z-30 px-4"
          variants={textVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.h1
            variants={textVariants}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2 sm:mb-3 md:mb-4 max-w-[90%] md:max-w-3xl drop-shadow-lg"
          >
            {title || "Bem-vindo"}
          </motion.h1>

          <motion.p
            variants={textVariants}
            transition={{ delay: 0.2 }}
            className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-white/90 max-w-[90%] sm:max-w-[80%] md:max-w-xl mb-3 sm:mb-4 md:mb-6 lg:mb-8 drop-shadow-md"
          >
            {subtitle || "Descubra nossos serviços"}
          </motion.p>

          <motion.div variants={textVariants} transition={{ delay: 0.4 }}>
            <button
              onClick={onclick}
              className="bg-[#11165fe5] px-3 py-1 sm:px-4 sm:py-2 md:px-5 md:py-2 lg:px-6 lg:py-3 rounded-lg backdrop-blur-sm font-bold text-white hover:bg-[#1a1e53e1] hover:scale-105 transition-all text-xs sm:text-sm md:text-base"
            >
              Saber Mais
            </button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BannerSlide;
