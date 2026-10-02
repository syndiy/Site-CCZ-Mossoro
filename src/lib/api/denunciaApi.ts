import axios from "axios";

const localClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
});

export const denunciaApi = {
  async criar(formData: FormData) {
    const response = await localClient.post("/denuncia", formData);
    return response.data;
  },

  async buscarPorProtocolo(protocolo: string) {
    const response = await localClient.get(
      `/denuncia/protocolo/${encodeURIComponent(protocolo)}`
    );
    return response.data;
  },
};