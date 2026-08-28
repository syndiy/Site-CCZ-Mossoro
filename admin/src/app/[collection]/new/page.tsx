import { notFound } from "next/navigation";
import { isCollection } from "@/lib/content";
import { collections, defaultValues } from "@/lib/collections";
import { EntryForm } from "@/components/entry-form";
import { BackLink } from "@/components/back-link";

export default async function NewEntryPage({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection } = await params;
  if (!isCollection(collection)) notFound();

  const config = collections[collection];

  return (
    <main className="page page-editor">
      <BackLink />
      <header className="page-header">
        <p className="kicker">Novo conteúdo</p>
        <h1>{config.createLabel}</h1>
        <p className="muted">Preencha os dados abaixo e salve como rascunho antes de publicar.</p>
      </header>
      <EntryForm config={config} initialValues={defaultValues(config)} />
    </main>
  );
}
