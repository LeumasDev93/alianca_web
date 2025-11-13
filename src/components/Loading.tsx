import { LiaSpinnerSolid } from "react-icons/lia";

export const LoadingSpinner = () => {
  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="flex flex-col justify-center items-center gap-4 bg-white p-8 md:p-10 rounded-2xl shadow-2xl">
        {/* Spinner Animado */}
        <div className="relative">
          {/* Círculo externo girando */}
          <div className="absolute inset-0 border-4 border-[#002256]/20 rounded-full w-16 h-16 md:w-20 md:h-20"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-[#002256] rounded-full w-16 h-16 md:w-20 md:h-20 animate-spin"></div>
          
          {/* Círculo interno girando */}
          <div className="absolute inset-2 border-4 border-[#B7021C]/20 rounded-full w-12 h-12 md:w-16 md:h-16"></div>
          <div className="absolute inset-2 border-4 border-transparent border-t-[#B7021C] rounded-full w-12 h-12 md:w-16 md:h-16 animate-spin" style={{animationDirection: "reverse"}}></div>
          
          {/* Centro */}
          <div className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20">
            <div className="w-4 h-4 md:w-6 md:h-6 bg-gradient-to-br from-[#002256] to-[#B7021C] rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Texto de Carregamento */}
        <div className="text-center">
          <h2 className="text-lg md:text-xl font-bold text-[#002256] mb-1 animate-pulse">
            Carregando...
          </h2>
          <p className="text-sm text-gray-600">
            Por favor, aguarde um momento
          </p>
        </div>

        {/* Barra de Progresso Animada */}
        <div className="w-48 md:w-64 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#002256] via-[#B7021C] to-[#002256] animate-loading-bar"></div>
        </div>

        {/* Pontos Animados */}
        <div className="flex justify-center gap-2">
          <div className="w-2 h-2 bg-[#002256] rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-[#0047AB] rounded-full animate-bounce animation-delay-200"></div>
          <div className="w-2 h-2 bg-[#B7021C] rounded-full animate-bounce animation-delay-400"></div>
        </div>

        {/* Mensagem de Rodapé */}
        <p className="text-xs text-gray-500 mt-2">
          Aliança Seguros • Sempre ao seu lado
        </p>
      </div>
    </div>
  );
};
