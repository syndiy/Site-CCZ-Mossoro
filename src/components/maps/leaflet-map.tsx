"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { useEffect } from "react";

export type LatLng = { lat: number; lng: number };

const pinIcon = L.divIcon({
  className: "",
  html: `<div class="ccz-pin">
    <span class="ccz-pin-pulse"></span>
    <svg width="36" height="48" viewBox="0 0 34 46" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 0C7.6 0 0 7.6 0 17c0 12.2 15.3 27.5 16 28.2.6.6 1.5.6 2 0 .7-.7 16-16 16-28.2C34 7.6 26.4 0 17 0Z" fill="#1465be"/>
      <circle cx="17" cy="17" r="6.5" fill="#fff"/>
    </svg>
  </div>`,
  iconSize: [36, 48],
  iconAnchor: [18, 48],
});

function ClickPicker({ onPick }: { onPick: (p: LatLng) => void }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function Recenter({ center, zoom }: { center: LatLng; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([center.lat, center.lng], zoom ?? map.getZoom(), { duration: 0.9 });
  }, [center, zoom, map]);
  return null;
}

type Props = {
  center: LatLng;
  marker?: LatLng | null;
  zoom?: number;
  onPick?: (p: LatLng) => void;
  className?: string;
};

export default function LeafletMap({ center, marker, zoom = 16, onPick, className }: Props) {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      scrollWheelZoom={false}
      zoomControl={true}
      attributionControl={false}
      className={className}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        maxZoom={20}
      />
      {marker ? (
        <Marker
          position={[marker.lat, marker.lng]}
          icon={pinIcon}
          draggable={!!onPick}
          eventHandlers={
            onPick
              ? {
                  dragend(e) {
                    const p = e.target.getLatLng();
                    onPick({ lat: p.lat, lng: p.lng });
                  },
                }
              : undefined
          }
        />
      ) : null}
      {onPick ? <ClickPicker onPick={onPick} /> : null}
      <Recenter center={center} zoom={marker ? 17 : undefined} />
    </MapContainer>
  );
}
