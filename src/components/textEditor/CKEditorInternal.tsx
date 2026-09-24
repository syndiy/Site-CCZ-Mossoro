'use client';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ComponentProps } from 'react';

interface CKEditorInternalProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CKEditorInternal({ value, onChange }: CKEditorInternalProps) {
  
  const EditorConfigurado = ClassicEditor as unknown as ComponentProps<typeof CKEditor>['editor'];

  return (
    <div className="bg-white text-black rounded-md overflow-hidden border">
      <CKEditor
        editor={EditorConfigurado}
        data={value}
        onChange={(event, editor) => {
          const editorInstance = editor as { getData: () => string };
          const data = editorInstance.getData();
          onChange(data);
        }}
        config={{
          toolbar: [
            'heading', '|',
            'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|',
            'insertTable', 'tableColumn', 'tableRow', 'mergeTableCells', '|',
            'undo', 'redo'
          ],
        }}
      />
      {/* Estilo embutido para garantir que o editor tenha uma altura razoável por padrão */}
      <style jsx global>{`
        .ck-editor__editable_inline {
          min-height: 300px;
        }
      `}</style>
    </div>
  );
}