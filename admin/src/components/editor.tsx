"use client";

import { useRef } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Markdown } from "tiptap-markdown";
import { uploadImage } from "@/lib/upload";

type Props = {
  value: string;
  onChange: (markdown: string) => void;
};

export function ContentEditor({ value, onChange }: Props) {
  const fileInput = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TiptapImage,
      Link.configure({ openOnClick: false }),
      Markdown.configure({ html: false, transformCopiedText: true }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.storage.markdown.getMarkdown());
    },
  });

  if (!editor) return null;

  async function insertImage(file: File) {
    try {
      const path = await uploadImage(file);
      editor!.chain().focus().setImage({ src: path, alt: "" }).run();
    } catch {
      window.alert("Não foi possível enviar a imagem.");
    }
  }

  return (
    <div>
      <Toolbar editor={editor} onPickImage={() => fileInput.current?.click()} />
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

  const actions = [
    { label: "Negrito", active: editor.isActive("bold"), run: () => chain().toggleBold().run() },
    { label: "Itálico", active: editor.isActive("italic"), run: () => chain().toggleItalic().run() },
    {
      label: "Subtítulo",
      active: editor.isActive("heading", { level: 2 }),
      run: () => chain().toggleHeading({ level: 2 }).run(),
    },
    {
      label: "Lista",
      active: editor.isActive("bulletList"),
      run: () => chain().toggleBulletList().run(),
    },
    {
      label: "Lista numerada",
      active: editor.isActive("orderedList"),
      run: () => chain().toggleOrderedList().run(),
    },
    {
      label: "Citação",
      active: editor.isActive("blockquote"),
      run: () => chain().toggleBlockquote().run(),
    },
    {
      label: "Link",
      active: editor.isActive("link"),
      run: () => {
        const url = window.prompt("Endereço do link (https://...)");
        if (url) chain().setLink({ href: url }).run();
        else chain().unsetLink().run();
      },
    },
    { label: "Imagem", active: false, run: onPickImage },
  ];

  return (
    <div className="editor-toolbar">
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          className={action.active ? "active" : ""}
          onClick={action.run}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
