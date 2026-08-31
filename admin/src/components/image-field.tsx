"use client";

import { useState } from "react";
import { uploadImage } from "@/lib/upload";
import { editorImageUrl } from "@/lib/image-url";

type Props = {
  value: string;
  onChange: (path: string) => void;
};

export function ImageField({ value, onChange }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    if (!new Set(["image/jpeg", "image/png", "image/webp"]).has(file.type)) {
      setError("Use uma imagem JPG, PNG ou WebP.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("A imagem deve ter no maximo 8 MB.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      onChange(await uploadImage(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível enviar a imagem.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="upload-row">
        <label className="btn secondary">
          {value ? "Trocar imagem" : "Escolher imagem"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hidden
            disabled={busy}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) handleFile(file);
              event.target.value = "";
            }}
          />
        </label>
        {value ? (
          <button type="button" className="btn ghost" onClick={() => onChange("")}>
            Remover
          </button>
        ) : null}
        {busy ? <span className="muted">Enviando...</span> : null}
      </div>
      {error ? <p className="error">{error}</p> : null}
      {value ? <img src={editorImageUrl(value)} alt="" className="image-preview" /> : null}
    </div>
  );
}
