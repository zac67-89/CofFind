import { Cafe } from "@/types/cafe";

export const KNOWN_TOWNSHIPS = [
  "Ahlone",
  "Bahan",
  "Dagon",
  "Downtown",
  "Hlaing",
  "Insein",
  "Kamayut",
  "Kyauktada",
  "Lanmadaw",
  "Latha",
  "Mayangone",
  "Mingalar Taung Nyunt",
  "Pabedan",
  "Pazundaung",
  "Sanchaung",
  "South Okkalapa",
  "Tamwe",
  "Thingangyun",
  "Yankin",
] as const;

const GENERIC_DESCRIPTION = /popular coffee and social gathering spot/i;

function parseClockToMinutes(raw: string): number | null {
  const match = raw.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3].toUpperCase();
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

export function isOpenNow(openingHours: string, now = new Date()): boolean | null {
  if (!openingHours) return null;
  const parts = openingHours.split(/\s*[—–-]\s*/);
  if (parts.length < 2) return null;
  const start = parseClockToMinutes(parts[0]);
  const end = parseClockToMinutes(parts[1]);
  if (start == null || end == null) return null;
  const current = now.getHours() * 60 + now.getMinutes();
  if (end <= start) return current >= start || current < end;
  return current >= start && current < end;
}

export function isStockPhoto(url?: string): boolean {
  if (!url) return true;
  return /unsplash\.com|images\.unsplash/i.test(url);
}

export function realPhotos(photos?: string[]): string[] {
  return (photos ?? []).filter((url) => !isStockPhoto(url));
}

export function isGenericDescription(text?: string): boolean {
  if (!text) return true;
  return GENERIC_DESCRIPTION.test(text);
}

export function formatPriceLevel(price?: string): string {
  if (!price) return "";
  return price.replace(/^price\s*[-–—]\s*/i, "").trim();
}

export function formatDistanceKm(km?: number): string | null {
  if (km == null || Number.isNaN(km)) return null;
  if (km < 0.1) return "< 0.1 km";
  return `${km.toFixed(1)} km`;
}

export function townshipFromCafe(cafe: Pick<Cafe, "address" | "township">): string {
  const address = cafe.address || "";
  const named = address.match(/([A-Za-z][A-Za-z\s]+?)\s+Township/i);
  if (named) {
    const guessed = named[1].trim();
    const known = KNOWN_TOWNSHIPS.find((t) => t.toLowerCase() === guessed.toLowerCase());
    return known || guessed;
  }

  const fromAddress = KNOWN_TOWNSHIPS.find((t) =>
    new RegExp(`\\b${t.replace(/\s+/g, "\\s+")}\\b`, "i").test(address)
  );
  if (fromAddress) return fromAddress;

  const fallback = cafe.township?.trim() || "";
  if (fallback && fallback !== "Yangon" && fallback !== "Bahan") return fallback;
  if (fallback === "Bahan" && /bahan/i.test(address)) return "Bahan";
  return fallback && fallback !== "Bahan" ? fallback : "Yangon";
}

export function withDisplayFields(cafe: Cafe): Cafe {
  const photos = realPhotos(cafe.photos);
  return {
    ...cafe,
    township: townshipFromCafe(cafe),
    photos,
    description: isGenericDescription(cafe.description) ? "" : cafe.description,
    price_level: formatPriceLevel(cafe.price_level),
  };
}

