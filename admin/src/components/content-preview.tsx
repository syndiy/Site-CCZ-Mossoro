"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import { Markdown } from "tiptap-markdown";
import { editorImageUrl } from "@/lib/image-url";

type Props = {
  title: string;
  eyebrow?: string;
  summary: string;
  cover: string;
  coverAlt: string;
  publishedAt: string;
  body: string;
};

function formatDate(value: string) {
  if (!value) return "Sem data de publicacao";
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

export function ContentPreview({
  title,
  eyebrow,
  summary,
  cover,
  coverAlt,
  publishedAt,
  body,
}: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    editable: false,
    extensions: [
      StarterKit,
      TiptapImage,
      Markdown.configure({ html: false }),
    ],
    content: body,
  });

  useEffect(() => {
    editor?.commands.setContent(body);
  }, [body, editor]);

  return (
    <article className="content-preview" aria-label="Previa da publicacao">
      {cover ? <img className="preview-cover" src={editorImageUrl(cover)} alt={coverAlt} /> : null}
      <header className="preview-header">
        {eyebrow ? <p className="preview-eyebrow">{eyebrow}</p> : null}
        <h2>{title || "Titulo da publicacao"}</h2>
        <p className="preview-date">Publicado em {formatDate(publishedAt)}</p>
        {summary ? <p className="preview-summary">{summary}</p> : null}
      </header>
      <div className="preview-markdown">
        {editor ? <EditorContent editor={editor} /> : null}
      </div>
    </article>
  );
}
