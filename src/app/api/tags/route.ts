import { NextResponse } from 'next/server';
import { API_CONFIG } from '@/config/api';

export async function GET() {
  try {
    const url = `${API_CONFIG.BASE_URL}/tags?includeChildren=true`;
    
    console.log('='.repeat(50));
    console.log('🏷️ ALLY API - BUSCANDO TAGS');
    console.log('='.repeat(50));
    console.log('🔗 URL completa:', url);
    console.log('🔑 Base URL:', API_CONFIG.BASE_URL);
    console.log('🔑 Token (primeiros 50 chars):', API_CONFIG.TOKEN.substring(0, 50) + '...');
    console.log('🔑 Token existe:', !!API_CONFIG.TOKEN);
    console.log('-'.repeat(50));
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Apikey': API_CONFIG.TOKEN,
      },
      cache: 'no-store',
    });

    console.log('📡 Status HTTP:', response.status);
    console.log('📡 Status Text:', response.statusText);
    console.log('📡 Headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ ERRO NA RESPOSTA');
      console.error('❌ Status:', response.status);
      console.error('❌ Body:', errorText);
      console.log('='.repeat(50));
      
      return NextResponse.json(
        { 
          error: `API retornou ${response.status}`, 
          details: errorText,
          url: url,
          status: response.status 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ SUCESSO! Tags recebidas:', Array.isArray(data) ? `${data.length} tags` : typeof data);
    console.log('📦 Dados:', JSON.stringify(data).substring(0, 200) + '...');
    console.log('='.repeat(50));
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ EXCEÇÃO CAPTURADA');
    console.error('❌ Erro:', error);
    console.error('❌ Tipo:', typeof error);
    console.log('='.repeat(50));
    
    return NextResponse.json(
      { 
        error: 'Erro ao buscar tags', 
        details: error instanceof Error ? error.message : String(error),
        type: typeof error
      },
      { status: 500 }
    );
  }
}


