"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import type { LatLng } from "./maplibre-map";

const MapaBase = dynamic(() => import("./maplibre-map"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-muted" />,
});

export type { LatLng };

export function Map({
  center,
  marker,
  zoom,
  onPick,
  className,
}: {
  center: LatLng;
  marker?: LatLng | null;
  zoom?: number;
  onPick?: (p: LatLng) => void;
  className?: string;
}) {
  return (
    <div className={cn("relative z-0 isolate overflow-hidden rounded-2xl shadow-card ring-1 ring-black/5", className)}>
      <MapaBase center={center} marker={marker} zoom={zoom} onPick={onPick} />
    </div>
  );
}
