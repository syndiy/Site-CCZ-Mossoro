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
    <div className="page">
      <BackLink />
      <h1>{config.createLabel}</h1>
      <EntryForm config={config} initialValues={defaultValues(config)} />
    </div>
  );
}
