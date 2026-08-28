"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Container } from "@/components/layout/container";
import { subscribeToStorage, readStorage, writeStorage } from "@/lib/browser-store";

const TAMANHOS = [100, 112, 125];
const CHAVE_CONTRASTE = "ccz-contraste";
const CHAVE_FONTE = "ccz-fonte";

export function AccessibilityBar() {
  const contraste = useSyncExternalStore(
    subscribeToStorage,
    () => readStorage(CHAVE_CONTRASTE) === "1",
    () => false,
  );

  const tamanho = useSyncExternalStore(
    subscribeToStorage,
    () => Number(readStorage(CHAVE_FONTE) ?? "0"),
    () => 0,
  );

  useEffect(() => {
    document.documentElement.classList.toggle("contraste", contraste);
  }, [contraste]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${TAMANHOS[tamanho] ?? TAMANHOS[0]}%`;
  }, [tamanho]);

  const ajustarFonte = (delta: number) =>
    writeStorage(CHAVE_FONTE, String(Math.min(TAMANHOS.length - 1, Math.max(0, tamanho + delta))));

  const botao =
    "rounded px-2 py-1 font-medium transition-colors hover:bg-white/15 focus-visible:bg-white/15";

  return (
    <div className="bg-brand-900 text-xs text-white/90">
      <Container className="flex items-center gap-1 py-1.5">
        <a href="#content" className={`mr-auto ${botao}`}>
          Ir para o conteúdo
        </a>
        <span className="hidden text-white/50 sm:inline">Acessibilidade:</span>
        <button
          type="button"
          onClick={() => ajustarFonte(-1)}
          className={botao}
          aria-label="Diminuir tamanho da fonte"
          aria-controls="content"
        >
          A-
        </button>
        <button
          type="button"
          onClick={() => ajustarFonte(1)}
          className={`${botao} text-sm`}
          aria-label="Aumentar tamanho da fonte"
          aria-controls="content"
        >
          A+
        </button>
        <button
          type="button"
          onClick={() => writeStorage(CHAVE_CONTRASTE, contraste ? "0" : "1")}
          aria-pressed={contraste}
          className={botao}
        >
          Alto contraste
        </button>
      </Container>
    </div>
  );
}
