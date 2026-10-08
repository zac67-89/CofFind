# Yangon Café Discovery — User Stories

## 1. Project Overview

**Yangon Café Discovery** is a web-based café discovery platform that helps users discover cafés around Yangon.

The system collects café location and geographic information from **OpenStreetMap (OSM)** and enriches the collected data using **web scraping from publicly accessible sources**.

The platform allows users to:

* Discover cafés around Yangon
* Search for cafés
* Filter and sort cafés
* Explore cafés on an interactive map
* View detailed café information
* Find cafés by township
* Access external café websites and social media pages
* View café locations and geographic information

### Data Flow

```text
OpenStreetMap
      │
      ├── Café Name
      ├── Coordinates
      ├── Address
      ├── OSM ID
      └── OSM Tags
      │
      ▼
OSM Data Collection
      │
      ▼
Data Normalization
      │
      ▼
Web Scraping
      │
      ├── Website
      ├── Phone
      ├── Opening Hours
      ├── Social Links
      ├── Images
      └── Additional Information
      │
      ▼
Data Cleaning & Validation
      │
      ▼
Café Dataset
      │
      ▼
Yangon Café Discovery Website
```

---

# 2. User Roles

## 2.1 Visitor

A visitor is a user who accesses the website without authentication.

Visitors can:

* Browse cafés
* Search cafés
* Filter cafés
* Sort cafés
* Explore cafés on a map
* View café details
* Open external café links

---

## 2.2 Data Collection System

The data collection system is responsible for:

* Collecting café data from OSM
* Identifying relevant café records
* Scraping publicly accessible web sources
* Extracting useful information
* Normalizing data
* Detecting duplicates
* Validating collected information
* Updating outdated information

---

## 2.3 Administrator

The administrator manages the collected café data and the data collection process.

Administrators can:

* Review collected cafés
* Approve or reject scraped data
* Correct incorrect information
* Remove invalid cafés
* Trigger data collection
* Trigger scraping jobs
* Review scraping errors
* Monitor data freshness

---

# 3. Epic 1 — Café Discovery

## US-001 — Browse Cafés

**As a visitor,**
I want to browse cafés available around Yangon,
so that I can discover places to visit.

### Acceptance Criteria

* The homepage displays a collection of cafés.
* Each café card displays:

  * Café name
  * Location
  * Image, if available
  * Rating, if available
  * Café category, if available
* Users can click a café card.
* Clicking a café opens its detail page.

---

## US-002 — View Café Details

**As a visitor,**
I want to view detailed information about a café,
so that I can decide whether I want to visit it.

### Acceptance Criteria

The café detail page can display:

* Café name
* Address
* Township
* Latitude and longitude
* Opening hours
* Phone number
* Website
* Social media links
* Café category
* Price range
* Amenities
* Photos
* Rating
* Map location

Missing information should be handled gracefully.

---

## US-003 — View Café Location

**As a visitor,**
I want to see a café's location on a map,
so that I can understand where the café is located.

### Acceptance Criteria

* A map is displayed on the café detail page.
* The café is represented by a map marker.
* The marker uses the café's geographic coordinates.
* Users can zoom and pan the map.
* The map does not break when coordinates are unavailable.

---

## US-004 — Open External Café Information

**As a visitor,**
I want to access a café's external website or social media page,
so that I can get more information about the café.

### Acceptance Criteria

* Website links are displayed when available.
* Social media links are displayed when available.
* External links open the appropriate external website.
* Missing links are not displayed as broken buttons.

---

# 4. Epic 2 — Map Exploration

## US-005 — Explore Cafés on a Map

**As a visitor,**
I want to see cafés on an interactive Yangon map,
so that I can discover cafés based on location.

### Acceptance Criteria

* Café locations are represented using map markers.
* Multiple cafés can be displayed simultaneously.
* Users can zoom and pan the map.
* Map markers represent valid café coordinates.
* The map focuses on Yangon when initially loaded.

---

## US-006 — Open Café from Map Marker

**As a visitor,**
I want to click a café marker,
so that I can quickly view information about that café.

### Acceptance Criteria

Clicking a marker displays:

* Café name
* Township or address
* Rating, if available
* Café image, if available
* Link to café details

---

## US-007 — Explore Cafés by Map Area

