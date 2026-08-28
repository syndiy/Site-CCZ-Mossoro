"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import {
  Map as MapLibre,
  Marker,
  NavigationControl,
  AttributionControl,
  type StyleSpecification,
} from "maplibre-gl";
import { useEffect, useRef } from "react";

export type LatLng = { lat: number; lng: number };

// Camada raster evita o estilo vetorial remoto que falhava ao entregar tiles.
// A atribuicao e mantida no controle nativo do MapLibre.
const ESTILO: StyleSpecification = {
  version: 8,
  sources: {
    openstreetmap: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      maxzoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
    },
  },
  layers: [{ id: "openstreetmap", type: "raster", source: "openstreetmap" }],
};

const PIN_HTML = `<div class="ccz-pin">
  <span class="ccz-pin-pulse"></span>
  <svg width="36" height="48" viewBox="0 0 34 46" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 0C7.6 0 0 7.6 0 17c0 12.2 15.3 27.5 16 28.2.6.6 1.5.6 2 0 .7-.7 16-16 16-28.2C34 7.6 26.4 0 17 0Z" fill="#1465be"/>
    <circle cx="17" cy="17" r="6.5" fill="#fff"/>
  </svg>
</div>`;

type Props = {
  center: LatLng;
  marker?: LatLng | null;
  zoom?: number;
  onPick?: (p: LatLng) => void;
  className?: string;
};

export default function MapLibreMap({ center, marker, zoom = 16, onPick, className }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const mapa = useRef<MapLibre | null>(null);
  const pino = useRef<Marker | null>(null);
  // Guardado em ref para o listener de clique não precisar ser recriado.
  const aoEscolher = useRef(onPick);
  useEffect(() => {
    aoEscolher.current = onPick;
  }, [onPick]);

  useEffect(() => {
    if (!container.current || mapa.current) return;

    const map = new MapLibre({
      container: container.current,
      style: ESTILO,
      center: [center.lng, center.lat],
      zoom,
      attributionControl: false,
    });

    map.scrollZoom.disable();
    map.addControl(new NavigationControl({ showCompass: false }), "top-right");
    // Atribuição do OpenStreetMap é exigida pela licença dos dados.
    map.addControl(new AttributionControl({ compact: true }), "bottom-right");

    map.on("click", (e) => {
      aoEscolher.current?.({ lat: e.lngLat.lat, lng: e.lngLat.lng });
    });

    // Sem isto o mapa nasce com tamanho zero (o contêiner ainda não foi medido)
    // e nunca chega a pedir os tiles.
    const observador = new ResizeObserver(() => map.resize());
    observador.observe(container.current);

    mapa.current = map;

    return () => {
      observador.disconnect();
      map.remove();
      mapa.current = null;
      pino.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Marcador: cria, move e liga o arraste.
  useEffect(() => {
    const map = mapa.current;
    if (!map) return;

    if (!marker) {
      pino.current?.remove();
      pino.current = null;
      return;
    }

    if (!pino.current) {
      const el = document.createElement("div");
      el.innerHTML = PIN_HTML;
      const novo = new Marker({
        element: el.firstElementChild as HTMLElement,
        anchor: "bottom",
        draggable: Boolean(onPick),
      });
      novo.on("dragend", () => {
        const p = novo.getLngLat();
        aoEscolher.current?.({ lat: p.lat, lng: p.lng });
      });
      novo.setLngLat([marker.lng, marker.lat]).addTo(map);
      pino.current = novo;
    } else {
      pino.current.setLngLat([marker.lng, marker.lat]);
    }
  }, [marker, onPick]);

  // Recentraliza quando o endereço muda.
  useEffect(() => {
    mapa.current?.flyTo({
      center: [center.lng, center.lat],
      zoom: marker ? 17 : zoom,
      duration: 900,
    });
  }, [center, zoom, marker]);

  return <div ref={container} className={className} style={{ height: "100%", width: "100%" }} />;
}
