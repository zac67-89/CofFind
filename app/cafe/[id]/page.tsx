"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Cafe } from "@/types/cafe";
import initialCafesData from "@/data/cafes.json";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  SolarArrowLeft,
  SolarHeart,
  SolarStar,
  SolarClockCircle,
  SolarMapPoint,
  SolarPhone,
  SolarGlobe,
  SolarNavigation,
  SolarCheckCircle,
  SolarCup,
} from "@/components/icons/SolarIcons";

export default function CafeDetailPage() {
  const params = useParams();
  const cafeId = params?.id as string;

  const [language, setLanguage] = useState<"en" | "mm">("en");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  // Load favorites from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("coffind_favorites");
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
      const storedLang = localStorage.getItem("coffind_lang") as "en" | "mm";
      if (storedLang) {
        setLanguage(storedLang);
      }
    } catch (e) {
      console.warn("localStorage access issue", e);
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

  const cafe = (initialCafesData as Cafe[]).find((c) => c.id === cafeId);

  if (!cafe) {
    return (
      <main className="min-h-screen px-4 md:px-8 py-6 max-w-7xl mx-auto flex flex-col justify-between select-none">
        <Header
          favoritesCount={favorites.length}
          showFavoritesOnly={false}
          onShowFavorites={() => {}}
          viewMode="cards"
          onViewModeChange={() => {}}
          language={language}
          onLanguageChange={handleLanguageChange}
        />
        <div className="text-center py-24 space-y-4">
          <div className="w-12 h-12 rounded-full bg-cafe-warm-bg text-cafe-caramel flex items-center justify-center mx-auto">
            <SolarCup size={24} />
          </div>
          <h1 className="text-2xl font-bold text-cafe-espresso">Cafe Not Found</h1>
          <p className="text-sm text-cafe-hazelnut">
            The cafe you are looking for could not be found or has been moved.
          </p>
          <Link
            href="/"
            className="emil-press inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cafe-caramel text-white text-xs font-semibold hover:bg-cafe-caramel-hover transition-colors"
          >
            <SolarArrowLeft size={16} />
            <span>Return to Cafe Guide</span>
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const isFav = favorites.includes(cafe.id);
  const displayName = language === "mm" && cafe.name_mm ? cafe.name_mm : cafe.name;

  const photos =
    cafe.photos && cafe.photos.length > 0
      ? cafe.photos
      : [
          "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80",
        ];

  const mapDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${cafe.name} ${cafe.address}`
  )}`;

  return (
    <main className="min-h-screen px-4 md:px-8 py-6 max-w-7xl mx-auto space-y-8 select-none">
      {/* Top Header */}
      <Header
        favoritesCount={favorites.length}
        showFavoritesOnly={false}
        onShowFavorites={() => {}}
        viewMode="cards"
        onViewModeChange={() => {}}
        language={language}
        onLanguageChange={handleLanguageChange}
      />

      {/* Back Button & Save Action */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="emil-press inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-cafe-border text-cafe-espresso text-xs font-semibold hover:border-cafe-border-hover shadow-cafe transition-colors"
        >
          <SolarArrowLeft size={16} />
          <span>Back to all cafes</span>
        </Link>

        <button
          type="button"
          onClick={() => toggleFavorite(cafe.id)}
          className={`emil-press px-4 py-2 rounded-full border text-xs font-semibold flex items-center gap-2 transition-all ${
            isFav
              ? "bg-cafe-caramel text-white border-cafe-caramel shadow-sm"
              : "bg-white border-cafe-border text-cafe-espresso hover:border-cafe-border-hover shadow-cafe"
          }`}
        >
          <SolarHeart
            size={16}
            filled={isFav}
            className={isFav ? "text-white" : "text-cafe-caramel"}
          />
          <span>{isFav ? "Saved to favorites" : "Save to favorites"}</span>
        </button>
      </div>

      {/* Photo Gallery Section */}
      <section aria-label="Cafe Photos" className="space-y-3">
        {/* Main Displayed Photo */}
        <div className="relative h-64 sm:h-96 md:h-[440px] w-full rounded-2xl overflow-hidden bg-cafe-warm-bg shadow-cafe border border-cafe-border">
          <img
            src={photos[selectedPhotoIndex] || photos[0]}
            alt={displayName}
            className="w-full h-full object-cover transition-opacity duration-300 outline outline-1 outline-black/5"
          />
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                cafe.open_now ? "bg-cafe-green" : "bg-cafe-muted"
              }`}
            />
            <span className={cafe.open_now ? "text-cafe-green" : "text-cafe-muted"}>
              {cafe.open_now ? "Open right now" : "Currently closed"}
            </span>
          </div>
        </div>

        {/* Thumbnail Selector */}
        {photos.length > 1 && (
          <div className="grid grid-cols-4 gap-3">
            {photos.map((url, idx) => (
              <button
                key={url + idx}
                type="button"
                onClick={() => setSelectedPhotoIndex(idx)}
                className={`emil-press relative h-20 sm:h-24 rounded-xl overflow-hidden border-2 transition-all ${
                  selectedPhotoIndex === idx
                    ? "border-cafe-caramel shadow-sm scale-[0.98]"
                    : "border-transparent opacity-75 hover:opacity-100"
                }`}
              >
                <img
                  src={url}
                  alt={`${displayName} photo ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Main Content Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Details, Description, Amenities, Reviews (7 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Cafe Header & Badges */}
          <div className="bg-white border border-cafe-border rounded-2xl p-6 sm:p-7 shadow-cafe space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cafe-warm-bg text-cafe-caramel border border-cafe-border text-xs font-semibold uppercase tracking-wider">
                {cafe.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-cafe-cream text-cafe-hazelnut border border-cafe-border text-xs font-medium">
                {cafe.township} Township
              </span>
              <span className="px-3 py-1 rounded-full bg-cafe-cream text-cafe-hazelnut border border-cafe-border text-xs font-medium">
                {cafe.price_level}
              </span>
            </div>

            {/* Prominent Single Cafe Title */}
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-cafe-espresso">
              {displayName}
            </h1>

            {/* Rating Banner */}
            <div className="flex items-center gap-3 pt-1 border-t border-cafe-border/70 text-xs sm:text-sm">
              <div className="flex items-center gap-1.5 text-cafe-terracotta font-bold">
                <SolarStar size={18} filled={true} className="text-cafe-terracotta" />
                <span className="text-base text-cafe-espresso font-bold">
                  {cafe.rating.toFixed(1)}
                </span>
                <span className="text-cafe-hazelnut font-normal">
                  out of 5.0
                </span>
              </div>
              <span className="text-cafe-border">·</span>
              <span className="text-cafe-hazelnut">
                {cafe.reviews_count.toLocaleString()} community reviews
              </span>
            </div>
          </div>

          {/* Description Section (Bright, Readable, High Contrast) */}
          <div className="bg-white border border-cafe-border rounded-2xl p-6 sm:p-7 shadow-cafe space-y-3">
            <h2 className="text-base font-bold text-cafe-espresso uppercase tracking-wider">
              About This Cafe
            </h2>
            <p className="text-sm sm:text-base text-cafe-espresso leading-relaxed font-normal">
              {cafe.description}
            </p>
          </div>

          {/* Amenities & Highlights */}
          {cafe.amenities && cafe.amenities.length > 0 && (
            <div className="bg-white border border-cafe-border rounded-2xl p-6 sm:p-7 shadow-cafe space-y-4">
              <h2 className="text-base font-bold text-cafe-espresso uppercase tracking-wider">
                Amenities & Features
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {cafe.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-cafe-cream border border-cafe-border text-xs font-medium text-cafe-espresso"
                  >
                    <SolarCheckCircle size={16} className="text-cafe-green flex-shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Community Ratings & Verified Reviews */}
          <section aria-label="Ratings & Reviews" className="bg-white border border-cafe-border rounded-2xl p-6 sm:p-7 shadow-cafe space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-cafe-espresso uppercase tracking-wider">
                  Community Rating
                </h2>
                <p className="text-xs text-cafe-hazelnut mt-0.5">
                  Based on {cafe.reviews_count.toLocaleString()} ratings from Google Maps & OpenStreetMap
                </p>
              </div>

              <div className="flex items-center gap-3 bg-cafe-cream px-4 py-2.5 rounded-2xl border border-cafe-border">
                <span className="text-2xl font-bold text-cafe-espresso">
                  {cafe.rating.toFixed(1)}
                </span>
                <div className="flex items-center gap-0.5 text-cafe-terracotta">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <SolarStar
                      key={star}
                      size={16}
                      filled={star <= Math.round(cafe.rating)}
                      className="text-cafe-terracotta"
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-cafe-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-cafe-hazelnut">
              <span>Read genuine customer feedback and verified community reviews directly on Google Maps</span>
              <a
                href={mapDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="emil-press inline-flex items-center gap-1.5 font-semibold text-cafe-caramel hover:text-cafe-caramel-hover transition-colors"
              >
                <span>Read reviews on Google Maps</span>
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </section>
        </div>

        {/* Right Column: Location, Hours, Contact & Directions (4 cols) */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
          {/* Location & Opening Hours Card */}
          <div className="bg-white border border-cafe-border rounded-2xl p-6 shadow-cafe space-y-5">
            <h2 className="text-base font-bold text-cafe-espresso uppercase tracking-wider">
              Visiting Details
            </h2>

            {/* Address */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-cafe-caramel font-semibold">
                <SolarMapPoint size={16} />
                <span>Location & Address</span>
              </div>
              <p className="text-cafe-espresso leading-relaxed pl-6">
                {cafe.address}
              </p>
            </div>

            {/* Opening Hours Schedule */}
            <div className="space-y-1.5 text-xs border-t border-cafe-border/70 pt-4">
              <div className="flex items-center gap-2 text-cafe-caramel font-semibold">
                <SolarClockCircle size={16} />
                <span>Opening Hours</span>
              </div>
              <div className="pl-6 space-y-1 text-cafe-espresso">
                <div className="flex justify-between py-0.5 font-medium">
                  <span>Everyday:</span>
                  <span className="text-cafe-hazelnut">{cafe.opening_hours}</span>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-2 border-t border-cafe-border/70 pt-4 text-xs">
              {cafe.phone && (
                <a
                  href={`tel:${cafe.phone}`}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-cafe-cream border border-cafe-border text-cafe-espresso hover:text-cafe-caramel transition-colors"
                >
                  <SolarPhone size={16} className="text-cafe-caramel" />
                  <span className="font-medium">{cafe.phone}</span>
                </a>
              )}
              {cafe.website && (
                <a
                  href={cafe.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-cafe-cream border border-cafe-border text-cafe-espresso hover:text-cafe-caramel transition-colors truncate"
                >
                  <SolarGlobe size={16} className="text-cafe-caramel" />
                  <span className="font-medium truncate">Visit Official Website</span>
                </a>
              )}
            </div>

            {/* Primary Directions CTA */}
            <a
              href={mapDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="emil-press w-full py-3 rounded-xl bg-cafe-caramel text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-cafe-caramel-hover shadow-sm transition-all"
            >
              <SolarNavigation size={16} />
              <span>Get Directions on Google Maps</span>
            </a>
          </div>
        </aside>
      </div>

      {/* Editorial Footer */}
      <Footer />
    </main>
  );
}