**As a visitor,**
I want to explore cafés within the visible map area,
so that I can discover cafés around a specific location.

### Acceptance Criteria

* The system can identify cafés within the current map area.
* The café list can update when the map is moved.
* Users can explore different areas of Yangon by panning the map.
* Map results remain synchronized with the café list.

---

## US-008 — Cluster Nearby Café Markers

**As a visitor,**
I want nearby café markers to be grouped together,
so that the map remains readable when many cafés exist in the same area.

### Acceptance Criteria

* Nearby markers can be grouped into clusters.
* The cluster displays the number of cafés it represents.
* Zooming into a cluster reveals individual cafés.
* The map remains responsive with many markers.

---

# 5. Epic 3 — Search

## US-009 — Search Cafés

**As a visitor,**
I want to search for cafés by name or location,
so that I can quickly find a specific café.

### Acceptance Criteria

Users can search by:

* Café name
* Township
* Address
* Café category
* Relevant tags

The system displays matching cafés.

---

## US-010 — Search by Township

**As a visitor,**
I want to search for cafés within a specific township,
so that I can discover cafés in that area.

### Acceptance Criteria

* Users can select a township.
* Only relevant cafés are displayed.
* The map updates according to the selected township.
* Users can clear the township filter.

---

## US-011 — Search with Multiple Keywords

**As a visitor,**
I want to use multiple search terms,
so that I can perform more specific searches.

### Example

```text
coffee sanchaung
```

or:

```text
work friendly bahan
```

### Acceptance Criteria

* The system processes multiple keywords.
* Results match relevant café fields.
* Search is case-insensitive.
* Empty search queries display the default café list.

---

# 6. Epic 4 — Café Filtering

## US-012 — Filter by Township

**As a visitor,**
I want to filter cafés by township,
so that I can find cafés in a specific area.

### Acceptance Criteria

Available townships are displayed as filter options.

Selecting a township updates:

* Café list
* Result count
* Map markers

---

## US-013 — Filter by Café Type

**As a visitor,**
I want to filter cafés by type,
so that I can find cafés that match my preferences.

### Possible Categories

* Specialty Coffee
* Coffee Shop
* Bakery & Café
* Dessert Café
* Tea & Café
* Restaurant & Café
* Brunch Café

### Acceptance Criteria

* Users can select one or more categories.
* Results update according to the selected categories.
* Users can clear the category filter.

---

## US-014 — Filter by Price Range

**As a visitor,**
I want to filter cafés by price range,
so that I can find cafés within my preferred budget.

### Possible Price Ranges

```text
$
$$
$$$
$$$$
```

### Acceptance Criteria

* Users can select a price range.
* Only matching cafés are displayed.
* Missing price information does not cause errors.

---

## US-015 — Filter by Amenities

**As a visitor,**
I want to filter cafés by available amenities,
so that I can find cafés suitable for my needs.

### Possible Amenities

* Wi-Fi
* Power Outlet
* Air Conditioning
* Parking
* Outdoor Seating
* Indoor Seating
* Work Friendly
* Study Friendly

### Acceptance Criteria

* Users can select one or more amenities.
* Results update based on selected amenities.
* Cafés without amenity information are handled gracefully.

---

## US-016 — Filter by Rating

**As a visitor,**
I want to filter cafés by rating,
so that I can find highly rated cafés.

### Possible Filters

```text
4.5+
4.0+
3.5+
```

### Acceptance Criteria

* Users can select a minimum rating.
* Cafés below the selected rating are excluded.
* Cafés without ratings are handled separately.

---

## US-017 — Filter by Open Status

**As a visitor,**
I want to filter cafés based on their opening status,
so that I can find cafés that are currently open.

### Acceptance Criteria

* The system determines the current open/closed status when opening hours are available.
* Users can select "Open Now".
* Cafés without opening-hour information are clearly handled.

---

# 7. Epic 5 — Sorting

## US-018 — Sort by Rating

**As a visitor,**
I want to sort cafés by rating,
so that I can see highly rated cafés first.

### Acceptance Criteria

* Users can sort from highest to lowest rating.
* Cafés without ratings are placed appropriately.

---

## US-019 — Sort Alphabetically

**As a visitor,**
I want to sort cafés alphabetically,
so that I can find cafés more easily.

