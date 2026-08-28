import Link from "next/link";
import type { WorkspaceEntry } from "./content-workspace-data";
import { entryId } from "./content-workspace-data";

export function ContentRow({
  entry,
  position,
  dragging,
  onDragStart,
  onDragEnd,
  onDrop,
  onToggle,
}: {
  entry: WorkspaceEntry;
  position: number;
  dragging: boolean;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onDrop: (id: string, home: boolean, beforeId?: string) => void;
  onToggle: (entry: WorkspaceEntry) => void;
}) {
  const id = entryId(entry);
  return (
    <article
      className={`content-row ${dragging ? "is-dragging" : ""}`}
      draggable
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", id);
        onDragStart(id);
      }}
      onDragEnd={onDragEnd}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        event.stopPropagation();
        const dragged = event.dataTransfer.getData("text/plain");
        if (dragged && dragged !== id) onDrop(dragged, entry.home, id);
      }}
    >
      <span className="drag-handle" title="Arrastar para ordenar">::</span>
      <span className="order-number">{position}</span>
      <div className="row-cover">{entry.cover ? <img src={entry.cover} alt="" /> : null}</div>
      <div className="row-content">
        <div className="row-title"><strong>{entry.title}</strong>{entry.draft ? <span className="badge draft">Rascunho</span> : <span className="badge live">Publicado</span>}</div>
        <span className="row-meta">{entry.publishedAt || "Sem data"} | /{entry.slug}</span>
      </div>
      <button className={`home-toggle ${entry.home ? "selected" : ""}`} type="button" onClick={() => onToggle(entry)} aria-label={entry.home ? "Retirar da página inicial" : "Colocar na página inicial"}>
        {entry.home ? "Na home" : "Adicionar"}
      </button>
      <Link className="edit-link" href={`/${entry.collection}/${entry.slug}`} onClick={(event) => event.stopPropagation()}>Editar</Link>
    </article>
  );
}
