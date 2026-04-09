import { useState, useRef, useEffect } from "react";
import { MapPin, ChevronDown } from "lucide-react";

export default function LocationAutocomplete({
  locations,
  value,
  onChange,
  placeholder = "Location",
  iconColor = "text-primary-500",
  required = false,
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  // Sync display text when value changes externally
  useEffect(() => {
    if (value) {
      const loc = locations.find((l) => String(l.id) === String(value));
      if (loc) setQuery(loc.name);
    } else {
      setQuery("");
    }
  }, [value, locations]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
        // Reset text to selected location if user didn't pick
        if (value) {
          const loc = locations.find((l) => String(l.id) === String(value));
          if (loc) setQuery(loc.name);
        } else {
          setQuery("");
        }
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [value, locations]);

  const filtered = locations.filter((l) =>
    l.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (loc) => {
    onChange(String(loc.id));
    setQuery(loc.name);
    setOpen(false);
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setOpen(true);
    // Clear selection when user edits text
    if (value) onChange("");
  };

  return (
    <div ref={wrapperRef} className="relative">
      <MapPin
        size={18}
        className={`absolute top-1/2 left-3 -translate-y-1/2 ${iconColor}`}
      />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pr-10 pl-10 text-sm text-gray-700 transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none"
      />
      <ChevronDown
        size={16}
        className={`pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition ${open ? "rotate-180" : ""}`}
      />

      {/* Hidden input for form validation */}
      <input type="hidden" value={value} required={required} />

      {open && (
        <ul className="absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {filtered.length > 0 ? (
            filtered.map((l) => (
              <li
                key={l.id}
                onClick={() => handleSelect(l)}
                className={`flex cursor-pointer items-center gap-2 px-3 py-2.5 text-sm transition hover:bg-primary-50 ${
                  String(l.id) === String(value)
                    ? "bg-primary-50 font-medium text-primary-700"
                    : "text-gray-700"
                }`}
              >
                <MapPin size={14} className="shrink-0 text-gray-400" />
                {l.name}
              </li>
            ))
          ) : (
            <li className="px-3 py-2.5 text-sm text-gray-400">
              No locations found
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
