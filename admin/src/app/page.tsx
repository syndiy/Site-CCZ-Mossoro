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
    <div className="page">
      <header className="page-header">
        <p className="kicker">Painel editorial</p>
        <h1>Organizar conteudo</h1>
        <p className="muted">
          Escolha o que aparece na pagina inicial e defina a ordem arrastando os conteudos.
        </p>
      </header>
      <ContentWorkspace initialEntries={entries} />
    </div>
  );
}
