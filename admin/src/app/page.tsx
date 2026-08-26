import Link from "next/link";
import { listEntries, type Collection } from "@/lib/content";
import { collections, type CollectionConfig } from "@/lib/collections";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Conteúdo do site</h1>
        <p className="muted">
          Publique artigos e notícias. Nada aparece no site enquanto estiver como rascunho.
        </p>
      </header>

      {(Object.keys(collections) as Collection[]).map((name) => (
        <CollectionSection key={name} config={collections[name]} />
      ))}
    </div>
  );
}

function CollectionSection({ config }: { config: CollectionConfig }) {
  const entries = listEntries(config.name);
  const published = entries.filter((entry) => !entry.data.draft).length;

  return (
    <section className="collection">
      <div className="collection-header">
        <div>
          <h2>{config.plural}</h2>
          <span className="muted">
            {entries.length} no total · {published} no site
          </span>
        </div>
        <Link href={`/${config.name}/new`} className="btn">
          {config.createLabel}
        </Link>
      </div>

      <div className="card">
        {entries.length === 0 ? (
          <p className="muted">Nada por aqui ainda. Comece criando o primeiro.</p>
        ) : (
          entries.map((entry) => {
            const draft = Boolean(entry.data.draft);
            return (
              <div className="list-item" key={entry.slug}>
                <div>
                  <h3>{String(entry.data.title ?? entry.slug)}</h3>
                  <div className="list-meta">
                    <span className={draft ? "badge draft" : "badge live"}>
                      {draft ? "Rascunho" : "No site"}
                    </span>
                    {entry.data.publishedAt ? (
                      <span className="muted">{String(entry.data.publishedAt)}</span>
                    ) : null}
                    {entry.data.featured ? <span className="badge featured">Destaque</span> : null}
                  </div>
                </div>
                <Link href={`/${config.name}/${entry.slug}`} className="btn secondary">
                  Editar
                </Link>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
