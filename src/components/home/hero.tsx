import Image from "next/image";
import type { ReactNode } from "react";
import { Container } from "@/components/layout/container";
import { HeroNewsBackground, type HeroSlide } from "./hero-news";

type HeroProps = {
  eyebrow?: string;
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  /** Notícias que assumem o fundo e vão passando. Sem elas, fica a imagem fixa. */
  slides?: HeroSlide[];
  children?: ReactNode;
};

export function Hero({ eyebrow, title, subtitle, image, imageAlt, slides, children }: HeroProps) {
  const comSlides = Boolean(slides && slides.length > 0);

  return (
    <section
      className={
        comSlides
          ? "relative min-h-[920px] overflow-hidden bg-brand-900 sm:min-h-[840px] md:min-h-[640px]"
          : "relative flex min-h-[560px] items-center overflow-hidden bg-brand-900 md:min-h-[640px]"
      }
    >
      {comSlides ? (
        <HeroNewsBackground slides={slides!} fallback={image} fallbackAlt={imageAlt} />
      ) : (
        <>
          <Image src={image} alt={imageAlt} fill priority sizes="100vw" className="object-cover" />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-brand-900 via-brand-900/80 to-brand-900/25"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white to-transparent"
          />
        </>
      )}

      <Container
        className={
          comSlides
            ? "relative z-20 pb-[380px] pt-12 sm:pb-[320px] sm:pt-16 md:pb-32 md:pt-16"
            : "relative py-16"
        }
      >
        <div className="max-w-2xl">
          {eyebrow ? (
            <span className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-widest text-brand-300">
              {eyebrow}
            </span>
          ) : null}
          <h1 className="mt-5 text-4xl font-bold leading-[1.1] text-white md:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/85 md:text-xl">{subtitle}</p>
          {children ? (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4 [&>a]:w-full sm:[&>a]:w-auto">
              {children}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
