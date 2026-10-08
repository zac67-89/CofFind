"use client";

import React from "react";
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

interface FilterBarProps {
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
  onRequestLocation: () => void;
  userLocation: { lat: number; lng: number } | null;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export function FilterBar({
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
  onRequestLocation,
  userLocation,
  onResetFilters,
  hasActiveFilters,
}: FilterBarProps) {
  return (
    <div className="space-y-3.5 bg-white border border-cafe-border rounded-2xl p-4 sm:p-5 shadow-cafe select-none">
      {/* Search Bar & Near Me Action */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-lg">
          <label htmlFor="cafe-search" className="sr-only">
            Search cafes in Yangon
          </label>
          <div className="absolute left-3.5 top-2.5 text-cafe-muted pointer-events-none">
            <SolarMagnifier size={18} />
          </div>
          <input
            id="cafe-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by cafe name, street, or coffee style..."
            className="w-full bg-cafe-cream border border-cafe-border rounded-xl py-2 pl-10 pr-9 text-xs md:text-sm text-cafe-espresso placeholder:text-cafe-muted focus:outline-none focus:border-cafe-caramel focus:ring-1 focus:ring-cafe-caramel transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear search query"
              className="absolute right-2.5 top-2.5 text-cafe-muted hover:text-cafe-espresso emil-press p-0.5"
            >
              <SolarCloseCircle size={16} />
            </button>
          )}
        </div>

        {/* Locate Me Button */}
        <button
          type="button"
          onClick={onRequestLocation}
          className={`emil-press px-4 py-2 rounded-xl text-xs font-medium border flex items-center justify-center gap-2 transition-all ${
            userLocation
              ? "bg-cafe-green-bg text-cafe-green border-cafe-green/30"
              : "bg-cafe-warm-bg text-cafe-espresso border-cafe-border hover:border-cafe-border-hover"
          }`}
        >
          <SolarMapPoint size={15} className={userLocation ? "text-cafe-green" : "text-cafe-caramel"} />
          <span>{userLocation ? "Location active" : "Cafes Near Me"}</span>
        </button>
      </div>

      {/* Filter Buttons & Township Selection */}
      <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
        <span className="text-xs font-medium text-cafe-hazelnut mr-1 hidden sm:inline">
          Filter by:
        </span>

        {/* Still Open Filter */}
        <button
          type="button"
          onClick={onToggleStillOpen}
          aria-pressed={stillOpenOnly}
          className={`emil-press px-3 py-1.5 rounded-full font-medium border flex items-center gap-1.5 transition-all ${
            stillOpenOnly
              ? "bg-cafe-caramel text-white border-cafe-caramel shadow-sm"
              : "bg-cafe-warm-bg text-cafe-espresso border-cafe-border hover:border-cafe-border-hover"
          }`}
        >
          <SolarClockCircle size={14} className={stillOpenOnly ? "text-white" : "text-cafe-caramel"} />
          <span>Still Open</span>
        </button>

        {/* Wi-Fi Filter */}
        <button
          type="button"
          onClick={onToggleWifi}
          aria-pressed={wifiOnly}
          className={`emil-press px-3 py-1.5 rounded-full font-medium border flex items-center gap-1.5 transition-all ${
            wifiOnly
              ? "bg-cafe-caramel text-white border-cafe-caramel shadow-sm"
              : "bg-cafe-warm-bg text-cafe-espresso border-cafe-border hover:border-cafe-border-hover"
          }`}
        >
          <SolarWifi size={14} className={wifiOnly ? "text-white" : "text-cafe-caramel"} />
          <span>Wi-Fi</span>
        </button>

        {/* Work Friendly Filter */}
        <button
          type="button"
          onClick={onToggleWorkFriendly}
          aria-pressed={workFriendlyOnly}
          className={`emil-press px-3 py-1.5 rounded-full font-medium border flex items-center gap-1.5 transition-all ${
            workFriendlyOnly
              ? "bg-cafe-caramel text-white border-cafe-caramel shadow-sm"
              : "bg-cafe-warm-bg text-cafe-espresso border-cafe-border hover:border-cafe-border-hover"
          }`}
        >
          <SolarLaptop size={14} className={workFriendlyOnly ? "text-white" : "text-cafe-caramel"} />
          <span>Work Friendly</span>
        </button>

        {/* Pet Friendly Filter */}
        <button
          type="button"
          onClick={onTogglePetFriendly}
          aria-pressed={petFriendlyOnly}
          className={`emil-press px-3 py-1.5 rounded-full font-medium border flex items-center gap-1.5 transition-all ${
            petFriendlyOnly
              ? "bg-cafe-caramel text-white border-cafe-caramel shadow-sm"
              : "bg-cafe-warm-bg text-cafe-espresso border-cafe-border hover:border-cafe-border-hover"
          }`}
        >
          <SolarPaw size={14} className={petFriendlyOnly ? "text-white" : "text-cafe-caramel"} />
          <span>Pet Friendly</span>
        </button>

        {/* Rating 4.0+ Filter */}
        <button
          type="button"
          onClick={onToggleRatingOver4}
          aria-pressed={ratingOver4Only}
          className={`emil-press px-3 py-1.5 rounded-full font-medium border flex items-center gap-1.5 transition-all ${
            ratingOver4Only
              ? "bg-cafe-caramel text-white border-cafe-caramel shadow-sm"
              : "bg-cafe-warm-bg text-cafe-espresso border-cafe-border hover:border-cafe-border-hover"
          }`}
        >
          <SolarStar size={14} filled={true} className={ratingOver4Only ? "text-white" : "text-cafe-terracotta"} />
          <span>Rating over 4</span>
        </button>

        {/* Township Dropdown Filter */}
        <div className="relative">
          <select
            value={selectedTownship}
            onChange={(e) => onSelectTownship(e.target.value)}
            aria-label="Filter by township"
            className="emil-press bg-cafe-warm-bg text-cafe-espresso border border-cafe-border hover:border-cafe-border-hover px-3 py-1.5 rounded-full text-xs font-medium focus:outline-none focus:border-cafe-caramel cursor-pointer"
          >
            <option value="ALL">All Townships</option>
            {availableTownships.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Filters Action */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="emil-press text-xs font-semibold text-cafe-caramel hover:text-cafe-caramel-hover flex items-center gap-1 px-2.5 py-1 rounded-full hover:bg-cafe-warm-bg transition-colors ml-auto"
          >
            <SolarRotate size={13} />
            <span>Reset filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
