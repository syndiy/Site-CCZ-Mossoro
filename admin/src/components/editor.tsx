"use client";

import { useRef, useState } from "react";
import { BubbleMenu } from "@tiptap/react/menus";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Markdown } from "tiptap-markdown";
import {
  Bold,
  Code,
  Heading2,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Undo2,
} from "lucide-react";
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
      Link.configure({ openOnClick: false }),
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
        <ActionButton label="Negrito" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={16} /></ActionButton>
        <ActionButton label="Italico" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={16} /></ActionButton>
        <ActionButton label="Link" active={editor.isActive("link")} onClick={() => setLink(editor)}><LinkIcon size={16} /></ActionButton>
        <ActionButton label="Citacao" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote size={16} /></ActionButton>
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
    <div className="editor-toolbar" aria-label="Ferramentas de formatacao">
      <ActionButton label="Desfazer" onClick={() => chain().undo().run()} disabled={!editor.can().undo()}><Undo2 size={17} /></ActionButton>
      <ActionButton label="Refazer" onClick={() => chain().redo().run()} disabled={!editor.can().redo()}><Redo2 size={17} /></ActionButton>
      <span className="toolbar-divider" />
      <ActionButton label="Negrito" active={editor.isActive("bold")} onClick={() => chain().toggleBold().run()}><Bold size={17} /></ActionButton>
      <ActionButton label="Italico" active={editor.isActive("italic")} onClick={() => chain().toggleItalic().run()}><Italic size={17} /></ActionButton>
      <ActionButton label="Titulo de secao" active={editor.isActive("heading", { level: 2 })} onClick={() => chain().toggleHeading({ level: 2 }).run()}><Heading2 size={17} /></ActionButton>
      <span className="toolbar-divider" />
      <ActionButton label="Lista" active={editor.isActive("bulletList")} onClick={() => chain().toggleBulletList().run()}><List size={17} /></ActionButton>
      <ActionButton label="Lista numerada" active={editor.isActive("orderedList")} onClick={() => chain().toggleOrderedList().run()}><ListOrdered size={17} /></ActionButton>
      <ActionButton label="Citacao" active={editor.isActive("blockquote")} onClick={() => chain().toggleBlockquote().run()}><Quote size={17} /></ActionButton>
      <ActionButton label="Codigo" active={editor.isActive("code")} onClick={() => chain().toggleCode().run()}><Code size={17} /></ActionButton>
      <ActionButton label="Link" active={editor.isActive("link")} onClick={() => setLink(editor)}><LinkIcon size={17} /></ActionButton>
      <ActionButton label="Imagem" onClick={onPickImage}><ImageIcon size={17} /></ActionButton>
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
  return <button type="button" className={active ? "active" : ""} onClick={onClick} disabled={disabled} aria-label={label} title={label}>{children}</button>;
}

function setLink(editor: Editor) {
  const current = editor.getAttributes("link").href ?? "";
  const url = window.prompt("Endereco do link", current);
  if (url === null) return;
  if (url.trim()) editor.chain().focus().setLink({ href: url.trim() }).run();
  else editor.chain().focus().unsetLink().run();
}
