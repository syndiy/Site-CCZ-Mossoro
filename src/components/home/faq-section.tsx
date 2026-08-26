import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/shared/reveal";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { faq } from "@/lib/faq";

export function FaqSection() {
  return (
    <section className="py-12 lg:py-24">
      <Container>
        <Reveal>
          <SectionHeading eyebrow="Tire suas dúvidas" title="Perguntas frequentes" />
        </Reveal>
        <Reveal delay={80} className="mx-auto max-w-3xl">
          <Accordion className="flex flex-col gap-3">
            {faq.map((item, i) => (
              <AccordionItem
                key={item.pergunta}
                value={`q${i}`}
                className="rounded-xl border border-line/70 bg-white px-5"
              >
                <AccordionTrigger className="text-left text-base font-semibold text-brand-900">
                  {item.pergunta}
                </AccordionTrigger>
                <AccordionContent className="text-ink-soft">{item.resposta}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </Container>
    </section>
  );
}
