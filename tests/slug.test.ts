import { describe, expect, it } from "vitest";
import { slugify } from "../admin/src/lib/slug";

describe("slugify", () => {
  it("remove acentos e cria slug estavel", () => {
    expect(slugify("Vacinação gratuita: cães e gatos")).toBe("vacinacao-gratuita-caes-e-gatos");
  });

  it("nao deixa separadores nas pontas", () => {
    expect(slugify("  Dengue / prevenção  ")).toBe("dengue-prevencao");
  });
});
