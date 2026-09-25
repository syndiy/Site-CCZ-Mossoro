// A auditoria do backend guarda o conteúdo das requisições, inclusive senhas e CPF.
// Nada disso pode aparecer na tela: mascara por nome de campo, em qualquer nível.
const SENSIVEL = /pass(word)?|senha|cpf|token|secret|authorization/i;

export function mascararDetalhes(detalhes: string | null | undefined): string {
  if (!detalhes) return "";
  const mascarar = (valor: unknown): unknown => {
    if (Array.isArray(valor)) return valor.map(mascarar);
    if (valor && typeof valor === "object") {
      return Object.fromEntries(Object.entries(valor).map(([chave, v]) => [chave, SENSIVEL.test(chave) ? "•••" : mascarar(v)]));
    }
    return valor;
  };
  try {
    return JSON.stringify(mascarar(JSON.parse(detalhes)), null, 2);
  } catch {
    return detalhes.replace(/("?(?:password|senha|cpf|token)"?\s*[:=]\s*)("[^"]*"|[^,}\s]*)/gi, '$1"•••"');
  }
}

const ACOES: Record<string, string> = {
  AUTHENTICATEUSER: "Entrou no painel", CRIAR: "Criou", EDITAR: "Editou", PUBLICAR: "Publicou",
  DESPUBLICAR: "Retirou do portal", EXCLUIR: "Excluiu", EXCLUSAOLOGICA: "Excluiu", ATUALIZARDESTAQUES: "Alterou os destaques",
  UPDATE: "Atualizou", DELETE: "Excluiu", CREATE: "Registrou", SAVE: "Registrou", UPLOAD: "Enviou imagem",
  CREATEUSER: "Criou usuário", UPDATEUSER: "Atualizou usuário", DELETEUSER: "Excluiu usuário",
};
const RECURSOS: Record<string, string> = {
  CONTEUDO: "Conteúdo", DENUNCIA: "Denúncia", USER: "Usuário", GLOBALCONFIG: "Informações do CCZ",
  MIDIA: "Imagem", ALLOWEDEMPLOYEE: "Servidor autorizado", AUDIT: "Auditoria",
};
const capitalizar = (t: string) => t.charAt(0) + t.slice(1).toLowerCase();

export const descreverAcao = (acao: string) => ACOES[acao] ?? capitalizar(acao);
export const descreverRecurso = (recurso: string) => RECURSOS[recurso] ?? capitalizar(recurso);
// Leituras (listar, buscar, ver) são a maior parte do registro e escondem as alterações.
export const ehConsulta = (acao: string) => /^(LISTAR|LIST|FIND|GET|BUSCAR|CARREGAR|CURRENTUSER)/.test(acao);
