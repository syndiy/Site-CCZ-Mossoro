"use client";

import { useSiteConfig } from "@/components/layout/site-config-provider";
import { Container } from "@/components/layout/container";
import { Icon } from "@/components/shared/icon";
import { Reveal } from "@/components/shared/reveal";

export function HomeContactInfo() {
  const site = useSiteConfig();
  return (
      <section className="py-12 lg:py-24">
        <Container className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
          <InfoCard icon="location" title="Onde estamos" delay={0}>
            {site.address.street}, {site.address.district}, {site.address.city}/
            {site.address.state}
          </InfoCard>
          <InfoCard icon="clock" title="Atendimento" delay={90}>
            {site.hours.label}
          </InfoCard>
          <InfoCard icon="phone" title="Contato" delay={180}>
            <a href={`tel:${site.contact.phoneRaw}`} className="hover:underline">
              {site.contact.phone}
            </a>
            <br />
            <a href={`mailto:${site.contact.email}`} className="hover:underline">
              {site.contact.email}
            </a>
          </InfoCard>
        </Container>
      </section>
  );
}

function InfoCard({
  icon,
  title,
  delay,
  children,
}: {
  icon: "location" | "clock" | "phone";
  title: string;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <Reveal delay={delay} className="h-full">
      <div className="h-full rounded-xl border border-border bg-surface p-5 transition-colors duration-300 hover:border-brand-400">
        <Icon name={icon} size={28} className="text-brand-600" />
        <h3 className="my-2 text-xl font-semibold">{title}</h3>
        <p className="text-ink-soft">{children}</p>
      </div>
    </Reveal>
  );
}
