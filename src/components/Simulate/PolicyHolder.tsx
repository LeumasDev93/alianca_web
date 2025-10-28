"use client";

import React, { useState } from "react";

interface PolicyHolderProps {
  onNext: () => void;
  updateData: (data: { [key: string]: string }) => void;
  invalidFields?: string[]; 
  formData: { [key: string]: string };
}

export const PolicyHolder: React.FC<PolicyHolderProps> = ({
  updateData,
  invalidFields = [],
  formData = {}, 
}) => {

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validatePhoneNumber = (value: string, fieldName: string) => {
    const phoneRegex = /^\d{7}$/;
  
    if (!phoneRegex.test(value)) {
      return `O ${fieldName} deve conter exatamente 7 números.`;
    }
  
    return "";
  };
  
  const validateNif = (nif: string) => {
    const nifRegex = /^\d{9}$/;

    if (!nifRegex.test(nif)) {
      return "O NIF deve conter 9 números.";
    }

    const weights = [9, 8, 7, 6, 5, 4, 3, 2]; 
    let sum = 0;
  
    for (let i = 0; i < 8; i++) {
      sum += parseInt(nif[i]) * weights[i];
    }
  
    const remainder = sum % 11;
    const expectedCheckDigit = remainder < 2 ? 0 : 11 - remainder;
  
    const actualCheckDigit = parseInt(nif[8]);
    if (expectedCheckDigit !== actualCheckDigit) {
      return "NIF inválido. Verifique o número inserido.";
    }
  
    return "";
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Por favor, insira um e-mail válido.";
    }
    return "";
  };

  const validations = {
    phone: (value: string) => validatePhoneNumber(value, "telefone"),
    nif: validateNif,
    mobile: (value: string) => validatePhoneNumber(value, "telemóvel"), 
    email: validateEmail,
  };

  type ValidationKeys = keyof typeof validations;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (validations[name as ValidationKeys]) {
      const errorMessage = validations[name as ValidationKeys](value);
      setErrors((prev) => ({ ...prev, [name]: errorMessage }));
    }

    updateData({ [name]: value });
  };

  const getFieldClassName = (name: string, isRequired: boolean = false) => {
    const isInvalid = invalidFields.includes(name);
    if (isRequired && isInvalid) {
      return "border-red-600";
    }
    return "border-blue-900";
  };

  const shouldShowError = (name: string, isRequired: boolean = false) => {
    return isRequired && invalidFields.includes(name);
  };

  return (
    <div className="flex flex-col items-center space-y-14">
      <div className="flex w-full md:w-[800px]">
        <p className="text-blue-950 md:text-2xl text-center">
          Aproveite a vida conscientemente de que fez a escolha correta. Seguro
          de Vida <span className="font-bold">Aliança Seguro</span> é a melhor
          opção para quem quer o bem-estar e segurança de quem mais gosta.
        </p>
      </div>

      <div className="flex flex-col space-y-8 w-full">
        <div className="flex">
          <div className="flex flex-col">
            <input
              className={`w-96 md:w-[850px] font-serif text-blue-950 border ${getFieldClassName(
                "name",
                true
              )} focus:outline-none p-2 rounded-lg`}
              id="name"
              name="name"
              value={formData.name || ""} 
              onChange={handleChange}
              required
              placeholder="Nome *"
            />
            {shouldShowError("name", true) && (
              <span className="text-red-600 text-sm mt-1">
                Este campo é obrigatório
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20">
          <div className="space-y-8">
            <div className="flex flex-col">
            <input
              className={`w-96 font-serif text-blue-950 border ${getFieldClassName(
                "email",
                true
              )} focus:outline-none p-2 rounded-lg`}
              id="email"
              name="email"
              type="email"
              value={formData.email || ""}
              required
              onChange={handleChange}
              placeholder="Email *"
            />
              {errors.email && (
                <span className="text-red-600 text-sm mt-1">{errors.email}</span>
              )}
              {shouldShowError("email", true) && (
                <span className="text-red-600 text-sm mt-1">
                  Este campo é obrigatório
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <input
                type="number"
                className={`w-96 font-serif text-blue-950 border ${getFieldClassName(
                  "phone"
                )} focus:outline-none p-2 rounded-lg`}
                id="phone"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
                placeholder="Telefone"
              />
              {errors.phone && (
                <span className="text-red-600 text-sm mt-1">{errors.phone}</span>
              )}
            </div>
            <div className="flex flex-col">
              <input
                className={`w-96 font-serif text-blue-950 border ${getFieldClassName(
                  "cni",
                  true
                )} focus:outline-none p-2 rounded-lg`}
                id="cni"
                name="cni"
                value={formData.cni || ""} 
                onChange={handleChange}
                required
                placeholder="CNI / BI *"
              />
              {shouldShowError("cni", true) && (
                <span className="text-red-600 text-sm mt-1">
                  Este campo é obrigatório
                </span>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex flex-col">
              <input
                type="number"
                className={`w-96 font-serif text-blue-950 border ${getFieldClassName(
                  "mobile",
                  true
                )} focus:outline-none p-2 rounded-lg`}
                id="mobile"
                name="mobile"
                value={formData.mobile || ""} 
                onChange={handleChange}
                required
                placeholder="Telemóvel *"
              />
               {errors.mobile && (
                  <span className="text-red-600 text-sm mt-1">{errors.mobile}</span>
                )}
               {shouldShowError("mobile", true) && (
                <span className="text-red-600 text-sm mt-1">
                  Este campo é obrigatório
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <input
                type="number"
                className={`w-96 font-serif text-blue-950 border ${getFieldClassName(
                  "nif",
                  true
                )} focus:outline-none p-2 rounded-lg`}
                id="nif"
                name="nif"
                value={formData.nif || ""} // Preenche com os dados existentes
                onChange={handleChange}
                required
                placeholder="NIF *"
              />
              {errors.nif && (
                  <span className="text-red-600 text-sm mt-1">{errors.nif}</span>
                )}
              {shouldShowError("nif", true) && (
                <span className="text-red-600 text-sm mt-1">
                  Este campo é obrigatório
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <input
                className={`w-96 font-serif text-blue-950 border ${getFieldClassName(
                  "city"
                )} focus:outline-none p-2 rounded-lg`}
                id="city"
                name="city"
                value={formData.city || ""} // Preenche com os dados existentes
                onChange={handleChange}
                placeholder="Concelho / Cidade"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};