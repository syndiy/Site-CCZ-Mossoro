import Image from "next/image";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/layout/button-link";
import { Reveal } from "@/components/shared/reveal";
import { Icon } from "@/components/shared/icon";

const dicas = [
  "Vire para baixo ou guarde baldes, garrafas, pneus e vasilhames.",
  "Tampe bem as caixas d'água, cisternas e tonéis.",
  "Troque a água dos vasos de plantas e dos bebedouros dos animais a cada dois ou três dias.",
  "Mantenha calhas, ralos e lajes sem água acumulada.",
];

export function DengueSection() {
  return (
    <section className="py-12 lg:py-24">
      <Container className="grid items-center gap-10 lg:grid-cols-2">
        <Reveal>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            Vigilância em saúde
          </span>
          <h2 className="mt-2 text-2xl font-bold md:text-3xl">
            10 minutos por semana contra a dengue
          </h2>
          <p className="mt-3 text-ink-soft">
            O mosquito da dengue se cria em água parada e limpa. Uma vistoria rápida no seu quintal,
            uma vez por semana, já ajuda a proteger toda a vizinhança.
          </p>
          <ul className="mt-5 flex flex-col gap-3">
            {dicas.map((d) => (
              <li key={d} className="flex items-start gap-3 text-ink-soft">
                <Icon name="check" size={20} className="mt-0.5 shrink-0 text-success-600" />
                <span>{d}</span>
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-wrap gap-3">
            <ButtonLink href="/articles/dengue/" size="lg">
              Ler artigo sobre dengue
            </ButtonLink>
            <ButtonLink href="/reports/" variant="outline" size="lg">
              Denunciar um foco
            </ButtonLink>
          </div>
        </Reveal>

        <Reveal delay={120} className="hidden justify-self-center lg:block">
          <Image
            src="/img/3d/mosquito.png"
            alt="Mosquito da dengue"
            width={320}
            height={320}
            className="icon-tint-blue h-auto w-64 animate-float drop-shadow-2xl"
          />
        </Reveal>
      </Container>
    </section>
  );
}
