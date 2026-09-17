/**
 * Fica fora de lib/cms porque aquele módulo lê o disco com node:fs, e componentes
 * de navegador também precisam formatar datas.
 */
export function formatDate(iso: string): string {
  if (!iso) return "";
  // "2026-08-12" é lido como meia-noite UTC e voltaria um dia no fuso do Brasil.
  const parts = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  const date = parts
    ? new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]))
    : new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}
