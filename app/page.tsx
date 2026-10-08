"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { Cafe } from "@/types/cafe";
import { Header } from "@/components/layout/Header";
import { FilterBar } from "@/components/cafe/FilterBar";
import { CafeCard } from "@/components/cafe/CafeCard";
import { Footer } from "@/components/layout/Footer";
import initialCafesData from "@/data/cafes.json";
import { SolarCompass, SolarCup, SolarRotate } from "@/components/icons/SolarIcons";
import { Loader2 } from "lucide-react";

// Client-only dynamic Leaflet Map (Warm Voyager Tiles)
const LeafletMap = dynamic(() => import("@/components/map/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] rounded-2xl border border-cafe-border flex flex-col items-center justify-center text-cafe-hazelnut text-xs gap-3 bg-white shadow-cafe select-none">
      <SolarCompass size={24} className="text-cafe-caramel animate-spin" />
      <span className="font-medium">Loading Yangon Map...</span>
    </div>
  ),
});

const ITEMS_PER_PAGE = 12;

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function HomePage() {
  const [cafes] = useState<Cafe[]>(initialCafesData as Cafe[]);
  const [language, setLanguage] = useState<"en" | "mm">("en");

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTownship, setSelectedTownship] = useState("ALL");
  const [stillOpenOnly, setStillOpenOnly] = useState(false);
  const [wifiOnly, setWifiOnly] = useState(false);
  const [workFriendlyOnly, setWorkFriendlyOnly] = useState(false);
  const [petFriendlyOnly, setPetFriendlyOnly] = useState(false);
  const [ratingOver4Only, setRatingOver4Only] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "map">("cards");

  // Geolocation state
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationPrompt, setLocationPrompt] = useState(false);

  // Selected Cafe for map pin highlighting
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Infinite Scrolling State
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Load preferences from localStorage
  useEffect(() => {
    try {
      const storedFavs = localStorage.getItem("coffind_favorites");
      if (storedFavs) {
        setFavorites(JSON.parse(storedFavs));
      } else {
        setFavorites(["yangon-cafe-001"]);
      }

      const storedLang = localStorage.getItem("coffind_lang") as "en" | "mm";
      if (storedLang) {
        setLanguage(storedLang);
      }
    } catch (e) {
      console.warn("Could not access localStorage", e);
    }
  }, []);

  const handleLanguageChange = (lang: "en" | "mm") => {
    setLanguage(lang);
    try {
      localStorage.setItem("coffind_lang", lang);
    } catch (e) {}
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem("coffind_favorites", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // Geolocation request handler
  const requestLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLocationPrompt(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationPrompt(false);
      },
      (error) => {
        console.warn("Geolocation permission denied or unavailable", error);
        setLocationPrompt(false);
        alert("Location access was denied. You can still search by township.");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Derive unique township options
  const availableTownships = useMemo(() => {
    const set = new Set<string>();
    cafes.forEach((c) => {
      if (c.township && c.township !== "Yangon") set.add(c.township);
    });
    return Array.from(set).sort();
  }, [cafes]);

  // Check if any filter is active
  const hasActiveFilters = Boolean(
    searchQuery.trim() ||
      selectedTownship !== "ALL" ||
      stillOpenOnly ||
      wifiOnly ||
      workFriendlyOnly ||
      petFriendlyOnly ||
      ratingOver4Only ||
      showFavoritesOnly
  );

  // Filtering engine with user location sorting
  const filteredCafes = useMemo(() => {
    let list = cafes.filter((cafe) => {
      if (showFavoritesOnly && !favorites.includes(cafe.id)) {
        return false;
      }

      if (selectedTownship !== "ALL" && cafe.township !== selectedTownship) {
        return false;
      }

      if (stillOpenOnly && !cafe.open_now) {
        return false;
      }

      if (wifiOnly && !cafe.has_wifi && !cafe.amenities?.includes("Wi-Fi")) {
        return false;
      }

      if (workFriendlyOnly && !cafe.work_friendly && !cafe.amenities?.includes("Work Friendly")) {
        return false;
      }

      if (petFriendlyOnly && !cafe.pet_friendly && !cafe.amenities?.includes("Pet Friendly")) {
        return false;
      }

      if (ratingOver4Only && cafe.rating < 4.0) {
        return false;
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

    // If userLocation is available, calculate distances and sort by closest
    if (userLocation) {
      list = list.map((c) => {
        const dist = calculateDistanceKm(
          userLocation.lat,
          userLocation.lng,
          c.latitude,
          c.longitude
        );
        return { ...c, distance_km: dist };
      });
      list.sort((a, b) => (a.distance_km || 0) - (b.distance_km || 0));
    }

    return list;
  }, [
    cafes,
    searchQuery,
    selectedTownship,
    stillOpenOnly,
    wifiOnly,
    workFriendlyOnly,
    petFriendlyOnly,
    ratingOver4Only,
    showFavoritesOnly,
    favorites,
    userLocation,
  ]);

  // Reset pagination on filter changes
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [
    searchQuery,
    selectedTownship,
    stillOpenOnly,
    wifiOnly,
    workFriendlyOnly,
    petFriendlyOnly,
    ratingOver4Only,
    showFavoritesOnly,
  ]);

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
      { rootMargin: "300px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [viewMode, filteredCafes.length]);

  const currentlyVisibleCafes = useMemo(() => {
    return filteredCafes.slice(0, visibleCount);
  }, [filteredCafes, visibleCount]);

  const resetAllFilters = () => {
    setSearchQuery("");
    setSelectedTownship("ALL");
    setStillOpenOnly(false);
    setWifiOnly(false);
    setWorkFriendlyOnly(false);
    setPetFriendlyOnly(false);
    setRatingOver4Only(false);
    setShowFavoritesOnly(false);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  return (
    <main className="min-h-screen px-4 md:px-8 py-6 max-w-7xl mx-auto space-y-6 select-none">
      {/* Top Navigation Header */}
      <Header
        favoritesCount={favorites.length}
        showFavoritesOnly={showFavoritesOnly}
        onShowFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        language={language}
        onLanguageChange={handleLanguageChange}
      />

      {/* Hero Welcome (Warm light cafe theme, zero emojis, clean visual hierarchy) */}
      <section aria-labelledby="page-heading" className="space-y-3 pt-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cafe-warm-bg text-cafe-caramel border border-cafe-border text-xs font-semibold uppercase tracking-wider">
            <SolarCompass size={14} className="text-cafe-caramel" />
            <span>Yangon Coffee Directory</span>
          </span>
          <span className="text-cafe-muted text-xs">·</span>
          <span className="text-xs text-cafe-hazelnut font-medium">
            {filteredCafes.length} places to explore
          </span>
        </div>

        <h1
          id="page-heading"
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-cafe-espresso leading-tight"
        >
          Find your next cozy corner for coffee & work.
        </h1>
        <p className="text-sm md:text-base text-cafe-hazelnut max-w-2xl font-normal leading-relaxed">
          Discover tranquil work sanctuaries, specialty single-origin roasters, and historic neighborhood tea houses across Yangon.
        </p>
      </section>

      {/* Filter Bar with all 6 filters */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedTownship={selectedTownship}
        onSelectTownship={setSelectedTownship}
        stillOpenOnly={stillOpenOnly}
        onToggleStillOpen={() => setStillOpenOnly(!stillOpenOnly)}
        wifiOnly={wifiOnly}
        onToggleWifi={() => setWifiOnly(!wifiOnly)}
        workFriendlyOnly={workFriendlyOnly}
        onToggleWorkFriendly={() => setWorkFriendlyOnly(!workFriendlyOnly)}
        petFriendlyOnly={petFriendlyOnly}
        onTogglePetFriendly={() => setPetFriendlyOnly(!petFriendlyOnly)}
        ratingOver4Only={ratingOver4Only}
        onToggleRatingOver4={() => setRatingOver4Only(!ratingOver4Only)}
        availableTownships={availableTownships}
        onRequestLocation={requestLocation}
        userLocation={userLocation}
        onResetFilters={resetAllFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* View Mode: Card Grid View */}
      {viewMode === "cards" && (
        <section aria-label="Cafes List" className="space-y-6 pt-2">
          {currentlyVisibleCafes.length > 0 ? (
            <>
              {/* Responsive 3-Column Card Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                {currentlyVisibleCafes.map((cafe) => (
                  <CafeCard
                    key={cafe.id}
                    cafe={cafe}
                    isFavorite={favorites.includes(cafe.id)}
                    onToggleFavorite={toggleFavorite}
                    language={language}
                  />
                ))}
              </div>

              {/* Infinite Scroll Sentinel */}
              <div
                ref={sentinelRef}
                className="py-8 flex flex-col items-center justify-center text-xs text-cafe-hazelnut gap-2"
              >
                {visibleCount < filteredCafes.length ? (
                  <div className="flex items-center gap-2 text-cafe-espresso font-medium">
                    <Loader2 className="w-4 h-4 animate-spin text-cafe-caramel" aria-hidden="true" />
                    <span>Loading more spots...</span>
                  </div>
                ) : (
                  <span className="text-cafe-muted">
                    You have seen all {filteredCafes.length} cafes in this list.
                  </span>
                )}
              </div>
            </>
          ) : (
            /* Friendly Empty State */
            <div className="bg-white border border-cafe-border rounded-2xl p-12 text-center space-y-4 max-w-md mx-auto my-8 shadow-cafe">
              <div className="w-12 h-12 rounded-full bg-cafe-warm-bg text-cafe-caramel flex items-center justify-center mx-auto">
                <SolarCup size={24} />
              </div>
              <h2 className="text-lg font-bold text-cafe-espresso">
                No cafes found
              </h2>
              <p className="text-xs text-cafe-hazelnut leading-relaxed">
                We couldn&apos;t find any cafes matching your search terms or active filters. Try clearing some filters or picking another neighborhood.
              </p>
              <button
                type="button"
                onClick={resetAllFilters}
                className="emil-press px-5 py-2.5 rounded-full bg-cafe-caramel text-white text-xs font-semibold hover:bg-cafe-caramel-hover inline-flex items-center gap-2 shadow-sm"
              >
                <SolarRotate size={14} />
                <span>Show all cafes</span>
              </button>
            </div>
          )}
        </section>
      )}

      {/* View Mode: Interactive OpenStreetMap */}
      {viewMode === "map" && (
        <section aria-label="Interactive Map" className="space-y-4 pt-2">
          <div className="bg-white border border-cafe-border rounded-2xl p-4 h-[650px] flex flex-col shadow-cafe">
            <div className="flex justify-between items-center pb-3 border-b border-cafe-border text-xs text-cafe-hazelnut">
              <span className="font-bold text-cafe-espresso">Yangon Map Explorer</span>
              <span>Showing {filteredCafes.length} cafes · Click pin for details</span>
            </div>
            <div className="flex-1 my-2 overflow-hidden rounded-xl">
              <LeafletMap
                cafes={filteredCafes}
                selectedCafe={selectedCafe}
                onSelectCafe={(c) => setSelectedCafe(c)}
                language={language}
                userLocation={userLocation}
                onRequestLocation={requestLocation}
              />
            </div>
          </div>
        </section>
      )}

      {/* Editorial Footer */}
      <Footer />
    </main>
  );
}
