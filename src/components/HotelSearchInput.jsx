import { useState, useRef, useEffect } from "react";
import { MapPin, X, Loader2, AlertCircle, Navigation } from "lucide-react";

const MAX_ZONE_DISTANCE_KM = 15;
const DEBOUNCE_MS = 350;
const MIN_QUERY_LEN = 3;
const NEARBY_RADIUS_M = 15000;
const POSITION_CACHE_MS = 5 * 60 * 1000;

// Samui + Phuket + Krabi bounding box (left, top, right, bottom)
const VIEWBOX = "98.2,9.7,100.15,7.4";

// Module-level cache so position survives across component instances within a session
let cachedPosition = null;
let cachedPositionTime = 0;

function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function extractPlaceName(r) {
  if (r.display_place) return r.display_place;
  if (r.name) return r.name;
  if (r.address && r.address.name) return r.address.name;
  if (r.display_name) {
    const first = r.display_name.split(",")[0];
    if (first) return first.trim();
  }
  return r.display_name || null;
}

function findNearestZone(locations, lat, lng) {
  let nearest = null;
  let minDist = Infinity;
  for (const l of locations) {
    if (l.latitude == null || l.longitude == null) continue;
    const d = haversineKm(lat, lng, l.latitude, l.longitude);
    if (d < minDist) {
      minDist = d;
      nearest = l;
    }
  }
  return nearest ? { zone: nearest, distanceKm: minDist } : null;
}

