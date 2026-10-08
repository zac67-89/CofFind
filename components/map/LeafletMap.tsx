"use client";

import React, { useEffect, useRef } from "react";
import { Cafe } from "@/types/cafe";
import L from "leaflet";

interface LeafletMapProps {
  cafes: Cafe[];
  selectedCafe: Cafe | null;
  onSelectCafe: (cafe: Cafe) => void;
}

export default function LeafletMap({
  cafes,
  selectedCafe,
  onSelectCafe,
}: LeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center on Yangon
    const map = L.map(mapContainerRef.current, {
      center: [16.815, 96.155],
      zoom: 13,
      zoomControl: false,
    });

    // Add zoom controls
    L.control.zoom({ position: "topright" }).addTo(map);

    // Free OpenStreetMap standard tiles (Zero API Key required)
    // with dark style blending into Walnut Shadow
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" style="color: #6c5f51">OpenStreetMap</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }
    ).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    cafes.forEach((cafe) => {
      if (!cafe.latitude || !cafe.longitude) return;

      const isSelected = selectedCafe?.id === cafe.id;

      const iconHtml = `
        <div class="flex flex-col items-center cursor-pointer group" style="transform: translate(-50%, -100%);">
          <div class="px-2 py-0.5 rounded-pill text-[10px] font-medium tracking-tight uppercase whitespace-nowrap transition-all ${
            isSelected
              ? "bg-bark-brown text-warm-cream border border-warm-cream shadow-md scale-110"
              : "bg-walnut-shadow text-driftwood border border-cork-border hover:border-warm-cream hover:text-warm-cream"
          }">
            ${cafe.name}
          </div>
          <div class="w-2 h-2 rounded-full mt-0.5 ${
            isSelected ? "bg-ember-accent animate-pulse scale-125" : "bg-warm-cream"
          }"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: "custom-cafe-marker",
        html: iconHtml,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      const marker = L.marker([cafe.latitude, cafe.longitude], {
        icon: customIcon,
        title: cafe.name,
      }).addTo(map);

      marker.on("click", () => {
        onSelectCafe(cafe);
      });

      markersRef.current[cafe.id] = marker;
    });
  }, [cafes, selectedCafe, onSelectCafe]);

  // Pan smoothly on selection
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedCafe) return;

    if (selectedCafe.latitude && selectedCafe.longitude) {
      map.flyTo([selectedCafe.latitude, selectedCafe.longitude], 15, {
        duration: 1.2,
      });
    }
  }, [selectedCafe]);

  return (
    <div className="w-full h-full relative rounded-card overflow-hidden border border-cork-border select-none">
      <div ref={mapContainerRef} className="w-full h-full min-h-[460px]" />

      <div className="absolute bottom-3 left-3 z-[400] bg-walnut-shadow/90 backdrop-blur border border-cork-border px-2.5 py-1 rounded text-[10px] text-driftwood uppercase">
        Yangon Interactive Map · OpenStreetMap Free Tile
      </div>
    </div>
  );
}
