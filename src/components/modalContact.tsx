"use client";

import Image from "next/image";
import IconLocalization from "@/assets/Icones/OndeNosEncontrar_Icone.png";
import IconMenssage from "@/assets/Icones/FaleConnosco_Icone.png";
import { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { API_TOKEN_PROD, apiAlianca } from "@/data/service/axios";
import { APIResponse, ContactInfosData } from "@/types/typesData";
import Link from "next/link";

export function ModalContact({
  onClose,
}: {
  onClose: () => void;
  telefone1: string;
  telefone2: string;
}) {
  const [data, setData] = useState<ContactInfosData[]>([]);

  const [messageFields, setMessageFields] = useState("");
  const [messageError, setMessageError] = useState("");
  const [messageSuccess, setMessageSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    mensagem: "",
    checkbox: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value, type } = e.target;

    if (type === "checkbox" && "checked" in e.target) {
      setFormData((prevState) => ({
        ...prevState,
        [id]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [id]: value,
      }));
    }
  };

  const validateForm = () => {
    if (!formData.nome || !formData.email || !formData.mensagem) {
      setMessageFields("Por favor, preencha todos os campos.");
      setTimeout(() => {
        setMessageFields("");
      }, 3000);
      return false;
    }

    if (!formData.checkbox) {
      setMessageFields("Marca o campo, não sou um robô.");
      setTimeout(() => {
        setMessageFields("");
      }, 3000);
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessageFields("Por favor, insira um email válido.");
      setTimeout(() => {
        setMessageFields("");
      }, 3000);
      return false;
    }

    if (formData.mensagem.length < 10) {
      setMessageFields("A mensagem deve ter pelo menos 10 caracteres.");
      setTimeout(() => {
        setMessageFields("");
      }, 3000);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessageFields("");
    setMessageError("");
    setMessageSuccess("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const token = API_TOKEN_PROD;

      const response = await fetch(
        "https://gestao.aliancaseguros.cv/api/fale-connoscos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: {
              nome: formData.nome,
              email: formData.email,
              mensagem: formData.mensagem,
            },
          }),
        }
      );

      if (response.ok) {
        setMessageSuccess("Mensagem enviada com sucesso!");
        setFormData({ nome: "", email: "", mensagem: "", checkbox: false });
        setTimeout(() => {
          setMessageSuccess("");
        }, 3000);
      } else {
        setMessageError(
          "Erro ao enviar a mensagem. Tente novamente mais tarde."
        );
        setTimeout(() => {
          setMessageError("");
        }, 3000);
      }
    } catch (error) {
      console.error("Erro ao enviar a mensagem:", error);
      setMessageError("Erro ao enviar a mensagem. Tente novamente mais tarde.");
      setTimeout(() => {
        setMessageError("");
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await apiAlianca.get<APIResponse<ContactInfosData>>(
          "/contact-infos?populate=*"
        );
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching parceiros:", error);
      }
    };

    fetchContactInfo();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
      <div className="relative bg-white w-full h-full md:w-auto md:h-auto py-8 md:p-14 rounded-md shadow-lg z-60 overflow-y-auto md:overflow-visible">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-black"
        >
          <IoCloseOutline className="w-6 h-6" />
        </button>
        <div className="flex flex-col md:flex-row sm:flex-row md:space-x-28 px-10">
          {/* Seção: Saiba onde nos encontrar */}
          <div className="flex flex-col items-center">
            <div className="flex space-x-2">
              <Image
                src={IconLocalization}
                alt=""
                className="md:w-5 md:h-6 w-4 h-5"
              />
              <p className="text-red-700 font-semibold">
                Saiba onde nos encontrar
              </p>
            </div>

            <div className="flex flex-row space-x-6 md:space-x-0 items-center mt-4 md:mt-0 md:flex-col">
              <div className="flex-col md:space-y-2 md:items-center md:justify-center md:text-center mt-5">
                <p className="text-sm text-gray-900">{data[0]?.adress}</p>
                <p className="text-sm text-gray-900">{data[0]?.cidade}</p>
                <p className="text-sm text-gray-900">{data[0]?.pais}</p>
              </div>

              <div className="flex justify-center md:mt-10">
                <Link
                  href="/mapa"
                  target="_blank"
                  className="bg-gray-100 border border-red-700 text-red-700 text-xs md:text-sm font-semibold py-2 px-4 rounded-md shadow-md hover:bg-gray-200 transition-all duration-300"
                >
                  Ver no mapa
                </Link>
              </div>
            </div>
          </div>

          {/* Seção: Fale Connosco */}
          <div className="flex flex-col items-center mt-5 md:mt-0 space-y-6">
            <div className="flex items-center space-x-2">
              <Image
                src={IconMenssage}
                alt="Ícone de mensagem"
                className="w-6 h-6"
              />
              <p className="text-red-700 font-bold text-lg">Fale connosco</p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col space-y-2 md:space-y-4 w-72 md:w-80"
            >
              {/* Campos do formulário */}
              <div className="flex flex-col">
                <label className="text-gray-600 font-medium" htmlFor="nome">
                  Nome
                </label>
                <input
                  id="nome"
                  type="text"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className="bg-gray-100 border md:w-full border-gray-300 rounded-md h-10 px-3 text-gray-800 focus:ring-2 focus:ring-red-600 focus:outline-none"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-600 font-medium" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-gray-100 border border-gray-300 rounded-md h-10 px-3 text-gray-800 focus:ring-2 focus:ring-red-600 focus:outline-none"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-600 font-medium" htmlFor="mensagem">
                  Mensagem
                </label>
                <textarea
                  id="mensagem"
                  rows={4}
                  value={formData.mensagem}
                  onChange={handleInputChange}
                  className="bg-gray-100 border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:ring-2 focus:ring-red-600 focus:outline-none resize-none"
                />
              </div>

              {/* Mensagens de feedback */}
              {messageFields && (
                <div className="flex items-center justify-center bg-red-600 text-white px-4 py-2 rounded-lg mb-4">
                  <span>{messageFields}</span>
                </div>
              )}

              {messageError && (
                <div className="flex items-center justify-center bg-red-600 text-white px-4 py-2 rounded-lg mb-4">
                  <span>{messageError}</span>
                </div>
              )}

              {messageSuccess && (
                <div className="flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-lg mb-4">
                  <span>{messageSuccess}</span>
                </div>
              )}

              {/* Checkbox e botão de envio */}
              <div className="flex justify-between items-center w-60 md:w-80">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="checkbox"
                    checked={formData.checkbox}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-red-700 border-gray-300 rounded focus:ring-red-700 focus:ring-2"
                  />
                  <label htmlFor="checkbox" className="text-gray-800 text-sm">
                    Não sou um robô
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gray-100 border border-red-700 text-sm text-red-700 font-semibold py-2 px-4 rounded-md shadow-md hover:bg-gray-200 transition-all duration-300"
                >
                  {isSubmitting ? "Enviando..." : "Enviar"}
                </button>
              </div>
            </form>

            <div className="flex space-x-2 mt-5 w-80">
              <p className="text-center text-sm text-gray-900">
                Ou ligue pra o número
                <span className="text-red-700">
                  {data[0]?.telefone1} / {data[0]?.telefone2}
                </span>{" "}
                nos dias úteis das 8hr às 19hr. Encerrado ao fim-de-semana.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
