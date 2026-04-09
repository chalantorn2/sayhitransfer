import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function DatePickerCustom({
  value,
  onChange,
  minDate,
  placeholder = "Date",
  iconColor = "text-primary-500",
  required = false,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Parse value "YYYY-MM-DD"
  const selected = value ? (() => {
    const [y, m, d] = value.split("-").map(Number);
    return new Date(y, m - 1, d);
  })() : null;

  const [viewDate, setViewDate] = useState(
    selected || new Date()
  );

  useEffect(() => {
    if (selected) setViewDate(new Date(selected));
  }, [value]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => setViewDate(new Date(viewYear, viewMonth - 1, 1));
  const nextMonth = () => setViewDate(new Date(viewYear, viewMonth + 1, 1));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const minD = minDate ? new Date(minDate) : null;
  if (minD) minD.setHours(0, 0, 0, 0);

  const isDisabled = (day) => {
    const d = new Date(viewYear, viewMonth, day);
    return minD && d < minD;
  };

  const isSelected = (day) => {
    if (!selected) return false;
    return (
      selected.getFullYear() === viewYear &&
      selected.getMonth() === viewMonth &&
      selected.getDate() === day
    );
  };

  const isToday = (day) => {
    return (
      today.getFullYear() === viewYear &&
      today.getMonth() === viewMonth &&
      today.getDate() === day
    );
  };

  const handleSelect = (day) => {
    if (isDisabled(day)) return;
    const d = new Date(viewYear, viewMonth, day);
    const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    onChange(str);
    setOpen(false);
  };

  const displayValue = selected
    ? `${selected.getDate()} ${MONTHS[selected.getMonth()].slice(0, 3)} ${selected.getFullYear()}`
    : "";

  return (
    <div ref={ref} className="relative">
      <Calendar
        size={18}
        className={`pointer-events-none absolute top-1/2 left-3 z-10 -translate-y-1/2 ${iconColor}`}
      />
      <input
        type="text"
        readOnly
        value={displayValue}
        placeholder={placeholder}
        required={required}
        onClick={() => setOpen((o) => !o)}
        className="w-full cursor-pointer rounded-lg border border-gray-200 bg-gray-50 py-3 pr-3 pl-10 text-sm text-gray-700 transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none"
      />
      <input type="hidden" value={value || ""} required={required} />

      {open && (
        <div className="absolute z-50 mt-1 w-72 rounded-xl border border-gray-200 bg-white p-4 shadow-xl">
          {/* Header */}
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={prevMonth}
              className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm font-semibold text-gray-800">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Day names */}
          <div className="mb-1 grid grid-cols-7 text-center">
            {DAYS.map((d) => (
              <span key={d} className="text-xs font-medium text-gray-400">
                {d}
              </span>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 text-center">
            {Array.from({ length: firstDay }).map((_, i) => (
              <span key={`e-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const disabled = isDisabled(day);
              const sel = isSelected(day);
              const tod = isToday(day);
              return (
                <button
                  key={day}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleSelect(day)}
                  className={`mx-auto my-0.5 flex h-8 w-8 items-center justify-center rounded-full text-sm transition
                    ${disabled ? "cursor-not-allowed text-gray-300" : "cursor-pointer hover:bg-primary-50"}
                    ${sel ? "bg-primary-600 font-semibold text-white hover:bg-primary-700" : ""}
                    ${!sel && tod ? "font-bold text-primary-600 ring-1 ring-primary-300" : ""}
                    ${!sel && !tod && !disabled ? "text-gray-700" : ""}
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
