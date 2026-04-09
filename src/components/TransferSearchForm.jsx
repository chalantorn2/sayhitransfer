import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Search } from "lucide-react";
import { fetchLocations } from "../api";
import LocationAutocomplete from "./LocationAutocomplete";
import DatePickerCustom from "./DatePickerCustom";
import TimePickerCustom from "./TimePickerCustom";

export default function TransferSearchForm() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [form, setForm] = useState({
    type: "oneway",
    pickup: "",
    dropoff: "",
    date: "",
    time: "",
    returnDate: "",
    returnTime: "",
    adt: 1,
    chd: 0,
    inf: 0,
  });

  useEffect(() => {
    fetchLocations()
      .then(setLocations)
      .catch(() => {});
  }, []);

  const set = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(form).forEach(([k, v]) => {
      if (v !== "" && v !== 0) params.set(k, v);
    });
    navigate(`/transfer?${params.toString()}`);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl lg:p-8"
    >
      <h3 className="mb-5 text-lg font-semibold text-primary-900">
        Book Your Transfer
      </h3>

      {/* Trip Type */}
      <div className="mb-5 flex gap-2">
        {["oneway", "return"].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => set("type", t)}
            className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition ${
              form.type === t
                ? "bg-primary-600 text-white shadow"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {t === "oneway" ? "One Way" : "Return"}
          </button>
        ))}
      </div>

      {/* Locations */}
      <div className="mb-4 space-y-3">
        <LocationAutocomplete
          locations={locations}
          value={form.pickup}
          onChange={(v) => set("pickup", v)}
          placeholder="Pick-up Location"
          iconColor="text-primary-500"
          required
        />
        <LocationAutocomplete
          locations={locations}
          value={form.dropoff}
          onChange={(v) => set("dropoff", v)}
          placeholder="Drop-off Location"
          iconColor="text-red-400"
          required
        />
      </div>

      {/* Date & Time */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        <DatePickerCustom
          value={form.date}
          onChange={(v) => set("date", v)}
          minDate={today}
          placeholder="Date"
          iconColor="text-primary-500"
          required
        />
        <TimePickerCustom
          value={form.time}
          onChange={(v) => set("time", v)}
          placeholder="Time"
          iconColor="text-primary-500"
          required
        />
      </div>

      {/* Return Date & Time */}
      {form.type === "return" && (
        <div className="mb-4 grid grid-cols-2 gap-3">
          <DatePickerCustom
            value={form.returnDate}
            onChange={(v) => set("returnDate", v)}
            minDate={form.date || today}
            placeholder="Return Date"
            iconColor="text-orange-400"
            required
          />
          <TimePickerCustom
            value={form.returnTime}
            onChange={(v) => set("returnTime", v)}
            placeholder="Return Time"
            iconColor="text-orange-400"
            required
          />
        </div>
      )}

      {/* Passengers */}
      <div className="mb-5">
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { key: "adt", label: "Adult", min: 1 },
            { key: "chd", label: "Child", min: 0 },
            { key: "inf", label: "Infant", min: 0 },
          ].map(({ key, label, min }) => (
            <div key={key}>
              <label className="mb-1 block text-xs text-gray-500">
                {label}
              </label>
              <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50">
                <button
                  type="button"
                  onClick={() => set(key, Math.max(min, form[key] - 1))}
                  className="px-2.5 py-2 text-lg text-gray-500 transition hover:text-primary-600"
                >
                  -
                </button>
                <span className="flex-1 text-center text-sm font-medium text-gray-700">
                  {form[key]}
                </span>
                <button
                  type="button"
                  onClick={() => set(key, form[key] + 1)}
                  className="px-2.5 py-2 text-lg text-gray-500 transition hover:text-primary-600"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/30 transition hover:bg-primary-700 active:scale-[0.98]"
      >
        <Search size={18} />
        Search Available Vehicles
      </button>
    </form>
  );
}
