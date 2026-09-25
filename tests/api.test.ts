import { describe, expect, it, vi, afterEach } from "vitest";
import { criarDenuncia } from "@/lib/api/denunciaApi";
import type { DenunciaPayload } from "@/lib/types/denuncia";

const payload: DenunciaPayload = {
  tipoDeDenuncia: "MAUS_TRATOS",
  descricao: "Animal preso sem agua",
  nomeDenunciante: "Maria",
  numeroTelefone: "84999999999",
  cep: "59600-000",
  logradouro: "Rua Exemplo",
  numero: "10",
  complemento: "Casa",
  bairro: "Centro",
  localidade: "Mossoro",
  uf: "RN",
  imagem: null,
};

function capturarEnvio() {
  const fetchMock = vi.fn(async () => ({
    ok: true,
    status: 200,
    json: async () => ({ protocolo: "2026-0001", dataCriacao: "2026-09-24T10:00:00", tipoDenuncia: "MAUS_TRATOS", statusDenuncia: "EM_ANALISE" }),
  })) as unknown as typeof fetch;
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock as unknown as ReturnType<typeof vi.fn>;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("criarDenuncia", () => {
  it("traduz o endereco para os campos esperados pelo backend", async () => {
    const fetchMock = capturarEnvio();
    await criarDenuncia(payload);

    const form = fetchMock.mock.calls[0][1].body as FormData;
    // O backend renomeou estes campos: logradouro->rua, localidade->cidade, uf->estado.
    expect(form.get("rua")).toBe("Rua Exemplo");
    expect(form.get("cidade")).toBe("Mossoro");
    expect(form.get("estado")).toBe("RN");
    expect(form.get("logradouro")).toBeNull();
    expect(form.get("localidade")).toBeNull();
    expect(form.get("uf")).toBeNull();
  });

  it("envia descricao e abre a denuncia em analise", async () => {
    const fetchMock = capturarEnvio();
    await criarDenuncia(payload);

    const form = fetchMock.mock.calls[0][1].body as FormData;
    expect(form.get("descricao")).toBe("Animal preso sem agua");
    expect(form.get("statusDenuncia")).toBe("EM_ANALISE");
  });

  it("omite coordenadas quando nao foram marcadas no mapa", async () => {
    const fetchMock = capturarEnvio();
    await criarDenuncia(payload);

    const form = fetchMock.mock.calls[0][1].body as FormData;
    expect(form.get("latitude")).toBeNull();
    expect(form.get("longitude")).toBeNull();
  });

  it("envia as coordenadas quando o cidadao marca o local", async () => {
    const fetchMock = capturarEnvio();
    await criarDenuncia({ ...payload, latitude: -5.18, longitude: -37.34 });

    const form = fetchMock.mock.calls[0][1].body as FormData;
    expect(form.get("latitude")).toBe("-5.18");
    expect(form.get("longitude")).toBe("-37.34");
  });
});
