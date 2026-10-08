"use client";

import React from "react";
import { Bookmark, LayoutGrid, MapPin } from "lucide-react";

interface HeaderProps {
  favoritesCount: number;
  onShowFavorites: () => void;
  showFavoritesOnly: boolean;
  viewMode: "cards" | "map";
  onViewModeChange: (mode: "cards" | "map") => void;
}

export function Header({
  favoritesCount,
  onShowFavorites,
  showFavoritesOnly,
  viewMode,
  onViewModeChange,
}: HeaderProps) {
  return (
    <header className="w-full flex items-center justify-between pb-4 dashed-divider select-none">
      <div className="flex items-center gap-3">
        <a
          href="/"
          className="text-xl md:text-2xl font-medium tracking-tight uppercase text-warm-cream hover:opacity-90 transition-opacity focus-visible:ring-1 focus-visible:ring-warm-cream"
        >
          COFFIND
        </a>
        <span className="hidden sm:inline-flex text-[10px] md:text-xs tracking-wider uppercase px-2.5 py-0.5 rounded-pill border border-cork-border text-driftwood">
          Yangon Coffee Guide
        </span>
      </div>

      <nav aria-label="Main Navigation" className="flex items-center gap-3 sm:gap-6 text-xs uppercase font-medium">
        {/* View Mode Switcher: Cards vs Map */}
        <div className="flex items-center p-0.5 border border-cork-border rounded-pill bg-walnut-shadow">
          <button
            type="button"
            onClick={() => onViewModeChange("cards")}
            aria-pressed={viewMode === "cards"}
            className={`emil-press px-3 py-1 rounded-pill flex items-center gap-1.5 transition-colors focus-visible:ring-1 focus-visible:ring-warm-cream ${
              viewMode === "cards"
                ? "bg-bark-brown text-warm-cream border border-warm-cream/30"
                : "text-driftwood hover:text-warm-cream"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Cards</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("map")}
            aria-pressed={viewMode === "map"}
            className={`emil-press px-3 py-1 rounded-pill flex items-center gap-1.5 transition-colors focus-visible:ring-1 focus-visible:ring-warm-cream ${
              viewMode === "map"
                ? "bg-bark-brown text-warm-cream border border-warm-cream/30"
                : "text-driftwood hover:text-warm-cream"
            }`}
          >
            <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Map</span>
          </button>
        </div>

        {/* Saved Favorites Tab */}
        <button
          type="button"
          onClick={onShowFavorites}
          aria-pressed={showFavoritesOnly}
          className={`emil-press transition-colors flex items-center gap-1.5 relative pb-1 focus-visible:ring-1 focus-visible:ring-warm-cream ${
            showFavoritesOnly ? "text-warm-cream" : "text-driftwood hover:text-warm-cream"
          }`}
        >
          <Bookmark
            aria-hidden="true"
            className={`w-3.5 h-3.5 ${favoritesCount > 0 ? "text-ember-accent" : ""}`}
          />
          <span>Saved ({favoritesCount})</span>
          {showFavoritesOnly && (
            <span className="absolute bottom-0 left-0 right-0 h-[1px] border-b border-dashed border-ember-accent"></span>
          )}
        </button>
      </nav>
    </header>
  );
}
