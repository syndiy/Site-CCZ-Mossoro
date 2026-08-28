import { describe, expect, it } from "vitest";
import { validateReportImage } from "@/lib/report-validation";

describe("validacao da foto da denuncia", () => {
  it("aceita formatos suportados dentro do limite", () => {
    expect(validateReportImage({ type: "image/jpeg", size: 1024 })).toBeNull();
    expect(validateReportImage({ type: "image/png", size: 8 * 1024 * 1024 })).toBeNull();
  });

  it("rejeita tipo e tamanho invalidos", () => {
    expect(validateReportImage({ type: "application/pdf", size: 1024 })).toContain("JPG");
    expect(validateReportImage({ type: "image/webp", size: 8 * 1024 * 1024 + 1 })).toContain("8 MB");
  });
});
