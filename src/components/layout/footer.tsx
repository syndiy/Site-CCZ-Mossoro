import Link from "next/link";
import { site } from "@/lib/site";
import { services } from "@/lib/content";
import { Container } from "./container";
import { Icon } from "@/components/shared/icon";

function Heading({ children }: { children: string }) {
  return (
    <h2 className="mb-4 inline-block border-b-2 border-brand-400 pb-2 text-xl text-white">
      {children}
    </h2>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 bg-brand-900 text-gray-300">
      <Container className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-12 py-16">
        <div>
          <Heading>Onde estamos</Heading>
          <p className="mb-3 flex items-start gap-2">
            <Icon name="location" size={20} className="mt-0.5 shrink-0 text-brand-300" />
            <span>
              {site.address.street}, {site.address.district}
              <br />
              {site.address.city}/{site.address.state}, {site.address.zip}
            </span>
          </p>
          <p className="mb-3 flex items-center gap-2">
            <Icon name="phone" size={20} className="shrink-0 text-brand-300" />
            <a href={`tel:${site.contact.phoneRaw}`} className="text-gray-300 hover:text-white">
              {site.contact.phone}
            </a>
          </p>
          <p className="flex items-center gap-2">
            <Icon name="mail" size={20} className="shrink-0 text-brand-300" />
            <a href={`mailto:${site.contact.email}`} className="text-gray-300 hover:text-white">
              {site.contact.email}
            </a>
          </p>
        </div>

        <div>
          <Heading>Atendimento</Heading>
          <p className="flex items-center gap-2">
            <Icon name="clock" size={20} className="shrink-0 text-brand-300" />
            <span>{site.hours.label}</span>
          </p>
        </div>

        <div>
          <Heading>Serviços</Heading>
          <ul className="flex flex-col gap-2">
            {services.map((servico) => (
              <li key={servico.href}>
                <Link href={servico.href} className="text-brand-300 hover:text-white">
                  {servico.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <Heading>Institucional</Heading>
          <p className="mb-1">{site.parentOrg}</p>
          <p className="mb-3">{site.department}</p>
          <ul className="flex flex-col gap-2">
            <li>
              <Link href="/about/" className="text-brand-300 hover:text-white">
                Sobre o CCZ
              </Link>
            </li>
            <li>
              <Link href="/contact/" className="text-brand-300 hover:text-white">
                Contato
              </Link>
            </li>
            <li>
              <Link href="/accessibility/" className="text-brand-300 hover:text-white">
                Acessibilidade
              </Link>
            </li>
            <li>
              <Link href="/privacy/" className="text-brand-300 hover:text-white">
                Privacidade e LGPD
              </Link>
            </li>
          </ul>
        </div>
      </Container>

    </footer>
  );
}
