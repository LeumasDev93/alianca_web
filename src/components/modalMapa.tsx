"use client";

import React, { useRef, useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import customPin from "@/assets/Icones/OndeNosEncontrar_Icone.png";
import { IoCloseOutline } from "react-icons/io5";

export default function ModalMap({
  onClose,
  lat,
  lng,
}: {
  onClose: () => void;
  lat: number;
  lng: number;
}) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapContainer.current) return;

    const map = L.map(mapContainer.current, {
      center: [lat, lng],
      zoom: 17,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution:
        "Map data &copy; <a href='https://www.openstreetmap.org'>OpenStreetMap</a> contributors, Tiles courtesy of <a href='https://www.openstreetmap.fr/'>OpenStreetMap France</a>",
      maxZoom: 17,
    }).addTo(map);

    L.tileLayer(
      "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      { maxZoom: 17 }
    ).addTo(map);

    const customIcon = L.icon({
      iconUrl: customPin.src,
      iconSize: [40, 48],
      iconAnchor: [20, 48],
      popupAnchor: [0, -48],
    });

    L.marker([lat, lng], { icon: customIcon })
      .addTo(map)
      .bindPopup("Aqui está a localização!");

    map.setView([lat, lng], 17);

    // Função de limpeza
    return () => {
      map.remove();
    };
  }, [isClient, lat, lng]); // Removido `isClient` do array de dependências

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
      <div className="relative bg-white p-14 rounded-md shadow-lg w-full h-full">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-black"
        >
          <IoCloseOutline className="w-6 h-6" />
        </button>
        <div ref={mapContainer} className="w-full h-full" />
      </div>
    </div>
  );
}
