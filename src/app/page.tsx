import Image from "next/image";
import { Hero } from "@/components/home/hero";
import { ServiceGrid } from "@/components/cards/service-card";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/layout/button-link";
import { SectionHeading } from "@/components/layout/section-heading";
import { Icon } from "@/components/shared/icon";
import { Reveal } from "@/components/shared/reveal";
import { FaqSection } from "@/components/home/faq-section";
import { DengueSection } from "@/components/home/dengue-section";
import { FeaturedArticles } from "@/components/home/featured-articles";
import { PawPattern, Paw } from "@/components/shared/illustrations";
import { quickAccess } from "@/lib/content";
import { getLatestNews, formatDate } from "@/lib/cms";
import { HomeContactInfo } from "@/components/home/contact-info";
import { WhatsappButton } from "@/components/layout/institutional-links";

export default function HomePage() {
  const heroSlides = getLatestNews().map((noticia) => ({
    slug: noticia.slug,
    title: noticia.title,
    excerpt: noticia.excerpt,
    publishedAt: noticia.publishedAt,
    publishedLabel: formatDate(noticia.publishedAt),
    cover: noticia.cover,
    coverAlt: noticia.coverAlt,
  }));

  return (
    <>
      <Hero
        eyebrow="Vigilância em Saúde em Mossoró"
        title="Saúde pública e proteção animal para todos"
        subtitle="Vacinação, castração, controle de vetores e denúncias. Todos os serviços do Centro de Controle de Zoonoses em um só lugar."
        image="/img/home2.avif"
        imageAlt="Um cão e um gato juntos, representando o cuidado do CCZ com os animais de Mossoró"
        slides={heroSlides}
      >
        <ButtonLink href="/reports/" size="lg">
          Fazer uma denúncia
        </ButtonLink>
        <ButtonLink href="/services/" variant="secondary" size="lg">
          Ver serviços
        </ButtonLink>
      </Hero>

      <section className="relative overflow-hidden py-12 lg:py-24">
        <div className="blob -left-32 top-10 size-96 bg-brand-400/20" aria-hidden="true" />
        <div className="blob -right-32 bottom-0 size-96 bg-warm-500/10" aria-hidden="true" />
        <Container className="relative">
          <Reveal>
            <SectionHeading eyebrow="Acesso rápido" title="Como podemos ajudar você hoje?" />
          </Reveal>
          <ServiceGrid items={quickAccess} />
        </Container>
      </section>

      <FeatureRow
        image="/img/home.avif"
        imageAlt="Cão e gato atendidos nas campanhas do CCZ Mossoró"
        eyebrow="Campanhas gratuitas"
        title="Vacinação e castração ao alcance de todos"
        bullets={[
          "Vacinação antirrábica de cães e gatos nos postos e mutirões.",
          "Castração gratuita para controlar a população animal com responsabilidade.",
          "Orientação sobre a guarda responsável e o bem-estar dos animais.",
        ]}
      >
        <ButtonLink href="/services/" size="lg">
          Ver serviços
        </ButtonLink>
      </FeatureRow>

      <section className="relative overflow-hidden bg-gradient-to-r from-brand-800 to-brand-600">
        <PawPattern className="text-white/10" />
        <Container className="relative flex flex-wrap items-center justify-between gap-8 py-12">
          <Reveal className="max-w-xl">
            <h2 className="max-w-[22ch] text-2xl font-bold text-white md:text-3xl">
              Cuidar dos animais é cuidar das pessoas
            </h2>
            <p className="mt-3 max-w-[52ch] text-white/90">
              A castração e a vacinação gratuitas ajudam a controlar a população de animais e a
              prevenir doenças que afetam toda a comunidade. Participe das campanhas do CCZ.
            </p>
            <WhatsappButton
              message="Olá! Quero informações sobre castração e vacinação no CCZ Mossoró."
              variant="success"
              size="lg"
              className="mt-6"
            >
              <Icon name="whatsapp" size={20} /> Falar com o CCZ
            </WhatsappButton>
          </Reveal>
          <Reveal delay={120} className="hidden shrink-0 md:block">
            <Image
              src="/img/mascote-cao-gato.png"
              alt="Mascotes do CCZ: um cão e um gato"
              width={781}
              height={659}
              className="animate-float h-auto w-80 drop-shadow-2xl lg:w-[26rem]"
            />
          </Reveal>
        </Container>
      </section>

      <FeatureRow
        reverse
        image="/img/home3.avif"
        imageAlt="Ambiente urbano em Mossoró, contexto do controle de vetores"
        eyebrow="Controle de vetores"
        title="Juntos contra a dengue, a zika e a chikungunya"
        bullets={[
          "Elimine focos de água parada: o mosquito se reproduz em poucos dias.",
          "Denuncie terrenos baldios e focos que você não consegue resolver.",
          "Receba as equipes de vistoria e apoie os mutirões do seu bairro.",
        ]}
      >
        <ButtonLink href="/reports/" size="lg">
          Denunciar um foco
        </ButtonLink>
      </FeatureRow>

      <DengueSection />

      <FeaturedArticles />

      <FaqSection />

      <HomeContactInfo />
    </>
  );
}

function FeatureRow({
  image,
  imageAlt,
  eyebrow,
  title,
  bullets,
  reverse = false,
  children,
}: {
  image: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  bullets: string[];
  reverse?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <section className="py-12 lg:py-20">
      <Container className="grid items-center gap-10 lg:grid-cols-2">
        <Reveal className={reverse ? "lg:order-2" : ""}>
          <div className="relative overflow-hidden rounded-2xl shadow-card transition-shadow duration-500 hover:shadow-pop">
            <div className="relative aspect-4/3">
              <Image
                src={image}
                alt={imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-[1200ms] ease-out hover:scale-105"
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={120} className={reverse ? "lg:order-1" : ""}>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            {eyebrow}
          </span>
          <h2 className="mt-2 text-2xl font-bold md:text-3xl">{title}</h2>
          <ul className="mt-5 flex flex-col gap-3">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-ink-soft">
                <Paw className="mt-0.5 h-5 w-5 shrink-0 fill-brand-600" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          {children ? <div className="mt-7">{children}</div> : null}
        </Reveal>
      </Container>
    </section>
  );
}
