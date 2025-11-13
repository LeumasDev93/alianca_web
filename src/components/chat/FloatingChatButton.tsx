"use client";

import { useState } from "react";
import Chat from "@/components/chat/Chat";
import { X } from "lucide-react";

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    setIsExpanded(false);
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleClose = () => {
    setIsExpanded(false);
    setTimeout(() => setIsOpen(false), 100);
  };

  return (
    <>
      {/* Botão Flutuante - só aparece quando fechado */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-[9999] w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-[#002256] to-[#B7021C] hover:from-[#001a40] hover:to-[#950119] rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 group"
          aria-label="Abrir chat"
        >
          {/* Pulsante de fundo */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#002256] to-[#B7021C] rounded-full animate-ping opacity-75"></div>
          
          {/* Ícone de chat */}
          <div className="relative z-10">
            <svg 
              className="w-7 h-7 sm:w-8 sm:h-8 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
              />
            </svg>
          </div>

          {/* Badge de notificação */}
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full flex items-center justify-center animate-pulse">
            <span className="text-[10px] text-white font-bold">AI</span>
          </div>
        </button>
      )}

      {/* Overlay escuro - só no mobile quando expandido */}
      {isExpanded && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[9990] animate-fadeIn"
          onClick={() => {
            setIsExpanded(false);
            setTimeout(() => setIsOpen(false), 300);
          }}
        ></div>
      )}

      {/* Painel do Chat - Uma única instância que muda de posição */}
      {isOpen && (
        <div className={`
          fixed z-[9995] bg-white shadow-2xl overflow-hidden
          transition-all duration-300 ease-in-out
          ${isExpanded 
            ? 'right-0 top-[56px] md:top-20 h-[calc(100vh-56px)] md:h-[calc(100vh-80px)] w-full md:w-1/2 lg:w-[45%] xl:w-[40%] rounded-none' 
            : 'bottom-24 right-6 w-80 sm:w-96 h-[500px] rounded-2xl border-2 border-gray-200'
          }
        `}>
          {/* Botão Fechar (X) - canto superior direito */}
          <button
            onClick={handleClose}
            className="absolute top-1 right-1 z-10 p-1 text-gray-400 hover:text-red-600 transition-all duration-200 hover:scale-110"
            aria-label="Fechar chat"
            title="Fechar chat"
          >
            <X className="w-4 h-4" color="white" strokeWidth={3}/>
          </button>

          {/* Botão Expandir/Minimizar - canto inferior direito, acima do footer */}
          <button
            onClick={handleToggleExpand}
            className="absolute bottom-14 right-2 sm:bottom-14 sm:right-3 z-10 p-1.5 sm:p-2 bg-gradient-to-r from-[#002256] to-[#B7021C] hover:from-[#001a40] hover:to-[#950119] text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            aria-label={isExpanded ? "Minimizar chat" : "Expandir chat"}
            title={isExpanded ? "Minimizar" : "Expandir"}
          >
            {isExpanded ? (
              // Ícone minimizar
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            ) : (
              // Ícone expandir
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            )}
          </button>

          <Chat />
        </div>
      )}
    </>
  );
}


