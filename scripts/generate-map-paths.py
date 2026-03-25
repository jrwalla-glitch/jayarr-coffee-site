#!/usr/bin/env python3
"""
Generate SVG path data for coffee belt countries from Natural Earth 110m GeoJSON.
Outputs a TypeScript file with country paths for the CoffeeMap component.
"""
import json
import math
import urllib.request
import sys

# Natural Earth 110m countries GeoJSON
URL = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson"

# Map from Natural Earth NAME to our country ID
# Only countries we want to show on the map (coffee belt region)
COUNTRY_MAP = {
    # Countries WITH articles (interactive)
    "Brazil": "brazil",
    "Bolivia": "bolivia",
    "China": "china",
    "Colombia": "colombia",
    "Costa Rica": "costa-rica",
    "Cuba": "cuba",
    "El Salvador": "el-salvador",
    "Ethiopia": "ethiopia",
    "Guatemala": "guatemala",
    "Honduras": "honduras",
    "India": "india",
    "Indonesia": "indonesia",
    "Jamaica": "jamaica",
    "Kenya": "kenya",
    "Malawi": "malawi",
    "Mexico": "mexico",
    "Myanmar": "myanmar",
    "Nicaragua": "nicaragua",
    "Panama": "panama",
    "Papua New Guinea": "papua-new-guinea",
    "Peru": "peru",
    "Rwanda": "rwanda",
    "United Republic of Tanzania": "tanzania",
    "Tanzania": "tanzania",
    "Yemen": "yemen",
    # Context countries (visible but not interactive — fill out the map)
    "Venezuela": "venezuela",
    "Ecuador": "ecuador",
    "Guyana": "guyana",
    "Suriname": "suriname",
    "French Guiana": "french-guiana",
    "Paraguay": "paraguay",
    "Uruguay": "uruguay",
    "Argentina": "argentina",
    "Chile": "chile",
    "Belize": "belize",
    "Haiti": "haiti",
    "Dominican Rep.": "dominican-republic",
    "Dominican Republic": "dominican-republic",
    "Puerto Rico": "puerto-rico",
    "Trinidad and Tobago": "trinidad-tobago",
    "United States of America": "usa",
    "Morocco": "morocco",
    "Algeria": "algeria",
    "Libya": "libya",
    "Egypt": "egypt",
    "W. Sahara": "western-sahara",
    "Western Sahara": "western-sahara",
    "Mauritania": "mauritania",
    "Mali": "mali",
    "Niger": "niger",
    "Chad": "chad",
    "Sudan": "sudan",
    "South Sudan": "south-sudan",
    "S. Sudan": "south-sudan",
    "Eritrea": "eritrea",
    "Djibouti": "djibouti",
    "Somalia": "somalia",
    "Somaliland": "somaliland",
    "Senegal": "senegal",
    "Gambia": "gambia",
    "Guinea-Bissau": "guinea-bissau",
    "Guinea": "guinea",
    "Sierra Leone": "sierra-leone",
    "Liberia": "liberia",
    "Ivory Coast": "ivory-coast",
    "Côte d'Ivoire": "ivory-coast",
    "Ghana": "ghana",
    "Togo": "togo",
    "Benin": "benin",
    "Burkina Faso": "burkina-faso",
    "Nigeria": "nigeria",
    "Cameroon": "cameroon",
    "Central African Rep.": "central-african-republic",
    "Central African Republic": "central-african-republic",
    "Eq. Guinea": "equatorial-guinea",
    "Equatorial Guinea": "equatorial-guinea",
    "Gabon": "gabon",
    "Rep. of the Congo": "congo-republic",
    "Republic of the Congo": "congo-republic",
    "Congo": "congo-republic",
    "Dem. Rep. Congo": "drc",
    "Democratic Republic of the Congo": "drc",
    "Uganda": "uganda",
    "Burundi": "burundi",
    "Mozambique": "mozambique",
    "Madagascar": "madagascar",
    "Zambia": "zambia",
    "Zimbabwe": "zimbabwe",
    "Angola": "angola",
    "Namibia": "namibia",
    "Botswana": "botswana",
    "South Africa": "south-africa",
    "eSwatini": "eswatini",
    "Swaziland": "eswatini",
    "Lesotho": "lesotho",
    "Saudi Arabia": "saudi-arabia",
    "Oman": "oman",
    "Iran": "iran",
    "Iraq": "iraq",
    "Syria": "syria",
    "Jordan": "jordan",
    "Israel": "israel",
    "Lebanon": "lebanon",
    "United Arab Emirates": "uae",
    "Pakistan": "pakistan",
    "Afghanistan": "afghanistan",
    "Nepal": "nepal",
    "Bhutan": "bhutan",
    "Bangladesh": "bangladesh",
    "Sri Lanka": "sri-lanka",
    "Thailand": "thailand",
    "Laos": "laos",
    "Lao PDR": "laos",
    "Vietnam": "vietnam",
    "Viet Nam": "vietnam",
    "Cambodia": "cambodia",
    "Malaysia": "malaysia",
    "Philippines": "philippines",
    "Taiwan": "taiwan",
    "Japan": "japan",
    "Australia": "australia",
    "New Zealand": "new-zealand",
    "Timor-Leste": "timor-leste",
    "East Timor": "timor-leste",
    # European & Central Asian context countries (visible at ±55°)
    "Spain": "spain",
    "Portugal": "portugal",
    "France": "france",
    "Italy": "italy",
    "Greece": "greece",
    "Turkey": "turkey",
    "Türkiye": "turkey",
    "Albania": "albania",
    "North Macedonia": "north-macedonia",
    "Bulgaria": "bulgaria",
    "Romania": "romania",
    "Serbia": "serbia",
    "Croatia": "croatia",
    "Bosnia and Herz.": "bosnia",
    "Bosnia and Herzegovina": "bosnia",
    "Montenegro": "montenegro",
    "Hungary": "hungary",
    "Austria": "austria",
    "Slovenia": "slovenia",
    "Cyprus": "cyprus",
    "Tunisia": "tunisia",
    "South Korea": "south-korea",
    "Korea": "south-korea",
    "North Korea": "north-korea",
    "Dem. Rep. Korea": "north-korea",
    "Turkmenistan": "turkmenistan",
    "Uzbekistan": "uzbekistan",
    "Kyrgyzstan": "kyrgyzstan",
    "Tajikistan": "tajikistan",
    "Azerbaijan": "azerbaijan",
    "Armenia": "armenia",
    "Georgia": "georgia",
    "Kuwait": "kuwait",
    "Qatar": "qatar",
    # Northern countries (partially visible, fill in landmass gaps)
    "United Kingdom": "uk",
    "Ireland": "ireland",
    "Germany": "germany",
    "Poland": "poland",
    "Netherlands": "netherlands",
    "Belgium": "belgium",
    "Denmark": "denmark",
    "Czechia": "czechia",
    "Czech Republic": "czechia",
    "Slovakia": "slovakia",
    "Switzerland": "switzerland",
    "Luxembourg": "luxembourg",
    "Belarus": "belarus",
    "Ukraine": "ukraine",
    "Moldova": "moldova",
    "Lithuania": "lithuania",
    "Russia": "russia",
    "Canada": "canada",
    "Kazakhstan": "kazakhstan",
    "Mongolia": "mongolia",
    # Small/island nations
    "Bahamas": "bahamas",
    "Brunei": "brunei",
    "Fiji": "fiji",
    "Falkland Is.": "falkland-islands",
    "Falkland Islands": "falkland-islands",
    "New Caledonia": "new-caledonia",
    "Solomon Is.": "solomon-islands",
    "Solomon Islands": "solomon-islands",
    "Vanuatu": "vanuatu",
    "Kosovo": "kosovo",
}

