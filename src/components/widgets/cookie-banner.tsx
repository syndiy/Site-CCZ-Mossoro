"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { subscribeToStorage, readStorage, writeStorage } from "@/lib/browser-store";

const CHAVE = "ccz-cookies";

export function CookieBanner() {
  const aceito = useSyncExternalStore(
    subscribeToStorage,
    () => readStorage(CHAVE) === "1",
    () => true,
  );

  if (aceito) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-brand-900 text-white shadow-pop">
      <Container className="flex flex-col items-start gap-3 py-4 sm:flex-row sm:items-center">
        <p className="text-sm text-white/90">
          Usamos cookies essenciais para o funcionamento do site e para melhorar a sua experiência.
          Ao continuar, você concorda com a nossa{" "}
          <Link href="/privacy/" className="font-medium underline hover:text-brand-300">
            Política de Privacidade
          </Link>
          .
        </p>
        <Button
          onClick={() => writeStorage(CHAVE, "1")}
          className="shrink-0 whitespace-nowrap sm:ml-auto"
        >
          Aceitar
        </Button>
      </Container>
    </div>
  );
}
