import type { ReactNode } from "react";

/**
 * As telas do editor buscam os dados no navegador, entao o export estatico so
 * precisa gerar a casca de cada colecao. O layout fica no servidor porque
 * generateStaticParams nao pode conviver com "use client" na mesma pagina.
 */
export function generateStaticParams() {
  return [{ colecao: "noticias" }, { colecao: "artigos" }];
}

export default function ColecaoLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
