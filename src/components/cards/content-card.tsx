import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { formatDate } from "@/lib/cms";

type ContentCardProps = {
  href: string;
  title: string;
  summary: string;
  cover: string | null;
  coverAlt: string;
  eyebrow?: string;
  publishedAt?: string;
};

export function ContentCard({
  href,
  title,
  summary,
  cover,
  coverAlt,
  eyebrow,
  publishedAt,
}: ContentCardProps) {
  return (
    <Link
      href={href}
      className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-line/70 bg-surface shadow-soft transition-all duration-300 hover:border-brand-300 hover:shadow-md"
    >
      {/* 
        aspect-video: Força proporção 16:9 (widescreen)
        bg-info-50: Mantém a sua cor de fundo para o fallback 
      */}
      <div className="relative aspect-video w-full overflow-hidden bg-info-50">
        {cover ? (
          <Image
            src={cover}
            alt={coverAlt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            // object-cover garante que a imagem preencha o card sem distorcer
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-sm font-medium text-ink-soft/60">Sem imagem de capa</span>
          </div>
        )}
      </div>
      
      <div className="flex flex-1 flex-col p-6 md:p-8">
        {eyebrow ? (
          <span className="mb-3 text-xs font-bold uppercase tracking-widest text-brand-600">
            {eyebrow}
          </span>
        ) : null}
        
        {/* Títulos grandes e responsivos (text-2xl celular, text-3xl monitor) */}
        <h3 className="mb-4 line-clamp-3 text-2xl font-bold leading-snug text-ink group-hover:text-brand-700 md:text-3xl">
          {title}
        </h3>
        
        {/* Resumo com texto base/lg para leitura confortável */}
        <p className="mb-6 flex-1 line-clamp-3 text-base text-ink-soft md:text-lg">
          {summary}
        </p>
        
        {publishedAt ? (
          <span className="mt-auto text-sm font-medium text-muted-foreground">
            {formatDate(publishedAt)}
          </span>
        ) : null}
      </div>
    </Link>
  );
}

export function ContentGrid({ children }: { children: ReactNode }) {
  return (
    <ul className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:gap-14">
      {children}
    </ul>
  );
}