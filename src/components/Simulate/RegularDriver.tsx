"use client";

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface RegularDriverProps {
  onNext: () => void;
  updateData: (data: { [key: string]: string | Date | null }) => void;
  invalidFields?: string[];
  formData: { [key: string]: string | Date | null };
}

export const RegularDriver: React.FC<RegularDriverProps> = ({
  updateData,
  invalidFields = [],
  formData = {},
}) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [cartaDate, setCartaDate] = useState<Date | null>(
    typeof formData.dataCarta === "string" ? new Date(formData.dataCarta) : formData.dataCarta || null
  );

  const [birthdyDate, setBirthdyDate] = useState<Date | null>(
    typeof formData.dataNascimento === "string" ? new Date(formData.dataNascimento) : formData.dataNascimento || null
  );

  const validateCartaDate = (date: Date | null) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (!date) {
      return "Este campo é obrigatório.";
    }

    if (date > yesterday) {
      return "A data da carta de condução deve ser até um dia anterior à data atual.";
    }

    return "";
  };

  const validateBirthdayDate = (date: Date | null) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    if (!date) {
      return "Este campo é obrigatório.";
    }

    if (date > today) {
      return "A data de nascimento não pode ser no futuro.";
    }

    const minAgeDate = new Date(today);
    minAgeDate.setFullYear(today.getFullYear() - 18);

    if (date > minAgeDate) {
      return "O usuário deve ter pelo menos 18 anos.";
    }

    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateData({ [name]: value });
  };

  const handleCartaDateChange = (date: Date | null) => {
    setCartaDate(date);

    const errorMessage = validateCartaDate(date);
    setErrors((prev) => ({ ...prev, dataCarta: errorMessage }));

    updateData({ dataCarta: date });
  };

  const handleBirthdyDateChange = (date: Date | null) => {
    setBirthdyDate(date);

    const errorMessage = validateBirthdayDate(date);
    setErrors((prev) => ({ ...prev, dataNascimento: errorMessage }));

    updateData({ dataNascimento: date });
  };

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
          opção para quem quer o bem-estar e segurança de quem mais gosta.
        </p>
      </div>
      <div className="flex flex-col space-y-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 w-full">
          {/* Coluna 1 */}
          <div className="space-y-4 w-full">
            {/* Nome */}
            <div className="w-full">
              <input
                className={`w-full md:w-96 font-serif text-blue-950 border ${getFieldClassName("driverName", true)} 
                          focus:outline-none p-3 rounded-lg text-sm md:text-base`}
                id="driverName"
                name="driverName"
                value={formData.driverName?.toString() || ""}
                onChange={handleChange}
                required
                placeholder="Nome *"
              />
              {shouldShowError("driverName", true) && (
                <span className="text-red-600 text-xs mt-1 block">
                  Este campo é obrigatório
                </span>
              )}
            </div>

            {/* Data Carta Condução */}
            <div className="w-full">
              <DatePicker
                id="dataCarta"
                name="dataCarta"
                selected={cartaDate}
                onChange={handleCartaDateChange}
                placeholderText="Data Carta Condução *"
                required
                className={`w-full md:w-96 font-serif text-blue-950 border ${getFieldClassName("dataCarta", true)} 
                          focus:outline-none p-3 rounded-lg text-sm md:text-base`}
              />
              {shouldShowError("dataCarta", true) && (
                <span className="text-red-600 text-xs mt-1 block">
                  {errors.dataCarta}
                </span>
              )}
            </div>
          </div>

          {/* Coluna 2 */}
          <div className="space-y-4 w-full">
            {/* Data Nascimento */}
            <div className="w-full">
              <DatePicker
                id="dataNascimento"
                name="dataNascimento"
                selected={birthdyDate}
                onChange={handleBirthdyDateChange}
                placeholderText="Data Nascimento *"
                required
                className={`w-full md:w-96 font-serif text-blue-950 border ${getFieldClassName("dataNascimento", true)} 
                          focus:outline-none p-3 rounded-lg text-sm md:text-base`}
              />
              {shouldShowError("dataNascimento", true) && (
                <span className="text-red-600 text-xs mt-1 block">
                  {errors.dataNascimento}
                </span>
              )}
            </div>

            {/* Número de Carta */}
            <div className="w-full">
              <input
                className={`w-full md:w-96 font-serif text-blue-950 border ${getFieldClassName("licenseNumber", true)} 
                          focus:outline-none p-3 rounded-lg text-sm md:text-base`}
                id="licenseNumber"
                name="licenseNumber"
                onChange={handleChange}
                value={formData.licenseNumber?.toString() || ""}
                required
                placeholder="Número de Carta Condução *"
              />
              {shouldShowError("licenseNumber", true) && (
                <span className="text-red-600 text-xs mt-1 block">
                  Este campo é obrigatório
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};