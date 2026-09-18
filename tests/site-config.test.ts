import { describe, it, expect } from "vitest";
import { applySiteConfig } from "@/lib/site-config";
import { site } from "@/lib/site";

describe("configuração institucional publicada", () => {
  it("ignora placeholders do Java e preserva dados do portal", () => {
    const config = applySiteConfig({ nomeInstituicao: "[PREENCHER] Centro", logradouro: "[PREENCHER] Rua", cep: "00000-000", emailContato: "preencher@ccz.gov.br" });
    expect(config.legalName).toBe(site.legalName);
    expect(config.address.street).toBe(site.address.street);
    expect(config.contact.email).toBe(site.contact.email);
  });
  it("publica endereço, atendimento e contato válidos", () => {
    const config = applySiteConfig({ logradouro: "Rua de Teste", numero: "42", horarioFuncionamento: "8h às 17h", emailContato: "equipe@example.test", whatsapp: "(84) 99999-1234" });
    expect(config.address.street).toBe("Rua de Teste, 42");
    expect(config.hours.label).toBe("8h às 17h");
    expect(config.contact.email).toBe("equipe@example.test");
    expect(config.contact.whatsapp).toBe("5584999991234");
  });
});
