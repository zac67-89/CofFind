"use client";

import React, { useState, useEffect } from "react";
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
import { getCopy, ratingSourceLabel, type Lang } from "@/lib/copy";
import { isOpenNow, withDisplayFields } from "@/lib/cafe-utils";

export default function CafeDetailPage() {
  const params = useParams();
  const cafeId = params?.id as string;

  const [language, setLanguage] = useState<Lang>("en");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const t = getCopy(language);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("coffind_favorites");
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
      const storedLang = localStorage.getItem("coffind_lang") as Lang;
      if (storedLang === "en" || storedLang === "mm") {
        setLanguage(storedLang);
      }
    } catch (e) {
      console.warn("localStorage access issue", e);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "mm" ? "my" : "en";
  }, [language]);

  const handleLanguageChange = (lang: Lang) => {
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

  const cafeRaw = (initialCafesData as Cafe[]).find((c) => c.id === cafeId);
  const cafe = cafeRaw ? withDisplayFields(cafeRaw) : undefined;

  if (!cafe) {
    return (
      <main
        lang={language === "mm" ? "my" : "en"}
        className="min-h-screen px-4 md:px-8 py-6 max-w-7xl mx-auto flex flex-col justify-between"
      >
        <Header
          favoritesCount={favorites.length}
          showFavoritesOnly={false}
          onShowFavorites={() => {
            window.location.assign("/?saved=1");
          }}
          language={language}
          onLanguageChange={handleLanguageChange}
        />
        <div className="text-center py-24 space-y-4">
          <div className="w-12 h-12 rounded-full bg-cafe-warm-bg text-cafe-caramel flex items-center justify-center mx-auto">
            <SolarCup size={24} />
          </div>
          <h1 className="text-2xl font-bold text-cafe-espresso">{t.cafeNotFound}</h1>
          <p className="text-sm text-cafe-hazelnut">{t.cafeNotFoundBody}</p>
          <Link
            href="/"
            className="emil-press inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cafe-caramel text-white text-xs font-semibold hover:bg-cafe-caramel-hover transition-colors"
          >
            <SolarArrowLeft size={16} />
            <span>{t.returnGuide}</span>
          </Link>
        </div>
        <Footer language={language} />
      </main>
    );
  }

  const isFav = favorites.includes(cafe.id);
  const source = ratingSourceLabel(cafe.data_sources, language);

  const photos = cafe.photos ?? [];
  const open = mounted ? isOpenNow(cafe.opening_hours) : null;

  const mapDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${cafe.name} ${cafe.address}`
  )}`;

  return (
    <main
      lang={language === "mm" ? "my" : "en"}
      className="min-h-screen px-4 md:px-8 py-6 max-w-7xl mx-auto space-y-8"
    >
      <Header
        favoritesCount={favorites.length}
        showFavoritesOnly={false}
        onShowFavorites={() => {
          window.location.assign("/?saved=1");
        }}
        language={language}
        onLanguageChange={handleLanguageChange}
      />

      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="emil-press inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-cafe-border text-cafe-espresso text-xs font-semibold hover:border-cafe-border-hover shadow-cafe transition-colors"
        >
          <SolarArrowLeft size={16} />
          <span>{t.backToAll}</span>
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
          <span>{isFav ? t.savedFavorite : t.saveFavorite}</span>
        </button>
      </div>

      <section aria-label="Cafe Photos" className="space-y-3">
        <div className="relative h-64 sm:h-96 md:h-[440px] w-full rounded-2xl overflow-hidden bg-cafe-warm-bg shadow-cafe border border-cafe-border">
          {photos[selectedPhotoIndex] || photos[0] ? (
            <img
              src={photos[selectedPhotoIndex] || photos[0]}
              alt={cafe.name}
              className="w-full h-full object-cover transition-opacity duration-300 outline outline-1 outline-black/5"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-cafe-caramel">
              <SolarCup size={36} />
              <span className="text-sm font-medium">{t.photoUnavailable}</span>
            </div>
          )}
          {open != null && (
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${open ? "bg-cafe-green" : "bg-cafe-hazelnut"}`} />
              <span className={open ? "text-cafe-green" : "text-cafe-hazelnut"}>
                {open ? t.openRightNow : t.currentlyClosed}
              </span>
            </div>
          )}
        </div>

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
                  alt={`${cafe.name} photo ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-cafe-border rounded-2xl p-6 sm:p-7 shadow-cafe space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cafe-warm-bg text-cafe-caramel border border-cafe-border text-xs font-semibold uppercase tracking-wider">
                {cafe.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-cafe-cream text-cafe-hazelnut border border-cafe-border text-xs font-medium">
                {cafe.township} {t.townshipSuffix}
              </span>
              <span className="px-3 py-1 rounded-full bg-cafe-cream text-cafe-hazelnut border border-cafe-border text-xs font-medium">
                {cafe.price_level}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-cafe-espresso">
              {cafe.name}
            </h1>

            <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-cafe-border/70 text-xs sm:text-sm">
              <div className="flex items-center gap-1.5 text-cafe-terracotta font-bold">
                <SolarStar size={18} filled={true} className="text-cafe-terracotta" />
                <span className="text-base text-cafe-espresso font-bold">
                  {cafe.rating.toFixed(1)}
                </span>
                <span className="text-cafe-hazelnut font-normal">{t.outOfFive}</span>
              </div>
              <span className="text-cafe-border">·</span>
              <span className="text-cafe-hazelnut">
                {t.ratingFrom} {source}
              </span>
            </div>
          </div>

          {cafe.description && (
            <div className="bg-white border border-cafe-border rounded-2xl p-6 sm:p-7 shadow-cafe space-y-3">
              <h2 className="text-base font-bold text-cafe-espresso uppercase tracking-wider">
                {t.aboutCafe}
              </h2>
              <p className="text-sm sm:text-base text-cafe-espresso leading-relaxed font-normal">
                {cafe.description}
              </p>
            </div>
          )}

          {cafe.amenities && cafe.amenities.length > 0 && (
            <div className="bg-white border border-cafe-border rounded-2xl p-6 sm:p-7 shadow-cafe space-y-4">
              <h2 className="text-base font-bold text-cafe-espresso uppercase tracking-wider">
                {t.whatYoullFind}
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

          <section aria-label={t.ratingTitle} className="bg-white border border-cafe-border rounded-2xl p-6 sm:p-7 shadow-cafe space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-cafe-espresso uppercase tracking-wider">
                  {t.ratingTitle}
                </h2>
                <p className="text-xs text-cafe-hazelnut mt-0.5">
                  {t.ratingFrom} {source}
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
          </section>
        </div>

        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
          <div className="bg-white border border-cafe-border rounded-2xl p-6 shadow-cafe space-y-5">
            <h2 className="text-base font-bold text-cafe-espresso uppercase tracking-wider">
              {t.visitingDetails}
            </h2>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-cafe-caramel font-semibold">
                <SolarMapPoint size={16} />
                <span>{t.locationAddress}</span>
              </div>
              <p className="text-cafe-espresso leading-relaxed pl-6">{cafe.address}</p>
            </div>

            <div className="space-y-1.5 text-xs border-t border-cafe-border/70 pt-4">
              <div className="flex items-center gap-2 text-cafe-caramel font-semibold">
                <SolarClockCircle size={16} />
                <span>{t.openingHours}</span>
              </div>
              <div className="pl-6 space-y-1 text-cafe-espresso">
                <div className="flex justify-between py-0.5 font-medium">
                  <span>{t.everyday}</span>
                  <span className="text-cafe-hazelnut">{cafe.opening_hours}</span>
                </div>
              </div>
            </div>

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
                  <span className="font-medium truncate">{t.visitWebsite}</span>
                </a>
              )}
            </div>

            <a
              href={mapDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="emil-press w-full py-3 rounded-xl bg-cafe-caramel text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-cafe-caramel-hover shadow-sm transition-all"
            >
              <SolarNavigation size={16} />
              <span>{t.getDirections}</span>
            </a>
          </div>
        </aside>
      </div>

      <Footer language={language} />
    </main>
  );
}
