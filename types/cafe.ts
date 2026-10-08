export interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  comment: string;
  tag?: string;
}

export interface Cafe {
  id: string;
  name: string;
  name_mm?: string;
  category: string;
  township: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  reviews_count: number;
  price_level: string; // e.g. "Price - Affordable", "Price - Moderate", "Price - Premium"
  opening_hours: string;
  open_now: boolean;
  phone?: string;
  website?: string;
  description: string;
  amenities: string[];
  photos: string[];
  reviews?: Review[];
  has_wifi?: boolean;
  work_friendly?: boolean;
  pet_friendly?: boolean;
  distance_km?: number;
  osm_id?: string;
  data_sources?: string[];
}
