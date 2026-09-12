import type { StatusDenuncia, TipoDenuncia } from "@/lib/types/denuncia";

const STATUS_CONFIG: Record<StatusDenuncia, { label: string; className: string }> = {
  EM_ANALISE: {
    label: "Em Análise",
    className: "bg-amber-50 text-amber-700 ring-amber-600/20",
  },
  VISITA_REALIZADA: {
    label: "Visita Realizada",
    className: "bg-blue-50 text-blue-700 ring-blue-700/10",
  },
  CONCLUIDA: {
    label: "Concluída",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  },
  NAO_RESOLVIDA: {
    label: "Não Resolvida",
    className: "bg-rose-50 text-rose-700 ring-rose-600/10",
  },
};

const TIPO_LABELS: Record<TipoDenuncia, string> = {
  MAUS_TRATOS: "Maus-tratos a Animais",
  BARATAS: "Infestação de Baratas",
  RATOS: "Infestação de Ratos",
  MORCEGOS: "Foco de Morcegos",
  ANIMAIS_SINANTROPICOS: "Animais Sinantrópicos",
};

export function StatusBadge({ status }: { status: StatusDenuncia }) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    className: "bg-gray-50 text-gray-700 ring-gray-600/10",
  };

  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${config.className}`}
    >
      {config.label}
    </span>
  );
}

export function formatarTipo(tipo: TipoDenuncia): string {
  return TIPO_LABELS[tipo] || tipo;
}