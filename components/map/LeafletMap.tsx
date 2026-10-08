"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Cafe } from "@/types/cafe";
import L from "leaflet";
import { SolarMapPoint, SolarNavigation } from "@/components/icons/SolarIcons";

interface LeafletMapProps {
  cafes: Cafe[];
  selectedCafe: Cafe | null;
  onSelectCafe?: (cafe: Cafe) => void;
  language?: "en" | "mm";
  userLocation?: { lat: number; lng: number } | null;
  onRequestLocation?: () => void;
}

export default function LeafletMap({
  cafes,
  selectedCafe,
  onSelectCafe,
  language = "en",
  userLocation,
  onRequestLocation,
}: LeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const userMarkerRef = useRef<L.Marker | null>(null);

  const [locating, setLocating] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center on central Yangon (around Bahan/Dagon)
    const map = L.map(mapContainerRef.current, {
      center: [16.815, 96.155],
      zoom: 13,
      zoomControl: false,
    });

    // Add zoom controls top-right
    L.control.zoom({ position: "topright" }).addTo(map);

    // Warm Voyager Map Tiles (Light, warm coffee/paper aesthetics)
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> &copy; CARTO',
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

  // Update Cafe Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    cafes.forEach((cafe) => {
      if (!cafe.latitude || !cafe.longitude) return;

      const isSelected = selectedCafe?.id === cafe.id;
      const displayName = language === "mm" && cafe.name_mm ? cafe.name_mm : cafe.name;
      const photoThumb = cafe.photos && cafe.photos.length > 0 ? cafe.photos[0] : "";

      const iconHtml = `
        <div class="flex flex-col items-center cursor-pointer group" style="transform: translate(-50%, -100%);">
          <div class="px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-tight whitespace-nowrap transition-all shadow-sm ${
            isSelected
              ? "bg-[#8C532B] text-white border border-[#8C532B] scale-105"
              : "bg-white text-[#2D2118] border border-[#EFE6DC] hover:border-[#8C532B] hover:text-[#8C532B]"
          }">
            ${displayName}
          </div>
          <div class="w-2.5 h-2.5 rounded-full mt-0.5 border border-white shadow-sm ${
            isSelected ? "bg-[#C8753B] scale-125" : "bg-[#8C532B]"
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
        title: displayName,
      }).addTo(map);

      // Light Cafe Themed Popup Content (includes photo & direct View Details link)
      const popupHtml = `
        <div class="space-y-2 select-none" style="min-width: 200px;">
          ${
            photoThumb
              ? `<div style="height: 100px; width: 100%; border-radius: 10px; overflow: hidden; background: #F5EFE6; margin-bottom: 8px;">
                  <img src="${photoThumb}" alt="${displayName}" style="width: 100%; height: 100%; object-fit: cover;" />
                </div>`
              : ""
          }
          <div style="font-size: 10px; font-weight: 700; color: #8C532B; text-transform: uppercase;">
            ${cafe.township} Township · ${cafe.price_level}
          </div>
          <div style="font-size: 14px; font-weight: 700; color: #2D2118; margin-top: 2px;">
            ${displayName}
          </div>
          <div style="font-size: 11px; color: #6E5C50; display: flex; align-items: center; gap: 4px;">
            <span style="color: #C8753B; font-weight: 700; display: flex; align-items: center; gap: 3px;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#C8753B"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <span>${cafe.rating.toFixed(1)}</span>
            </span>
            <span>(${cafe.reviews_count} reviews)</span>
          </div>
          <div style="padding-top: 6px; border-top: 1px solid #EFE6DC; margin-top: 8px;">
            <a href="/cafe/${cafe.id}" style="display: block; text-align: center; background: #8C532B; color: #FFFFFF; font-size: 11px; font-weight: 700; padding: 6px 12px; border-radius: 20px; text-decoration: none;">
              View Full Details →
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        maxWidth: 260,
        className: "cafe-leaflet-popup",
      });

      marker.on("click", () => {
        if (onSelectCafe) {
          onSelectCafe(cafe);
        }
      });

      markersRef.current[cafe.id] = marker;
    });
  }, [cafes, selectedCafe, onSelectCafe, language]);

  // Update User Location Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }

    if (userLocation) {
      const userIconHtml = `
        <div class="relative flex items-center justify-center" style="transform: translate(-50%, -50%);">
          <div class="absolute w-7 h-7 bg-[#8C532B]/25 rounded-full animate-ping"></div>
          <div class="w-4 h-4 bg-[#8C532B] border-2 border-white rounded-full shadow-md"></div>
        </div>
      `;

      const userIcon = L.divIcon({
        className: "user-location-marker",
        html: userIconHtml,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      const marker = L.marker([userLocation.lat, userLocation.lng], {
        icon: userIcon,
        zIndexOffset: 1000,
        title: "Your Location",
      }).addTo(map);

      userMarkerRef.current = marker;

      // Smooth pan to user location
      map.flyTo([userLocation.lat, userLocation.lng], 14, { duration: 1.2 });
    }
  }, [userLocation]);

  // Pan smoothly on selected cafe change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedCafe) return;

    if (selectedCafe.latitude && selectedCafe.longitude) {
      map.flyTo([selectedCafe.latitude, selectedCafe.longitude], 15, {
        duration: 1.2,
      });

      const m = markersRef.current[selectedCafe.id];
      if (m) {
        m.openPopup();
      }
    }
  }, [selectedCafe]);

  // Handler for Locate Me action
  const handleLocateMe = () => {
    if (onRequestLocation) {
      onRequestLocation();
    }
  };

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden border border-cafe-border shadow-cafe select-none">
      <div ref={mapContainerRef} className="w-full h-full min-h-[500px]" />

      {/* Floating Themed Controls */}
      <div className="absolute top-4 left-4 z-[400] flex flex-col gap-2">
        {/* Locate Me Button */}
        <button
          type="button"
          onClick={handleLocateMe}
          title="Find your current location"
          className="emil-press bg-white border border-cafe-border hover:border-cafe-caramel text-cafe-espresso p-2.5 rounded-xl shadow-cafe flex items-center gap-2 text-xs font-semibold transition-all"
        >
          <SolarMapPoint size={16} className="text-cafe-caramel" />
          <span className="hidden sm:inline">My Location</span>
        </button>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-sm border border-cafe-border px-3 py-1.5 rounded-xl text-[11px] text-cafe-hazelnut shadow-sm flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cafe-caramel" />
        <span>Yangon Interactive Cafe Map</span>
      </div>
    </div>
  );
}
