"use client";

import { useRef, useState } from "react";
import { BubbleMenu } from "@tiptap/react/menus";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import { Markdown } from "tiptap-markdown";
import { uploadImage } from "@/lib/upload";

type Props = {
  value: string;
  onChange: (markdown: string) => void;
};

export function ContentEditor({ value, onChange }: Props) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [selectionVersion, setSelectionVersion] = useState(0);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TiptapImage,
      Markdown.configure({ html: false, transformCopiedText: true }),
    ],
    content: value,
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.storage.markdown.getMarkdown());
    },
    onSelectionUpdate: () => setSelectionVersion((version) => version + 1),
  });

  if (!editor) return null;
  void selectionVersion;

  async function insertImage(file: File) {
    try {
      const path = await uploadImage(file);
      editor!.chain().focus().setImage({ src: path, alt: "" }).run();
    } catch {
      window.alert("Nao foi possivel enviar a imagem.");
    }
  }

  return (
    <div className="editor-shell">
      <div className="editor-context">
        <span>Corpo do conteudo</span>
        <span>Markdown. Salvamento pelo formulario</span>
      </div>
      <Toolbar editor={editor} onPickImage={() => fileInput.current?.click()} />
      <BubbleMenu editor={editor} className="editor-bubble">
        <ActionButton label="Negrito" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>Negrito</ActionButton>
        <ActionButton label="Itálico" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>Itálico</ActionButton>
        <ActionButton label="Link" active={editor.isActive("link")} onClick={() => setLink(editor)}>Link</ActionButton>
        <ActionButton label="Citação" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>Citação</ActionButton>
      </BubbleMenu>
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) insertImage(file);
          event.target.value = "";
        }}
      />
      <div className="editor-body">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function Toolbar({ editor, onPickImage }: { editor: Editor; onPickImage: () => void }) {
  const chain = () => editor.chain().focus();
  return (
    <div className="editor-toolbar" aria-label="Ferramentas de formatação">
      <ActionButton label="Desfazer" onClick={() => chain().undo().run()} disabled={!editor.can().undo()}>Desfazer</ActionButton>
      <ActionButton label="Refazer" onClick={() => chain().redo().run()} disabled={!editor.can().redo()}>Refazer</ActionButton>
      <span className="toolbar-divider" />
      <ActionButton label="Negrito" active={editor.isActive("bold")} onClick={() => chain().toggleBold().run()}>Negrito</ActionButton>
      <ActionButton label="Itálico" active={editor.isActive("italic")} onClick={() => chain().toggleItalic().run()}>Itálico</ActionButton>
      <ActionButton label="Título de seção" active={editor.isActive("heading", { level: 2 })} onClick={() => chain().toggleHeading({ level: 2 }).run()}>Título</ActionButton>
      <span className="toolbar-divider" />
      <ActionButton label="Lista" active={editor.isActive("bulletList")} onClick={() => chain().toggleBulletList().run()}>Lista</ActionButton>
      <ActionButton label="Lista numerada" active={editor.isActive("orderedList")} onClick={() => chain().toggleOrderedList().run()}>Numerada</ActionButton>
      <ActionButton label="Citação" active={editor.isActive("blockquote")} onClick={() => chain().toggleBlockquote().run()}>Citação</ActionButton>
      <ActionButton label="Código" active={editor.isActive("code")} onClick={() => chain().toggleCode().run()}>Código</ActionButton>
      <ActionButton label="Link" active={editor.isActive("link")} onClick={() => setLink(editor)}>Link</ActionButton>
      <ActionButton label="Imagem" onClick={onPickImage}>Imagem</ActionButton>
    </div>
  );
}

function ActionButton({
  label,
  active = false,
  disabled = false,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return <button type="button" className={active ? "active" : ""} onClick={onClick} disabled={disabled} aria-label={label} aria-pressed={active}>{children}</button>;
}

function setLink(editor: Editor) {
  const current = editor.getAttributes("link").href ?? "";
  const url = window.prompt("Endereco do link", current);
  if (url === null) return;
  if (url.trim()) editor.chain().focus().setLink({ href: url.trim() }).run();
  else editor.chain().focus().unsetLink().run();
}