### Acceptance Criteria

Available options:

```text
A → Z
Z → A
```

---

## US-020 — Sort by Recently Added

**As a visitor,**
I want to sort cafés by when they were added,
so that I can discover newly collected cafés.

### Acceptance Criteria

* Each café has a collection or creation timestamp.
* Newer cafés can be displayed first.

---

# 8. Epic 6 — OpenStreetMap Data Collection

## US-021 — Collect Café Data from OSM

**As a data collection system,**
I want to retrieve café records from OpenStreetMap,
so that I can build the initial café dataset automatically.

### Acceptance Criteria

The system can retrieve relevant OSM records within the Yangon area.

Collected information may include:

* OSM ID
* Name
* Latitude
* Longitude
* Address
* Township
* Website
* Phone
* Opening hours
* OSM tags

---

## US-022 — Identify Café Records

**As a data collection system,**
I want to identify records that represent cafés,
so that unrelated businesses are not added to the dataset.

### Acceptance Criteria

The system prioritizes relevant OSM tags such as:

```text
amenity=cafe
```

Other related categories can be handled separately.

---

## US-023 — Store OSM Source Information

**As a data collection system,**
I want to preserve the original OSM identifiers and source information,
so that each café can be traced back to its source.

### Acceptance Criteria

Each imported café should retain:

* OSM ID
* OSM source
* Source URL, when applicable
* Original OSM tags
* Import timestamp

---

## US-024 — Update OSM Data

**As a data collection system,**
I want to periodically update café data from OSM,
so that the dataset remains reasonably current.

### Acceptance Criteria

* Existing cafés can be matched using OSM IDs.
* New cafés can be added.
* Existing records can be updated.
* Removed or unavailable OSM records can be detected.
* The system records when the last synchronization occurred.

---

# 9. Epic 7 — Web Scraping

## US-025 — Identify Scraping Sources

**As a data collection system,**
I want to identify publicly accessible web sources related to a café,
so that additional information can be collected.

### Possible Sources

* Café official websites
* Public business websites
* Public directory pages
* Public social media pages, where permitted
* Other publicly accessible business information

### Acceptance Criteria

* The system identifies available source URLs.
* Invalid URLs are rejected.
* Duplicate URLs are detected.
* Scraping is performed only where permitted by the source's terms and technical restrictions.

---

## US-026 — Scrape Café Information

**As a data collection system,**
I want to scrape publicly accessible café information,
so that the dataset contains more complete information than OSM alone.

### Information to Collect

Where available:

* Café name
* Description
* Address
* Phone
* Website
* Opening hours
* Social links
* Images
* Amenities
* Menu links
* Price information

### Acceptance Criteria

* Scraping extracts available information.
* Missing fields are stored as unavailable.
* Failed scraping does not stop the entire collection process.
* Scraping errors are recorded.

---

## US-027 — Respect Website Restrictions

**As a data collection system,**
I want to respect website scraping restrictions,
so that the platform does not unnecessarily violate website policies or overload external services.

### Acceptance Criteria

The scraper should:

* Respect applicable Terms of Service.
* Respect robots.txt where applicable.
* Apply reasonable request rates.
* Avoid unnecessary repeated requests.
* Handle HTTP errors.
* Handle timeouts.
* Handle rate limiting.
* Avoid bypassing authentication or anti-bot protections.

---

## US-028 — Handle Scraping Failures

**As a data collection system,**
I want to handle scraping failures gracefully,
so that one failed source does not interrupt the entire collection process.

### Acceptance Criteria

The system handles:

* Connection errors
* Timeout errors
* HTTP errors
* Invalid HTML
* Missing content
* Blocked requests
* Unexpected page structures

Failed records should be logged for later review.

---

# 10. Epic 8 — Data Normalization

## US-029 — Normalize Café Names

**As a data processing system,**
I want to normalize café names from different sources,
so that duplicate cafés can be identified.

### Acceptance Criteria

The system can normalize:

* Letter casing
* Extra whitespace
* Common punctuation
* Minor formatting differences

---

## US-030 — Normalize Locations

**As a data processing system,**
I want to normalize café addresses and geographic coordinates,
so that location-based operations work consistently.

### Acceptance Criteria

