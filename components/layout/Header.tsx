"use client";

import React from "react";
import Link from "next/link";
import { SolarCup, SolarHeart, SolarMapPoint } from "@/components/icons/SolarIcons";
import { LayoutGrid } from "lucide-react";

interface HeaderProps {
  favoritesCount: number;
  onShowFavorites: () => void;
  showFavoritesOnly: boolean;
  viewMode: "cards" | "map";
  onViewModeChange: (mode: "cards" | "map") => void;
  language: "en" | "mm";
  onLanguageChange: (lang: "en" | "mm") => void;
}

export function Header({
  favoritesCount,
  onShowFavorites,
  showFavoritesOnly,
  viewMode,
  onViewModeChange,
  language,
  onLanguageChange,
}: HeaderProps) {
  return (
    <header className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-cafe-border select-none">
      {/* Brand & Tagline */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus-visible:ring-2 focus-visible:ring-cafe-caramel rounded-xl"
        >
          <div className="w-9 h-9 rounded-full bg-cafe-caramel text-white flex items-center justify-center shadow-sm group-hover:bg-cafe-caramel-hover transition-colors">
            <SolarCup size={18} className="text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-cafe-espresso block leading-none">
              CofFind
            </span>
            <span className="text-[11px] text-cafe-hazelnut font-normal">
              Yangon Cafe & Tea Guide
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Controls */}
      <nav aria-label="Main Navigation" className="flex items-center gap-2 sm:gap-3 text-xs font-medium flex-wrap">
        {/* Language Toggle: English vs Burmese */}
        <div
          role="group"
          aria-label="Language selection"
          className="flex items-center p-0.5 border border-cafe-border rounded-full bg-cafe-warm-bg"
        >
          <button
            type="button"
            onClick={() => onLanguageChange("en")}
            aria-pressed={language === "en"}
            className={`emil-press px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
              language === "en"
                ? "bg-white text-cafe-espresso shadow-sm"
                : "text-cafe-hazelnut hover:text-cafe-espresso"
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange("mm")}
            aria-pressed={language === "mm"}
            className={`emil-press px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
              language === "mm"
                ? "bg-white text-cafe-espresso shadow-sm"
                : "text-cafe-hazelnut hover:text-cafe-espresso"
            }`}
          >
            မြန်မာ
          </button>
        </div>

        {/* View Mode Switcher: Cards vs Map */}
        <div className="flex items-center p-0.5 border border-cafe-border rounded-full bg-cafe-warm-bg">
          <button
            type="button"
            onClick={() => onViewModeChange("cards")}
            aria-pressed={viewMode === "cards"}
            className={`emil-press px-3 py-1 rounded-full flex items-center gap-1.5 transition-all ${
              viewMode === "cards"
                ? "bg-white text-cafe-espresso shadow-sm font-semibold"
                : "text-cafe-hazelnut hover:text-cafe-espresso"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Cards</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("map")}
            aria-pressed={viewMode === "map"}
            className={`emil-press px-3 py-1 rounded-full flex items-center gap-1.5 transition-all ${
              viewMode === "map"
                ? "bg-white text-cafe-espresso shadow-sm font-semibold"
                : "text-cafe-hazelnut hover:text-cafe-espresso"
            }`}
          >
            <SolarMapPoint size={14} className="text-cafe-caramel" />
            <span>Map</span>
          </button>
        </div>

        {/* Saved Favorites Button */}
        <button
          type="button"
          onClick={onShowFavorites}
          aria-pressed={showFavoritesOnly}
          className={`emil-press px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 ${
            showFavoritesOnly
              ? "bg-cafe-caramel text-white border-cafe-caramel shadow-sm"
              : "bg-white border-cafe-border text-cafe-espresso hover:border-cafe-border-hover shadow-cafe"
          }`}
        >
          <SolarHeart
            size={14}
            filled={favoritesCount > 0}
            className={showFavoritesOnly ? "text-white" : favoritesCount > 0 ? "text-cafe-terracotta" : "text-cafe-muted"}
          />
          <span>Saved ({favoritesCount})</span>
        </button>
      </nav>
    </header>
  );
}
