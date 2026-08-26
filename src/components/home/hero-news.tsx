import Link from "next/link";
import { formatDate, getLatestNews } from "@/lib/cms";

export function HeroNews() {
  const noticias = getLatestNews();
  if (noticias.length === 0) return null;

  return (
    <div className="rounded-2xl border border-white/15 bg-brand-800/70 p-5 shadow-pop backdrop-blur-md">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-300">
          <span className="size-1.5 rounded-full bg-brand-300" />
          Fique por dentro
        </span>
        <Link
          href="/news/"
          className="text-xs font-semibold text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline"
        >
          Ver todas
        </Link>
      </div>
      <ul className="mt-2 divide-y divide-white/10">
        {noticias.map((noticia) => (
          <li key={noticia.slug}>
            <Link href={`/news/${noticia.slug}/`} className="group flex flex-col gap-1 py-3">
              {noticia.publishedAt ? (
                <span className="text-xs text-white/60">{formatDate(noticia.publishedAt)}</span>
              ) : null}
              <span className="text-sm font-semibold leading-snug text-white transition-colors group-hover:text-brand-300">
                {noticia.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
