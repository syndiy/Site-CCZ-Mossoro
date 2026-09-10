import { describe, expect, it } from "vitest";
import type { DenunciaResponse } from "../admin/src/lib/backend";
import {
  contarPorStatus,
  formatarEndereco,
  formatarProtocolo,
  formatarTelefone,
  ordemStatus,
  statusDenuncia,
  tiposDenuncia,
} from "../admin/src/lib/denuncias";

function denuncia(campos: Partial<DenunciaResponse> = {}): DenunciaResponse {
  return {
    idDenuncia: 1,
    tipoDeDenuncia: "MAUS_TRATOS",
    statusDenuncia: "EM_ANALISE",
    numeroTelefone: null,
    nomeDenunciante: null,
    idEndereco: 1,
    logradouro: null,
    numero: null,
    complemento: null,
    bairro: null,
    cep: null,
    localidade: null,
    uf: null,
    imagem: null,
    ...campos,
  };
}

describe("endereco da denuncia", () => {
  it("monta o endereco na ordem que a equipe le em campo", () => {
    const texto = formatarEndereco(
      denuncia({
        logradouro: "Rua Doutor João Marcelino",
        numero: "120",
        complemento: "Fundos",
        bairro: "Centro",
        localidade: "Mossoró",
        uf: "RN",
        cep: "59600-000",
      }),
    );

    expect(texto).toBe(
      "Rua Doutor João Marcelino, 120 · Fundos · Centro · Mossoró/RN · 59600-000",
    );
  });

  it("omite os campos que o cidadao deixou em branco", () => {
    const texto = formatarEndereco(
      denuncia({ logradouro: "Rua Exemplo", localidade: "Mossoró", uf: "RN", complemento: "  " }),
    );

    expect(texto).toBe("Rua Exemplo · Mossoró/RN");
  });

  it("devolve vazio quando nao ha endereco nenhum", () => {
    expect(formatarEndereco(denuncia())).toBe("");
  });
});

describe("telefone e protocolo", () => {
  it("formata celular e fixo", () => {
    expect(formatarTelefone("84999998888")).toBe("(84) 99999-8888");
    expect(formatarTelefone("8433148000")).toBe("(84) 3314-8000");
  });

  it("devolve o valor original quando nao reconhece o formato", () => {
    expect(formatarTelefone("123")).toBe("123");
    expect(formatarTelefone(null)).toBe("");
  });

  it("mostra o protocolo com a mesma largura da consulta do site", () => {
    expect(formatarProtocolo(7)).toBe("0007");
    expect(formatarProtocolo(12345)).toBe("12345");
  });
});

describe("contagem por andamento", () => {
  it("conta cada status e mantem zero nos vazios", () => {
    const contagem = contarPorStatus([
      denuncia({ idDenuncia: 1, statusDenuncia: "EM_ANALISE" }),
      denuncia({ idDenuncia: 2, statusDenuncia: "EM_ANALISE" }),
      denuncia({ idDenuncia: 3, statusDenuncia: "CONCLUIDA" }),
    ]);

    expect(contagem).toEqual({
      EM_ANALISE: 2,
      VISITA_REALIZADA: 0,
      CONCLUIDA: 1,
      NAO_RESOLVIDA: 0,
    });
  });
});

describe("rotulos", () => {
  it("cobre todos os enums do backend", () => {
    expect(Object.keys(tiposDenuncia)).toHaveLength(5);
    expect(Object.keys(statusDenuncia)).toHaveLength(4);
    expect(ordemStatus).toHaveLength(4);
    expect(new Set(ordemStatus).size).toBe(4);
  });

  it("comeca a fila pelo que ainda espera a equipe", () => {
    expect(ordemStatus[0]).toBe("EM_ANALISE");
  });
});
