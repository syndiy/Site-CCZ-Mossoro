import { describe, expect, it } from "vitest";
import { descreverAcao, ehConsulta, mascararDetalhes } from "@/lib/auditoria";

describe("trilha de auditoria", () => {
  it("nunca mostra senha, CPF ou token, em qualquer nível", () => {
    const saida = mascararDetalhes(JSON.stringify([{ email: "a@b.c", password: "segredo", dados: { cpf: "52998224725", token: "x" } }]));
    expect(saida).not.toContain("segredo");
    expect(saida).not.toContain("52998224725");
    expect(saida).toContain("a@b.c");
  });

  it("mascara mesmo quando o detalhe não é JSON", () => {
    expect(mascararDetalhes('LoginUserDto[email=a@b.c, password=segredo]')).not.toContain("segredo");
    expect(mascararDetalhes('{"password":"segredo"')).not.toContain("segredo");
  });

  it("traduz ações e separa consultas de alterações", () => {
    expect(descreverAcao("AUTHENTICATEUSER")).toBe("Entrou no painel");
    expect(ehConsulta("FINDALL")).toBe(true);
    expect(ehConsulta("PUBLICAR")).toBe(false);
  });
});
