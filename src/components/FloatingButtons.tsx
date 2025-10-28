"use client";

import Image from "next/image";
import { useState } from "react";
import { Calculator } from "lucide-react";
import IconContactWhite from "@/assets/Icones/Contactar_Icone.png";
import IconContactBlue from "@/assets/Icones/Contactar_Icone.svg";
import { ModalSimulate } from "./Simulate/modalSimulate";
import { ModalContact } from "./modalContact";

export default function FloatingButtons() {
	const [isSimulateOpen, setIsSimulateOpen] = useState(false);
	const [isContactOpen, setIsContactOpen] = useState(false);

	return (
		<div className="fixed top-40 md:top-1/2 right-0 z-[1000]">
			{/* Simulate button */}
			<button
				onClick={() => setIsSimulateOpen(true)}
				className=" p-4 md:p-4 bg-blue-950 hover:bg-white hover:border border-blue-950 rounded-tl-xl rounded-bl-none shadow-lg transition-all duration-300 ease-in-out w-10 h-10 md:w-20 md:h-20 flex flex-col items-center justify-center group"
			>
				<div className="flex items-center justify-center w-4 h-3 md:w-8 md:h-8">
					<Calculator className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:text-blue-950 transition-colors duration-300" />
				</div>
				<span className="text-xs text-white mt-1 hidden md:flex transition-colors duration-300 group-hover:text-[#002256]">
					Simular
				</span>
			</button>

			{/* Contact button */}
			<button
				onClick={() => setIsContactOpen(true)}
				className="p-4 md:p-4 bg-[#B7021C] hover:bg-white hover:border border-[#B7021C]/80 rounded-bl-xl rounded-tl-none shadow-lg transition-all duration-300 ease-in-out w-10 h-10 md:w-20 md:h-20 flex flex-col items-center justify-center group"
			>
				<div className="flex items-center justify-center md:relative w-4 h-4 md:w-8 md:h-8">
					<Image
						src={IconContactWhite}
						alt="Contactar"
						className="absolute w-6 h-6 md:w-8 md:h-8 transition-opacity duration-300 opacity-100 group-hover:opacity-0"
					/>
					<Image
						src={IconContactBlue}
						alt="Contactar Hover"
						className="absolute w-6 h-6 md:w-8 md:h-8 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
					/>
				</div>
				<span className="text-xs text-white mt-1 hidden md:flex transition-colors duration-300 group-hover:text-[#002256]">
					Contactar
				</span>
			</button>

			{isSimulateOpen && <ModalSimulate onClose={() => setIsSimulateOpen(false)} />}
			{isContactOpen && (
				<ModalContact onClose={() => setIsContactOpen(false)} telefone1="" telefone2="" />
			)}
		</div>
	);
}
