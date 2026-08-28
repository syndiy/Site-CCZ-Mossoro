"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/shared/icon";

export function BackToTop() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const aoRolar = () => setVisivel(window.scrollY > 600);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Voltar ao topo"
      className={cn(
        "fixed bottom-[var(--voltar-ao-topo-bottom,1.5rem)] right-6 z-40 inline-flex size-12 items-center justify-center rounded-full bg-brand-600 text-white shadow-pop transition-all duration-300 hover:-translate-y-1 hover:bg-brand-800",
        visivel ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <Icon name="arrow" size={22} className="-rotate-90" />
    </button>
  );
}
