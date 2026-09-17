"use client";

import { useEffect, useState } from "react";
import type { DenunciaResponse, StatusDenuncia } from "@/lib/types/denuncia";
import {
  atualizarDenunciaAdmin,
  responseToUpdateRequest,
} from "@/lib/api/denunciaApi";
import { getImageUrl } from "@/lib/api/apiClient";
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
  // Guarda a URL da imagem que falhou ao carregar
  const [imagemComErro, setImagemComErro] = useState<string | null>(null);

  // Fechar modal ao pressionar a tecla ESC
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

  const urlImagem = getImageUrl(denuncia.imagem);
  
  // Estado derivado: se a URL atual for diferente da URL que deu erro, considera sem erro automaticamente
  const erroImagem = imagemComErro === urlImagem;

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

        {/* Detalhes Gerais da Ocorrência */}
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
              {denuncia.rua}, Nº {denuncia.numero || "S/N"}
              {denuncia.complemento ? ` (${denuncia.complemento})` : ""}
              <br />
              {denuncia.bairro} — {denuncia.cidade}/{denuncia.estado}
            </p>
          </div>
        </div>

        {/* Bloco da Descrição dos Fatos */}
        <div>
          <span className="font-semibold text-muted-foreground block mb-1.5 text-sm">
            Descrição do Ocorrido:
          </span>
          <div className="bg-muted/20 border rounded-lg p-3.5 text-sm leading-relaxed text-foreground">
            {denuncia.descricao && denuncia.descricao.trim() ? (
              <p className="whitespace-pre-wrap break-words">{denuncia.descricao}</p>
            ) : (
              <p className="text-muted-foreground italic text-xs">
                Nenhuma descrição detalhada foi informada pelo denunciante.
              </p>
            )}
          </div>
        </div>

        {/* Evidência Fotográfica */}
        <div>
          <span className="font-semibold text-muted-foreground block mb-2 text-sm">Evidência Anexada:</span>
          {denuncia.imagem && !erroImagem ? (
            <div className="relative overflow-hidden rounded-lg border bg-black/5 flex flex-col items-center justify-center p-3">
              <img
                src={urlImagem}
                alt={`Evidência da denúncia ${denuncia.protocolo}`}
                className="object-contain max-h-72 w-full rounded-md"
                onError={() => setImagemComErro(urlImagem)}
              />
              <a
                href={urlImagem}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline mt-2.5 font-medium flex items-center gap-1"
              >
                Abrir imagem original em nova aba ↗
              </a>
            </div>
          ) : (
            <div className="border border-dashed rounded-lg p-5 text-center text-xs text-muted-foreground bg-muted/10">
              {denuncia.imagem && erroImagem ? (
                <div className="flex flex-col gap-1 text-destructive">
                  <p className="font-semibold">⚠️ Não foi possível carregar a imagem do servidor.</p>
                  <p className="text-[11px] text-muted-foreground">
                    Caminho: <code className="bg-muted px-1 py-0.5 rounded text-foreground">{urlImagem}</code>
                  </p>
                </div>
              ) : (
                <p className="italic">Nenhuma imagem foi anexada a esta denúncia.</p>
              )}
            </div>
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