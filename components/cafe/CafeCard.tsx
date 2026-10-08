"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Cafe } from "@/types/cafe";
import { SolarHeart, SolarStar, SolarClockCircle } from "@/components/icons/SolarIcons";

interface CafeCardProps {
  cafe: Cafe;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  language?: "en" | "mm";
}

export function CafeCard({
  cafe,
  isFavorite,
  onToggleFavorite,
  language = "en",
}: CafeCardProps) {
  const [imageError, setImageError] = useState(false);

  // Single name display based on language preference (no dual-name subtitle)
  const displayName = language === "mm" && cafe.name_mm ? cafe.name_mm : cafe.name;

  const coverPhoto =
    !imageError && cafe.photos && cafe.photos.length > 0
      ? cafe.photos[0]
      : "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80";

  const shortAddress = cafe.address.split(",")[0] || cafe.township;

  return (
    <article className="group bg-white border border-cafe-border hover:border-cafe-border-hover rounded-2xl overflow-hidden shadow-cafe hover:shadow-cafe-hover transition-all duration-200 flex flex-col justify-between select-none">
      <Link href={`/cafe/${cafe.id}`} className="block">
        {/* Photo Container on Top */}
        <div className="relative h-48 w-full overflow-hidden bg-cafe-warm-bg">
          <img
            src={coverPhoto}
            alt={displayName}
            loading="lazy"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out outline outline-1 outline-black/5"
          />

          {/* Open / Closed Status Badge */}
          <span
            className={`absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-semibold shadow-sm flex items-center gap-1.5 ${
              cafe.open_now ? "text-cafe-green" : "text-cafe-muted"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                cafe.open_now ? "bg-cafe-green" : "bg-cafe-muted"
              }`}
            />
            <span>{cafe.open_now ? "Open now" : "Closed"}</span>
          </span>

          {/* Favorite Heart Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite(cafe.id);
            }}
            aria-label={
              isFavorite
                ? `Remove ${displayName} from favorites`
                : `Save ${displayName} to favorites`
            }
            className="emil-press absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white flex items-center justify-center text-cafe-caramel shadow-sm transition-colors"
          >
            <SolarHeart
              size={18}
              filled={isFavorite}
              className={isFavorite ? "text-cafe-terracotta" : "text-cafe-muted hover:text-cafe-caramel"}
            />
          </button>
        </div>

        {/* Card Content Body */}
        <div className="p-4 space-y-2">
          {/* Township & Price Tier */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-cafe-caramel uppercase tracking-wider">
              {cafe.township}
            </span>
            <span className="font-medium text-cafe-hazelnut">
              {cafe.price_level}
            </span>
          </div>

          {/* Single Cafe Name */}
          <h2 className="text-xl font-bold tracking-tight text-cafe-espresso group-hover:text-cafe-caramel transition-colors pt-0.5">
            {displayName}
          </h2>

          {/* Star Rating & Review Count */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-cafe-terracotta font-bold flex items-center gap-1">
              <SolarStar size={14} filled={true} className="text-cafe-terracotta" />
              <span>{cafe.rating.toFixed(1)}</span>
            </span>
            <span className="text-cafe-hazelnut">
              ({cafe.reviews_count.toLocaleString()} reviews)
            </span>
            <span className="text-cafe-border">·</span>
            <span className="text-cafe-muted truncate max-w-[140px]">
              {shortAddress}
            </span>
          </div>

          {/* Description Snippet (Readable & High Contrast) */}
          <p className="text-xs text-cafe-hazelnut line-clamp-2 leading-relaxed pt-1">
            {cafe.description}
          </p>

          {/* Tags & Amenities Placed Towards the Bottom */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            <span className="px-2.5 py-0.5 rounded-md bg-cafe-warm-bg border border-cafe-border text-[11px] font-medium text-cafe-hazelnut">
              {cafe.category}
            </span>
            {cafe.amenities &&
              cafe.amenities
                .filter((a) => ["Wi-Fi", "Work Friendly", "Pet Friendly", "Outdoor Seating"].includes(a))
                .slice(0, 3)
                .map((amenity) => (
                  <span
                    key={amenity}
                    className="px-2.5 py-0.5 rounded-md bg-cafe-cream border border-cafe-border text-[11px] text-cafe-hazelnut"
                  >
                    {amenity}
                  </span>
                ))}
          </div>
        </div>
      </Link>

      {/* Card Footer */}
      <div className="p-4 pt-2.5 border-t border-cafe-border/70 flex items-center justify-between text-xs text-cafe-hazelnut">
        <div className="flex items-center gap-1.5 text-cafe-muted">
          <SolarClockCircle size={14} />
          <span>{cafe.opening_hours.split("—")[0].trim()}</span>
        </div>

        <Link
          href={`/cafe/${cafe.id}`}
          className="emil-press font-semibold text-cafe-caramel hover:text-cafe-caramel-hover flex items-center gap-1"
        >
          <span>View Details</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
