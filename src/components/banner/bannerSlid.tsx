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

        {/* Overlay com gradiente */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent z-0" />

        {/* Conteúdo */}
        <motion.div
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-10 w-full h-full flex items-center"
          variants={textVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="max-w-3xl w-full">
            <motion.h1
              variants={textVariants}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white drop-shadow-2xl mb-3 sm:mb-4 animate-fade-in"
            >
              {title || "Bem-vindo"}
            </motion.h1>

            <motion.p
              variants={textVariants}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/90 drop-shadow-lg mb-4 sm:mb-6"
            >
              {subtitle || "Descubra nossos serviços"}
            </motion.p>

            <motion.div variants={textVariants} transition={{ delay: 0.4 }}>
              <button
                onClick={onclick}
                className="bg-[#B7021C] hover:bg-[#950119] text-white font-bold py-2 px-6 sm:py-3 sm:px-7 md:py-4 md:px-8 text-sm sm:text-base rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Saber Mais
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BannerSlide;
