import { listEntries, type Collection } from "@/lib/content";
import { collections } from "@/lib/collections";
import { ContentWorkspace, type WorkspaceEntry } from "@/components/content-workspace";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const entries: WorkspaceEntry[] = (Object.keys(collections) as Collection[]).flatMap(
    (collection) =>
      listEntries(collection).map((entry) => ({
        collection,
        slug: entry.slug,
        title: String(entry.data.title ?? entry.slug),
        publishedAt: String(entry.data.publishedAt ?? ""),
        draft: Boolean(entry.data.draft),
        cover: entry.data.cover ? String(entry.data.cover) : null,
        home:
          entry.data.home === undefined
            ? collection === "news" || Boolean(entry.data.featured)
            : Boolean(entry.data.home),
        homeOrder: Number.isFinite(Number(entry.data.homeOrder))
          ? Number(entry.data.homeOrder)
          : null,
      })),
  );

  return (
    <main className="page">
      <header className="page-header">
        <p className="kicker">Editor de conteúdo</p>
        <h1>Organização da página inicial</h1>
        <p className="muted">
          Escolha o que aparece na página inicial e defina a ordem dos conteúdos publicados.
        </p>
      </header>
      <ContentWorkspace initialEntries={entries} />
    </main>
  );
}
