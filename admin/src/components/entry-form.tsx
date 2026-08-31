"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ContentEditor } from "./editor";
import { ContentPreview } from "./content-preview";
import { ImageField } from "./image-field";
import { toPayload, type CollectionConfig, type Field } from "@/lib/collections";

type Values = Record<string, string | boolean>;

type Props = {
  config: CollectionConfig;
  slug?: string;
  initialValues: Values;
  initialBody?: string;
  initialDraft?: boolean;
};

export function EntryForm({
  config,
  slug,
  initialValues,
  initialBody = "",
  initialDraft = true,
}: Props) {
  const router = useRouter();
  const [values, setValues] = useState<Values>(initialValues);
  const [body, setBody] = useState(initialBody);
  const [draft, setDraft] = useState(initialDraft);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  const isEditing = Boolean(slug);
  const initialSnapshot = useMemo(
    () => JSON.stringify({ values: initialValues, body: initialBody, draft: initialDraft }),
    [initialBody, initialDraft, initialValues],
  );
  const dirty = JSON.stringify({ values, body, draft }) !== initialSnapshot;
  const setField = (name: string, value: string | boolean) =>
    setValues((current) => ({ ...current, [name]: value }));

  useEffect(() => {
    if (!dirty) return;
    const warnBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warnBeforeUnload);
    return () => window.removeEventListener("beforeunload", warnBeforeUnload);
  }, [dirty]);

  async function save(nextDraft: boolean) {
    if (!String(values.title ?? "").trim()) {
      setError("O título é obrigatório.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      const res = await fetch(
        isEditing ? `/api/content/${config.name}/${slug}` : `/api/content/${config.name}`,
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...toPayload(config, values), draft: nextDraft, body }),
        },
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Não foi possível salvar.");
        return;
      }

      setDraft(nextDraft);
      router.push("/");
      router.refresh();
    } catch {
      setError("Não foi possível conectar ao editor. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    const confirmed = window.confirm(
      `Remover "${values.title}" definitivamente? Para apenas tirar do site, use "Despublicar".`,
    );
    if (!confirmed) return;

    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/content/${config.name}/${slug}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Não foi possível remover.");
      }
    } catch {
      setError("Não foi possível conectar ao editor. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="entry-form">
      <div className="editor-status">
        <div className="status-row">
          <span className={draft ? "badge draft" : "badge live"}>
            {draft ? "Rascunho" : "Publicado no site"}
          </span>
          {dirty ? <span className="unsaved-status" role="status">Alteracoes nao salvas</span> : null}
          <span className="muted">
            {draft
              ? "Só você vê. O conteúdo não aparece no site."
              : "Qualquer pessoa vê este conteúdo no site."}
          </span>
        </div>
      </div>

      <div className="card metadata-card">
        <div className="section-heading">
          <div>
            <h2>Informações principais</h2>
            <p className="muted">Esses dados aparecem na listagem e nos resultados de busca.</p>
          </div>
        </div>
        {config.fields.map((field) => (
          <FieldControl
            key={field.name}
            field={field}
            value={values[field.name]}
            onChange={(value) => setField(field.name, value)}
          />
        ))}
      </div>

      <div className="card body-card">
        <div className="section-heading">
          <div>
            <h2>Texto da publicação</h2>
            <p className="muted">Use títulos de seção, listas e links para organizar a leitura.</p>
          </div>
        </div>
        <div className="editor-view-switch" role="tablist" aria-label="Modo de visualizacao">
          <button
            type="button"
            role="tab"
            aria-selected={!previewOpen}
            className={!previewOpen ? "active" : ""}
            onClick={() => setPreviewOpen(false)}
          >
            Editar
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={previewOpen}
            className={previewOpen ? "active" : ""}
            onClick={() => setPreviewOpen(true)}
          >
            Previa
          </button>
        </div>
        {previewOpen ? (
          <ContentPreview
            title={String(values.title ?? "")}
            eyebrow={String(values.eyebrow ?? "")}
            summary={String(values.description ?? values.excerpt ?? "")}
            cover={String(values.cover ?? "")}
            coverAlt={String(values.coverAlt ?? "")}
            publishedAt={String(values.publishedAt ?? "")}
            body={body}
          />
        ) : (
          <ContentEditor value={body} onChange={setBody} />
        )}
      </div>

      {error ? <p className="error">{error}</p> : null}

      <div className="actions">
        {draft ? (
          <>
            <button className="btn" type="button" disabled={busy} onClick={() => save(false)}>
              Publicar no site
            </button>
            <button
              className="btn secondary"
              type="button"
              disabled={busy}
              onClick={() => save(true)}
            >
              Salvar rascunho
            </button>
          </>
        ) : (
          <>
            <button className="btn" type="button" disabled={busy} onClick={() => save(false)}>
              Salvar alterações
            </button>
            <button
              className="btn secondary"
              type="button"
              disabled={busy}
              onClick={() => save(true)}
            >
              Despublicar
            </button>
          </>
        )}
        {isEditing ? (
          <button className="btn danger" type="button" disabled={busy} onClick={remove}>
            Remover
          </button>
        ) : null}
      </div>
    </div>
  );
}

function FieldControl({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: string | boolean;
  onChange: (value: string | boolean) => void;
}) {
  const id = `field-${field.name}`;

  if (field.type === "toggle") {
    return (
      <div className="field checkbox-row">
        <input
          id={id}
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(event.target.checked)}
        />
        <div>
          <label htmlFor={id}>{field.label}</label>
          {field.hint ? <p className="hint">{field.hint}</p> : null}
        </div>
      </div>
    );
  }

  return (
    <div className="field">
      <label className="field-label" htmlFor={id}>
        {field.label}
        {field.required ? <span className="required"> *</span> : null}
      </label>
      {field.hint ? <p className="hint">{field.hint}</p> : null}
      {field.type === "image" ? (
        <ImageField value={String(value)} onChange={onChange} />
      ) : field.type === "textarea" ? (
        <textarea id={id} value={String(value)} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input
          id={id}
          type={field.type === "date" ? "date" : "text"}
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}
