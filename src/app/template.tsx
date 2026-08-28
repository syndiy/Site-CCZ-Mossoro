"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";

// useLayoutEffect roda antes da pintura no cliente; no servidor não existe.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// template.tsx é remontado a cada navegação, então isto roda uma vez por página.
export default function Template({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const elemento = ref.current;
    if (!elemento) return;

    // eMAG e WCAG 2.3.3: quem pede menos movimento recebe a página sem animação.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const animacao = gsap.fromTo(
      elemento,
      { autoAlpha: 0, y: 12 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.45,
        ease: "power2.out",
        // Sem transform residual: ele criaria um containing block para os filhos.
        clearProps: "transform,visibility",
      },
    );

    return () => {
      animacao.kill();
      gsap.set(elemento, { clearProps: "all" });
    };
  }, []);

  // Sem opacidade inline: se o JS falhar, a página continua legível.
  return <div ref={ref}>{children}</div>;
}
