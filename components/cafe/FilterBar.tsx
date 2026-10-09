"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  SolarMagnifier,
  SolarCloseCircle,
  SolarClockCircle,
  SolarWifi,
  SolarLaptop,
  SolarPaw,
  SolarStar,
  SolarMapPoint,
  SolarRotate,
} from "@/components/icons/SolarIcons";
import { getCopy, type Lang } from "@/lib/copy";

const CHIP =
  "emil-press min-h-11 px-3.5 py-2 rounded-full text-sm font-medium border flex items-center gap-1.5 transition-all";
const CHIP_OFF = "bg-cafe-warm-bg text-cafe-espresso border-cafe-border hover:border-cafe-border-hover";
const CHIP_ON = "bg-cafe-caramel text-white border-cafe-caramel shadow-sm";

interface FilterBarProps {
  language: Lang;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedTownship: string;
  onSelectTownship: (township: string) => void;
  stillOpenOnly: boolean;
  onToggleStillOpen: () => void;
  wifiOnly: boolean;
  onToggleWifi: () => void;
  workFriendlyOnly: boolean;
  onToggleWorkFriendly: () => void;
  petFriendlyOnly: boolean;
  onTogglePetFriendly: () => void;
  ratingOver4Only: boolean;
  onToggleRatingOver4: () => void;
  availableTownships: string[];
  popularTownships: string[];
  onRequestLocation: () => void;
  userLocation: { lat: number; lng: number } | null;
  locating: boolean;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  showAmenityFilters: boolean;
  highlightTownships?: boolean;
}

