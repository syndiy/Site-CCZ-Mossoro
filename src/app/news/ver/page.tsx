import type { Metadata } from "next";
import { PublicacaoAoVivo } from "@/components/content/publicacao-ao-vivo";

// Sem indexacao: o endereco definitivo da noticia e /news/<slug>/, gerado no
// proximo build. Esta rota so existe para ela poder ser lida antes disso.
export const metadata: Metadata = {
  title: "Notícia",
  robots: { index: false, follow: true },
};

export default function VerNoticiaPage() {
  return <PublicacaoAoVivo colecao="noticias" rotulo="Notícias" rota="news" />;
}
