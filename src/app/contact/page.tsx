import type { Metadata } from "next";
import { ContactContent } from "@/components/layout/contact-content";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Endereço, telefone e horário de atendimento do Centro de Controle de Zoonoses de Mossoró.",
  alternates: { canonical: "/contact/" },
};

export default function ContatoPage() { return <ContactContent />; }
