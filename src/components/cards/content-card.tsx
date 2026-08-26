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
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line/70 bg-surface shadow-soft transition hover:border-brand-300 hover:shadow-md"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-info-50">
        {cover ? (
          <Image
            src={cover}
            alt={coverAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain p-6 transition group-hover:scale-105"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-6">
        {eyebrow ? (
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            {eyebrow}
          </span>
        ) : null}
        <h3 className="mt-2 text-xl font-bold text-ink group-hover:text-brand-700">{title}</h3>
        <p className="mt-3 line-clamp-3 text-sm text-ink-soft">{summary}</p>
        {publishedAt ? (
          <span className="mt-4 text-xs text-muted-foreground">{formatDate(publishedAt)}</span>
        ) : null}
      </div>
    </Link>
  );
}

export function ContentGrid({ children }: { children: ReactNode }) {
  return <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{children}</ul>;
}
