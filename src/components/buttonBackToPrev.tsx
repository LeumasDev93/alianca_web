"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import IconBack from "@/assets/Icones/Botao-Voltar_Icone.svg";

export default function ButtonBackToPrevious() {
  const [previousSlug, setPreviousSlug] = useState<string | null>(null);
  const [currentSlug, setCurrentSlug] = useState<string>("");

  const pathname = usePathname();

  useEffect(() => {
    const currentSlugFromPathname =
      pathname?.split("/").filter(Boolean).pop() || "";

    sessionStorage.setItem("currentSlug", currentSlugFromPathname);

    const previousSlugFromStorage = sessionStorage.getItem("previousSlug");
    //console.log("previousSlugFromStorage:", previousSlugFromStorage);

    if (previousSlugFromStorage !== currentSlugFromPathname) {
      setPreviousSlug(previousSlugFromStorage);
    }

    setCurrentSlug(currentSlugFromPathname);

    sessionStorage.setItem("previousSlug", currentSlugFromPathname);
  }, [pathname]);

  //console.log(previousSlug, "/", currentSlug);
  return (
    <div className="fixed top-10 -left-6 md:top-20 md:left-1 p-4 md:space-x-2 flex z-30">
      <button
        onClick={() => history.back()}
        className="text-white flex space-x-2 md:items-center px-4 py-2 rounded-xl"
      >
        <span className="md:w-8 md:h-8 w-5 h-5 rounded-full flex justify-center items-center bg-[#8d8c8c] p-1 md:p-2">
          <Image src={IconBack} alt="Voltar" />
        </span>

        <span className="text-xs md:text-sm text-white bg-[#8d8c8c] rounded-full px-4 py-1  ">
          {previousSlug !== null ? `${previousSlug}` : "home"} /{currentSlug}
        </span>
      </button>
    </div>
  );
}
