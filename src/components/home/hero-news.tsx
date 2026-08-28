"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Icon } from "@/components/shared/icon";
import { subscribeToMediaQuery, matchesMediaQuery } from "@/lib/browser-store";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const subscribeToReducedMotion = subscribeToMediaQuery(REDUCED_MOTION);
const INTERVALO = 6500;

export type HeroSlide = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  publishedLabel: string;
  cover: string | null;
  coverAlt: string;
};

type Props = {
  slides: HeroSlide[];
  fallback: string;
  fallbackAlt: string;
};

export function HeroNewsBackground({ slides, fallback, fallbackAlt }: Props) {
  const [atual, setAtual] = useState(0);
  const [pausado, setPausado] = useState(false);

  const semMovimento = useSyncExternalStore(
    subscribeToReducedMotion,
    () => matchesMediaQuery(REDUCED_MOTION),
    () => false,
  );

  const passando = slides.length > 1 && !pausado && !semMovimento;

  useEffect(() => {
    if (!passando) return;
    const timer = setInterval(() => setAtual((i) => (i + 1) % slides.length), INTERVALO);
    return () => clearInterval(timer);
  }, [passando, slides.length]);

  const noticia = slides[atual];
  const total = slides.length;

  return (
    <>
      {/* Trilho que desliza na horizontal: cada notícia ocupa uma tela. */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <div
          className={semMovimento ? "flex h-full" : "flex h-full transition-transform duration-[900ms] ease-[cubic-bezier(0.65,0,0.35,1)]"}
          style={{
            width: `${total * 100}%`,
            transform: `translate3d(-${(atual * 100) / total}%, 0, 0)`,
          }}
        >
          {slides.map((slide, i) => (
            <div key={slide.slug} className="relative h-full" style={{ width: `${100 / total}%` }}>
              <Image
                src={slide.cover ?? fallback}
                alt=""
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Véu lateral: mantém o título legível sobre qualquer foto. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-brand-900 via-brand-900/85 to-brand-900/40"
      />

      {/* Véu do rodapé, atrás da legenda. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-brand-900/95 via-brand-900/55 to-transparent"
      />

      {/* Emenda com a página branca logo abaixo: baixa e curta, para não lavar a legenda. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white via-white/45 to-transparent"
      />

      {noticia ? (
        <div className="absolute inset-x-0 bottom-0 z-10 pb-8 sm:pb-10 md:pb-14">
          <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
            <div className="grid min-w-0 gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              {/* aria-live avisa leitores de tela a cada troca. */}
              <div aria-live="polite" aria-atomic="true" className="min-w-0">
                <span className="text-xs font-semibold uppercase tracking-widest text-brand-300">
                  Últimas notícias
                </span>
                <Link
                  href={`/news/${noticia.slug}/`}
                  className="group mt-2 block max-w-3xl text-white underline-offset-4 hover:underline"
                >
                  <span className="block text-xs text-white/75">Publicado em {noticia.publishedLabel}</span>
                  <span className="mt-1 block line-clamp-3 text-lg font-bold leading-tight sm:line-clamp-2 sm:text-2xl">
                    {noticia.title}
                  </span>
                  {noticia.excerpt ? <span className="mt-2 block line-clamp-3 text-sm leading-relaxed text-white/80 sm:line-clamp-2">{noticia.excerpt}</span> : null}
                  <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-white">
                    Ler notícia
                    <Icon name="arrow" size={16} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </div>

              <div className="flex max-w-full flex-wrap items-center gap-1 lg:pb-1">
                {slides.map((slide, i) => (
                  <button
                    key={slide.slug}
                    type="button"
                    onClick={() => setAtual(i)}
                    aria-label={`Mostrar notícia ${i + 1} de ${total}: ${slide.title}`}
                    aria-current={i === atual}
                    className="group p-1.5"
                  >
                    <span
                      className={`block h-1.5 rounded-full transition-all ${
                        i === atual ? "w-6 bg-white" : "w-1.5 bg-white/45 group-hover:bg-white/80"
                      }`}
                    />
                  </button>
                ))}

                {/* WCAG 2.2.2: conteúdo que se move sozinho precisa poder ser parado. */}
                {total > 1 && !semMovimento ? (
                  <button
                    type="button"
                    onClick={() => setPausado((p) => !p)}
                    aria-pressed={pausado}
                    aria-label={
                      pausado ? "Retomar a passagem das notícias" : "Pausar a passagem das notícias"
                    }
                    className="ml-1 rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/15 hover:text-white"
                  >
                    <Icon name={pausado ? "play" : "pause"} size={14} />
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <span className="sr-only">{fallbackAlt}</span>
      )}
    </>
  );
}
