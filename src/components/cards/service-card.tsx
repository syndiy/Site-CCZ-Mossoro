import Link from "next/link";
import type { ServiceItem } from "@/lib/content";
import { Reveal } from "@/components/shared/reveal";
import { Icon } from "@/components/shared/icon";

export function ServiceCard({ item }: { item: ServiceItem }) {
  return (
    <Link
      href={item.href}
      className="card-beam group relative flex h-full flex-col gap-4 rounded-2xl border border-line/70 bg-white p-6 no-underline transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
    >
      <Icon
        name={item.icon}
        size={30}
        className="text-brand-600 transition-transform duration-300 group-hover:scale-110"
      />
      <div>
        <h3 className="text-base font-semibold text-brand-900">{item.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{item.description}</p>
      </div>
      <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-brand-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        Saiba mais
        <Icon name="arrow" size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

export function ServiceGrid({ items }: { items: ServiceItem[] }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5">
      {items.map((item, i) => (
        <Reveal key={item.title} delay={i * 80} className="h-full">
          <ServiceCard item={item} />
        </Reveal>
      ))}
    </div>
  );
}
