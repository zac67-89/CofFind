"use client";

import React from "react";
import Link from "next/link";
import { SolarCup, SolarHeart } from "@/components/icons/SolarIcons";
import { getCopy, type Lang } from "@/lib/copy";

interface HeaderProps {
  favoritesCount: number;
  onShowFavorites: () => void;
  showFavoritesOnly: boolean;
  language: Lang;
  onLanguageChange: (lang: Lang) => void;
}

export function Header({
  favoritesCount,
  onShowFavorites,
  showFavoritesOnly,
  language,
  onLanguageChange,
}: HeaderProps) {
  const t = getCopy(language);

  return (
    <header className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-cafe-border">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus-visible:ring-2 focus-visible:ring-cafe-caramel rounded-xl"
        >
          <div className="w-11 h-11 rounded-full bg-cafe-caramel text-white flex items-center justify-center shadow-sm group-hover:bg-cafe-caramel-hover transition-colors">
            <SolarCup size={18} className="text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-cafe-espresso block leading-none">
              CofFind
            </span>
            <span className="text-xs text-cafe-hazelnut font-normal">{t.tagline}</span>
          </div>
        </Link>
      </div>

      <nav aria-label="Main Navigation" className="flex items-center gap-2 sm:gap-3 text-sm font-medium flex-wrap">
        <div
          role="group"
          aria-label="Language selection"
          className="flex items-center p-0.5 border border-cafe-border rounded-full bg-cafe-warm-bg"
        >
          <button
            type="button"
            onClick={() => onLanguageChange("en")}
            aria-pressed={language === "en"}
            className={`emil-press min-h-11 px-3 rounded-full text-sm font-semibold transition-all ${
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
            className={`emil-press min-h-11 px-3 rounded-full text-sm font-semibold transition-all ${
              language === "mm"
                ? "bg-white text-cafe-espresso shadow-sm"
                : "text-cafe-hazelnut hover:text-cafe-espresso"
            }`}
          >
            မြန်မာ
          </button>
        </div>

        <button
          type="button"
          onClick={onShowFavorites}
          aria-pressed={showFavoritesOnly}
          className={`emil-press min-h-11 px-3.5 rounded-full border transition-all flex items-center gap-1.5 ${
            showFavoritesOnly
              ? "bg-cafe-caramel text-white border-cafe-caramel shadow-sm"
              : "bg-white border-cafe-border text-cafe-espresso hover:border-cafe-border-hover shadow-cafe"
          }`}
        >
          <SolarHeart
            size={16}
            filled={favoritesCount > 0}
            className={
              showFavoritesOnly
                ? "text-white"
                : favoritesCount > 0
                  ? "text-cafe-terracotta"
                  : "text-cafe-hazelnut"
            }
          />
          <span>
            {t.saved} ({favoritesCount})
          </span>
        </button>
      </nav>
    </header>
  );
}
