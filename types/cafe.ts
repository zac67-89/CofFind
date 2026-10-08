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
  price_level: string;
  opening_hours: string;
  open_now: boolean;
  phone?: string;
  website?: string;
  description: string;
  amenities: string[];
  osm_id?: string;
  data_sources?: string[];
}
