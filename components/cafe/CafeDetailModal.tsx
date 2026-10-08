"use client";

import React, { useEffect } from "react";
import { Cafe } from "@/types/cafe";
import { X, Star, Clock, Globe, Phone, ExternalLink, Heart, MapPin } from "lucide-react";

interface CafeDetailModalProps {
  cafe: Cafe | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

function getPriceDescription(level: string) {
  if (level === "$") return "Affordable · Casual daily coffee";
  if (level === "$$$" || level === "$$$$") return "Special treat · Premium selection";
  return "Moderate · Standard specialty coffee pricing";
}

export function CafeDetailModal({
  cafe,
  onClose,
  isFavorite,
  onToggleFavorite,
}: CafeDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!cafe) return null;

  const mapDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${cafe.name} ${cafe.address}`
  )}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-cafe-title"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-150 select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-walnut-shadow border border-cork-border rounded-card max-w-xl w-full p-6 space-y-5 shadow-2xl relative transition-all duration-200 transform scale-100 max-h-[90vh] overflow-y-auto custom-scroll"
      >
        {/* Header */}
        <div className="flex justify-between items-start dashed-divider pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium uppercase px-2.5 py-0.5 rounded-pill bg-bark-brown text-warm-cream border border-cork-border/50">
                {cafe.category}
              </span>
              <span
                className={`text-[10px] font-medium tracking-wide ${
                  cafe.open_now ? "text-ember-accent" : "text-driftwood"
                }`}
              >
                {cafe.open_now ? "● Open right now" : "○ Closed"}
              </span>
            </div>

            <h2
              id="modal-cafe-title"
              className="text-2xl md:text-3xl font-medium uppercase tracking-tight text-warm-cream pt-1"
            >
              {cafe.name}
            </h2>
            {cafe.name_mm && (
              <p className="text-xs text-driftwood">{cafe.name_mm}</p>
            )}
            <p className="text-xs text-driftwood uppercase tracking-wide">
              {cafe.township} · {cafe.address}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleFavorite(cafe.id)}
              aria-label={
                isFavorite
                  ? `Remove ${cafe.name} from saved`
                  : `Save ${cafe.name} to favorites`
              }
              className="emil-press p-2 rounded-full border border-cork-border hover:border-warm-cream text-warm-cream transition-colors focus-visible:ring-1 focus-visible:ring-warm-cream"
            >
              <Heart
                aria-hidden="true"
                className={`w-4 h-4 ${
                  isFavorite ? "fill-ember-accent text-ember-accent" : "text-driftwood"
                }`}
              />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close details"
              className="emil-press p-2 rounded-full border border-cork-border hover:border-warm-cream text-driftwood hover:text-warm-cream transition-colors focus-visible:ring-1 focus-visible:ring-warm-cream"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Narrative Description */}
        <p className="text-sm text-warm-cream/90 leading-relaxed font-normal">
          {cafe.description}
        </p>

        {/* Essential Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="border border-cork-border p-3.5 rounded-card bg-walnut-shadow space-y-1">
            <div className="flex items-center gap-1.5 text-driftwood text-[10px] uppercase font-medium">
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Opening Hours</span>
            </div>
            <p className="font-medium text-warm-cream">{cafe.opening_hours}</p>
          </div>

          <div className="border border-cork-border p-3.5 rounded-card bg-walnut-shadow space-y-1">
            <div className="flex items-center gap-1.5 text-driftwood text-[10px] uppercase font-medium">
              <Star className="w-3.5 h-3.5 fill-ember-accent text-ember-accent" aria-hidden="true" />
              <span>Community Rating</span>
            </div>
            <p className="font-medium text-warm-cream">
              ★ {cafe.rating.toFixed(1)} out of 5 ({cafe.reviews_count.toLocaleString()} reviews)
            </p>
          </div>
        </div>

        {/* Price Tier */}
        <div className="border border-cork-border p-3 rounded-card text-xs flex items-center justify-between">
          <span className="text-driftwood text-[11px] uppercase">Price guide</span>
          <span className="font-medium text-warm-cream">{getPriceDescription(cafe.price_level)}</span>
        </div>

        {/* Verified Amenities */}
        {cafe.amenities && cafe.amenities.length > 0 && (
          <div className="border border-cork-border p-3.5 rounded-card space-y-2">
            <span className="text-driftwood block text-[10px] uppercase font-medium tracking-wide">
              What to expect here
            </span>
            <div className="flex flex-wrap gap-2">
              {cafe.amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="px-2.5 py-1 rounded-ghost border border-cork-border text-xs text-warm-cream/90 uppercase"
                >
                  ✓ {amenity}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Contact Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {cafe.phone && (
            <div className="flex items-center gap-2 border border-cork-border/70 p-2.5 rounded-card text-driftwood">
              <Phone className="w-3.5 h-3.5 text-warm-cream" aria-hidden="true" />
              <a href={`tel:${cafe.phone}`} className="hover:text-warm-cream underline">
                {cafe.phone}
              </a>
            </div>
          )}
          {cafe.website && (
            <div className="flex items-center gap-2 border border-cork-border/70 p-2.5 rounded-card text-driftwood">
              <Globe className="w-3.5 h-3.5 text-warm-cream" aria-hidden="true" />
              <a
                href={cafe.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-warm-cream underline truncate"
              >
                Visit website
              </a>
            </div>
          )}
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-3 pt-2 dashed-divider-t">
          <a
            href={mapDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="emil-press flex-1 py-2.5 rounded-pill bg-bark-brown text-warm-cream text-xs font-medium uppercase text-center border border-warm-cream/20 hover:border-warm-cream transition-colors flex items-center justify-center gap-2 focus-visible:ring-1 focus-visible:ring-warm-cream"
          >
            <span>Open in Google Maps for directions</span>
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
          <button
            type="button"
            onClick={onClose}
            className="emil-press px-5 py-2.5 rounded-ghost border border-warm-cream text-warm-cream text-xs font-medium uppercase hover:bg-warm-cream/10 transition-colors focus-visible:ring-1 focus-visible:ring-warm-cream"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
