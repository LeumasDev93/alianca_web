"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import BannerSlide from "@/components/banner/bannerSlid";
import BannerControls from "@/components/banner/bannerControls";
import BannerIndicators from "@/components/banner/bannerIndicator";
import { useRouter } from "next/navigation";

const DEFAULT_INTERVAL = 30000;

interface BannerProps {
  banners: any[];
  baseImageUrl: string;
}

const Banner: React.FC<BannerProps> = ({ banners, baseImageUrl }) => {
  const getImageUrl = React.useCallback(
    (banner: any) => {
      if (!banner?.banner_img?.url) return "";
      return `${baseImageUrl}${banner.banner_img.url}`;
    },
    [baseImageUrl]
  );
  const preloadImage = (url: string) =>
    new Promise<void>((resolve) => {
      if (!url) return resolve();
      const img = new Image();
      img.src = url;
      img.onload = () => resolve();
      img.onerror = () => resolve();
    });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [previousIndex, setPreviousIndex] = useState(0);
  const [progressPct, setProgressPct] = useState(0);
  const router = useRouter();

  const nextSlide = useCallback(async () => {
    if (banners.length <= 1) return;
    const nextIndex = (currentIndex + 1) % banners.length;
    await preloadImage(getImageUrl(banners[nextIndex]));
    setPreviousIndex(currentIndex);
    setDirection(1);
    setCurrentIndex(nextIndex);
  }, [banners, currentIndex, getImageUrl]);

  const prevSlide = useCallback(async () => {
    if (banners.length <= 1) return;
    const prevIndex = (currentIndex - 1 + banners.length) % banners.length;
    await preloadImage(getImageUrl(banners[prevIndex]));
    setPreviousIndex(currentIndex);
    setDirection(-1);
    setCurrentIndex(prevIndex);
  }, [banners, currentIndex, getImageUrl]);

  const goToSlide = useCallback(
    async (index: number) => {
      if (banners.length <= 1 || index === currentIndex) return;
      await preloadImage(getImageUrl(banners[index]));
      setPreviousIndex(currentIndex);
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
    },
    [currentIndex, banners, getImageUrl]
  );

  const handleUserInteraction = useCallback((action: () => void) => {
    setIsAutoPlaying(false);
    action();
    const timer = setTimeout(() => setIsAutoPlaying(true), 10000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || banners.length <= 1) return;

    const timer = setTimeout(() => {
      // call async but do not await inside setTimeout
      nextSlide();
    }, DEFAULT_INTERVAL);

    return () => clearTimeout(timer);
  }, [currentIndex, isAutoPlaying, nextSlide, banners.length]);

  // Progress bar synced with autoplay
  useEffect(() => {
    if (!isAutoPlaying || banners.length <= 1) {
      setProgressPct(0);
      return;
    }
    setProgressPct(0);
    const startedAt = Date.now();
    const id = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const pct = Math.min(100, (elapsed / DEFAULT_INTERVAL) * 100);
      setProgressPct(pct);
    }, 100);
    return () => clearInterval(id);
  }, [currentIndex, isAutoPlaying, banners.length]);

  const handleButtonClick = (id: number) => {
    router.push(`/banner-details/${id}`);
  };

  // Pause on hover
  const onMouseEnter = () => setIsAutoPlaying(false);
  const onMouseLeave = () => setIsAutoPlaying(true);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleUserInteraction(nextSlide);
      if (e.key === "ArrowLeft") handleUserInteraction(prevSlide);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleUserInteraction, nextSlide, prevSlide]);

  // Wheel navigation (throttled)
  const lastWheelRef = React.useRef(0);
  const onWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    const now = Date.now();
    if (now - lastWheelRef.current < 800) return;
    lastWheelRef.current = now;
    if (e.deltaY > 0) handleUserInteraction(nextSlide);
    if (e.deltaY < 0) handleUserInteraction(prevSlide);
  };

  // Touch swipe navigation
  const touchStartX = React.useRef<number | null>(null);
  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      if (dx < 0) handleUserInteraction(nextSlide);
      else handleUserInteraction(prevSlide);
    }
    touchStartX.current = null;
  };

  const currentBanner = banners[currentIndex];
  const previousBanner = banners[previousIndex];

  return (
    <div
      className="relative w-full h-52 sm:h-[50vh] lg:h-[80vh] xl:h-[50vh] overflow-hidden mt-4 sm:mt-6 md:mt-10 lg:mt-16 xl:mt-20 bg-center bg-cover"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onWheel={onWheel}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{ backgroundImage: `url(${getImageUrl(currentBanner)})` }}
    >
      <div className="absolute inset-0">
        <AnimatePresence initial={false}>
          <BannerSlide
            onclick={() => handleButtonClick(currentBanner.id)}
            key={currentIndex}
            image={getImageUrl(currentBanner)}
            title={currentBanner?.titulo}
            subtitle={currentBanner?.description}
            isActive={true}
            direction={direction}
            currentIndex={currentIndex}
            previousIndex={previousIndex}
            onSwipeLeft={() => handleUserInteraction(nextSlide)}
            onSwipeRight={() => handleUserInteraction(prevSlide)}
          />
        </AnimatePresence>
        {/* Bottom progress bar */}
        {banners.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40">
            <div
              className="h-full bg-white/70 transition-[width] duration-100"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        )}
      </div>

      {banners.length > 1 && (
        <>
          <BannerControls
            onPrev={() => handleUserInteraction(prevSlide)}
            onNext={() => handleUserInteraction(nextSlide)}
          />
          <BannerIndicators
            currentIndex={currentIndex}
            interval={DEFAULT_INTERVAL}
            totalSlides={banners.length}
            onSlideChange={(index) =>
              handleUserInteraction(() => goToSlide(index))
            }
          />
        </>
      )}
    </div>
  );
};

export default Banner;
