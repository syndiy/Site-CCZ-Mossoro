import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/shared/reveal";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/layout/button-link";
import { JsonLd } from "@/components/shared/json-ld";
import { Icon } from "@/components/shared/icon";
import { Paw } from "@/components/shared/illustrations";
import { Card, CardContent } from "@/components/ui/card";
import { breadcrumbJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { servicoPaginas, servicoPorSlug, type Bloco } from "@/lib/services-content";

export function generateStaticParams() {
  return servicoPaginas.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const servico = servicoPorSlug(slug);
  if (!servico) return {};

  return {
    title: servico.title,
    description: servico.metaDescription,
    alternates: { canonical: `/services/${servico.slug}/` },
  };
}

function Blocos({ blocos }: { blocos: Bloco[] }) {
  return (
    <>
      {blocos.map((bloco, i) => {
        if (bloco.tipo === "texto") {
          return (
            <p key={i} className="mt-3 text-ink-soft first:mt-0">
              {bloco.texto}
            </p>
          );
        }

        if (bloco.tipo === "lista") {
          return (
            <ul key={i} className="mt-4 flex flex-col gap-3 first:mt-0">
              {bloco.itens.map((item) => (
                <li key={item} className="flex items-start gap-3 text-ink-soft">
                  <Paw className="mt-1 size-4 shrink-0 fill-brand-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <ol key={i} className="mt-4 flex flex-col gap-4 first:mt-0">
            {bloco.itens.map((item, n) => (
              <li key={item} className="flex items-start gap-3 text-ink-soft">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {n + 1}
                </span>
                <span className="pt-0.5">{item}</span>
              </li>
            ))}
          </ol>
        );
      })}
    </>
  );
}

export default async function ServicoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const servico = servicoPorSlug(slug);
  if (!servico) notFound();

  return (
    <article className="py-12 lg:py-20">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Início", path: "/" },
          { name: "Serviços", path: "/services/" },
          { name: servico.title, path: `/services/${servico.slug}/` },
        ])}
      />

      <Container>
        <nav aria-label="Trilha de navegação" className="mb-8 text-sm text-muted-foreground">
          <Link href="/services/" className="hover:text-brand-600">
            Serviços
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{servico.title}</span>
        </nav>

        <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto]">
          <div className="blob -left-24 -top-24 size-80 bg-brand-400/25" aria-hidden="true" />
          <Reveal className="relative max-w-[60ch]">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-600">
              {servico.eyebrow}
            </span>
            <h1 className="mt-4 text-4xl font-bold md:text-5xl">{servico.title}</h1>
            <p className="mt-5 text-lg text-ink-soft">{servico.intro}</p>
          </Reveal>

          {servico.ilustracao ? (
            <Reveal delay={150} className="relative hidden justify-self-center md:block">
              <Image
                src={servico.ilustracao.src}
                alt={servico.ilustracao.alt}
                width={280}
                height={280}
                className={cn(
                  "animate-float h-auto w-56 drop-shadow-2xl lg:w-64",
                  servico.ilustracao.src.includes("/3d/") && "icon-tint-blue",
                )}
              />
            </Reveal>
          ) : null}
        </div>

        <div className="mt-14 grid max-w-4xl gap-6">
          {servico.secoes.map((secao, i) => (
            <Reveal key={secao.titulo} delay={i * 70}>
              <Card className="rounded-2xl shadow-soft transition-shadow duration-300 hover:shadow-card">
                <CardContent>
                  <h2 className="text-xl font-bold text-brand-900">{secao.titulo}</h2>
                  <Blocos blocos={secao.blocos} />
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 flex max-w-4xl flex-wrap gap-4 border-t border-border pt-8">
          <ButtonLink href={`tel:${site.contact.phoneRaw}`} size="lg">
            <Icon name="phone" size={18} /> Ligar {site.contact.phone}
          </ButtonLink>
          {servico.cta ? (
            <ButtonLink href={servico.cta.href} variant="outline" size="lg">
              {servico.cta.label}
            </ButtonLink>
          ) : null}
          {servico.secondaryCta ? (
            <ButtonLink href={servico.secondaryCta.href} variant="secondary" size="lg">
              {servico.secondaryCta.label}
            </ButtonLink>
          ) : null}
        </div>
      </Container>
    </article>
  );
}
