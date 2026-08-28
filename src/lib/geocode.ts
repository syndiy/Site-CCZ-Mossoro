export type Endereco = {
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;
  localidade: string;
  uf: string;
};

export type Coords = { lat: number; lng: number };

export function apenasDigitos(valor: string) {
  return valor.replace(/\D/g, "");
}

export function formatarCep(valor: string) {
  const digitos = apenasDigitos(valor).slice(0, 8);
  return digitos.length > 5 ? `${digitos.slice(0, 5)}-${digitos.slice(5)}` : digitos;
}

export async function buscarPorCep(cep: string): Promise<Partial<Endereco> | null> {
  const digitos = apenasDigitos(cep);
  if (digitos.length !== 8) return null;

  try {
    const res = await fetchWithTimeout(`https://viacep.com.br/ws/${digitos}/json/`);
    if (!res.ok) return null;

    const data = await res.json();
    if (data.erro) return null;

    return {
      cep: formatarCep(digitos),
      logradouro: data.logradouro ?? "",
      bairro: data.bairro ?? "",
      localidade: data.localidade ?? "",
      uf: data.uf ?? "",
    };
  } catch {
    return null;
  }
}

export async function coordenadasDoEndereco(consulta: string): Promise<Coords | null> {
  if (!consulta.trim()) return null;
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(consulta)}`;
  try {
    const res = await fetchWithTimeout(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    return { lat: Number(data[0].lat), lng: Number(data[0].lon) };
  } catch {
    return null;
  }
}

export async function enderecoDasCoordenadas(coords: Coords): Promise<Partial<Endereco> | null> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.lat}&lon=${coords.lng}`;
  try {
    const res = await fetchWithTimeout(url);
    if (!res.ok) return null;

    const data = await res.json();
    const a = data?.address;
    if (!a) return null;

    return {
      cep: a.postcode ? formatarCep(a.postcode) : "",
      logradouro: a.road ?? "",
      numero: a.house_number ?? "",
      bairro: a.suburb ?? a.neighbourhood ?? a.city_district ?? "",
      localidade: a.city ?? a.town ?? a.municipality ?? "",
      uf: typeof a["ISO3166-2-lvl4"] === "string" ? a["ISO3166-2-lvl4"].split("-")[1] : "",
    };
  } catch {
    return null;
  }
}
import { fetchWithTimeout } from "./fetch-with-timeout";
