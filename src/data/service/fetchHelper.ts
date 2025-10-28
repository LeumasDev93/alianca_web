
// Tipos para os parâmetros de fetch
interface FetchOptions extends RequestInit {
  headers?: HeadersInit;
}

// Tipo genérico para a resposta da API
interface ApiResponse<T> {
  data: T;
  error?: string;
}

const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;  // Acessando a variável de ambiente no lado do cliente

async function customFetch<T>(url: string, options: FetchOptions = {}): Promise<T> {
  const headers = {
    'Authorization': `Bearer ${API_TOKEN}`,
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  const data: ApiResponse<T> = await response.json();  // Assegure que a resposta corresponde a este formato
  return data.data;  // Retorne diretamente os dados, assumindo que eles estão sob a chave 'data'
}

export default customFetch;
