"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Cafe } from "@/types/cafe";
import { Header } from "@/components/layout/Header";
import { FilterBar } from "@/components/cafe/FilterBar";
import { CafeCard } from "@/components/cafe/CafeCard";
import { Footer } from "@/components/layout/Footer";
import { Toast } from "@/components/ui/Toast";
import initialCafesData from "@/data/cafes.json";
import { SolarCup, SolarRotate, SolarMapPoint } from "@/components/icons/SolarIcons";
import { getCopy, type Lang } from "@/lib/copy";
import { isOpenNow, withDisplayFields } from "@/lib/cafe-utils";
import { Loader2 } from "lucide-react";

const ITEMS_PER_PAGE = 12;
const NEARBY_LIMIT = 24;
const POPULAR_TOWNSHIPS = ["Bahan", "Downtown", "Kamayut", "Sanchaung", "Yankin", "Dagon"];

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function HomePage() {
  const cafes = useMemo(
    () => (initialCafesData as Cafe[]).map(withDisplayFields),
    []
  );
  const [language, setLanguage] = useState<Lang>("en");
  const t = getCopy(language);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTownship, setSelectedTownship] = useState("");
  const [stillOpenOnly, setStillOpenOnly] = useState(false);
  const [wifiOnly, setWifiOnly] = useState(false);
  const [workFriendlyOnly, setWorkFriendlyOnly] = useState(false);
  const [petFriendlyOnly, setPetFriendlyOnly] = useState(false);
  const [ratingOver4Only, setRatingOver4Only] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const urlReady = useRef(false);

  useEffect(() => {
    try {
      const storedFavs = localStorage.getItem("coffind_favorites");
      if (storedFavs) setFavorites(JSON.parse(storedFavs));
    } catch (e) {
      console.warn("Could not access localStorage", e);
    }

    const params = new URLSearchParams(window.location.search);
    const township = params.get("township") || "";
    const q = params.get("q") || "";
    const lang = params.get("lang");
    const saved = params.get("saved") === "1";
    if (township) setSelectedTownship(township);
    if (q) setSearchQuery(q);
    if (lang === "en" || lang === "mm") {
      setLanguage(lang);
    } else {
      try {
        const storedLang = localStorage.getItem("coffind_lang") as Lang;
        if (storedLang === "en" || storedLang === "mm") setLanguage(storedLang);
      } catch (e) {}
    }
    if (saved) setShowFavoritesOnly(true);
    urlReady.current = true;
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "mm" ? "my" : "en";
  }, [language]);

  useEffect(() => {
    if (!urlReady.current) return;
    const params = new URLSearchParams();
    if (selectedTownship) params.set("township", selectedTownship);
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (language === "mm") params.set("lang", "mm");
    if (showFavoritesOnly) params.set("saved", "1");
    const next = params.toString();
    const path = `${window.location.pathname}${next ? `?${next}` : ""}`;
    window.history.replaceState(null, "", path);
    try {
      localStorage.setItem("coffind_lang", language);
    } catch (e) {}
  }, [selectedTownship, searchQuery, language, showFavoritesOnly]);

  const handleLanguageChange = (lang: Lang) => {
    setLanguage(lang);
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

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setToastMessage(t.locationUnsupported);
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocating(false);
      },
      (error) => {
        console.warn("Geolocation permission denied or unavailable", error);
        setLocating(false);
        setToastMessage(t.locationDenied);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const availableTownships = useMemo(() => {
    const set = new Set<string>();
    cafes.forEach((c) => {
      if (c.township && c.township !== "Yangon") set.add(c.township);
    });
    return Array.from(set).sort();
  }, [cafes]);

  const hasBrowseScope = Boolean(
    searchQuery.trim() || selectedTownship !== "" || userLocation || showFavoritesOnly
  );

  const hasActiveFilters = Boolean(
    searchQuery.trim() ||
      selectedTownship !== "" ||
      stillOpenOnly ||
      wifiOnly ||
      workFriendlyOnly ||
      petFriendlyOnly ||
      ratingOver4Only ||
      showFavoritesOnly ||
      userLocation
  );

  const filteredCafes = useMemo(() => {
    let list = cafes.filter((cafe) => {
      if (showFavoritesOnly && !favorites.includes(cafe.id)) {
        return false;
      }

      if (selectedTownship && selectedTownship !== "ALL" && cafe.township !== selectedTownship) {
        return false;
      }

      if (stillOpenOnly && isOpenNow(cafe.opening_hours) !== true) {
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

      const locationOnly =
        selectedTownship === "" && !searchQuery.trim() && !showFavoritesOnly;
      if (locationOnly) {
        list = list.slice(0, NEARBY_LIMIT);
      }
    } else if (selectedTownship === "ALL") {
      list.sort(
        (a, b) => b.rating - a.rating || (b.reviews_count || 0) - (a.reviews_count || 0)
      );
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
    userLocation,
  ]);

  useEffect(() => {
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
  }, [filteredCafes.length]);

  const currentlyVisibleCafes = useMemo(() => {
    return filteredCafes.slice(0, visibleCount);
  }, [filteredCafes, visibleCount]);

  const resetAllFilters = () => {
    setSearchQuery("");
    setSelectedTownship("");
    setStillOpenOnly(false);
    setWifiOnly(false);
    setWorkFriendlyOnly(false);
    setPetFriendlyOnly(false);
    setRatingOver4Only(false);
    setShowFavoritesOnly(false);
    setUserLocation(null);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  return (
    <main
      lang={language === "mm" ? "my" : "en"}
      className="min-h-screen px-4 md:px-8 py-6 max-w-7xl mx-auto space-y-5"
    >
      <Header
        favoritesCount={favorites.length}
        showFavoritesOnly={showFavoritesOnly}
        onShowFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
        language={language}
        onLanguageChange={handleLanguageChange}
      />

      <section aria-labelledby="page-heading" className="pt-1">
        <h1
          id="page-heading"
          className={`text-3xl sm:text-4xl font-bold tracking-tight text-cafe-espresso ${
            language === "mm" ? "leading-[1.85]" : "leading-tight"
          }`}
        >
          {t.heroTitle}
        </h1>
        <p
          className={`mt-2 text-sm md:text-base text-cafe-hazelnut max-w-2xl ${
            language === "mm" ? "leading-[2.25]" : "leading-relaxed"
          }`}
        >
          {t.heroBody}
        </p>
        {hasBrowseScope && (
          <p className="mt-2 text-sm text-cafe-hazelnut font-medium">
            {t.resultsCount(filteredCafes.length)}
          </p>
        )}
      </section>

      <div className="sticky top-0 z-20 -mx-4 md:-mx-8 px-4 md:px-8 py-3 bg-cafe-cream/95 backdrop-blur-sm">
        <FilterBar
          language={language}
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
          popularTownships={POPULAR_TOWNSHIPS.filter((township) =>
            availableTownships.includes(township)
          )}
          onRequestLocation={requestLocation}
          userLocation={userLocation}
          locating={locating}
          onResetFilters={resetAllFilters}
          hasActiveFilters={hasActiveFilters}
          showAmenityFilters={hasBrowseScope}
          highlightTownships={!hasBrowseScope}
        />
      </div>

      <section aria-label="Cafes List" className="space-y-6 pt-1">
        {!hasBrowseScope ? (
          <div
            role="status"
            className="bg-white border border-dashed border-cafe-caramel/40 rounded-2xl p-8 sm:p-10 text-center space-y-3 max-w-xl mx-auto"
          >
            <div className="w-12 h-12 rounded-full bg-cafe-warm-bg text-cafe-caramel flex items-center justify-center mx-auto">
              <SolarMapPoint size={24} />
            </div>
            <h2 className="text-lg font-bold text-cafe-espresso">{t.startTitle}</h2>
            <p
              className={`text-sm text-cafe-hazelnut max-w-md mx-auto ${
                language === "mm" ? "leading-[2.15]" : "leading-relaxed"
              }`}
            >
              {t.startBody}
            </p>
          </div>
        ) : currentlyVisibleCafes.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {currentlyVisibleCafes.map((cafe) => (
                <CafeCard
                  key={cafe.id}
                  cafe={cafe}
                  isFavorite={favorites.includes(cafe.id)}
                  onToggleFavorite={toggleFavorite}
                  language={language}
                  showDistance={Boolean(userLocation)}
                />
              ))}
            </div>

            <div
              ref={sentinelRef}
              className="py-8 flex flex-col items-center justify-center text-sm text-cafe-hazelnut gap-2"
            >
              {visibleCount < filteredCafes.length ? (
                <div className="flex items-center gap-2 text-cafe-espresso font-medium">
                  <Loader2 className="w-4 h-4 animate-spin text-cafe-caramel" aria-hidden="true" />
                  <span>{t.loadingMore}</span>
                </div>
              ) : (
                <span>{t.seenAll(filteredCafes.length)}</span>
              )}
            </div>
          </>
        ) : (
          <div className="bg-white border border-cafe-border rounded-2xl p-12 text-center space-y-4 max-w-md mx-auto my-8 shadow-cafe">
            <div className="w-12 h-12 rounded-full bg-cafe-warm-bg text-cafe-caramel flex items-center justify-center mx-auto">
              <SolarCup size={24} />
            </div>
            <h2 className="text-lg font-bold text-cafe-espresso">{t.emptyTitle}</h2>
            <p
              className={`text-sm text-cafe-hazelnut ${
                language === "mm" ? "leading-[2.15]" : "leading-relaxed"
              }`}
            >
              {t.emptyBody}
            </p>
            <button
              type="button"
              onClick={resetAllFilters}
              className="emil-press min-h-11 px-5 py-2.5 rounded-full bg-cafe-caramel text-white text-sm font-semibold hover:bg-cafe-caramel-hover inline-flex items-center gap-2 shadow-sm"
            >
              <SolarRotate size={14} />
              <span>{t.startOver}</span>
            </button>
          </div>
        )}
      </section>

      <Footer language={language} />

      {toastMessage && (
        <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
      )}
    </main>
  );
}
