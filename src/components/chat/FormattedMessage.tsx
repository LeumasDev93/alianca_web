"use client";

import React from "react";

interface FormattedMessageProps {
  text: string;
  isUser: boolean;
}

export default function FormattedMessage({ text, isUser }: FormattedMessageProps) {
  if (isUser) {
    // Mensagens do usuário não precisam formatação especial
    return <>{text}</>;
  }

  // Processar markdown para HTML
  const formatText = (input: string) => {
    const lines = input.split('\n');
    const elements: React.ReactElement[] = [];
    let key = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Linha vazia - adicionar espaço
      if (line.trim() === '') {
        elements.push(<div key={key++} className="h-2"></div>);
        continue;
      }

      // Lista com marcador (- ou •)
      if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
        const content = line.trim().substring(1).trim();
        elements.push(
          <div key={key++} className="flex gap-2 ml-2 mb-1">
            <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
            <span dangerouslySetInnerHTML={{ __html: processBold(content) }} />
          </div>
        );
        continue;
      }

      // Linha normal com possível negrito
      elements.push(
        <p key={key++} className="mb-2" dangerouslySetInnerHTML={{ __html: processBold(line) }} />
      );
    }

    return elements;
  };

  // Processar **texto** para <strong>texto</strong>
  const processBold = (text: string): string => {
    return text.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-gray-900 dark:text-white">$1</strong>');
  };

  return (
    <div className="space-y-1">
      {formatText(text)}
    </div>
  );
}