# Countries that have articles (will be interactive on the map)
INTERACTIVE = {
    "brazil", "bolivia", "china", "colombia", "costa-rica", "cuba",
    "el-salvador", "ethiopia", "guatemala", "honduras", "india",
    "indonesia", "jamaica", "kenya", "malawi", "mexico", "myanmar",
    "nicaragua", "panama", "papua-new-guinea", "peru", "rwanda",
    "tanzania", "yemen"
}

# Projection settings — Mercator, generous range for visual context
# Latitude range: -55 to 55 (coffee belt + Southern Europe + Southern S. America)
LAT_MIN, LAT_MAX = -55, 55
LON_MIN, LON_MAX = -180, 180
VIEW_W = 1000

def mercator_y(lat_deg):
    """Convert latitude to Mercator y coordinate."""
    lat_rad = math.radians(lat_deg)
    return math.log(math.tan(math.pi / 4 + lat_rad / 2))

# Calculate view height from Mercator projection bounds
MERC_Y_MIN = mercator_y(LAT_MIN)  # bottom (negative)
MERC_Y_MAX = mercator_y(LAT_MAX)  # top (positive)
MERC_Y_RANGE = MERC_Y_MAX - MERC_Y_MIN

# Scale height to maintain reasonable proportions
# Mercator at ±40° gives a range of ~1.526. Longitude range 360° = 2π ≈ 6.283
# So height = 1000 * (1.526 / 6.283) ≈ 243, but we want it wider, so scale up
VIEW_H = round(VIEW_W * MERC_Y_RANGE / (math.radians(LON_MAX - LON_MIN)))

