 export function generateRandomSimulationId(): number {
    
    const min = 100000000000; // Menor número de 12 dígitos
    const max = 999999999999; // Maior número de 12 dígitos
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }