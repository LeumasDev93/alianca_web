/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
type ServicosData = {
  id: number;
  title: string;
  icon?: { url: string }[];
};
import { useRouter } from "next/navigation";
import { LiaSpinnerSolid } from "react-icons/lia";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
interface ServiceProps {
  servicos: ServicosData[];
  baseImageUrl: string;
}

export function Service({ servicos, baseImageUrl }: ServiceProps) {
  const [data, setData] = useState<ServicosData[]>(servicos || []);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingButtons, setLoadingButtons] = useState<{
    [key: number]: boolean;
  }>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [groupSize, setGroupSize] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [windowWidth, setWindowWidth] = useState(0);

  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 1024) {
        setItemsPerPage(6); // Desktop
      } else if (window.innerWidth >= 768) {
        setItemsPerPage(3); // Tablet
      } else if (window.innerWidth >= 640) {
        setItemsPerPage(4); // Tablet grande
      } else {
        setItemsPerPage(2); // Mobile
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setData(servicos || []);
  }, [servicos]);

  const handleButtonClick = (id: number) => {
    setLoadingButtons((prev) => ({ ...prev, [id]: true }));
    router.push(`/servico-details/${id}`);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalGroups - 1 : prevIndex - 1
    );
    setProgress(
      (((currentIndex - 1 + totalGroups) % totalGroups) / totalGroups) * 100
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalGroups);
    setProgress((((currentIndex + 1) % totalGroups) / totalGroups) * 100);
  };

  const getVisibleItems = () => {
    if (data.length === 0) return [];

    if (data.length <= itemsPerPage) {
      return data;
    }

    let visibleItems = [];
    for (let i = 0; i < itemsPerPage; i++) {
      const index = (currentIndex + i) % data.length;
      visibleItems.push(data[index]);
    }
    return visibleItems;
  };

  const totalGroups = Math.ceil(data.length / groupSize);

  const updateProgress = useCallback(() => {
    const newProgress = ((currentIndex + 1) / totalGroups) * 100;
    setProgress(newProgress);
  }, [currentIndex, totalGroups]);

  useEffect(() => {
    updateProgress();
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % totalGroups;
        updateProgress();
        return newIndex;
      });
    }, 6000);
    return () => clearInterval(interval);
  }, [currentIndex, totalGroups, updateProgress]);

  return (
    <>
      {!isLoading && (
        <>
          {data.length > 0 && (
            <div className="flex flex-col justify-center items-center w-full h-full p-4 bg-[#eceaea] relative">
              <h1 className="md:text-3xl text-xl font-bold text-center mb-6 text-[#002256]">
                Os nossos produtos
              </h1>

              <div className="flex items-center w-full lg:max-w-6xl">
                {data.length > itemsPerPage && (
                  <button
                    onClick={handlePrev}
                    className="p-2 rounded-full bg-transparent hover:bg-[#b4b2b2] shadow-xl mr-2 z-10"
                    aria-label="Anterior"
                  >
                    <FaChevronLeft className="text-[#002256] hover:text-[#172944] text-sm md:text-xl" />
                  </button>
                )}

                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-center space-x-2 transition-transform duration-300">
                    {getVisibleItems().map((service, index) => (
                      <div
                        key={`${service.id}-${index}`}
                        className="flex-shrink-0 flex flex-col items-center"
                        style={{ width: `${100 / itemsPerPage}%` }}
                      >
                        <button
                          onClick={() => handleButtonClick(service.id)}
                          disabled={loadingButtons[service.id]}
                          className="flex flex-col items-center gap-3 h-full w-full"
                        >
                          <div className="flex flex-col items-center justify-center w-28 h-28 bg-[#e2e0e0] hover:bg-[#bbb7b7] rounded-2xl shadow-md mx-auto">
                            {service.icon && (
                              <Image
                                src={`${baseImageUrl}${service.icon[0].url}`}
                                alt={service.title || "servico sem título"}
                                className="w-12 h-12 mb-2"
                                width={100}
                                height={100}
                              />
                            )}
                            {loadingButtons[service.id] ? (
                              <LiaSpinnerSolid className="animate-spin mr-2 text-[#002256] text-xl" />
                            ) : null}
                          </div>
                          <div className="w-24 flex">
                            <p className="text-center text-md font-medium text-[#002256]">
                              {service.title}
                            </p>
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {data.length > itemsPerPage && (
                  <button
                    onClick={handleNext}
                    className="p-2 rounded-full bg-transparent hover:bg-[#b4b2b2] shadow-xl ml-2 z-10"
                    aria-label="Próximo"
                  >
                    <FaChevronRight className="text-[#002256] hover:text-[#172944] text-sm md:text-xl" />
                  </button>
                )}
              </div>
              {data.length > itemsPerPage && (
                <div className="w-full max-w-6xl px-8">
                  <div className="w-full h-2 bg-[#e2e0e0] rounded-lg overflow-hidden mt-4">
                    <div
                      className="h-full bg-[#002256] transition-all duration-[500ms]"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}
