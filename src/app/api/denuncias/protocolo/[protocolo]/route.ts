import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { protocolo: string } }
) {
  try {
    const apiUrl = process.env.SIGCCZ_API_URL;
    const apiKey = process.env.SIGCCZ_API_KEY;

    if (!apiUrl || !apiKey) {
      return NextResponse.json(
        { error: "Erro de configuração interna." },
        { status: 500 }
      );
    }

    const response = await fetch(
      `${apiUrl}/api/v1/denuncias/protocolo/${params.protocolo}`,
      {
        method: "GET",
        headers: {
          "X-API-KEY": apiKey,
        },
      }
    );

    const data = await response.json().catch(() => null);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("[PROXY GET PROTOCOLO]:", error);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}