* Latitude and longitude use a consistent format.
* Township names are normalized.
* Addresses are stored consistently.
* Invalid coordinates are detected.

---

## US-031 — Normalize Opening Hours

**As a data processing system,**
I want to normalize opening-hour information,
so that the application can determine whether a café is open.

### Acceptance Criteria

Opening hours from different sources can be converted into a consistent internal format.

Example:

```text
Monday:    08:00 - 21:00
Tuesday:   08:00 - 21:00
Wednesday: 08:00 - 21:00
```

---

# 11. Epic 9 — Duplicate Detection

## US-032 — Detect Duplicate Cafés

**As a data processing system,**
I want to detect duplicate café records,
so that the same café is not displayed multiple times.

### Possible Matching Signals

* OSM ID
* Exact coordinates
* Nearby coordinates
* Similar café names
* Similar addresses
* Website URL
* Phone number

---

## US-033 — Merge Café Data

**As a data processing system,**
I want to merge information from multiple sources,
so that each café has a more complete record.

### Example

```text
OSM
 ├── Name
 ├── Coordinates
 └── Address

Website
 ├── Opening Hours
 ├── Phone
 └── Website

Social Media
 └── Social Links
```

These records can be combined into one café entity.

---

# 12. Epic 10 — Data Validation

## US-034 — Validate Café Coordinates

**As a data processing system,**
I want to validate café coordinates,
so that invalid locations are not displayed on the map.

### Acceptance Criteria

* Latitude is valid.
* Longitude is valid.
* Coordinates fall within the expected geographic area.
* Invalid coordinates are flagged.

---

## US-035 — Validate Café Information

**As a data processing system,**
I want to validate collected café information,
so that incomplete or invalid data is detected before publication.

### Acceptance Criteria

The system validates:

* Required fields
* URLs
* Coordinates
* Phone numbers where possible
* Opening hours
* Duplicate records

---

# 13. Epic 11 — Data Freshness

## US-036 — Track Data Source

**As a data collection system,**
I want to record where each piece of café information came from,
so that the origin of the data can be identified.

### Example

```text
Name
Source: OSM

Opening Hours
Source: Official Website

Phone
Source: Official Website

Instagram
Source: Official Instagram
```

---

## US-037 — Track Last Updated Time

**As a data collection system,**
I want to record when café information was last updated,
so that outdated information can be identified.

### Acceptance Criteria

Each café record can contain:

```text
createdAt
updatedAt
lastScrapedAt
lastOSMSyncAt
```

---

## US-038 — Identify Stale Data

**As an administrator,**
I want to identify cafés whose information has not been updated recently,
so that outdated information can be reviewed.

### Acceptance Criteria

* The system identifies stale records.
* Stale records can be prioritized for re-scraping.
* The system displays the last update timestamp.

---

# 14. Epic 12 — Administration

## US-039 — View Collected Cafés

**As an administrator,**
I want to view all collected café records,
so that I can monitor the dataset.

### Acceptance Criteria

The administrator can view:

* Café name
* Location
* Data sources
* Data status
* Last updated time
* Scraping status

---

## US-040 — Review Collected Data

**As an administrator,**
I want to review automatically collected information,
so that incorrect information can be identified before publication.

### Acceptance Criteria

The administrator can:

* View source data
* View normalized data
* Compare source values
* Identify missing information
* Approve valid information
* Reject invalid information

---

## US-041 — Correct Café Information

**As an administrator,**
I want to correct incorrect café information,
so that users receive accurate information.

### Acceptance Criteria

Administrators can update:

* Café name
* Address
* Township
* Coordinates
* Category
* Opening hours
* Contact information
* Amenities
* External links

---

## US-042 — Remove Invalid Cafés

**As an administrator,**
I want to remove invalid or permanently closed cafés,
so that users do not receive misleading results.

### Acceptance Criteria

* Administrators can mark cafés as inactive.
* Inactive cafés are not displayed to visitors.
* Historical source information is retained where appropriate.

---

# 15. Epic 13 — Favorites

## US-043 — Save a Café

**As a visitor,**
I want to save a café as a favorite,
so that I can easily find it again later.

### Acceptance Criteria

* Users can add a café to favorites.
* Users can remove a café from favorites.
* Favorites persist after page refresh.

For a frontend-only implementation, favorites can be stored using browser storage.

