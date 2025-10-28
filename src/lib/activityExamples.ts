export function useSimulationActivity() {
  return {
    activities: [
      {
        id: 1,
        title: "Simulação iniciada",
        description: "Usuário iniciou uma nova simulação",
        timestamp: new Date().toISOString(),
        type: "info",
      },
      {
        id: 2,
        title: "Dados preenchidos",
        description: "Formulário de dados pessoais preenchido",
        timestamp: new Date().toISOString(),
        type: "success",
      },
      {
        id: 3,
        title: "Simulação concluída",
        description: "Simulação processada com sucesso",
        timestamp: new Date().toISOString(),
        type: "success",
      },
    ],
  };
}
