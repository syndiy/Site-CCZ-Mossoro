import { afterEach, describe, expect, it, vi } from "vitest";
import { listarDenunciasAdmin, responseToUpdateRequest } from "@/lib/api/denunciaApi";
import { requisitar } from "@/lib/api/apiClient";
import type { DenunciaResponse } from "@/lib/types/denuncia";

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); vi.restoreAllMocks(); vi.resetModules(); });

describe("integração do painel com Spring", () => {
  it("envia filtros e paginação ao servidor", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ content: [], page: 2, totalPages: 3, totalElements: 25 }) });
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("window", new EventTarget());
    vi.stubGlobal("localStorage", { getItem: () => "session-token" });
    await listarDenunciasAdmin(2, 10, { status: "EM_ANALISE", tipo: "RATOS" });
    const [url, options] = fetchMock.mock.calls[0];
    const query = new URL(url, "https://ccz.test").searchParams;
    expect(Object.fromEntries(query)).toEqual({ page: "2", size: "10", status: "EM_ANALISE", tipo: "RATOS" });
    expect(options.headers.Authorization).toBe("Bearer session-token");
  });

  it("expira a sessão ao receber 401 de uma chamada autenticada", async () => {
    const browser = new EventTarget();
    const expired = vi.fn();
    browser.addEventListener("ccz-session-expired", expired);
    vi.stubGlobal("window", browser);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ status: 401 }));
    await expect(requisitar("/api/users/me", { headers: { Authorization: "Bearer expired" } })).rejects.toThrow("Sua sessão expirou");
    expect(expired).toHaveBeenCalledOnce();
  });

  it("preserva a sessão quando uma operação retorna 403", async () => {
    const browser = new EventTarget();
    const expired = vi.fn();
    browser.addEventListener("ccz-session-expired", expired);
    vi.stubGlobal("window", browser);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ status: 403 }));
    expect((await requisitar("/api/users/list", { headers: { Authorization: "Bearer editor" } })).status).toBe(403);
    expect(expired).not.toHaveBeenCalled();
  });

  it("não apresenta falha do servidor como sessão expirada", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }));
    await expect(listarDenunciasAdmin()).rejects.toThrow("Não foi possível carregar as ocorrências");
  });

  it("preserva os dados ao mudar o status no contrato de atualização", () => {
    const data = { tipoDeDenuncia: "RATOS", statusDenuncia: "EM_ANALISE", nomeDenunciante: null, numeroTelefone: null, rua: "Rua A", cidade: "Mossoró", estado: "RN", numero: "10", complemento: null, bairro: "Centro", cep: "59600-000" } as DenunciaResponse;
    expect(responseToUpdateRequest(data, "CONCLUIDA")).toEqual({ tipoDeDenuncia: "RATOS", statusDenuncia: "CONCLUIDA", nomeDenunciante: null, numeroTelefone: null, logradouro: "Rua A", localidade: "Mossoró", uf: "RN", numero: "10", complemento: null, bairro: "Centro", cep: "59600-000" });
  });

  it("cadastra editor com o campo cpf que o Spring valida", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 201, json: async () => ({ id: 2 }) });
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("window", new EventTarget());
    vi.stubGlobal("localStorage", { getItem: () => "token-do-admin" });
    const { criarUsuario } = await import("@/lib/api/usuarioApi");
    await criarUsuario({ username: "Ana", email: "ana@ccz.test", phone: "84999990000", cpf: "52998224725", password: "segredo1" });
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body).toMatchObject({ cpf: "52998224725", role: "ROLE_EDITOR" });
    expect(body).not.toHaveProperty("CPF");
    // O cadastro público foi fechado: só o administrador, com o token, cria contas.
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe("Bearer token-do-admin");
  });

  it("usa a mesma origem quando o endereço da API não foi configurado", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "");
    const { API_BASE } = await import("@/lib/api/apiClient");
    expect(API_BASE).toBe("/api");
  });
});
