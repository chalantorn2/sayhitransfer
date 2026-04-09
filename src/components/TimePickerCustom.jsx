import { useState, useRef, useEffect } from "react";
import { Clock, ChevronUp, ChevronDown } from "lucide-react";

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1); // 1-12
const MINUTES = Array.from({ length: 60 }, (_, i) => i); // 0-59
const PERIODS = ["AM", "PM"];

function to24(hour, minute, period) {
  let h = hour;
  if (period === "AM" && h === 12) h = 0;
  else if (period === "PM" && h !== 12) h += 12;
  return `${String(h).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function from24(val) {
  if (!val) return { hour: 12, minute: 0, period: "AM" };
  const [h, m] = val.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  let hour = h % 12;
  if (hour === 0) hour = 12;
  return { hour, minute: m, period };
}

function formatDisplay(val) {
  if (!val) return "";
  const { hour, minute, period } = from24(val);
  return `${hour}:${String(minute).padStart(2, "0")} ${period}`;
}

export default function TimePickerCustom({
  value,
  onChange,
  placeholder = "Time",
  iconColor = "text-primary-500",
  required = false,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const { hour, minute, period } = from24(value);

  const update = (h, m, p) => onChange(to24(h, m, p));

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const cycleHour = (dir) => {
    const idx = HOURS.indexOf(hour);
    const next = HOURS[(idx + dir + 12) % 12];
    update(next, minute, period);
  };

  const cycleMinute = (dir) => {
    const next = ((minute + dir) % 60 + 60) % 60;
    update(hour, next, period);
  };

  const togglePeriod = () => {
    const next = period === "AM" ? "PM" : "AM";
    update(hour, minute, next);
  };

  return (
    <div ref={ref} className="relative">
      <Clock
        size={18}
        className={`pointer-events-none absolute top-1/2 left-3 z-10 -translate-y-1/2 ${iconColor}`}
      />
      <input
        type="text"
        readOnly
        value={formatDisplay(value)}
        placeholder={placeholder}
        required={required}
        onClick={() => setOpen((o) => !o)}
        className="w-full cursor-pointer rounded-lg border border-gray-200 bg-gray-50 py-3 pr-3 pl-10 text-sm text-gray-700 transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none"
      />
      <input type="hidden" value={value || ""} required={required} />

      {open && (
        <div className="absolute z-50 mt-1 rounded-xl border border-gray-200 bg-white p-4 shadow-xl">
          <div className="flex items-center gap-3">
            {/* Hour */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => cycleHour(1)}
                className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <ChevronUp size={18} />
              </button>
              <span className="flex h-10 w-12 items-center justify-center rounded-lg bg-primary-50 text-lg font-semibold text-primary-700">
                {hour}
              </span>
              <button
                type="button"
                onClick={() => cycleHour(-1)}
                className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <ChevronDown size={18} />
              </button>
            </div>

            <span className="text-lg font-bold text-gray-400">:</span>

            {/* Minute */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => cycleMinute(1)}
                className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <ChevronUp size={18} />
              </button>
              <span className="flex h-10 w-12 items-center justify-center rounded-lg bg-primary-50 text-lg font-semibold text-primary-700">
                {String(minute).padStart(2, "0")}
              </span>
              <button
                type="button"
                onClick={() => cycleMinute(-1)}
                className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <ChevronDown size={18} />
              </button>
            </div>

            {/* AM/PM */}
            <div className="ml-1 flex flex-col gap-1">
              {PERIODS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => { update(hour, minute, p); }}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    period === p
                      ? "bg-primary-600 text-white shadow"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
