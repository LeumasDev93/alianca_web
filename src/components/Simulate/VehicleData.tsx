import { customStyles } from "@/types/CustumStyles";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";



interface VehicleDataProps {
  onNext: () => void;
  updateData: (data: { [key: string]: string | number | Date | null }) => void;
  invalidFields?: string[];
  token: string | null;
  formData: { [key: string]: string | Date | null };
}

export const VehicleData: React.FC<VehicleDataProps> = ({
  updateData,
  token,
  invalidFields = [],
  formData = {}, 
}) => {

  const [startDate, setStartDate] = useState<Date | null>(
    typeof formData.dataMatricula === "string" ? new Date(formData.dataMatricula) : formData.dataMatricula || null
  );

  const [brands, setBrands] = useState<{ id: number; name: string }[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<{ value: string; label: string } | null>(
    formData.brand ? { value: formData.brand.toString(), label: formData.brand.toString() } : null
  );
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
  const [models, setModels] = useState<{ id: number; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchBrands = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/anywhere/api/v1/private/mobile/vehicle/brands', {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar marcas");
        }

        const data = await response.json();
        setBrands(data);

        if (formData.brand) {
          const selectedBrand = data.find((brand: { name: string }) => brand.name === formData.brand);
          if (selectedBrand) {
            setSelectedBrandId(selectedBrand.id);
            fetchModels(selectedBrand.id);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar marcas:", error);
        setError("Erro ao carregar marcas. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrands();
  }, [token, formData.brand]);

  const fetchModels = async (brandId: number) => {
    try {
      const response = await fetch(
        `/api/anywhere/api/v1/private/mobile/vehicle/brands/${brandId}/models`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar modelos");
      }

      const data = await response.json();
      setModels(data);
    } catch (error) {
      console.error("Erro ao buscar modelos:", error);
      setError("Erro ao carregar modelos. Tente novamente mais tarde.");
    }
  };

  const handleBrandChange = async (selectedOption: { value: string; label: string } | null) => {
    setSelectedBrand(selectedOption);

    if (selectedOption) {
      const selectedBrand = brands.find((brand) => brand.name === selectedOption.value);
      if (selectedBrand) {
        setSelectedBrandId(selectedBrand.id);
        updateData({ brand: selectedBrand.name });
        fetchModels(selectedBrand.id);
      }
    }
  };

  const validateMatriculaDate = (date: Date | null) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    if (!date) {
      return "";
    }
  
    if (date > today) {
      return "A data de matrícula não pode ser no futuro.";
    }
  
    return "";
  };

  const handleDateChange = (date: Date | null) => {
    setStartDate(date);
  
    const errorMessage = validateMatriculaDate(date);
    setErrors((prev) => ({ ...prev, dataMatricula: errorMessage }));
  
    updateData({ dataMatricula: date });
  };

  const brandOptions = brands.map((brand) => ({
    value: brand.name,
    label: brand.name,
  }));

  const getFieldClassName = (name: string, isRequired: boolean = false) => {
    const isInvalid = invalidFields.includes(name) || errors[name];
    if (isRequired && isInvalid) {
      return "border-red-600";
    }
    return "border-blue-900";
  };

  const shouldShowError = (name: string, isRequired: boolean = false) => {
    return isRequired && (invalidFields.includes(name) || errors[name]);
  };

  return (
    <div className="flex flex-col items-center space-y-14 w-96 md:w-[900px] md:max-w-[1000px]">
      <div className="flex w-full md:w-[800px]">
        <p className="text-blue-950 md:text-2xl text-center">
          Aproveite a vida conscientemente de que fez a escolha correta. Seguro
          de Vida <span className="font-bold">Aliança Seguro</span> é a melhor
          opção para quem quer o bem-estar e segurança de quem mais gosta
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 ">
        <div className="space-y-8">
          <div className="flex flex-col">
            <input
              className="w-96 font-serif text-blue-950 border border-blue-900 focus:outline-none p-2 rounded-lg"
              id="registration"
              name="registration"
              value={formData.registration?.toString() || ""} // Preenche com os dados existentes
              onChange={(e) => updateData({ registration: e.target.value })}
              placeholder="Matricula"
            />
          </div>
          <div className="flex flex-col">
            <Select
              className="w-96 font-serif text-blue-950"
              options={brandOptions}
              value={selectedBrand}
              onChange={handleBrandChange}
              placeholder="Selecione a marca"
              noOptionsMessage={({ inputValue }) =>
                inputValue.length < 3
                  ? "Digite pelo menos 3 letras"
                  : "Nenhuma marca encontrada"
              }
              isLoading={isLoading}
              isDisabled={isLoading}
              styles={customStyles}
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
          <div className="flex flex-col">
            <input
              className="w-96 font-serif text-blue-950 border border-blue-900 focus:outline-none p-2 rounded-lg"
              id="capacity"
              name="capacity"
              type="number"
              value={formData.capacity?.toString() || ""} // Preenche com os dados existentes
              onChange={(e) => updateData({ capacity: e.target.value })}
              placeholder="Lotação"
            />
          </div>
          <div className="flex flex-col">
            <input
               className={`w-96 font-serif text-blue-950 border ${getFieldClassName(
                "currentValue",
                true
              )} focus:outline-none p-2 rounded-lg`}
              id="currentValue"
              name="currentValue"
               type="number"
              value={formData.currentValue?.toString() || ""} // Preenche com os dados existentes
              onChange={(e) => updateData({ currentValue: e.target.value })}
              placeholder="Valor *"
              required
            />
             {shouldShowError("currentValue", true) && (
              <span className="text-red-600 text-sm mt-1">
                Este campo é obrigatório
              </span>
            )}
          </div>
        </div>
        <div className="space-y-8">
          <div className="flex flex-col">
            <DatePicker
              id="dataMatricula"
              selected={startDate}
              onChange={handleDateChange}
              placeholderText="Data Matricula"
              className="w-96 font-serif text-blue-950 border border-blue-900 focus:outline-none p-2 rounded-lg"
              name="dataMatricula"
            />
            {errors.dataMatricula && (
              <span className="text-red-600 text-sm mt-1">
                {errors.dataMatricula}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <select
              className="w-96 font-serif text-gray-500 border border-blue-900 focus:outline-none p-2 rounded-lg"
              id="model"
              name="model"
              value={formData.model?.toString() || ""} // Preenche com os dados existentes
              onChange={(e) => updateData({ model: e.target.value })}
              disabled={models.length === 0}
            >
              <option value="">
                {models.length === 0 ? "Selecione uma marca primeiro" : "Selecione o modelo"}
              </option>
              {models.map((model) => (
                <option key={model.id} value={model.name}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <input
              className="w-96 font-serif text-blue-950 border border-blue-900 focus:outline-none p-2 rounded-lg"
              id="engineSize"
              name="engineSize"
              type="number"
              value={formData.engineSize?.toString() || ""} // Preenche com os dados existentes
              onChange={(e) => updateData({ engineSize: e.target.value })}
              placeholder="Cilindrada"
            />
          </div>
        </div>
      </div>
    </div>
  );
};