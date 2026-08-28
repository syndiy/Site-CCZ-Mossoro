import Link from "next/link";
import { ExternalLink, FileText, Newspaper } from "lucide-react";
import type { Collection } from "@/lib/content";
import { collectionInfo, sortEntries, entryId, type WorkspaceEntry } from "./content-workspace-data";
import { ContentRow } from "./content-row";

export function ContentBoard({
  collection,
  entries,
  draggedId,
  onDragStart,
  onDragEnd,
  onDrop,
  onToggle,
}: {
  collection: Collection;
  entries: WorkspaceEntry[];
  draggedId: string | null;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onDrop: (id: string, home: boolean, beforeId?: string) => void;
  onToggle: (entry: WorkspaceEntry) => void;
}) {
  const homeEntries = sortEntries(entries.filter((entry) => entry.home));
  const libraryEntries = sortEntries(entries.filter((entry) => !entry.home));
  const Icon = collection === "news" ? Newspaper : FileText;

  return (
    <section className="content-board">
      <header className="board-header">
        <div className="board-title">
          <span className={`collection-mark ${collection}`}><Icon size={19} /></span>
          <div><h2>{collectionInfo[collection].label}</h2><span>{entries.length} arquivos</span></div>
        </div>
        <Link className="icon-link" href={`/${collection}`} aria-label={`Abrir todos os ${collectionInfo[collection].label.toLocaleLowerCase()}`} title="Abrir listagem"><ExternalLink size={17} /></Link>
      </header>

      <div className="board-lanes">
        <DropLane
          title="Na pagina inicial"
          caption="Aparecem em destaque"
          home
          entries={homeEntries}
          draggedId={draggedId}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDrop={onDrop}
          onToggle={onToggle}
        />
        <DropLane
          title="Fora da pagina inicial"
          caption="Continuam disponiveis na listagem"
          home={false}
          entries={libraryEntries}
          draggedId={draggedId}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDrop={onDrop}
          onToggle={onToggle}
        />
      </div>
    </section>
  );
}

function DropLane({
  title,
  caption,
  home,
  entries,
  draggedId,
  onDragStart,
  onDragEnd,
  onDrop,
  onToggle,
}: {
  title: string;
  caption: string;
  home: boolean;
  entries: WorkspaceEntry[];
  draggedId: string | null;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onDrop: (id: string, home: boolean, beforeId?: string) => void;
  onToggle: (entry: WorkspaceEntry) => void;
}) {
  return (
    <div
      className={`drop-lane ${home ? "home-lane" : "library-lane"} ${draggedId ? "drag-active" : ""}`}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        const id = event.dataTransfer.getData("text/plain");
        if (id) onDrop(id, home);
      }}
    >
      <div className="lane-heading"><div><h3>{title}</h3><span>{caption}</span></div><b>{entries.length}</b></div>
      <div className="lane-items">
        {entries.map((entry) => (
          <ContentRow
            key={entryId(entry)}
            entry={entry}
            position={entries.indexOf(entry) + 1}
            dragging={draggedId === entryId(entry)}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDrop={onDrop}
            onToggle={onToggle}
          />
        ))}
        {entries.length === 0 ? <div className="empty-lane">Solte um conteudo aqui</div> : null}
      </div>
    </div>
  );
}
