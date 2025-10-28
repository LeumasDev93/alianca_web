/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { PolicyHolder } from "@/components/Simulate/PolicyHolder";
import { RegularDriver } from "@/components/Simulate/RegularDriver";
import { VehicleData } from "@/components/Simulate/VehicleData";
import { Simulation } from "@/components/Simulate/Simulation";
import { getSession, signIn } from "next-auth/react";
import ButtonBackToPrevious from "@/components/buttonBackToPrev";
import { ModalCondictions } from "@/components/Simulate/modalCondictions";
import {
  FaCalculator,
  FaCar,
  FaChevronDown,
  FaUser,
  FaUserTie,
} from "react-icons/fa";
import {
  API_TOKEN_PROD,
  apiAlianca,
  BASE_IMAGE_URL,
} from "@/data/service/axios";
import { APIResponse } from "@/types/typesData";
import { LiaSpinnerSolid } from "react-icons/lia";
import { useRouter } from "next/navigation";
import { TypeSecurity } from "@/components/Simulate/TypesSecurity";

interface PdfFile {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number | null;
  height: number | null;
  formats: any; // Pode ser tipado mais especificamente se necessário
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: any;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface CondicaoGeralData {
  id: number;
  descricao: string;
  url: string;
  pdf_file: PdfFile[];
}

type Step = "policyholder" | "driver" | "vehicle" | "simulation";

export default function Page() {
  const [token, setToken] = useState<string | null>(null);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [insuranceType, setInsuranceType] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type");

    if (type) {
      setInsuranceType(type);
      console.log("Tipo de seguro:", type);
    }
  }, []);

  const fetchSession = async () => {
    const session = await getSession();

    if (session) {
      const currentTime = Math.floor(Date.now() / 1000);
      const tokenExpiry = session.user?.tokenExpiry || 0;

      if (tokenExpiry && tokenExpiry <= currentTime) {
        console.log("Token expirado. Obtendo novo token...");

        await signIn("credentials", { redirect: false });
        const newSession = await getSession();
        if (newSession) {
          const newToken = newSession.user?.accessToken || null;
          setToken(newToken); // Atualiza o estado do token
          return newToken; // Retorna o novo token
        } else {
          console.error("Falha ao renovar a sessão.");
          return null; // Retorna null em caso de falha
        }
      } else {
        console.log("Token ainda válido:", session.user?.accessToken);
        const currentToken = session.user?.accessToken || null;
        setToken(currentToken); // Atualiza o estado do token
        return currentToken; // Retorna o token atual
      }
    } else {
      console.log("Nenhuma sessão encontrada.");
      await signIn("credentials", { redirect: false });
      return null; // Retorna null se não houver sessão
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const [currentStep, setCurrentStep] = useState<Step>("policyholder");

  const [invalidFields, setInvalidFields] = useState<Record<Step, string[]>>({
    policyholder: [],
    driver: [],
    vehicle: [],
    simulation: [],
  });

  const [formData, setFormData] = useState<{
    policyholder: Record<string, unknown>;
    driver: Record<string, unknown>;
    vehicle: Record<string, unknown>;
    simulation?: Record<string, unknown>;
  }>({
    policyholder: {},
    driver: {},
    vehicle: {},
  });

  const [simulationResult, setSimulationResult] = useState(null);

  const steps = [
    { id: "policyholder", label: "TOMADOR DE SEGURO", icon: <FaUser /> },
    { id: "driver", label: "CONDUTOR HABITUAL", icon: <FaUserTie /> },
    { id: "vehicle", label: "DADOS DO VEICULO", icon: <FaCar /> },
    { id: "simulation", label: "SIMULAÇÃO", icon: <FaCalculator /> },
  ];

  const requiredFields: Record<Step, string[]> = {
    policyholder: ["name", "cni", "mobile", "nif", "email"],
    driver: ["driverName", "licenseNumber", "dataCarta", "dataNascimento"],
    vehicle: ["currentValue"],
    simulation: [],
  };

  const handleNext = async () => {
    const missingFields = requiredFields[currentStep].filter(
      (field) => !formData[currentStep]![field]
    );

    if (missingFields.length > 0) {
      setInvalidFields((prev) => ({
        ...prev,
        [currentStep]: missingFields,
      }));
      setErrorMessage("Preencha os campos obrigatórios.");
      setTimeout(() => {
        setErrorMessage("");
        setInvalidFields((prev) => ({
          ...prev,
          [currentStep]: [],
        }));
      }, 5000);
      return;
    }

    setErrorMessage(null);
    setInvalidFields((prev) => ({
      ...prev,
      [currentStep]: [],
    }));

    const stepOrder: Step[] = [
      "policyholder",
      "driver",
      "vehicle",
      "simulation",
    ];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }

    if (stepOrder[currentIndex + 1] === "simulation") {
      await handleSimulation();
      await fetchSimulation(formData);
    }
  };

  const handleBack = () => {
    const stepOrder: Step[] = [
      "policyholder",
      "driver",
      "vehicle",
      "simulation",
    ];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const resetForm = () => {
    setFormData({
      policyholder: {},
      driver: {},
      vehicle: {},
    });
    setCurrentStep("policyholder");
    setErrorMessage(null);
  };

  const updateFormData = (step: Step, data: Record<string, unknown>) => {
    setFormData((prev) => {
      const updatedData = {
        ...prev,
        [step]: { ...prev[step], ...data },
      };

      console.log(`Dados atualizados no passo ${step}:`, updatedData);

      return updatedData;
    });
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Mês começa do 0
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSimulation = async () => {
    if (!token) {
      console.error("Token não encontrado");
      return;
    }

    try {
      const payload = {
        data: {
          nome: String(formData.policyholder.name),
          bi_cni: String(formData.policyholder.cni),
          email: String(formData.policyholder.email),
          telefone: String(formData.policyholder.phone),
          telemovel: String(formData.policyholder.mobile),
          nif: String(formData.policyholder.nif),
          concelho: String(formData.policyholder.city),
          nome_condutor: String(formData.driver.driverName),
          data_nascimento: formatDate(
            new Date(String(formData.driver.dataNascimento))
          ),
          data_carta_conducao: formatDate(
            new Date(String(formData.driver.dataCarta))
          ),
          numero_carta_conducao: String(formData.driver.licenseNumber),
          matricula: String(formData.vehicle.registration),
          data_matricula: formatDate(
            new Date(String(formData.vehicle.dataMatricula))
          ),
          marca: String(formData.vehicle.brand),
          modelo: String(formData.vehicle.model),
          lotacao: Number(formData.vehicle.capacity),
          cilindrada: Number(formData.vehicle.engineSize),
        },
      };

      const response = await fetch(
        "http://localhost:1337/api/registo-simulacaos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_TOKEN_PROD}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setMessage({
          type: "error",
          text: `Erro HTTP: ${response.status}. Detalhes: ${JSON.stringify(
            errorData
          )}`,
        });
        throw new Error(
          `Erro HTTP: ${response.status}. Detalhes: ${JSON.stringify(
            errorData
          )}`
        );
      }

      const responseData = await response.json();

      setMessage({ type: "success", text: "Dados enviados com sucesso!" });
    } catch (error) {
      console.error("Erro ao enviar dados para a API:", error || error);
      setMessage({ type: "error", text: `Erro ao enviar dados: ${error}` });
    }
  };

  const generateRandomSimulationId = (): number => {
    const min = 100000000000; // Menor número de 12 dígitos
    const max = 999999999999; // Maior número de 12 dígitos
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const fetchSimulation = async (formData: any) => {
    setIsLoading(true);
    const session = await getSession();

    if (!session?.user?.accessToken) {
      console.warn("Nenhum token encontrado - redirecionando para login");
      signIn();
      return null;
    }

    const idSimulationTel = generateRandomSimulationId();
    console.log(idSimulationTel, "id gerado");

    const payload = {
      idSimulationTel: idSimulationTel,
      producer: 2,
      registerDateSimulationTel: new Date(),
      product: "EXTERNAL_AUTO",
      currency: "CVE",
      totalPremium: 0,
      startDate: new Date(),
      simulationObjects: [
        {
          properties: {
            licensePlate: formData.vehicle.registration,
            licenseDate: formData.vehicle.dataMatricula,
            brand: formData.vehicle.brand,
            currentValue: formData.vehicle.currentValue,
            model: formData.vehicle.model,
            seats: formData.vehicle.capacity,
            cylinderCap: formData.vehicle.engineSize,
            weight: 1200,
            chassis: "47835638",
            Ilha: "3",
            TipoDeUtilizacao: "99",
          },
          risks: [
            {
              name: "RISK_RC",
              code: "RC",
              capital: 50500000.0,
            },
          ],
          children: [
            {
              type: "AUTO_C",
              properties: {
                name: formData.driver.driverName,
                birthDate: formData.driver.dataNascimento,
                driverLicenseDate: formData.driver.dataCarta,
                driverLicenseNumber: formData.driver.licenseNumber,
              },
            },
          ],
        },
      ],
    };

    try {
      console.debug("Enviando payload:", payload);

      const response = await fetch("/api/simulation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          token: session.user.accessToken,
          ...payload,
        }),
        cache: "no-store",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Erro ${response.status}: ${JSON.stringify(errorData)}`
        );
      }

      const data = await response.json();
      console.log("Simulação criada:", data.installmentValues);
      setSimulationResult(data.installmentValues);
      setIsLoading(false);
      return data;
    } catch (error) {
      console.error("Falha na simulação:", {
        error: error instanceof Error ? error.message : error,
        timestamp: new Date().toISOString(),
      });
      setIsLoading(false);
      if (error instanceof Error && error.message.includes("401")) {
        signIn();
      }

      throw error;
    }
  };

  const stringFormDataPolicyholder = Object.fromEntries(
    Object.entries(formData.policyholder).map(([key, value]) => [
      key,
      String(value),
    ])
  );

  const stringFormDataDriver = Object.fromEntries(
    Object.entries(formData.driver).map(([key, value]) => [key, String(value)])
  );

  const stringFormDatVehicle = Object.fromEntries(
    Object.entries(formData.vehicle).map(([key, value]) => [key, String(value)])
  );
  const renderStep = () => {
    switch (currentStep) {
      case "policyholder":
        return (
          <PolicyHolder
            onNext={handleNext}
            updateData={(data) => updateFormData("policyholder", data)}
            invalidFields={invalidFields.policyholder}
            formData={stringFormDataPolicyholder}
          />
        );
      case "driver":
        return (
          <RegularDriver
            onNext={handleNext}
            updateData={(data) => updateFormData("driver", data)}
            invalidFields={invalidFields.driver}
            formData={stringFormDataDriver}
          />
        );
      case "vehicle":
        return (
          <VehicleData
            token={token}
            onNext={handleNext}
            updateData={(data) => updateFormData("vehicle", data)}
            invalidFields={invalidFields.vehicle}
            formData={stringFormDatVehicle}
          />
        );
      case "simulation":
        return (
          <Simulation
            simulationResult={simulationResult}
            currencySymbol="CVE"
            isLoading={isLoading}
          />
        );
      default:
        return null;
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenPdf = async () => {
    setIsLoading(true);

    try {
      const response = await apiAlianca.get<APIResponse<CondicaoGeralData>>(
        "/condicao-gerals?populate=*"
      );

      if (!response.data.data[0]?.pdf_file[0]?.url) {
        throw new Error("PDF não encontrado na resposta da API");
      }

      const pdfRelativeUrl = response.data.data[0].pdf_file[0].url;
      const pdfFullUrl = `${BASE_IMAGE_URL}${pdfRelativeUrl}`;

      window.open(pdfFullUrl, "_blank");
    } catch (error) {
      console.error("Erro ao abrir o PDF:", error);
      alert("Erro ao abrir o PDF. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col gap-8 row-start-2">
      {errorMessage && (
        <span className="bg-red-500 text-white px-4 py-2 rounded-lg mb-4 fixed top-32 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
          {errorMessage}
        </span>
      )}

      <ButtonBackToPrevious />

      <div className="flex flex-col mt-14 md:mt-10 mb-5 md:mb-20">
        {/* Hero Section */}
        <div className="flex justify-between h-auto md:h-[300px] bg-[#C41E3A] relative">
          <div className="absolute bottom-0 left-0 right-0 h-1 md:h-2 bg-[#002B5B] z-10"></div>

          <div className="absolute bottom-1 md:bottom-2 left-0 z-20 mt-5">
            <div className="flex flex-col">
              <div className="flex items-center justify-center bg-[#002B5B] md:w-64 p-2 md:px-6 md:py-4 rounded-t-xl">
                {insuranceType === "1" ? (
                  <span className="text-white font-bold text-sm md:text-lg">
                    SEGURO AUTOMÓVEL
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          {/* Conteúdo do banner (mantém como estava) */}
          <div className="container md:mx-auto h-full flex flex-col justify-center mt-8 md:mt-0 font-thin text-white">
            <h1 className="text-2xl md:text-5xl font-bold md:mb-4 text-center">
              Bem-Vindo
            </h1>
            <h2 className="text-lg md:text-4xl text-center">
              Simulador Automóvel
            </h2>
          </div>
          <Image
            src="https://st2.depositphotos.com/1441511/5482/i/450/depositphotos_54821609-stock-photo-happy-man-inside-car-of.jpg"
            alt="Driver"
            width={500}
            height={300}
            objectFit="cover"
            className="md:h-full h-32 w-60 md:w-[800px] rounded-l-full"
          />
        </div>
        {/* Steps Type Seguros */}
        <TypeSecurity />

        {/* Container button and RenderSteps*/}
        <div className="flex flex-col px-20 md:px-10 border border-[#b9b8b8] shadow-2xl pb-8 rounded-xl bg-[#e6e3e3] w-full">
          {/* Steps Navigation */}
          <div className="border-b w-full">
            <div className="flex justify-center w-full gap-1">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`relative py-1 md:py-4 px-2 md:px-10 md:w-full transition-transform duration-300 font-serif text-xs md:text-xl ${
                    currentStep === step.id
                      ? " text-[#002B5B] border-b-2 border-b-[#771c2b] z-10  "
                      : " text-[#6f7070] scale-100"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-[#002B5B]">{step.icon}</span>
                    {step.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="flex flex-col items-center justify-center md:mx-auto px-4 py-8 mb-10">
            {renderStep()}
          </div>

          {/* Footer */}
          <div className="flex flex-col items-center justify-center w-full space-y-4">
            {currentStep !== "simulation" ? (
              <div className="flex space-x-4">
                {currentStep !== "policyholder" && (
                  <button
                    onClick={handleBack}
                    className="bg-[#002B5B] text-white font-serif px-8 py-2 rounded flex items-center gap-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <LiaSpinnerSolid className="animate-spin h-5 w-5 text-white" />
                        Aguarde...
                      </>
                    ) : (
                      <span className="flex space-x-2">
                        <span>◀</span>
                        <span>VOLTAR</span>
                      </span>
                    )}
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className="bg-[#002B5B] text-white font-serif px-8 py-2 rounded flex items-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <LiaSpinnerSolid className="animate-spin h-5 w-5 text-white" />
                      Aguarde...
                    </>
                  ) : (
                    <span className="flex space-x-2">
                      <span>AVANÇAR</span>
                      <span>▶</span>
                    </span>
                  )}
                </button>
              </div>
            ) : (
              <div className="">
                <button
                  onClick={resetForm}
                  className="bg-[#002B5B] text-white font-serif px-8 py-2 rounded flex items-center gap-2"
                >
                  INICIO
                </button>
              </div>
            )}
            <div className="flex justify-center mt-3 md:mt-0">
              <button
                onClick={handleOpenPdf}
                className="text-[#C41E3A] font-serif text-center"
              >
                Ver condições Gerais
              </button>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && <ModalCondictions onClose={handleCloseModal} />}
    </main>
  );
}
