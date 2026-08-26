import { cn } from "@/lib/utils";

export function GoogleMapEmbed({
  query,
  className,
  title = "Mapa da localização",
}: {
  query: string;
  className?: string;
  title?: string;
}) {
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=16&hl=pt-BR&output=embed`;
  return (
    <div className={cn("overflow-hidden rounded-2xl shadow-card ring-1 ring-black/5", className)}>
      <iframe
        src={src}
        title={title}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full w-full border-0"
      />
    </div>
  );
}
