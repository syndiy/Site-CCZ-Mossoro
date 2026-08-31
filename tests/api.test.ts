import { describe, expect, it } from "vitest";
import { toDenunciaFormData, type DenunciaPayload } from "@/lib/api";

const payload: DenunciaPayload = {
  tipoDeDenuncia: "MAUS_TRATOS",
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

describe("contrato da denuncia", () => {
  it("inclui coordenadas apenas quando o ponto foi marcado", () => {
    const form = toDenunciaFormData({ ...payload, latitude: -5.187, longitude: -37.344 });

    expect(form.get("latitude")).toBe("-5.187");
    expect(form.get("longitude")).toBe("-37.344");
  });

  it("mantem os campos existentes quando nao ha coordenadas", () => {
    const form = toDenunciaFormData(payload);

    expect(form.get("latitude")).toBeNull();
    expect(form.get("longitude")).toBeNull();
    expect(form.get("tipoDeDenuncia")).toBe("MAUS_TRATOS");
  });
});
