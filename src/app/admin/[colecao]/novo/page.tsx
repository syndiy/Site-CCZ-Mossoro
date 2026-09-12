"use client";

import { use } from "react";
import { ConteudoForm } from "@/components/forms/conteudo-form";
import type { ColecaoConteudo } from "@/lib/types/conteudo";

interface PageProps {
  params: Promise<{ colecao: string }>;
}

export default function NovoConteudoPage({ params }: PageProps) {
  const { colecao } = use(params) as { colecao: ColecaoConteudo };

  return <ConteudoForm colecao={colecao} />;
}