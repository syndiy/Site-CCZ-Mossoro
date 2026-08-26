import { notFound } from "next/navigation";
import { isCollection, readEntry } from "@/lib/content";
import { collections, toFormValues } from "@/lib/collections";
import { EntryForm } from "@/components/entry-form";
import { BackLink } from "@/components/back-link";

export const dynamic = "force-dynamic";

export default async function EditEntryPage({
  params,
}: {
  params: Promise<{ collection: string; slug: string }>;
}) {
  const { collection, slug } = await params;
  if (!isCollection(collection)) notFound();

  const entry = readEntry(collection, slug);
  if (!entry) notFound();

  const config = collections[collection];

  return (
    <div className="page">
      <BackLink />
      <h1>Editar {config.singular.toLowerCase()}</h1>
      <EntryForm
        config={config}
        slug={slug}
        initialValues={toFormValues(config, entry.data)}
        initialBody={entry.body}
        initialDraft={Boolean(entry.data.draft)}
      />
    </div>
  );
}
