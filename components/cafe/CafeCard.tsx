"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Cafe } from "@/types/cafe";
import { SolarHeart, SolarStar, SolarClockCircle, SolarCup } from "@/components/icons/SolarIcons";
import { getCopy, ratingSourceLabel, type Lang } from "@/lib/copy";
import { formatDistanceKm, isOpenNow } from "@/lib/cafe-utils";

interface CafeCardProps {
  cafe: Cafe;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  language?: Lang;
  showDistance?: boolean;
}

export function CafeCard({
  cafe,
  isFavorite,
  onToggleFavorite,
  language = "en",
  showDistance = false,
}: CafeCardProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const t = getCopy(language);
  const source = ratingSourceLabel(cafe.data_sources, language);
  const coverPhoto = cafe.photos?.[0];
  const shortAddress = cafe.address.split(",")[0] || cafe.township;
  const open = mounted ? isOpenNow(cafe.opening_hours) : null;
  const distance = showDistance ? formatDistanceKm(cafe.distance_km) : null;

  return (
    <article className="group bg-white border border-cafe-border hover:border-cafe-border-hover rounded-2xl overflow-hidden shadow-cafe hover:shadow-cafe-hover transition-all duration-200 flex flex-col justify-between">
      <div className="relative h-48 w-full overflow-hidden bg-cafe-warm-bg">
        <Link href={`/cafe/${cafe.id}`} className="block h-full">
          {coverPhoto ? (
            <img
              src={coverPhoto}
              alt={cafe.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out outline outline-1 outline-black/5"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-cafe-caramel">
              <SolarCup size={28} />
              <span className="text-sm font-medium">{t.photoUnavailable}</span>
            </div>
          )}
        </Link>

        {open != null && (
          <span
            className={`absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm flex items-center gap-1.5 ${
              open ? "text-cafe-green" : "text-cafe-hazelnut"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${open ? "bg-cafe-green" : "bg-cafe-hazelnut"}`} />
            <span>{open ? t.openNow : t.closed}</span>
          </span>
        )}

        <button
          type="button"
          onClick={() => onToggleFavorite(cafe.id)}
          aria-label={
            isFavorite ? `${t.savedFavorite}: ${cafe.name}` : `${t.saveFavorite}: ${cafe.name}`
          }
          className="emil-press absolute top-3 right-3 min-h-11 min-w-11 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white flex items-center justify-center text-cafe-caramel shadow-sm transition-colors"
        >
          <SolarHeart
            size={20}
            filled={isFavorite}
            className={isFavorite ? "text-cafe-terracotta" : "text-cafe-hazelnut hover:text-cafe-caramel"}
          />
        </button>
      </div>

      <Link href={`/cafe/${cafe.id}`} className="block p-4 space-y-2 flex-1">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-cafe-caramel uppercase tracking-wider">
            {cafe.township}
          </span>
          <span className="font-medium text-cafe-hazelnut">{cafe.price_level}</span>
        </div>

        <h2 className="text-xl font-bold tracking-tight text-cafe-espresso group-hover:text-cafe-caramel transition-colors pt-0.5">
          {cafe.name}
        </h2>

        <div className="flex items-center gap-1.5 text-sm min-w-0">
          <span className="text-cafe-terracotta font-bold flex items-center gap-1 shrink-0">
            <SolarStar size={14} filled={true} className="text-cafe-terracotta" />
            <span>{cafe.rating.toFixed(1)}</span>
          </span>
          <span className="text-cafe-border">·</span>
          <span className="text-cafe-hazelnut truncate">{source}</span>
          {distance && (
            <>
              <span className="text-cafe-border">·</span>
              <span className="text-cafe-hazelnut shrink-0">{distance}</span>
            </>
          )}
        </div>

        <p className="text-sm text-cafe-hazelnut truncate">{shortAddress}</p>

        {cafe.description && (
          <p className="text-sm text-cafe-hazelnut line-clamp-2 leading-relaxed pt-1">
            {cafe.description}
          </p>
        )}

        <div className="flex flex-wrap gap-1.5 pt-2">
          <span className="px-2.5 py-0.5 rounded-md bg-cafe-warm-bg border border-cafe-border text-xs font-medium text-cafe-hazelnut">
            {cafe.category}
          </span>
          {cafe.amenities &&
            cafe.amenities
              .filter((a) => ["Wi-Fi", "Work Friendly", "Pet Friendly", "Outdoor Seating"].includes(a))
              .slice(0, 3)
              .map((amenity) => (
                <span
                  key={amenity}
                  className="px-2.5 py-0.5 rounded-md bg-cafe-cream border border-cafe-border text-xs text-cafe-hazelnut"
                >
                  {amenity}
                </span>
              ))}
        </div>
      </Link>

      <div className="p-4 pt-2.5 border-t border-cafe-border/70 flex items-center justify-between text-sm text-cafe-hazelnut">
        <div className="flex items-center gap-1.5">
          <SolarClockCircle size={16} />
          <span>{cafe.opening_hours.split("—")[0].trim()}</span>
        </div>

        <Link
          href={`/cafe/${cafe.id}`}
          className="emil-press min-h-11 inline-flex items-center font-semibold text-cafe-caramel hover:text-cafe-caramel-hover gap-1"
        >
          <span>{t.viewDetails}</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
