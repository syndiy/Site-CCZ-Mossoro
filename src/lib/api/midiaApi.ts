import { API_BASE, getToken, getImageUrl, requisitar } from "./apiClient";
import { comprimirImagem } from "../image";

export async function uploadMidia(file: File): Promise<string> {
  const token = getToken();
  const formData = new FormData();
  // Fotos de celular chegam com vários MB; reduzidas, a página abre bem mais rápido.
  // Só JPEG: PNG e WebP podem ter transparência, que viraria fundo preto em JPEG.
  const reduzida = file.type === "image/jpeg" ? await comprimirImagem(file, 1600, 0.82) : file;
  formData.append("file", reduzida.size < file.size ? reduzida : file);

  const res = await requisitar(`${API_BASE}/midia`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) throw new Error("Falha no upload da imagem.");
  const data = await res.json();
  return getImageUrl(data.url);
}