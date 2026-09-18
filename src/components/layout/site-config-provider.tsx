"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { API_BASE } from "@/lib/api/apiClient";
import { fetchWithTimeout } from "@/lib/fetch-with-timeout";
import { applySiteConfig, type SiteConfig } from "@/lib/site-config";

const fallback = applySiteConfig({});
const SiteConfigContext = createContext(fallback);
export const useSiteConfig = () => useContext(SiteConfigContext);

export function SiteConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState(fallback);
  useEffect(() => {
    if (!API_BASE) return;
    let active = true;
    const load = async () => {
      try {
        const response = await fetchWithTimeout(`${API_BASE}/configuracaoGlobal`);
        if (!response.ok) return;
        const data = await response.json() as SiteConfig;
        if (active) setConfig(applySiteConfig(data));
      } catch { /* Mantem o conteudo institucional do build quando a API falha. */ }
    };
    void load();
    window.addEventListener("ccz-site-config-updated", load);
    return () => { active = false; window.removeEventListener("ccz-site-config-updated", load); };
  }, []);
  return <SiteConfigContext.Provider value={config}>{children}</SiteConfigContext.Provider>;
}
