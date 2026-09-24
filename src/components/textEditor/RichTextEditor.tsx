'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
// 1. Atualizado para o novo pacote
import 'react-quill-new/dist/quill.snow.css'; 

// 2. Importando do novo pacote
const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] bg-gray-50 border rounded-md animate-pulse flex items-center justify-center text-gray-400">
      Carregando editor...
    </div>
  ),
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, 4, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ align: [] }], // Aqui estão os botões de centralizar!
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  }), []);

  return (
    <div className="bg-white text-black rounded-md border">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
      />
      <style jsx global>{`
        .ql-toolbar.ql-snow {
          border: none !important;
          border-bottom: 1px solid #e5e7eb !important;
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
          background-color: #f9fafb;
        }
        .ql-container.ql-snow {
          border: none !important;
          min-height: 300px;
          border-bottom-left-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
        }
        .ql-editor {
          min-height: 300px;
          font-size: 1rem;
        }
      `}</style>
    </div>
  );
}