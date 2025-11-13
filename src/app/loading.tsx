export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        {/* Logo Animado */}
        <div className="flex justify-center mb-8">
          <div className="relative w-24 h-24">
            {/* Círculo externo girando */}
            <div className="absolute inset-0 border-4 border-[#002256]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#002256] rounded-full animate-spin"></div>
            
            {/* Círculo do meio */}
            <div className="absolute inset-2 border-4 border-[#B7021C]/20 rounded-full"></div>
            <div className="absolute inset-2 border-4 border-transparent border-t-[#B7021C] rounded-full animate-spin animation-delay-150" style={{animationDirection: "reverse"}}></div>
            
            {/* Centro */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-br from-[#002256] to-[#0047AB] rounded-full animate-pulse shadow-lg"></div>
            </div>
          </div>
        </div>

        {/* Texto de Carregamento */}
        <h2 className="text-2xl font-bold text-[#002256] mb-2 animate-pulse">
          Carregando...
        </h2>
        <p className="text-gray-600">
          Por favor, aguarde um momento
        </p>

        {/* Barra de Progresso Animada */}
        <div className="mt-8 max-w-xs mx-auto">
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#002256] via-[#B7021C] to-[#002256] animate-loading-bar"></div>
          </div>
        </div>

        {/* Pontos Animados */}
        <div className="flex justify-center gap-2 mt-6">
          <div className="w-2 h-2 bg-[#002256] rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-[#0047AB] rounded-full animate-bounce animation-delay-200"></div>
          <div className="w-2 h-2 bg-[#B7021C] rounded-full animate-bounce animation-delay-400"></div>
        </div>

        {/* Mensagem de Rodapé */}
        <p className="mt-8 text-xs text-gray-500">
          Aliança Seguros • Sempre ao seu lado
        </p>
      </div>
    </div>
  );
}

