import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ClipboardList, Newspaper, ShieldCheck } from "lucide-react";

const destaques = [
  { icon: ClipboardList, texto: "Acompanhe e atualize as ocorrências enviadas pela população." },
  { icon: Newspaper, texto: "Publique notícias e artigos que aparecem no portal na hora." },
  { icon: ShieldCheck, texto: "Acesso restrito a servidores autorizados pelo CCZ." },
];

// Moldura das telas de login e cadastro da equipe: marca à esquerda, formulário à direita.
export function AuthLayout({ titulo, descricao, children }: { titulo: string; descricao: string; children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-600 p-12 text-white lg:flex lg:flex-col">
        <div aria-hidden="true" className="absolute -right-24 -top-24 size-96 rounded-full bg-white/5" />
        <div aria-hidden="true" className="absolute -bottom-32 -left-20 size-[28rem] rounded-full bg-white/5" />
        <Link href="/" className="relative w-fit rounded-md focus-visible:outline-2 focus-visible:outline-white">
          <Image src="/logo.svg" alt="CCZ Mossoró — página inicial" width={180} height={80} className="h-16 w-auto" priority />
        </Link>
        <div className="relative mt-auto max-w-md">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-300">Painel de gestão</p>
          <h2 className="mt-3 text-3xl font-bold leading-tight text-white">
            Centro de Controle de Zoonoses de Mossoró
          </h2>
          <ul className="mt-8 space-y-4">
            {destaques.map(({ icon: Icon, texto }) => (
              <li key={texto} className="flex items-start gap-3 text-sm leading-relaxed text-white/85">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Icon className="size-4" />
                </span>
                <span className="pt-2">{texto}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative mt-12 text-xs text-white/60">Prefeitura Municipal de Mossoró · Secretaria de Saúde</p>
      </aside>

      <main id="content" className="flex flex-col bg-surface">
        <div className="flex items-center justify-between gap-4 bg-brand-900 px-5 py-4 lg:bg-transparent lg:px-10 lg:py-6">
          <Link href="/" className="rounded-md lg:hidden">
            <Image src="/logo.svg" alt="CCZ Mossoró — página inicial" width={120} height={54} className="h-10 w-auto" priority />
          </Link>
          <Link
            href="/"
            className="ml-auto inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-white/85 hover:text-white lg:text-muted-foreground lg:hover:text-brand-800"
          >
            <ArrowLeft className="size-4" /> Voltar ao portal
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center px-5 py-10 lg:px-10">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold tracking-tight">{titulo}</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{descricao}</p>
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
