"""
OpenStreetMap Café Collector for Yangon (CofFind)
Fetches café locations and geographic attributes from the Overpass API.
"""

import json
import logging
import os
import sys
import time
import requests

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

OVERPASS_MIRRORS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://lz4.overpass-api.de/api/interpreter"
]

HEADERS = {
    "User-Agent": "CofFindYangonApp/1.0 (contact: dev@coffind.local; research project)",
    "Accept": "*/*"
}

# Yangon bounding box: (min_lat, min_lon, max_lat, max_lon)
YANGON_BBOX = "16.65,96.00,17.05,96.35"

OVERPASS_QUERY = f"""
[out:json][timeout:30];
(
  node["amenity"="cafe"]({YANGON_BBOX});
  way["amenity"="cafe"]({YANGON_BBOX});
);
out center tags;
"""

def fetch_osm_cafes():
    logging.info("Requesting Yangon cafes from OpenStreetMap Overpass API...")
    data = None
    for mirror in OVERPASS_MIRRORS:
        try:
            logging.info(f"Trying mirror: {mirror}")
            response = requests.post(mirror, data={"data": OVERPASS_QUERY}, headers=HEADERS, timeout=30)
            if response.status_code == 200:
                data = response.json()
                break
            else:
                logging.warning(f"Mirror {mirror} returned status {response.status_code}")
        except Exception as err:
            logging.warning(f"Mirror {mirror} failed: {err}")

    if not data:
        logging.error("All OSM mirrors failed or rate limited.")
        return []

    try:
        elements = data.get("elements", [])
        logging.info(f"Retrieved {len(elements)} raw elements from OSM.")

        cafes = []
        for el in elements:
            tags = el.get("tags", {})
            name = tags.get("name") or tags.get("name:en")
            if not name:
                continue

            lat = el.get("lat") or (el.get("center", {}).get("lat") if "center" in el else None)
            lon = el.get("lon") or (el.get("center", {}).get("lon") if "center" in el else None)

            if not lat or not lon:
                continue

            # Extract address fields
            street = tags.get("addr:street", "")
            housenumber = tags.get("addr:housenumber", "")
            full_address = f"{housenumber} {street}".strip() or tags.get("address", "")
            township = tags.get("addr:suburb") or tags.get("addr:district") or tags.get("addr:city", "Yangon")

            cafe_record = {
                "osm_id": str(el.get("id")),
                "osm_type": el.get("type"),
                "name": name.strip(),
                "name_mm": tags.get("name:my", ""),
                "latitude": float(lat),
                "longitude": float(lon),
                "address": full_address,
                "township": township,
                "phone": tags.get("phone") or tags.get("contact:phone", ""),
                "website": tags.get("website") or tags.get("contact:website", ""),
                "opening_hours": tags.get("opening_hours", ""),
                "cuisine": tags.get("cuisine", ""),
                "internet_access": tags.get("internet_access", ""),
                "outdoor_seating": tags.get("outdoor_seating", ""),
                "osm_tags": tags,
                "collected_at": time.strftime("%Y-%m-%dT%H:%M:%SZ")
            }
            cafes.append(cafe_record)

        os.makedirs("data", exist_ok=True)
        output_file = os.path.join("data", "raw_osm.json")
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(cafes, f, ensure_ascii=False, indent=2)

        logging.info(f"Successfully saved {len(cafes)} cafes to {output_file}")
        return cafes

    except Exception as e:
        logging.error(f"Failed to fetch from OSM Overpass API: {e}")
        return []

if __name__ == "__main__":
    fetch_osm_cafes()
