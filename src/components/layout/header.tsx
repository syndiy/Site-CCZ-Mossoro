"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { nav, site, whatsappUrl } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/shared/icon";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [rolou, setRolou] = useState(false);

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 8);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  useEffect(() => {
    if (!open) return;
    const fecharComEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", fecharComEscape);
    return () => {
      document.body.style.overflow = overflowAnterior;
      document.removeEventListener("keydown", fecharComEscape);
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-gradient-to-r from-brand-800 to-brand-600 transition-shadow duration-300",
        rolou ? "shadow-pop" : "shadow-none",
      )}
    >
      <div className="mx-auto flex min-h-[72px] w-full max-w-[1200px] items-center justify-between gap-4 px-6 lg:px-12">
        <Link
          href="/"
          aria-label={`${site.name}, ir para o início`}
          className="shrink-0 transition-transform duration-300 hover:scale-[1.03]"
        >
          <Image
            src="/logo.svg"
            alt={site.legalName}
            width={287}
            height={128}
            priority
            className="h-14 w-auto"
          />
        </Link>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/40 text-white lg:hidden"
          aria-expanded={open}
          aria-controls="main-menu"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? "close" : "menu"} title={open ? "Fechar menu" : "Abrir menu"} />
        </button>

        <nav
          id="main-menu"
          aria-label="Navegação principal"
          className={cn(
            "gap-8 lg:flex lg:items-center",
            "max-lg:absolute max-lg:inset-x-0 max-lg:top-[72px] max-lg:flex-col max-lg:items-stretch",
            "max-lg:gap-4 max-lg:bg-brand-800 max-lg:p-6 max-lg:shadow-card",
            open ? "max-lg:flex max-lg:animate-[menu-in_0.25s_ease-out]" : "max-lg:hidden",
          )}
        >
          <ul className="flex items-center gap-6 max-lg:flex-col max-lg:items-stretch max-lg:gap-0">
            {nav.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "relative inline-flex min-h-11 items-center text-lg font-semibold no-underline transition-colors duration-200",
                      "max-lg:border-l-4 max-lg:py-3 max-lg:pl-3",
                      "lg:after:pointer-events-none lg:after:absolute lg:after:bottom-1 lg:after:left-1/2 lg:after:h-[3px] lg:after:w-0 lg:after:-translate-x-1/2 lg:after:rounded-full lg:after:transition-[width] lg:after:duration-300",
                      active
                        ? "text-white max-lg:border-warm-500 lg:after:w-full lg:after:bg-warm-500"
                        : "text-white/90 hover:text-brand-300 max-lg:border-transparent lg:after:bg-brand-300 lg:hover:after:w-full",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2 max-lg:flex-col max-lg:items-stretch">
            <a
              href={`mailto:${site.contact.email}`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/60 px-4 text-sm font-semibold text-white no-underline transition-colors hover:bg-white/10"
            >
              <Icon name="mail" size={18} /> E-mail
            </a>
            <a
              href={whatsappUrl("Olá, gostaria de informações do CCZ Mossoró.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-success-600 px-4 text-sm font-semibold text-white no-underline transition-colors hover:brightness-110"
            >
              <Icon name="whatsapp" size={18} /> WhatsApp
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
