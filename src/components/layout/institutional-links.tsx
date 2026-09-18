"use client";

import { useSiteConfig } from "./site-config-provider";
import { whatsappUrl } from "@/lib/site";
import { ButtonLink } from "./button-link";
import type { ComponentProps } from "react";

export function WhatsappButton({ message, ...props }: Omit<ComponentProps<typeof ButtonLink>, "href"> & { message: string }) {
  const site = useSiteConfig();
  return <ButtonLink {...props} href={whatsappUrl(message, site.contact.whatsapp)} />;
}

export function InstitutionalEmailLink({ className }: { className?: string }) {
  const site = useSiteConfig();
  return <a href={`mailto:${site.contact.email}`} className={className}>{site.contact.email}</a>;
}

export function InstitutionalText({ field }: { field: "name" | "address" | "hours" }) {
  const site = useSiteConfig();
  const text = field === "name" ? site.legalName : field === "hours" ? site.hours.label : `${site.address.street}, ${site.address.district}, ${site.address.city}/${site.address.state}`;
  return <>{text}</>;
}