async function searchLocationIQ(query, token, signal) {
  const params = new URLSearchParams({
    key: token,
    q: query,
    limit: "8",
    countrycodes: "th",
    viewbox: VIEWBOX,
    bounded: "0",
    dedupe: "1",
    normalizecity: "1",
    "accept-language": "en",
  });
  const res = await fetch(
    `https://api.locationiq.com/v1/autocomplete?${params.toString()}`,
    { signal },
  );
  if (!res.ok) {
    // LocationIQ returns 404 when no results — treat as empty
    if (res.status === 404) return [];
    throw new Error("Search failed");
  }
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

async function fetchNearbyLocationIQ(lat, lng, token, signal) {
  const params = new URLSearchParams({
    key: token,
    lat: String(lat),
    lon: String(lng),
    tag: "tourism:hotel,tourism:resort,tourism:hostel,tourism:guest_house,tourism:motel",
    radius: String(NEARBY_RADIUS_M),
    limit: "10",
    format: "json",
  });
  const res = await fetch(
    `https://api.locationiq.com/v1/nearby?${params.toString()}`,
    { signal },
  );
  if (!res.ok) {
    if (res.status === 404) return [];
    throw new Error("Nearby fetch failed");
  }
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export default function HotelSearchInput({
  locations,
  value,
  onChange,
  placeholder = "Search hotel or place",
  iconColor = "text-primary-500",
  required = false,
}) {
  const token = import.meta.env.VITE_LOCATIONIQ_ACCESS_TOKEN;

  const wrapperRef = useRef(null);
  const onChangeRef = useRef(onChange);
  const locationsRef = useRef(locations);

  const [userText, setUserText] = useState(null);
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [outOfArea, setOutOfArea] = useState(false);
  const [open, setOpen] = useState(false);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [nearbyStatus, setNearbyStatus] = useState("idle"); // idle|loading|denied|unsupported|error|ready

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  useEffect(() => {
    locationsRef.current = locations;
  }, [locations]);

  const externalText =
    value && typeof value === "object"
      ? value.hotel_name || value.zone_name || ""
      : "";
  const query = userText ?? externalText;
  const hasValue = value && typeof value === "object" && value.location_id;

  // Debounced LocationIQ search
  useEffect(() => {
    if (userText === null || !token) return;
    const trimmed = userText.trim();
    if (trimmed.length < MIN_QUERY_LEN) return;

    const controller = new AbortController();
    const timer = setTimeout(() => {
      setSearching(true);
      searchLocationIQ(trimmed, token, controller.signal)
        .then((data) => {
          setResults(data);
          setSearching(false);
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            setResults([]);
            setSearching(false);
          }
        });
    }, DEBOUNCE_MS);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [userText, token]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleResultSelect = (r) => {
    const lat = parseFloat(r.lat);
    const lng = parseFloat(r.lon);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return;
    const nearest = findNearestZone(locationsRef.current, lat, lng);
    if (!nearest || nearest.distanceKm > MAX_ZONE_DISTANCE_KM) {
      setOutOfArea(true);
      setOpen(false);
      setUserText(null);
      setResults([]);
      onChangeRef.current("");
      return;
    }
    setOutOfArea(false);
    setOpen(false);
    setUserText(null);
    setResults([]);
    onChangeRef.current({
      location_id: String(nearest.zone.id),
      zone_name: nearest.zone.name,
      hotel_name: extractPlaceName(r),
      hotel_address: r.display_address || null,
      lat,
      lng,
    });
  };

  const clearSelection = () => {
    setUserText(null);
    setResults([]);
    setOutOfArea(false);
    setOpen(false);
    onChangeRef.current("");
  };

  const runNearbyFetch = (lat, lng) => {
    setNearbyStatus("loading");
    fetchNearbyLocationIQ(lat, lng, token)
      .then((data) => {
        setNearbyPlaces(data);
        setNearbyStatus("ready");
      })
      .catch(() => setNearbyStatus("error"));
  };

  const requestNearby = () => {
    if (!token) return;
    if (nearbyStatus === "loading") return;

    const now = Date.now();
    if (cachedPosition && now - cachedPositionTime < POSITION_CACHE_MS) {
      runNearbyFetch(cachedPosition.lat, cachedPosition.lng);
      return;
    }

    if (!("geolocation" in navigator)) {
      setNearbyStatus("unsupported");
      return;
    }

    setNearbyStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        cachedPosition = { lat, lng };
        cachedPositionTime = Date.now();
        runNearbyFetch(lat, lng);
      },
      (err) => {
        if (err.code === 1) setNearbyStatus("denied");
        else setNearbyStatus("error");
      },
      { timeout: 10000, maximumAge: POSITION_CACHE_MS, enableHighAccuracy: false },
    );
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <MapPin
          size={18}
          className={`absolute top-1/2 left-3 -translate-y-1/2 ${iconColor}`}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setUserText(e.target.value);
            setOutOfArea(false);
            setOpen(true);
            if (hasValue) onChangeRef.current("");
          }}
          onFocus={() => {
            if (hasValue) return;
            setOpen(true);
            if (nearbyStatus === "idle") requestNearby();
          }}
          placeholder={placeholder}
          disabled={!token}
          autoComplete="off"
          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pr-10 pl-10 text-sm text-gray-700 transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none disabled:opacity-60"
        />
        {hasValue && !searching && (
          <button
            type="button"
            onClick={clearSelection}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}
        {searching && (
          <Loader2
            size={16}
            className="absolute top-1/2 right-3 -translate-y-1/2 animate-spin text-gray-400"
          />
        )}
      </div>

      {/* Hidden input for browser form validation */}
      <input
        type="hidden"
        value={hasValue ? value.location_id : ""}
        required={required}
      />

      {/* Nearby places dropdown — shown when input open and user hasn't typed enough to search */}
      {open &&
        !hasValue &&
        (userText === null || userText.trim().length < MIN_QUERY_LEN) && (
          <ul className="absolute z-40 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
            <li className="flex items-center gap-1.5 border-b border-gray-100 px-3 py-1.5 text-[11px] font-medium text-gray-500">
              <Navigation size={11} /> Near You
            </li>
            {nearbyStatus === "loading" && (
              <li className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400">
                <Loader2 size={14} className="animate-spin" />
                Getting your location...
              </li>
            )}
            {nearbyStatus === "denied" && (
              <li className="px-3 py-2 text-xs text-gray-500">
                Location access denied. Type at least {MIN_QUERY_LEN} letters to search.
              </li>
            )}
            {nearbyStatus === "unsupported" && (
              <li className="px-3 py-2 text-xs text-gray-500">
                Your browser doesn't support location. Type to search.
              </li>
            )}
            {nearbyStatus === "error" && (
              <li className="flex items-center justify-between px-3 py-2 text-xs text-gray-500">
                <span>Couldn't get nearby places.</span>
                <button
                  type="button"
                  onClick={requestNearby}
                  className="font-medium text-primary-600 hover:underline"
                >
                  Retry
                </button>
              </li>
            )}
            {nearbyStatus === "idle" && (
              <li className="flex items-center justify-between px-3 py-2 text-xs text-gray-500">
                <span>Use my location to find nearby hotels</span>
                <button
                  type="button"
                  onClick={requestNearby}
                  className="font-medium text-primary-600 hover:underline"
                >
                  Enable
                </button>
              </li>
            )}
            {nearbyStatus === "ready" && nearbyPlaces.length === 0 && (
              <li className="px-3 py-2 text-xs text-gray-500">
                No hotels found near you. Type to search.
              </li>
            )}
            {nearbyStatus === "ready" &&
              nearbyPlaces.map((r) => (
                <li
                  key={r.place_id || `${r.osm_type}-${r.osm_id}`}
                  onClick={() => handleResultSelect(r)}
                  className="flex cursor-pointer items-start gap-2 px-3 py-2 text-sm hover:bg-primary-50"
                >
                  <MapPin
                    size={14}
                    className="mt-0.5 shrink-0 text-gray-400"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium text-gray-800">
                      {extractPlaceName(r)}
                    </div>
                    {r.display_address && (
                      <div className="truncate text-xs text-gray-500">
                        {r.display_address}
                      </div>
                    )}
                  </div>
                </li>
              ))}
          </ul>
        )}

      {/* Search results dropdown */}
      {open &&
        userText !== null &&
        userText.trim().length >= MIN_QUERY_LEN && (
          <ul className="absolute z-40 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
            {searching && results.length === 0 && (
              <li className="px-3 py-2 text-sm text-gray-400">Searching...</li>
            )}
            {!searching && results.length === 0 && (
              <li className="px-3 py-2 text-sm text-gray-400">
                No results found
              </li>
            )}
            {results.map((r) => (
              <li
                key={r.place_id}
                onClick={() => handleResultSelect(r)}
                className="flex cursor-pointer items-start gap-2 px-3 py-2 text-sm hover:bg-primary-50"
              >
                <MapPin
                  size={14}
                  className="mt-0.5 shrink-0 text-gray-400"
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium text-gray-800">
                    {extractPlaceName(r)}
                  </div>
                  {r.display_address && (
                    <div className="truncate text-xs text-gray-500">
                      {r.display_address}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

      {/* Show zone + address below when hotel is selected */}
      {hasValue && value.hotel_name && (
        <div className="mt-1 pl-1 text-[11px] text-gray-500">
          Zone: <span className="font-medium">{value.zone_name}</span>
          {value.hotel_address && (
            <span className="block truncate">{value.hotel_address}</span>
          )}
        </div>
      )}

      {outOfArea && (
        <div className="mt-1.5 flex items-start gap-1.5 rounded-md bg-red-50 px-2.5 py-2 text-xs text-red-700">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <span>
            We don't serve this area. Our service covers{" "}
            <strong>Koh Samui, Phuket, and Krabi</strong> only.
          </span>
        </div>
      )}

      {!token && (
        <div className="mt-1.5 text-xs text-red-600">
          LocationIQ token not configured. Set VITE_LOCATIONIQ_ACCESS_TOKEN in
          .env
        </div>
      )}
    </div>
  );
}
