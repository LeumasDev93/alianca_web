import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  context: any
) {
  const productId = context?.params?.id as string;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL_SIMULATOR;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY || "";
  const token = process.env.API_SECRET_TOKEN || "";

  if (!baseUrl) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_API_BASE_URL_SIMULATOR não configurado" },
      { status: 500 }
    );
  }

  try {
    const url = `${baseUrl}/simulador/1.0.0/products/${encodeURIComponent(
      productId
    )}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        ApiKey: apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      // Avoid Next caching API responses when hitting external APIs
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `Upstream error ${res.status}`, details: text },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Falha ao obter detalhes do produto", details: String(err?.message || err) },
      { status: 500 }
    );
  }
}


