import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/config/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('🤖 Ally API - Fazendo pergunta:', body.question);
    console.log('🔗 URL:', `${API_CONFIG.BASE_URL}/questions/ask`);
    console.log('🔑 Token existe:', !!API_CONFIG.TOKEN);
    
    const response = await fetch(`${API_CONFIG.BASE_URL}/questions/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Apikey': API_CONFIG.TOKEN,
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    console.log('📡 Resposta status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro na API:', response.status, errorText);
      return NextResponse.json(
        { error: `Erro na API: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Resposta recebida:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Erro ao fazer pergunta:', error);
    return NextResponse.json(
      { error: 'Erro ao processar pergunta', details: String(error) },
      { status: 500 }
    );
  }
}


