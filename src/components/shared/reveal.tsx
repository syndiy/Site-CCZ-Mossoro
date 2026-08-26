"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { subscribeToMediaQuery, matchesMediaQuery } from "@/lib/browser-store";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const subscribeToReducedMotion = subscribeToMediaQuery(REDUCED_MOTION);

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

export function Reveal({ children, delay = 0, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visivel, setVisivel] = useState(false);

  const semMovimento = useSyncExternalStore(
    subscribeToReducedMotion,
    () => matchesMediaQuery(REDUCED_MOTION),
    () => false,
  );

  useEffect(() => {
    const elemento = ref.current;
    if (!elemento || semMovimento) return;

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisivel(true);
          observador.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -80px 0px" },
    );

    observador.observe(elemento);
    return () => observador.disconnect();
  }, [semMovimento]);

  const mostrar = visivel || semMovimento;

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-[opacity,transform] duration-[900ms] ease-out",
        mostrar ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
