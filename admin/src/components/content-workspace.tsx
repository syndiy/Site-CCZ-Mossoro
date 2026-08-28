"use client";

import Link from "next/link";
import { Check, Plus, Save, Search, Upload } from "lucide-react";
import { useMemo, useState } from "react";
import type { Collection } from "@/lib/content";
import { ContentBoard } from "./content-board";
import { collectionInfo, entryId, sortEntries, type WorkspaceEntry } from "./content-workspace-data";

export type { WorkspaceEntry };

type Filter = "all" | Collection;

export function ContentWorkspace({ initialEntries }: { initialEntries: WorkspaceEntry[] }) {
  const [entries, setEntries] = useState(initialEntries);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const filteredEntries = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return entries.filter((entry) => {
      const matchesFilter = filter === "all" || entry.collection === filter;
      const matchesQuery =
        !normalizedQuery || entry.title.toLocaleLowerCase().includes(normalizedQuery);
      return matchesFilter && matchesQuery;
    });
  }, [entries, filter, query]);

  const publishedCount = entries.filter((entry) => !entry.draft).length;
  const homeCount = entries.filter((entry) => entry.home && !entry.draft).length;
  const boards = filter === "all" ? (["news", "articles"] as Collection[]) : [filter];

  function moveEntry(id: string, targetHome: boolean, beforeId?: string) {
    setEntries((current) => {
      const source = current.find((entry) => entryId(entry) === id);
      if (!source) return current;

      const sourceHome = source.home;
      const next = current.map((entry) =>
        entryId(entry) === id ? { ...entry, home: targetHome } : entry,
      );
      const targetLane = sortEntries(
        next.filter(
          (entry) =>
            entry.collection === source.collection &&
            entry.home === targetHome &&
            entryId(entry) !== id,
        ),
      );
      const targetIndex = beforeId
        ? Math.max(0, targetLane.findIndex((entry) => entryId(entry) === beforeId))
        : targetLane.length;
      targetLane.splice(targetIndex, 0, next.find((entry) => entryId(entry) === id)!);

      const orderedIds = new Map<string, number>();
      targetLane.forEach((entry, index) => orderedIds.set(entryId(entry), index + 1));
      if (sourceHome !== targetHome) {
        sortEntries(
          next.filter(
            (entry) =>
              entry.collection === source.collection &&
              entry.home === sourceHome &&
              entryId(entry) !== id,
          ),
        ).forEach((entry, index) => orderedIds.set(entryId(entry), index + 1));
      }

      setDirty(true);
      setMessage("");
      return next.map((entry) =>
        orderedIds.has(entryId(entry))
          ? { ...entry, homeOrder: orderedIds.get(entryId(entry))! }
          : entry,
      );
    });
  }

  function toggleHome(entry: WorkspaceEntry) {
    moveEntry(entryId(entry), !entry.home);
  }

  async function saveOrder() {
    setBusy(true);
    setError("");
    setMessage("");
    const items = (["news", "articles"] as Collection[]).flatMap((collection) =>
      [true, false].flatMap((home) =>
        sortEntries(entries.filter((entry) => entry.collection === collection && entry.home === home)).map(
          (entry, index) => ({
            collection: entry.collection,
            slug: entry.slug,
            home: entry.home,
            homeOrder: index + 1,
          }),
        ),
      ),
    );

    try {
      const response = await fetch("/api/content/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error ?? "Nao foi possivel salvar a organizacao.");
        return;
      }
      setDirty(false);
      setMessage("Organizacao salva no historico do projeto.");
    } catch {
      setError("Nao foi possivel conectar ao servidor.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="workspace">
      <section className="workspace-summary">
        <div className="summary-intro">
          <span className="summary-icon"><Upload size={20} /></span>
          <div>
            <strong>Distribuicao da pagina inicial</strong>
            <span>Conteudos publicados aparecem conforme a ordem abaixo.</span>
          </div>
        </div>
        <div className="summary-stats">
          <span><b>{entries.length}</b> conteudos</span>
          <span><b>{publishedCount}</b> publicados</span>
          <span><b>{homeCount}</b> na home</span>
        </div>
        <button className="btn save-btn" type="button" disabled={!dirty || busy} onClick={saveOrder}>
          {busy ? <span className="spinner" /> : <Save size={17} />}
          {busy ? "Salvando" : "Salvar organizacao"}
        </button>
      </section>

      <section className="workspace-library">
        <div className="library-toolbar">
          <div className="filter-tabs" role="tablist" aria-label="Filtrar conteudos">
            {(["all", "news", "articles"] as Filter[]).map((value) => (
              <button
                key={value}
                type="button"
                className={filter === value ? "filter-tab active" : "filter-tab"}
                onClick={() => setFilter(value)}
                role="tab"
                aria-selected={filter === value}
              >
                {value === "all" ? "Todos" : collectionInfo[value].label}
                <span>{value === "all" ? entries.length : entries.filter((entry) => entry.collection === value).length}</span>
              </button>
            ))}
          </div>
          <label className="search-field">
            <Search size={17} />
            <span className="sr-only">Buscar conteudo</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por titulo" />
          </label>
          <div className="new-links">
            <Link className="btn secondary compact-btn" href="/news/new"><Plus size={16} /> Noticia</Link>
            <Link className="btn secondary compact-btn" href="/articles/new"><Plus size={16} /> Artigo</Link>
          </div>
        </div>

        <div className="board-grid">
          {boards.map((collection) => (
            <ContentBoard
              key={collection}
              collection={collection}
              entries={filteredEntries.filter((entry) => entry.collection === collection)}
              draggedId={draggedId}
              onDragStart={setDraggedId}
              onDragEnd={() => setDraggedId(null)}
              onDrop={moveEntry}
              onToggle={toggleHome}
            />
          ))}
        </div>
      </section>

      {error ? <p className="error workspace-feedback">{error}</p> : null}
      {message ? <p className="success workspace-feedback"><Check size={16} /> {message}</p> : null}
    </div>
  );
}
