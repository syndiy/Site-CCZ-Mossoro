import type { Metadata } from "next";
import { PublicacaoAoVivo } from "@/components/content/publicacao-ao-vivo";

// Sem indexacao: o endereco definitivo do artigo e /articles/<slug>/, gerado no
// proximo build. Esta rota so existe para ele poder ser lido antes disso.
export const metadata: Metadata = {
  title: "Artigo",
  robots: { index: false, follow: true },
};

export default function VerArtigoPage() {
  return <PublicacaoAoVivo colecao="artigos" rotulo="Artigos" rota="articles" />;
}