def lon_to_x(lon):
    return (lon - LON_MIN) / (LON_MAX - LON_MIN) * VIEW_W

def lat_to_y(lat):
    """Convert latitude to SVG y coordinate using Mercator projection."""
    merc = mercator_y(lat)
    # Invert: higher latitude = lower y (SVG y increases downward)
    return (MERC_Y_MAX - merc) / MERC_Y_RANGE * VIEW_H

def coords_to_path(ring):
    """Convert a coordinate ring [[lon, lat], ...] to SVG path segment."""
    parts = []
    for i, (lon, lat) in enumerate(ring):
        # Clamp to our view range
        x = round(lon_to_x(lon), 1)
        y = round(lat_to_y(lat), 1)
        cmd = "M" if i == 0 else "L"
        parts.append(f"{cmd}{x},{y}")
    parts.append("Z")
    return "".join(parts)

def geometry_to_path(geometry):
    """Convert GeoJSON geometry to SVG path string."""
    paths = []
    if geometry["type"] == "Polygon":
        for ring in geometry["coordinates"]:
            paths.append(coords_to_path(ring))
    elif geometry["type"] == "MultiPolygon":
        for polygon in geometry["coordinates"]:
            for ring in polygon:
                paths.append(coords_to_path(ring))
    return " ".join(paths)

def feature_in_view(geometry):
    """Check if any part of the geometry is within our latitude range."""
    def check_coords(coords):
        for c in coords:
            if isinstance(c[0], (list, tuple)):
                if check_coords(c):
                    return True
            else:
                lon, lat = c[0], c[1]
                if LAT_MIN <= lat <= LAT_MAX:
                    return True
        return False
    return check_coords(geometry["coordinates"])

def main():
    print("Fetching Natural Earth 110m countries...", file=sys.stderr)
    req = urllib.request.Request(URL, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.loads(resp.read().decode("utf-8"))

    print(f"Got {len(data['features'])} features", file=sys.stderr)

    countries = {}
    unmatched = []

    for feature in data["features"]:
        props = feature["properties"]
        name = props.get("NAME") or props.get("name") or props.get("ADMIN") or ""

        country_id = COUNTRY_MAP.get(name)
        if not country_id:
            # Try alternate name fields
            for field in ["NAME_LONG", "FORMAL_EN", "NAME_EN", "name_long"]:
                alt_name = props.get(field, "")
                if alt_name in COUNTRY_MAP:
                    country_id = COUNTRY_MAP[alt_name]
                    break

        if not country_id:
            # Check if it's in our latitude range (might be a country we missed)
            if feature_in_view(feature["geometry"]):
                unmatched.append(name)
            continue

        # Skip if already processed (duplicate names)
        if country_id in countries:
            continue

        if not feature_in_view(feature["geometry"]):
            continue

        path_d = geometry_to_path(feature["geometry"])
        if not path_d.strip():
            continue

        countries[country_id] = {
            "id": country_id,
            "path": path_d,
            "interactive": country_id in INTERACTIVE,
        }

    print(f"Processed {len(countries)} countries ({sum(1 for c in countries.values() if c['interactive'])} interactive)", file=sys.stderr)
    if unmatched:
        print(f"Unmatched countries in view: {', '.join(sorted(set(unmatched)))}", file=sys.stderr)

    # Output as TypeScript
    print("// Auto-generated from Natural Earth 110m — do not edit manually")
    print("// Run: python3 scripts/generate-map-paths.py > src/data/mapPaths.ts")
    print("")
    print("export interface CountryPath {")
    print("  id: string;")
    print("  path: string;")
    print("  interactive: boolean;")
    print("}")
    print("")
    print(f"export const VIEW_W = {VIEW_W};")
    print(f"export const VIEW_H = {VIEW_H};")
    print(f"export const LAT_MIN = {LAT_MIN};")
    print(f"export const LAT_MAX = {LAT_MAX};")
    print("")
    print("// Pre-computed Mercator Y positions for map lines")
    print(f"export const TROPIC_CANCER_Y = {round(lat_to_y(23.4), 1)};")
    print(f"export const TROPIC_CAPRICORN_Y = {round(lat_to_y(-23.4), 1)};")
    print(f"export const EQUATOR_Y = {round(lat_to_y(0), 1)};")
    print("")
    print("export const countryPaths: CountryPath[] = [")

    for cid in sorted(countries.keys()):
        c = countries[cid]
        interactive_str = "true" if c["interactive"] else "false"
        print(f'  {{ id: "{c["id"]}", interactive: {interactive_str}, path: "{c["path"]}" }},')

    print("];")

if __name__ == "__main__":
    main()
