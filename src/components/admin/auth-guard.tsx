"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE, getToken, requisitar } from "@/lib/api/apiClient";
import { Button } from "@/components/ui/button";

type AdminSession = { id: number; name: string; roles: string[] };
const SessionContext = createContext<AdminSession | null>(null);
export const useAdminSession = () => useContext(SessionContext);

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<AdminSession | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    const expire = () => {
      localStorage.removeItem("token");
      setSession(null);
      router.replace("/login");
    };
    window.addEventListener("ccz-session-expired", expire);
    void (async () => {
      const token = getToken();
      if (!token) {
        router.replace("/login");
        return;
      }
      try {
        const response = await requisitar(`${API_BASE}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!active) return;
        if (response.status === 403) {
          expire();
          return;
        }
        if (!response.ok) throw new Error("Não foi possível verificar seu acesso.");
        const data = await response.json() as AdminSession;
        if (active) setSession(data);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Não foi possível verificar seu acesso.");
      }
    })();
    return () => {
      active = false;
      window.removeEventListener("ccz-session-expired", expire);
    };
  }, [router, attempt]);

  if (!session) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center text-sm text-muted-foreground" role="status">
        <p>{error || "Verificando seu acesso..."}</p>
        {error ? <Button variant="outline" onClick={() => { setError(""); setAttempt((value) => value + 1); }}>Tentar novamente</Button> : null}
      </div>
    );
  }
  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
}
