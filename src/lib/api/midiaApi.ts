import { API_BASE, getToken } from "./apiClient";

export async function uploadMidia(file: File): Promise<string> {
  const token = getToken();
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/midia`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) throw new Error("Falha no upload da imagem.");
  const data = await res.json();
  return data.url; 
}