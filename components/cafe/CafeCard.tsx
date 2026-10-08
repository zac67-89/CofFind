"use client";

import React from "react";
import { Cafe } from "@/types/cafe";
import { Heart, Star } from "lucide-react";

interface CafeCardProps {
  cafe: Cafe;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelect: (cafe: Cafe) => void;
  isSelected?: boolean;
}

function getPriceLabel(level: string) {
  if (level === "$") return "Affordable";
  if (level === "$$$" || level === "$$$$") return "Special treat";
  return "Moderate";
}

export function CafeCard({
  cafe,
  isFavorite,
  onToggleFavorite,
  onSelect,
  isSelected = false,
}: CafeCardProps) {
  const shortAddress = cafe.address.split(",")[0] || cafe.township;

  return (
    <article
      onClick={() => onSelect(cafe)}
      className={`emil-press select-none cursor-pointer bg-walnut-shadow border rounded-card p-5 transition-all flex flex-col justify-between ${
        isSelected
          ? "border-warm-cream"
          : "border-cork-border hover:border-driftwood"
      }`}
    >
      <div className="space-y-3">
        {/* Top Badges & Favorite Button */}
        <div className="flex justify-between items-start gap-3">
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

            <h2 className="text-xl md:text-2xl font-medium uppercase tracking-tight text-warm-cream pt-0.5">
              {cafe.name}
            </h2>
            {cafe.name_mm && (
              <p className="text-xs text-driftwood">{cafe.name_mm}</p>
            )}
            <p className="text-xs text-driftwood uppercase tracking-wide">
              {cafe.township} · {shortAddress}
            </p>
          </div>

          {/* Favorite Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(cafe.id);
            }}
            aria-label={
              isFavorite
                ? `Remove ${cafe.name} from saved cafés`
                : `Save ${cafe.name} to favorites`
            }
            className="emil-press p-2 rounded-full border border-cork-border hover:border-warm-cream text-warm-cream transition-colors focus-visible:ring-1 focus-visible:ring-warm-cream"
          >
            <Heart
              aria-hidden="true"
              className={`w-4 h-4 transition-colors ${
                isFavorite
                  ? "fill-ember-accent text-ember-accent"
                  : "text-driftwood hover:text-warm-cream"
              }`}
            />
          </button>
        </div>

        {/* Narrative Description */}
        <p className="text-xs text-warm-cream/80 line-clamp-2 leading-relaxed">
          {cafe.description}
        </p>

        {/* Friendly Amenities Chips */}
        {cafe.amenities && cafe.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {cafe.amenities.slice(0, 3).map((a) => (
              <span
                key={a}
                className="text-[10px] uppercase text-driftwood border border-cork-border/60 px-2 py-0.5 rounded-ghost"
              >
                {a}
              </span>
            ))}
            {cafe.amenities.length > 3 && (
              <span className="text-[10px] text-driftwood px-1 py-0.5">
                +{cafe.amenities.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer with Dashed Hairline Divider */}
      <div className="flex items-center justify-between pt-3.5 mt-4 dashed-divider-t text-xs text-driftwood">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-warm-cream/90 font-medium">
            <Star className="w-3.5 h-3.5 fill-ember-accent text-ember-accent" aria-hidden="true" />
            <span>{cafe.rating.toFixed(1)}</span>
            <span className="text-driftwood text-[11px]">
              ({cafe.reviews_count.toLocaleString()} reviews)
            </span>
          </span>
          <span>·</span>
          <span>{getPriceLabel(cafe.price_level)}</span>
        </div>

        <span className="text-warm-cream text-[11px] font-medium uppercase tracking-wide group-hover:text-ember-accent">
          View details →
        </span>
      </div>
    </article>
  );
}
