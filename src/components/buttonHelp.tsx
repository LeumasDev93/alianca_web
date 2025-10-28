"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useQRCode } from 'next-qrcode';
import IconWhatsapp from "@/assets/Icones/whatsapp.png";
import { apiAlianca } from "@/data/service/axios";
import { APIResponse, ContactInfosData } from "@/types/typesData";

export default function ButtonHelp() {
  const [data, setData] = useState<ContactInfosData[]>([]);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const [erro, setError] = useState("");
  const { Canvas } = useQRCode();

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await apiAlianca.get<APIResponse<ContactInfosData>>(
          "/contact-infos?populate=*"
        );
        const contactData = response.data.data[0];
        const phoneNumber = contactData.contactoWhatsapp;
        const message = contactData.messageWhatspp;
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        
        setWhatsappUrl(url); // Define o link do WhatsApp
        
      } catch (error) {
        setError("")
      }
    };

    fetchContactInfo();
  }, []);

  const handleClick = () => {
    if (whatsappUrl) {
      window.open(whatsappUrl, "_blank");
    }
  };

  return (
    <button 
      className="fixed bottom-10 right-5 md:right-10 flex items-center group"
    >
      {whatsappUrl && (
        <div className="hidden absolute max-w-[350px] space-x-2 right-0 md:flex items-center bg-[#0e4432] text-white px-8 py-2 rounded-full opacity-0 translate-x-10 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 ease-in-out">
          <Canvas
            text={whatsappUrl}
            options={{
              errorCorrectionLevel: "M",
              margin: 3,
              quality: 100,
              scale: 3,
              width: 70, 
              color: {
                dark: "#000000",
                light: "#FFFFFF",
              },
            }}
          />
          <span className="text-sm font-medium text-left w-60">
            Para falar conosco<br />
            escaneie o QR code ou<br />
            clique no botão.
          </span>
        </div>
      )}

      <div onClick={handleClick} className="relative z-10 bg-green-600 rounded-full p-3 md:p-4 flex items-center justify-center shadow-lg transition-transform duration-500 transform group-hover:scale-125">
        <Image 
          src={IconWhatsapp} 
          alt="WhatsApp" 
          className="w-6 h-6 md:w-8 md:h-8"
        />
      </div>
    </button>
  );
}