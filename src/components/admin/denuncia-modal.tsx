"use client";

import { useEffect, useState } from "react";
import {
  DenunciaResponse,
  StatusDenuncia,
  atualizarDenunciaAdmin,
  responseToUpdateRequest,
  getImageUrl,
} from "@/lib/api";
import { StatusBadge, formatarTipo } from "./status-badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  denuncia: DenunciaResponse;
  open: boolean;
  onClose: () => void;
  onUpdateSuccess: (atualizada: DenunciaResponse) => void;
}

export function DenunciaModal({ denuncia, open, onClose, onUpdateSuccess }: Props) {
  const [salvando, setSalvando] = useState(false);
  const [erroLocal, setErroLocal] = useState("");

  // Fechar modal ao pressionar ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  async function handleMudarStatus(novoStatus: StatusDenuncia) {
    setSalvando(true);
    setErroLocal("");
    try {
      const payload = responseToUpdateRequest(denuncia, novoStatus);
      const atualizada = await atualizarDenunciaAdmin(denuncia.idDenuncia, payload);
      onUpdateSuccess(atualizada);
    } catch (err) {
      setErroLocal(err instanceof Error ? err.message : "Erro ao atualizar o status.");
    } finally {
      setSalvando(false);
    }
  }

  const dataFormatada = denuncia.dataCriacao
    ? new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(new Date(denuncia.dataCriacao))
    : "Data indisponível";

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-background rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="flex justify-between items-start border-b pb-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              Protocolo: <span className="text-primary">{denuncia.protocolo}</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-1">Registrado em: {dataFormatada}</p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors"
            aria-label="Fechar modal"
          >
            ✕
          </button>
        </div>

        {erroLocal && (
          <Alert variant="destructive">
            <AlertDescription>{erroLocal}</AlertDescription>
          </Alert>
        )}

        {/* Gerenciamento do Status */}
        <div className="flex flex-col gap-2 bg-muted/40 p-4 rounded-lg border">
          <label className="text-sm font-semibold flex items-center justify-between">
            <span>Status Atual da Ocorrência:</span>
            <StatusBadge status={denuncia.statusDenuncia} />
          </label>
          <Select
            disabled={salvando}
            value={denuncia.statusDenuncia}
            onValueChange={(val) => handleMudarStatus(val as StatusDenuncia)}
          >
            <SelectTrigger className="w-full bg-background mt-1">
              <SelectValue placeholder="Alterar Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EM_ANALISE">EM ANÁLISE</SelectItem>
              <SelectItem value="VISITA_REALIZADA">VISITA REALIZADA</SelectItem>
              <SelectItem value="CONCLUIDA">CONCLUÍDA</SelectItem>
              <SelectItem value="NAO_RESOLVIDA">NÃO RESOLVIDA</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Detalhes da Denúncia */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold text-muted-foreground block">Tipo de Ocorrência:</span>
            <p className="font-medium text-foreground">{formatarTipo(denuncia.tipoDeDenuncia)}</p>
          </div>
          <div>
            <span className="font-semibold text-muted-foreground block">Denunciante:</span>
            <p className="font-medium text-foreground">{denuncia.nomeDenunciante || "Anônimo"}</p>
          </div>
          <div>
            <span className="font-semibold text-muted-foreground block">Telefone de Contato:</span>
            <p className="font-medium text-foreground">{denuncia.numeroTelefone || "Não informado"}</p>
          </div>
          <div>
            <span className="font-semibold text-muted-foreground block">CEP:</span>
            <p className="font-medium text-foreground">{denuncia.cep || "-"}</p>
          </div>
          <div className="sm:col-span-2 bg-muted/20 p-3 rounded-md border">
            <span className="font-semibold text-muted-foreground block mb-1">Endereço da Ocorrência:</span>
            <p className="font-medium leading-relaxed">
              {denuncia.rua}, Nº {denuncia.numero}
              {denuncia.complemento ? ` (${denuncia.complemento})` : ""}
              <br />
              {denuncia.bairro} — {denuncia.cidade}/{denuncia.estado}
            </p>
          </div>
        </div>

        {/* Evidência Fotográfica */}
        <div>
          <span className="font-semibold text-muted-foreground block mb-2">Evidência Anexada:</span>
          {denuncia.imagem ? (
            <div className="relative overflow-hidden rounded-lg border bg-black/5 flex items-center justify-center max-h-72">
              <img
                src={getImageUrl(denuncia.imagem)}
                alt={`Evidência da denúncia ${denuncia.protocolo}`}
                className="object-contain max-h-72 w-full"
              />
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic border border-dashed rounded-lg p-4 text-center">
              Nenhuma imagem foi anexada a esta denúncia.
            </p>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose} variant="outline">
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}