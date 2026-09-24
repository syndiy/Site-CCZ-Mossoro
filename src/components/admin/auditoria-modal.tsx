"use client";

import type { LogAtividade } from "@/lib/types/audit";
import { Button } from "@/components/ui/button";

interface AuditoriaModalProps {
  open: boolean;
  log: LogAtividade | null;
  onClose: () => void;
}

export function AuditoriaModal({ open, log, onClose }: AuditoriaModalProps) {
  if (!open || !log) return null;

  const formatarData = (dataString: string) => {
    return new Date(dataString).toLocaleString("pt-BR");
  };

  const formatarJson = (detalhes: string) => {
    try {
      return JSON.stringify(JSON.parse(detalhes), null, 2);
    } catch {
      return detalhes;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-background rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl border">
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h3 className="text-lg font-semibold text-foreground">Detalhes do Log</h3>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            ✕
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4 bg-muted/40 p-3 rounded-lg text-xs">
          <div>
            <span className="font-bold text-muted-foreground uppercase text-[10px]">Usuário</span>
            <p className="font-medium text-foreground">{log.usuario}</p>
          </div>
          <div>
            <span className="font-bold text-muted-foreground uppercase text-[10px]">IP de Origem</span>
            <p className="font-medium text-foreground">{log.ipOrigem}</p>
          </div>
          <div>
            <span className="font-bold text-muted-foreground uppercase text-[10px]">Ação / Recurso</span>
            <p className="font-medium text-foreground">{log.acao} - {log.recurso}</p>
          </div>
          <div>
            <span className="font-bold text-muted-foreground uppercase text-[10px]">Data e Hora</span>
            <p className="font-medium text-foreground">{formatarData(log.dataHora)}</p>
          </div>
        </div>

        <div className="mb-4">
          <span className="text-xs font-bold text-muted-foreground uppercase mb-2 block">
            Payload / Detalhes Trafegados
          </span>
          <pre className="bg-slate-950 text-emerald-400 p-3 rounded-md text-xs overflow-x-auto whitespace-pre-wrap font-mono max-h-60">
            {formatarJson(log.detalhes)}
          </pre>
        </div>

        {log.status.includes("ERRO") && (
          <div className="mt-3 text-xs bg-destructive/10 text-destructive p-3 rounded-md border border-destructive/20">
            <strong className="block font-semibold mb-0.5">Motivo da Falha:</strong>
            {log.status}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}