---

## US-044 — View Favorite Cafés

**As a visitor,**
I want to view my saved cafés,
so that I can quickly access places I am interested in.

### Acceptance Criteria

* A favorites page displays saved cafés.
* Users can open café details from favorites.
* Users can remove cafés from favorites.

---

# 16. Epic 14 — Responsive Experience

## US-045 — Use the Website on Mobile

**As a visitor,**
I want to use the website on my phone,
so that I can discover cafés while traveling around Yangon.

### Acceptance Criteria

The website should:

* Work on mobile screens.
* Provide touch-friendly controls.
* Provide readable café cards.
* Provide usable map interactions.
* Support responsive filters.
* Avoid horizontal scrolling.

---

## US-046 — Use the Website on Desktop

**As a visitor,**
I want to use the website on a desktop or laptop,
so that I can efficiently browse cafés.

### Acceptance Criteria

Desktop layouts should support:

* Café grid
* List + map layout
* Search
* Filters
* Café details
* Map exploration

---

# 17. Epic 15 — Performance

## US-047 — Load Café Data Efficiently

**As a visitor,**
I want café data to load quickly,
so that I can start exploring the website without unnecessary waiting.

### Acceptance Criteria

* Only required data is loaded initially.
* Large images are optimized.
* Map markers are handled efficiently.
* The interface remains responsive when many cafés are displayed.

---

## US-048 — Avoid Unnecessary Scraping

**As a data collection system,**
I want to avoid repeatedly scraping unchanged sources,
so that external websites are not unnecessarily requested.

### Acceptance Criteria

* Previously collected data has a timestamp.
* Scraping can be skipped when data is still considered fresh.
* Failed scraping attempts can be retried later.
* Scraping frequency can be controlled.

---

# 18. Epic 16 — Error Handling

## US-049 — Handle Missing Café Data

**As a visitor,**
I want the website to remain usable when some café information is unavailable,
so that incomplete data does not result in a broken page.

### Acceptance Criteria

The UI should display appropriate states such as:

```text
Opening hours unavailable
Phone number unavailable
Website unavailable
Rating unavailable
```

---

## US-050 — Handle Empty Search Results

**As a visitor,**
I want to know when no cafés match my search,
so that I understand why no results are displayed.

### Acceptance Criteria

The system displays:

```text
No cafés found.

Try changing your search or filters.
```

---

## US-051 — Handle Map Errors

**As a visitor,**
I want the website to remain usable if the map cannot load,
so that I can still browse café information.

### Acceptance Criteria

* Café list remains available.
* A meaningful error message is displayed.
* The application does not crash.

---

# 19. Epic 17 — Data Collection Monitoring

## US-052 — Monitor OSM Collection

**As an administrator,**
I want to see the status of OSM data collection,
so that I know whether the latest data synchronization succeeded.

### Acceptance Criteria

The system displays:

* Collection status
* Start time
* End time
* Number of records collected
* Number of new cafés
* Number of updated cafés
* Number of removed or inactive cafés
* Errors

---

## US-053 — Monitor Scraping Jobs

**As an administrator,**
I want to monitor scraping jobs,
so that I can identify failed or incomplete scraping operations.

### Acceptance Criteria

Each job can have a status:

```text
Pending
Running
Completed
Partially Completed
Failed
```

The system records:

* Start time
* End time
* Number of URLs processed
* Successful scrapes
* Failed scrapes
* Error count

---

# 20. Epic 18 — Data Transparency

## US-054 — Display Data Source

**As a visitor,**
I want to know where café information comes from,
so that I can understand the origin of the displayed information.

### Acceptance Criteria

The system can identify sources such as:

```text
Source: OpenStreetMap
Source: Official Website
Source: Public Business Page
```

---

## US-055 — Link Back to OSM

**As a visitor,**
I want to access the original OpenStreetMap location,
so that I can verify geographic information.

### Acceptance Criteria

* The café can provide a link to its OSM source where appropriate.
* The link opens the corresponding OSM location.

---

# 21. MVP User Stories

The first version of the project should focus on the following stories:

### Must Have

