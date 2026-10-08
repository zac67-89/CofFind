"use client";

import React from "react";
import { Search, X, Laptop } from "lucide-react";

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedTownship: string;
  onSelectTownship: (township: string) => void;
  workFriendlyOnly: boolean;
  onToggleWorkFriendly: () => void;
  availableTownships: string[];
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  selectedTownship,
  onSelectTownship,
  workFriendlyOnly,
  onToggleWorkFriendly,
  availableTownships,
}: FilterBarProps) {
  return (
    <div className="space-y-4 pt-1 select-none">
      {/* Search Input (DESIGN.md Underline Spec) */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-lg">
          <label htmlFor="cafe-search" className="sr-only">
            Search cafés in Yangon
          </label>
          <input
            id="cafe-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by café name, neighborhood, or atmosphere..."
            className="w-full bg-transparent border-b border-warm-cream/60 focus:border-warm-cream focus:outline-none text-xs md:text-sm tracking-wide py-2 pr-8 placeholder:text-driftwood transition-colors rounded-none text-warm-cream"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
              className="absolute right-1 top-2.5 text-driftwood hover:text-warm-cream emil-press p-1 focus-visible:ring-1 focus-visible:ring-warm-cream"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          ) : (
            <Search className="absolute right-1 top-2.5 text-driftwood w-3.5 h-3.5" aria-hidden="true" />
          )}
        </div>

        {/* Friendly Work & Wi-Fi Filter */}
        <button
          type="button"
          onClick={onToggleWorkFriendly}
          aria-pressed={workFriendlyOnly}
          className={`emil-press self-start sm:self-auto px-3.5 py-1.5 rounded-ghost text-xs uppercase font-medium border transition-colors flex items-center gap-2 focus-visible:ring-1 focus-visible:ring-warm-cream ${
            workFriendlyOnly
              ? "bg-bark-brown text-warm-cream border-warm-cream/40"
              : "border-cork-border text-driftwood hover:text-warm-cream hover:border-warm-cream/30"
          }`}
        >
          <Laptop className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Good for Work & Wi-Fi</span>
        </button>
      </div>

      {/* Neighborhood Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs uppercase font-medium scrollbar-none">
        <button
          type="button"
          onClick={() => onSelectTownship("ALL")}
          aria-pressed={selectedTownship === "ALL"}
          className={`emil-press px-3.5 py-1.5 rounded-pill border transition-colors whitespace-nowrap focus-visible:ring-1 focus-visible:ring-warm-cream ${
            selectedTownship === "ALL"
              ? "bg-bark-brown text-warm-cream border-warm-cream/40"
              : "border-warm-cream/20 text-warm-cream/80 hover:border-warm-cream"
          }`}
        >
          All Neighborhoods
        </button>

        {availableTownships.map((township) => (
          <button
            key={township}
            type="button"
            onClick={() => onSelectTownship(township)}
            aria-pressed={selectedTownship === township}
            className={`emil-press px-3 py-1.5 rounded-ghost border transition-colors whitespace-nowrap focus-visible:ring-1 focus-visible:ring-warm-cream ${
              selectedTownship === township
                ? "bg-bark-brown text-warm-cream border-warm-cream/40"
                : "border-cork-border text-driftwood hover:text-warm-cream hover:border-warm-cream/30"
            }`}
          >
            {township}
          </button>
        ))}
      </div>
    </div>
  );
}