export function FilterBar({
  language,
  searchQuery,
  onSearchChange,
  selectedTownship,
  onSelectTownship,
  stillOpenOnly,
  onToggleStillOpen,
  wifiOnly,
  onToggleWifi,
  workFriendlyOnly,
  onToggleWorkFriendly,
  petFriendlyOnly,
  onTogglePetFriendly,
  ratingOver4Only,
  onToggleRatingOver4,
  availableTownships,
  popularTownships,
  onRequestLocation,
  userLocation,
  locating,
  onResetFilters,
  hasActiveFilters,
  showAmenityFilters,
  highlightTownships = false,
}: FilterBarProps) {
  const t = getCopy(language);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMoreOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const extraTownships = availableTownships.filter((township) => !popularTownships.includes(township));
  const extraSelected = extraTownships.includes(selectedTownship);

  return (
    <div className="space-y-3 bg-white border border-cafe-border rounded-2xl p-4 sm:p-5 shadow-cafe">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-lg">
          <label htmlFor="cafe-search" className="sr-only">
            {t.searchLabel}
          </label>
          <div className="absolute left-3.5 top-3 text-cafe-hazelnut pointer-events-none">
            <SolarMagnifier size={18} />
          </div>
          <input
            id="cafe-search"
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full min-h-11 bg-cafe-cream border border-cafe-border rounded-xl py-2.5 pl-10 pr-9 text-sm text-cafe-espresso placeholder:text-cafe-hazelnut focus:outline-none focus:border-cafe-caramel focus:ring-1 focus:ring-cafe-caramel transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label={t.clearSearch}
              className="absolute right-2 top-2 min-h-11 min-w-11 text-cafe-hazelnut hover:text-cafe-espresso emil-press inline-flex items-center justify-center"
            >
              <SolarCloseCircle size={18} />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onRequestLocation}
          disabled={locating}
          className={`${CHIP} ${
            userLocation ? "bg-cafe-green-bg text-cafe-green border-cafe-green/30" : CHIP_OFF
          } justify-center sm:min-w-[10.5rem]`}
        >
          <SolarMapPoint size={16} className={userLocation ? "text-cafe-green" : "text-cafe-caramel"} />
          <span>{locating ? t.locating : userLocation ? t.locationActive : t.nearMe}</span>
        </button>
      </div>

      <div
        className={`flex items-center gap-2 flex-wrap rounded-2xl p-2 -mx-1 ${
          highlightTownships ? "ring-2 ring-cafe-caramel/40 bg-cafe-warm-bg/80" : ""
        }`}
      >
        {highlightTownships && (
          <p className="w-full px-1 pb-1 text-sm font-semibold text-cafe-caramel">
            {t.choosePrompt}
          </p>
        )}
        <button
          type="button"
          onClick={() => onSelectTownship("ALL")}
          aria-pressed={selectedTownship === "ALL"}
          className={`${CHIP} ${selectedTownship === "ALL" ? CHIP_ON : CHIP_OFF}`}
        >
          {t.allTownships}
        </button>
        {popularTownships.map((township) => (
          <button
            key={township}
            type="button"
            onClick={() => onSelectTownship(township)}
            aria-pressed={selectedTownship === township}
            className={`${CHIP} ${selectedTownship === township ? CHIP_ON : CHIP_OFF}`}
          >
            {township}
          </button>
        ))}
        {extraTownships.length > 0 && (
          <div className="relative" ref={moreRef}>
            <button
              type="button"
              onClick={() => setMoreOpen((open) => !open)}
              aria-haspopup="listbox"
              aria-expanded={moreOpen}
              aria-label={t.townshipFilter}
              className={`${CHIP} ${extraSelected ? CHIP_ON : CHIP_OFF}`}
            >
              <span>{extraSelected ? selectedTownship : t.moreTownships}</span>
              <span aria-hidden="true" className="text-[10px] opacity-70">
                {moreOpen ? "▴" : "▾"}
              </span>
            </button>
            {moreOpen && (
              <ul
                role="listbox"
                aria-label={t.townshipFilter}
                className="absolute z-30 mt-2 max-h-64 w-52 overflow-y-auto rounded-2xl border border-cafe-border bg-white p-1.5 shadow-cafe-modal"
              >
                {extraTownships.map((township) => (
                  <li key={township}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={selectedTownship === township}
                      onClick={() => {
                        onSelectTownship(township);
                        setMoreOpen(false);
                      }}
                      className={`emil-press w-full text-left min-h-11 px-3 py-2 rounded-xl text-sm font-medium ${
                        selectedTownship === township
                          ? "bg-cafe-warm-bg text-cafe-espresso"
                          : "text-cafe-hazelnut hover:bg-cafe-cream hover:text-cafe-espresso"
                      }`}
                    >
                      {township}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {showAmenityFilters && (
        <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-cafe-border/70">
          <span className="text-sm font-medium text-cafe-hazelnut mr-1 hidden sm:inline">
            {t.filterBy}
          </span>
          <button
            type="button"
            onClick={onToggleStillOpen}
            aria-pressed={stillOpenOnly}
            className={`${CHIP} ${stillOpenOnly ? CHIP_ON : CHIP_OFF}`}
          >
            <SolarClockCircle size={16} className={stillOpenOnly ? "text-white" : "text-cafe-caramel"} />
            <span>{t.stillOpen}</span>
          </button>
          <button
            type="button"
            onClick={onToggleWifi}
            aria-pressed={wifiOnly}
            className={`${CHIP} ${wifiOnly ? CHIP_ON : CHIP_OFF}`}
          >
            <SolarWifi size={16} className={wifiOnly ? "text-white" : "text-cafe-caramel"} />
            <span>{t.wifi}</span>
          </button>
          <button
            type="button"
            onClick={onToggleWorkFriendly}
            aria-pressed={workFriendlyOnly}
            className={`${CHIP} ${workFriendlyOnly ? CHIP_ON : CHIP_OFF}`}
          >
            <SolarLaptop size={16} className={workFriendlyOnly ? "text-white" : "text-cafe-caramel"} />
            <span>{t.workFriendly}</span>
          </button>
          <button
            type="button"
            onClick={onTogglePetFriendly}
            aria-pressed={petFriendlyOnly}
            className={`${CHIP} ${petFriendlyOnly ? CHIP_ON : CHIP_OFF}`}
          >
            <SolarPaw size={16} className={petFriendlyOnly ? "text-white" : "text-cafe-caramel"} />
            <span>{t.petFriendly}</span>
          </button>
          <button
            type="button"
            onClick={onToggleRatingOver4}
            aria-pressed={ratingOver4Only}
            className={`${CHIP} ${ratingOver4Only ? CHIP_ON : CHIP_OFF}`}
          >
            <SolarStar size={16} filled={true} className={ratingOver4Only ? "text-white" : "text-cafe-terracotta"} />
            <span>{t.ratingOver4}</span>
          </button>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="emil-press min-h-11 text-sm font-semibold text-cafe-caramel hover:text-cafe-caramel-hover flex items-center gap-1 px-3 py-2 rounded-full hover:bg-cafe-warm-bg transition-colors ml-auto"
            >
              <SolarRotate size={14} />
              <span>{t.resetFilters}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