```text
US-001  Browse Cafés
US-002  View Café Details
US-003  View Café Location
US-005  Explore Cafés on a Map
US-006  Open Café from Map Marker
US-009  Search Cafés
US-010  Search by Township
US-012  Filter by Township
US-013  Filter by Café Type
US-021  Collect Café Data from OSM
US-022  Identify Café Records
US-023  Store OSM Source Information
US-025  Identify Scraping Sources
US-026  Scrape Café Information
US-027  Respect Website Restrictions
US-028  Handle Scraping Failures
US-032  Detect Duplicate Cafés
US-033  Merge Café Data
US-034  Validate Café Coordinates
US-036  Track Data Source
US-037  Track Last Updated Time
US-049  Handle Missing Café Data
US-050  Handle Empty Search Results
```

---

# 22. Future Features

The following features can be implemented after the MVP:

```text
- User accounts
- User reviews
- User ratings
- Café submissions
- Café owner verification
- Favorites synchronization
- Personalized café recommendations
- "Find cafés near me"
- Distance calculation
- Route / directions
- Café opening status
- Advanced café discovery
- Work-friendly cafés
- Study-friendly cafés
- Date-friendly cafés
- Quiet cafés
- Late-night cafés
- Café collections
- Trending cafés
- Recently opened cafés
- Café popularity ranking
```

---

# 23. Recommended MVP User Flow

```text
                    Landing Page
                         │
                         ▼
                  Search / Explore
                         │
             ┌───────────┴───────────┐
             ▼                       ▼
         Café List                 Map
             │                       │
             │                  Map Marker
             │                       │
             └───────────┬───────────┘
                         ▼
                   Café Details
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
           Website     Map       Favorite
```

---

# 24. Recommended Data Pipeline

```text
                    OpenStreetMap
                          │
                          ▼
                  OSM Data Collector
                          │
                          ▼
                    Raw OSM Data
                          │
                          ▼
                 Data Normalization
                          │
                          ▼
                  Duplicate Detection
                          │
                          ▼
                  Source Discovery
                          │
                          ▼
                    Web Scraper
                          │
                          ▼
                  Scraped Raw Data
                          │
                          ▼
                 Data Normalization
                          │
                          ▼
                 Data Validation
                          │
                          ▼
                  Data Consolidation
                          │
                          ▼
                    Café Dataset
                          │
             ┌────────────┴────────────┐
             ▼                         ▼
        Web Application          Admin Interface
             │
       ┌─────┴─────┐
       ▼           ▼
    Café List     Map
       │           │
       └─────┬─────┘
             ▼
       Café Details
```

---

# 25. Non-Functional Requirements

## NFR-001 — Responsive Design

The application should work across:

* Mobile
* Tablet
* Desktop

---

## NFR-002 — Performance

The application should remain responsive when displaying a large number of cafés.

Map rendering, filtering, and search should avoid unnecessary processing.

---

## NFR-003 — Data Accuracy

Collected information should be validated before being displayed to users.

The system should distinguish between:

* Verified information
* Automatically collected information
* Missing information
* Potentially outdated information

---

## NFR-004 — Data Source Attribution

The system should preserve source information for collected data.

---

## NFR-005 — Scraping Compliance

The scraping system must respect applicable:

* Terms of Service
* Robots.txt directives where applicable
* Rate limits
* Copyright restrictions
* Access restrictions

The system must not bypass authentication, paywalls, CAPTCHAs, or anti-bot protections.

---

## NFR-006 — Maintainability

The data collection, scraping, normalization, and frontend rendering logic should remain separated so that individual components can be replaced or upgraded independently.

---

# 26. Initial Technology Scope

For the initial frontend:

```text
HTML
Tailwind CSS
JavaScript
Leaflet.js
OpenStreetMap
```

For data collection:

```text
OpenStreetMap
OSM / Overpass API
Web Scraping
```

A backend/database can be introduced later when the dataset and scraping workflow become large enough to justify it.

---

# 27. Project Principle

The project should **not treat OSM as the complete source of truth**.

Instead:

```text
OSM
 │
 └── Geographic Foundation
          │
          ▼
Web Sources
 │
 └── Additional Business Information
          │
          ▼
Normalization + Validation
          │
          ▼
Café Dataset
```

OSM should primarily provide **location and geographic identity**, while permitted web sources can provide **additional business information**.

This separation makes the data pipeline easier to maintain and allows individual sources to be replaced or expanded in the future.
