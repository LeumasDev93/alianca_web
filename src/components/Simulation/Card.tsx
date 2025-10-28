import { Product } from "@/types/typesData";
import { FaCar, FaHome, FaShieldAlt, FaPlane } from "react-icons/fa";
import * as FaIcons from "react-icons/fa";

const iconMap: Record<string, any> = {
  FaCar,
  FaHome,
  FaShieldAlt,
  FaPlane,
};

function resolveIconFromWebIcon(webIcon?: string | null) {
  if (!webIcon) return null;
  const Icon = (FaIcons as any)[webIcon];
  return Icon ? Icon : null;
}

export default function Card({ product, onSimulate }: { product: Product; onSimulate?: (p: Product) => void }) {
  const DynamicIcon = resolveIconFromWebIcon((product as any).webIcon);
  const IconComponent = DynamicIcon || (product.icon ? iconMap[product.icon] : FaShieldAlt);

  return (
    <div className="rounded-xl border border-blue-900/30 bg-[#e6f0ff] p-5 md:p-6 w-full">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-[#022b5b]">{product.name}</h3>
            <p className="text-sm text-[#022b5b] opacity-80">{product.category}</p>
          </div>
          <div className="text-[#022b5b] opacity-90">
            <IconComponent className="w-6 h-6" />
          </div>
        </div>

        <button
          onClick={() => onSimulate?.(product)}
          className="w-full bg-[#062f5d] hover:bg-[#05264b] text-white font-semibold rounded-md py-3 transition-colors"
        >
          Simular Agora
        </button>
      </div>
    </div>
  );
}