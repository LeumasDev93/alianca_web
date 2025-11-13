// Função para formatar preview de mensagens
export const formatMessagePreview = (text: string, maxLength: number): string => {
  if (!text) return '';
  
  // Remover quebras de linha e espaços extras
  const cleaned = text.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
  
  // Truncar se necessário
  if (cleaned.length <= maxLength) return cleaned;
  
  return cleaned.substring(0, maxLength) + '...';
};

