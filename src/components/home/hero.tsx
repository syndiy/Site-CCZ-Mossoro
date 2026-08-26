import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/container";

type HeroProps = {
  eyebrow?: string;
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  aside?: ReactNode;
  children?: ReactNode;
};

export function Hero({ eyebrow, title, subtitle, image, imageAlt, aside, children }: HeroProps) {
  return (
    <section className="relative flex min-h-[560px] items-center overflow-hidden bg-brand-900 md:min-h-[640px]">
      <Image src={image} alt={imageAlt} fill priority sizes="100vw" className="object-cover" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-brand-900 via-brand-900/80 to-brand-900/25"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white to-transparent"
      />
      <Container className="relative py-16">
        <div className={cn("flex flex-col gap-12 lg:flex-row lg:items-center", aside && "lg:gap-10")}>
          <div className="max-w-2xl">
            {eyebrow ? (
              <span className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-widest text-brand-300">
                <span className="h-px w-8 bg-brand-300" />
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
          {aside ? <aside className="w-full shrink-0 lg:w-[22rem]">{aside}</aside> : null}
        </div>
      </Container>
    </section>
  );
}
