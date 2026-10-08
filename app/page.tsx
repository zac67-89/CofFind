"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { Cafe } from "@/types/cafe";
import { Header } from "@/components/layout/Header";
import { FilterBar } from "@/components/cafe/FilterBar";
import { CafeCard } from "@/components/cafe/CafeCard";
import { CafeDetailModal } from "@/components/cafe/CafeDetailModal";
import { Footer } from "@/components/layout/Footer";
import initialCafesData from "@/data/cafes.json";
import { Compass, RotateCcw, Loader2 } from "lucide-react";

// Client-only dynamic Leaflet Map (Free OpenStreetMap - Zero API Key)
const LeafletMap = dynamic(() => import("@/components/map/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] rounded-card border border-cork-border flex flex-col items-center justify-center text-driftwood text-xs uppercase gap-2 bg-walnut-shadow select-none">
      <Compass className="w-6 h-6 animate-spin text-ember-accent" aria-hidden="true" />
      <span>Opening Yangon Map...</span>
    </div>
  ),
});

const ITEMS_PER_PAGE = 12;

export default function HomePage() {
  const [cafes] = useState<Cafe[]>(initialCafesData as Cafe[]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTownship, setSelectedTownship] = useState("ALL");
  const [workFriendlyOnly, setWorkFriendlyOnly] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "map">("cards");

  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const [modalCafe, setModalCafe] = useState<Cafe | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Infinite Scrolling State
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Load favorites from LocalStorage (US-043)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("coffind_favorites");
      if (stored) {
        setFavorites(JSON.parse(stored));
      } else {
        setFavorites(["yangon-cafe-001"]);
      }
    } catch (e) {
      console.warn("Could not access localStorage", e);
    }
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem("coffind_favorites", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // Derive neighborhood options
  const availableTownships = useMemo(() => {
    const set = new Set<string>();
    cafes.forEach((c) => {
      if (c.township && c.township !== "Yangon") set.add(c.township);
    });
    return Array.from(set).sort();
  }, [cafes]);

  // Filtering engine (US-009, US-010, US-012, US-015)
  const filteredCafes = useMemo(() => {
    return cafes.filter((cafe) => {
      if (showFavoritesOnly && !favorites.includes(cafe.id)) {
        return false;
      }

      if (selectedTownship !== "ALL" && cafe.township !== selectedTownship) {
        return false;
      }

      if (workFriendlyOnly) {
        const isWf =
          cafe.amenities?.some((a) =>
            ["Work Friendly", "Study Friendly", "Wi-Fi"].includes(a)
          ) || cafe.category.toLowerCase().includes("work");
        if (!isWf) return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const keywords = query.split(/\s+/);
        const searchableText = `${cafe.name} ${cafe.name_mm || ""} ${cafe.township} ${
          cafe.address
        } ${cafe.category} ${cafe.amenities?.join(" ") || ""} ${cafe.description}`.toLowerCase();

        const allMatched = keywords.every((kw) => searchableText.includes(kw));
        if (!allMatched) return false;
      }

      return true;
    });
  }, [cafes, searchQuery, selectedTownship, workFriendlyOnly, showFavoritesOnly, favorites]);

  // Reset pagination whenever filters or search query change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [searchQuery, selectedTownship, workFriendlyOnly, showFavoritesOnly]);

  // Infinite Scroll IntersectionObserver
  useEffect(() => {
    if (viewMode !== "cards") return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, filteredCafes.length));
        }
      },
      { rootMargin: "250px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [viewMode, filteredCafes.length]);

  const currentlyVisibleCafes = useMemo(() => {
    return filteredCafes.slice(0, visibleCount);
  }, [filteredCafes, visibleCount]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedTownship("ALL");
    setWorkFriendlyOnly(false);
    setShowFavoritesOnly(false);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  return (
    <main className="min-h-screen px-4 md:px-8 py-6 max-w-7xl mx-auto space-y-6 select-none">
      {/* Top Navigation */}
      <Header
        favoritesCount={favorites.length}
        showFavoritesOnly={showFavoritesOnly}
        onShowFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Hero Welcome (Clear, warm, non-technical) */}
      <section aria-labelledby="page-heading" className="space-y-1.5 pt-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium uppercase tracking-widest text-ember-accent">
            YANGON COFFEE GUIDE
          </span>
          <span className="text-driftwood text-xs">·</span>
          <span className="text-xs text-driftwood">
            {filteredCafes.length} places to explore
          </span>
        </div>

        <h1
          id="page-heading"
          className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight uppercase leading-[0.95] text-warm-cream"
        >
          Discover Great Coffee in Yangon.
        </h1>
        <p className="text-sm md:text-base text-warm-cream/80 max-w-2xl font-normal pt-1">
          Explore quiet work sanctuaries, specialty roasters, and historic tea spots across the city.
        </p>
      </section>

      {/* Filter and Search Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedTownship={selectedTownship}
        onSelectTownship={setSelectedTownship}
        workFriendlyOnly={workFriendlyOnly}
        onToggleWorkFriendly={() => setWorkFriendlyOnly(!workFriendlyOnly)}
        availableTownships={availableTownships}
      />

      {/* Accessible Live Region for search feedback */}
      <div role="status" aria-live="polite" className="sr-only">
        {filteredCafes.length} cafés available matching your selection.
      </div>

      {/* View Mode: Card Grid View (User Request) */}
      {viewMode === "cards" && (
        <section aria-label="Cafés List" className="space-y-6 pt-2">
          {currentlyVisibleCafes.length > 0 ? (
            <>
              {/* Responsive Card Grid (1 col on mobile, 2 cols on tablet, 3 cols on desktop) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
                {currentlyVisibleCafes.map((cafe) => (
                  <CafeCard
                    key={cafe.id}
                    cafe={cafe}
                    isFavorite={favorites.includes(cafe.id)}
                    onToggleFavorite={toggleFavorite}
                    onSelect={(c) => {
                      setSelectedCafe(c);
                      setModalCafe(c);
                    }}
                    isSelected={selectedCafe?.id === cafe.id}
                  />
                ))}
              </div>

              {/* Infinite Scroll Sentinel & Status */}
              <div ref={sentinelRef} className="py-6 flex flex-col items-center justify-center text-xs text-driftwood gap-2">
                {visibleCount < filteredCafes.length ? (
                  <div className="flex items-center gap-2 text-warm-cream/70">
                    <Loader2 className="w-4 h-4 animate-spin text-ember-accent" aria-hidden="true" />
                    <span>Loading more spots...</span>
                  </div>
                ) : (
                  <span className="text-driftwood">
                    You have seen all {filteredCafes.length} cafés in this list.
                  </span>
                )}
              </div>
            </>
          ) : (
            /* Friendly Empty State */
            <div className="border border-cork-border rounded-card p-12 text-center space-y-3 bg-walnut-shadow max-w-md mx-auto my-8">
              <span className="text-3xl" aria-hidden="true">☕</span>
              <h2 className="text-lg uppercase font-medium text-warm-cream">
                No cafés found
              </h2>
              <p className="text-xs text-driftwood leading-relaxed">
                We couldn&apos;t find any cafés matching your search terms. Try picking another neighborhood or clearing your filter.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="emil-press px-4 py-2 rounded-ghost border border-warm-cream text-xs uppercase font-medium text-warm-cream hover:bg-warm-cream/10 inline-flex items-center gap-2 mt-2 focus-visible:ring-1 focus-visible:ring-warm-cream"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Show all cafés</span>
              </button>
            </div>
          )}
        </section>
      )}

      {/* View Mode: Interactive OpenStreetMap (Free, Zero API Key) */}
      {viewMode === "map" && (
        <section aria-label="Interactive Map" className="space-y-4 pt-2">
          <div className="bg-walnut-shadow border border-cork-border rounded-card p-4 h-[600px] flex flex-col">
            <div className="flex justify-between items-center pb-3 dashed-divider text-xs text-driftwood">
              <span className="uppercase font-medium text-warm-cream">Yangon Map Explorer</span>
              <span>Showing {filteredCafes.length} locations · Free OpenStreetMap</span>
            </div>
            <div className="flex-1 my-2 overflow-hidden rounded-[8px]">
              <LeafletMap
                cafes={filteredCafes}
                selectedCafe={selectedCafe}
                onSelectCafe={(c) => {
                  setSelectedCafe(c);
                  setModalCafe(c);
                }}
              />
            </div>
            <p className="text-[11px] text-driftwood text-center pt-1">
              Click any pin to view opening hours, community ratings, and directions.
            </p>
          </div>
        </section>
      )}

      {/* Café Detail Modal */}
      <CafeDetailModal
        cafe={modalCafe}
        onClose={() => setModalCafe(null)}
        isFavorite={modalCafe ? favorites.includes(modalCafe.id) : false}
        onToggleFavorite={toggleFavorite}
      />

      {/* Editorial Footer */}
      <Footer />
    </main>
  );
}
