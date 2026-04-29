import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Car,
  Users,
  Briefcase,
  Check,
  ArrowLeft,
  ArrowRight,
  MapPin,
  Calendar,
  Clock,
  Mail,
  Phone,
  User,
  MessageCircle,
  Plane,
  Search,
  Loader2,
  Plus,
  Minus,
  AlertCircle,
} from "lucide-react";
import { fetchLocations, fetchVehicles, createBooking } from "../api";
import HotelSearchInput from "../components/HotelSearchInput";
import DatePickerCustom from "../components/DatePickerCustom";
import TimePickerCustom from "../components/TimePickerCustom";

const STEPS = ["Select Vehicle", "Your Details", "Confirmation"];

function StepIndicator({ current }) {
  return (
    <div className="mb-10 flex items-center justify-center gap-2">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition ${
                i < current
                  ? "bg-green-500 text-white"
                  : i === current
                    ? "bg-primary-600 text-white shadow-lg shadow-primary-600/30"
                    : "bg-gray-200 text-gray-500"
              }`}
            >
              {i < current ? <Check size={16} /> : i + 1}
            </div>
            <span
              className={`hidden text-sm font-medium sm:block ${
                i === current ? "text-primary-700" : "text-gray-400"
              }`}
            >
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`h-px w-8 sm:w-16 ${i < current ? "bg-green-400" : "bg-gray-200"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function InlineSearchForm({ form, setForm, locations, onSearch }) {
  const set = (key, value) => setForm((p) => ({ ...p, [key]: value }));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <form
      onSubmit={onSearch}
      className="mb-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <h3 className="mb-5 text-lg font-semibold text-primary-900">
        Search Transfer
      </h3>

      <div className="mb-4 flex gap-2">
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

      <div className="mb-4 grid grid-cols-2 gap-4">
        <HotelSearchInput
          locations={locations}
          value={form.pickup}
          onChange={(v) => set("pickup", v)}
          placeholder="Pick-up — hotel or place"
          iconColor="text-primary-500"
          required
        />
        <HotelSearchInput
          locations={locations}
          value={form.dropoff}
          onChange={(v) => set("dropoff", v)}
          placeholder="Drop-off — hotel or place"
          iconColor="text-red-400"
          required
        />
      </div>

      {form.type === "oneway" ? (
        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-[140px] flex-1">
            <DatePickerCustom
              value={form.date}
              onChange={(v) => set("date", v)}
              minDate={today}
              placeholder="Date"
              iconColor="text-primary-500"
              required
            />
          </div>
          <div className="min-w-[120px] flex-1">
            <TimePickerCustom
              value={form.time}
              onChange={(v) => set("time", v)}
              placeholder="Time"
              iconColor="text-primary-500"
              required
            />
          </div>
          <div className="flex gap-3">
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
                    className="px-2.5 py-2 text-gray-500 hover:text-primary-600"
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-sm font-medium text-gray-700">
                    {form[key]}
                  </span>
                  <button
                    type="button"
                    onClick={() => set(key, form[key] + 1)}
                    className="px-2.5 py-2 text-gray-500 hover:text-primary-600"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/30 transition hover:bg-primary-700 active:scale-[0.98]"
          >
            <Search size={18} /> Search
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
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
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex gap-3">
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
                      className="px-2.5 py-2 text-gray-500 hover:text-primary-600"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-sm font-medium text-gray-700">
                      {form[key]}
                    </span>
                    <button
                      type="button"
                      onClick={() => set(key, form[key] + 1)}
                      className="px-2.5 py-2 text-gray-500 hover:text-primary-600"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-primary-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/30 transition hover:bg-primary-700 active:scale-[0.98]"
            >
              <Search size={18} /> Search
            </button>
          </div>
        </>
      )}
    </form>
  );
}

function parseLocationFromParams(searchParams, prefix) {
  const id = searchParams.get(prefix);
  if (!id) return "";
  const lat = searchParams.get(`${prefix}_lat`);
  const lng = searchParams.get(`${prefix}_lng`);
  return {
    location_id: id,
    zone_name: "",
    hotel_name: searchParams.get(`${prefix}_hotel`) || null,
    hotel_address: searchParams.get(`${prefix}_addr`) || null,
    lat: lat ? parseFloat(lat) : null,
    lng: lng ? parseFloat(lng) : null,
  };
}

function displayLocationName(val) {
  if (!val || typeof val !== "object") return "";
  return val.hotel_name || val.zone_name || "";
}

export default function Transfer() {
  const [searchParams] = useSearchParams();
  const hasParams = searchParams.get("pickup") && searchParams.get("dropoff");

  const [locations, setLocations] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [step, setStep] = useState(hasParams ? 0 : -1);
  const [quantities, setQuantities] = useState({}); // { [vehicleId]: number }
  const [submitting, setSubmitting] = useState(false);
  const [bookingRef, setBookingRef] = useState("");
  const [bookingDetails, setBookingDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    line: "",
    flightNumber: "",
    specialRequests: "",
  });

  const [searchForm, setSearchForm] = useState({
    type: searchParams.get("type") || "oneway",
    pickup: parseLocationFromParams(searchParams, "pickup"),
    dropoff: parseLocationFromParams(searchParams, "dropoff"),
    date: searchParams.get("date") || "",
    time: searchParams.get("time") || "",
    returnDate: searchParams.get("returnDate") || "",
    returnTime: searchParams.get("returnTime") || "",
    adt: parseInt(searchParams.get("adt")) || 1,
    chd: parseInt(searchParams.get("chd")) || 0,
    inf: parseInt(searchParams.get("inf")) || 0,
  });

  const totalPassengers = searchForm.adt + searchForm.chd;
  const pickupId = searchForm.pickup?.location_id || "";
  const dropoffId = searchForm.dropoff?.location_id || "";

  const priceMultiplier = searchForm.type === "return" ? 2 : 1;

  const selectedLines = useMemo(
    () =>
      vehicles
        .map((v) => ({ vehicle: v, qty: quantities[v.id] || 0 }))
        .filter((l) => l.qty > 0),
    [vehicles, quantities],
  );
  const totalSeats = selectedLines.reduce(
    (sum, l) => sum + l.vehicle.max_passengers * l.qty,
    0,
  );
  const totalPrice = selectedLines.reduce(
    (sum, l) => sum + l.vehicle.price * l.qty * priceMultiplier,
    0,
  );
  const hasEnoughSeats = totalSeats >= totalPassengers;
  const hasSelection = selectedLines.length > 0;

  // Load locations
  useEffect(() => {
    fetchLocations()
      .then(setLocations)
      .catch(() => {});
  }, []);

  // Enrich zone_name in searchForm once locations load (for URL-param driven state)
  useEffect(() => {
    if (locations.length === 0) return;
    setSearchForm((p) => {
      const enrich = (val) => {
        if (!val || typeof val !== "object" || val.zone_name) return val;
        const zone = locations.find(
          (l) => String(l.id) === String(val.location_id),
        );
        return zone ? { ...val, zone_name: zone.name } : val;
      };
      const next = { ...p, pickup: enrich(p.pickup), dropoff: enrich(p.dropoff) };
      if (next.pickup === p.pickup && next.dropoff === p.dropoff) return p;
      return next;
    });
  }, [locations]);

  // Load vehicles when route changes (and reset selection)
  useEffect(() => {
    if (pickupId && dropoffId) {
      fetchVehicles(pickupId, dropoffId)
        .then((vs) => {
          setVehicles(vs);
          setQuantities({});
        })
        .catch(() => {});
    }
  }, [pickupId, dropoffId]);

  const pickupName = useMemo(
    () => displayLocationName(searchForm.pickup),
    [searchForm.pickup],
  );
  const dropoffName = useMemo(
    () => displayLocationName(searchForm.dropoff),
    [searchForm.dropoff],
  );

  const handleInlineSearch = (e) => {
    e.preventDefault();
    setStep(0);
    setQuantities({});
  };

  const setQty = (vehicleId, next) => {
    setQuantities((p) => {
      const n = Math.max(0, next);
      if (n === 0) {
        const { [vehicleId]: _omit, ...rest } = p;
        return rest;
      }
      return { ...p, [vehicleId]: n };
    });
  };

  const handleContinueToDetails = () => {
    if (!hasEnoughSeats || !hasSelection) return;
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const p = searchForm.pickup;
      const d = searchForm.dropoff;
      const result = await createBooking({
        trip_type: searchForm.type,
        pickup_location_id: Number(p.location_id),
        pickup_hotel_name: p.hotel_name || null,
        pickup_hotel_address: p.hotel_address || null,
        pickup_lat: p.lat ?? null,
        pickup_lng: p.lng ?? null,
        dropoff_location_id: Number(d.location_id),
        dropoff_hotel_name: d.hotel_name || null,
        dropoff_hotel_address: d.hotel_address || null,
        dropoff_lat: d.lat ?? null,
        dropoff_lng: d.lng ?? null,
        pickup_date: searchForm.date,
        pickup_time: searchForm.time,
        return_date: searchForm.returnDate || null,
        return_time: searchForm.returnTime || null,
        adults: searchForm.adt,
        children: searchForm.chd,
        infants: searchForm.inf,
        vehicles: selectedLines.map((l) => ({
          vehicle_id: l.vehicle.id,
          quantity: l.qty,
          unit_price: l.vehicle.price,
        })),
        total_price: totalPrice,
        first_name: bookingDetails.firstName,
        last_name: bookingDetails.lastName,
        email: bookingDetails.email,
        phone: bookingDetails.phone,
        line_id: bookingDetails.line || null,
        flight_number: bookingDetails.flightNumber || null,
        special_requests: bookingDetails.specialRequests || null,
      });
      setBookingRef(result.booking_ref);
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      alert(err.message || "Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative overflow-hidden bg-primary-950">
        {/* Layered gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_20%_40%,rgba(59,130,246,0.3),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_60%,rgba(99,102,241,0.2),transparent)]" />

        {/* Subtle decorative lines */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute top-16 left-[10%] h-px w-48 rotate-12 bg-white" />
          <div className="absolute top-32 left-[5%] h-px w-32 rotate-12 bg-white" />
          <div className="absolute bottom-20 right-[8%] h-px w-40 -rotate-12 bg-white" />
          <div className="absolute bottom-32 right-[15%] h-px w-24 -rotate-12 bg-white" />
        </div>

        {/* Soft glow accent */}
        <div className="absolute -top-32 right-1/4 h-64 w-64 rounded-full bg-primary-400/10 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-indigo-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pt-24 pb-14 text-center lg:px-8 lg:pt-28 lg:pb-16">
          <h1 className="mb-3 text-3xl font-bold text-white lg:text-4xl">
            Travel in{" "}
            <span className="bg-gradient-to-r from-primary-300 to-emerald-300 bg-clip-text text-transparent">
              Comfort
            </span>
          </h1>
          <p className="mx-auto mb-6 max-w-lg text-base font-light leading-relaxed text-blue-100/80">
            Reliable door-to-door transfers across Thailand — airport pickups,
            hotel shuttles, and custom routes.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-white">
            {[
              { icon: Car, title: "Private Vehicles" },
              { icon: Clock, title: "24/7 Service" },
              { icon: MapPin, title: "50+ Routes" },
            ].map(({ icon: Icon, title }) => (
              <div
                key={title}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm"
              >
                <Icon size={16} className="text-primary-300" />
                <span className="font-medium">{title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom curve */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 48"
            fill="none"
            className="w-full text-gray-50"
            preserveAspectRatio="none"
          >
            <path
              d="M0 48h1440V24C1200 0 960 40 720 40S240 0 0 24v24z"
              fill="currentColor"
            />
          </svg>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
        {step === -1 && (
          <InlineSearchForm
            form={searchForm}
            setForm={setSearchForm}
            locations={locations}
            onSearch={handleInlineSearch}
          />
        )}

        {step >= 0 && (
          <>
            {/* Route summary */}
            <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm">
                <MapPin size={16} className="text-primary-500" />
                <span className="font-medium">{pickupName}</span>
              </div>
              <ArrowRight size={16} className="text-gray-400" />
              <div className="flex items-center gap-2 text-sm">
                <MapPin size={16} className="text-red-400" />
                <span className="font-medium">{dropoffName}</span>
              </div>
              <div className="ml-auto flex gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar size={14} /> {searchForm.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} /> {searchForm.time}
                </span>
                <span className="flex items-center gap-1">
                  <Users size={14} /> {totalPassengers} pax
                </span>
              </div>
              <button
                onClick={() => {
                  setStep(-1);
                  setQuantities({});
                }}
                className="ml-2 text-xs font-medium text-primary-600 hover:underline"
              >
                Edit
              </button>
            </div>
            <StepIndicator current={step} />
          </>
        )}

        {/* Step 0 — Vehicle Selection */}
        {step === 0 && (
          <div>
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              Choose Your Vehicle
            </h2>
            {vehicles.length === 0 ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
                  <MapPin size={26} className="text-amber-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-amber-900">
                  Route Not Available
                </h3>
                <p className="mb-5 text-sm text-amber-800">
                  Sorry, we don't currently offer transfers on this route.
                  Please try a different pick-up or drop-off location, or
                  contact us for a custom quote.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => {
                      setStep(-1);
                      setQuantities({});
                    }}
                    className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-primary-700"
                  >
                    Change Route
                  </button>
                  <a
                    href="https://wa.me/66803895519"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-amber-300 bg-white px-5 py-2.5 text-sm font-semibold text-amber-700 transition hover:bg-amber-100"
                  >
                    Contact Us
                  </a>
                </div>
              </div>
            ) : (
            <>
              <p className="mb-4 text-sm text-gray-500">
                Select one or more vehicles to fit your group. You can mix
                types — e.g. 2× SUV + 1× Sedan.
              </p>
              <div className="grid gap-4 pb-32 sm:grid-cols-2 lg:grid-cols-3">
                {vehicles.map((v) => {
                  const qty = quantities[v.id] || 0;
                  const isSelected = qty > 0;
                  return (
                    <div
                      key={v.id}
                      className={`rounded-2xl border bg-white p-6 transition ${
                        isSelected
                          ? "border-primary-400 shadow-md ring-2 ring-primary-100"
                          : "border-gray-100 hover:border-primary-200 hover:shadow-lg"
                      }`}
                    >
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                        <Car size={28} />
                      </div>
                      <h3 className="mb-1 text-lg font-semibold text-gray-900">
                        {v.name}
                      </h3>
                      <p className="mb-3 text-sm text-gray-500">
                        {v.description}
                      </p>
                      <div className="mb-4 flex gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Users size={14} /> Max {v.max_passengers}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase size={14} /> {v.max_luggage} bags
                        </span>
                      </div>
                      <div className="mb-3">
                        <span className="text-xl font-bold text-primary-700">
                          {(v.price * priceMultiplier).toLocaleString()} THB
                        </span>
                        <span className="ml-1 text-xs text-gray-400">
                          / vehicle
                          {searchForm.type === "return" && " (round trip)"}
                        </span>
                      </div>
                      {qty === 0 ? (
                        <button
                          type="button"
                          onClick={() => setQty(v.id, 1)}
                          className="w-full rounded-lg border border-primary-200 bg-primary-50 py-2.5 text-sm font-semibold text-primary-700 transition hover:bg-primary-100"
                        >
                          Add to booking
                        </button>
                      ) : (
                        <div className="flex items-center justify-between rounded-lg border border-primary-200 bg-primary-50 p-1">
                          <button
                            type="button"
                            onClick={() => setQty(v.id, qty - 1)}
                            className="flex h-9 w-9 items-center justify-center rounded-md bg-white text-primary-700 shadow-sm transition hover:bg-primary-600 hover:text-white"
                            aria-label="Decrease"
                          >
                            <Minus size={16} />
                          </button>
                          <div className="text-center">
                            <div className="text-base font-bold text-primary-800">
                              {qty}
                            </div>
                            <div className="text-[10px] text-primary-600">
                              {qty === 1 ? "vehicle" : "vehicles"}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setQty(v.id, qty + 1)}
                            className="flex h-9 w-9 items-center justify-center rounded-md bg-white text-primary-700 shadow-sm transition hover:bg-primary-600 hover:text-white"
                            aria-label="Increase"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Sticky bottom summary bar */}
              <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
                <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-4 px-4 py-4 lg:px-8">
                  <div className="flex flex-1 flex-wrap items-center gap-4 text-sm">
                    <div
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                        hasSelection && hasEnoughSeats
                          ? "bg-green-50 text-green-700"
                          : hasSelection
                            ? "bg-amber-50 text-amber-700"
                            : "bg-gray-50 text-gray-500"
                      }`}
                    >
                      <Users size={16} />
                      <span className="font-medium">
                        {totalSeats} / {totalPassengers} seats
                      </span>
                      {hasSelection && !hasEnoughSeats && (
                        <span className="flex items-center gap-1 text-xs">
                          <AlertCircle size={12} />
                          Need {totalPassengers - totalSeats} more
                        </span>
                      )}
                    </div>
                    {hasSelection && (
                      <div className="hidden text-xs text-gray-500 sm:block">
                        {selectedLines
                          .map((l) => `${l.vehicle.name} × ${l.qty}`)
                          .join(", ")}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-[11px] text-gray-500">Total</div>
                      <div className="text-lg font-bold text-primary-700">
                        {totalPrice.toLocaleString()} THB
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleContinueToDetails}
                      disabled={!hasSelection || !hasEnoughSeats}
                      className="flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/30 transition hover:bg-primary-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                    >
                      Continue <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </>
            )}
          </div>
        )}

        {/* Step 1 — Booking Details */}
        {step === 1 && hasSelection && (
          <div className="grid gap-8 lg:grid-cols-3">
            <form
              onSubmit={handleBookingSubmit}
              className="space-y-5 lg:col-span-2"
            >
              <h2 className="text-xl font-semibold text-gray-900">
                Passenger Details
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    First Name *
                  </label>
                  <div className="relative">
                    <User
                      size={18}
                      className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      required
                      value={bookingDetails.firstName}
                      onChange={(e) =>
                        setBookingDetails((p) => ({
                          ...p,
                          firstName: e.target.value,
                        }))
                      }
                      placeholder="John"
                      className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Last Name *
                  </label>
                  <div className="relative">
                    <User
                      size={18}
                      className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      required
                      value={bookingDetails.lastName}
                      onChange={(e) =>
                        setBookingDetails((p) => ({
                          ...p,
                          lastName: e.target.value,
                        }))
                      }
                      placeholder="Doe"
                      className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="email"
                      required
                      value={bookingDetails.email}
                      onChange={(e) =>
                        setBookingDetails((p) => ({
                          ...p,
                          email: e.target.value,
                        }))
                      }
                      placeholder="john@example.com"
                      className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="tel"
                      required
                      value={bookingDetails.phone}
                      onChange={(e) =>
                        setBookingDetails((p) => ({
                          ...p,
                          phone: e.target.value,
                        }))
                      }
                      placeholder="+66 81 234 5678"
                      className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    LINE ID
                  </label>
                  <div className="relative">
                    <MessageCircle
                      size={18}
                      className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      value={bookingDetails.line}
                      onChange={(e) =>
                        setBookingDetails((p) => ({
                          ...p,
                          line: e.target.value,
                        }))
                      }
                      placeholder="@yourlineid"
                      className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Flight Number
                  </label>
                  <div className="relative">
                    <Plane
                      size={18}
                      className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      value={bookingDetails.flightNumber}
                      onChange={(e) =>
                        setBookingDetails((p) => ({
                          ...p,
                          flightNumber: e.target.value,
                        }))
                      }
                      placeholder="TG 123"
                      className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Special Requests
                </label>
                <textarea
                  rows={3}
                  value={bookingDetails.specialRequests}
                  onChange={(e) =>
                    setBookingDetails((p) => ({
                      ...p,
                      specialRequests: e.target.value,
                    }))
                  }
                  placeholder="Child seat, extra luggage, etc."
                  className="w-full rounded-lg border border-gray-200 py-3 px-4 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 px-6 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary-600 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/30 transition hover:bg-primary-700 active:scale-[0.98] disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />{" "}
                      Processing...
                    </>
                  ) : (
                    <>
                      Confirm Booking <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Booking Summary */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-24 lg:self-start">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Booking Summary
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-500">Vehicles</span>
                  <ul className="mt-1.5 space-y-1">
                    {selectedLines.map((l) => (
                      <li
                        key={l.vehicle.id}
                        className="flex justify-between text-xs"
                      >
                        <span className="font-medium text-gray-700">
                          {l.vehicle.name} × {l.qty}
                        </span>
                        <span className="text-gray-500">
                          {(
                            l.vehicle.price * l.qty * priceMultiplier
                          ).toLocaleString()}{" "}
                          THB
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Type</span>
                  <span className="font-medium">
                    {searchForm.type === "oneway" ? "One Way" : "Return"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Pick-up</span>
                  <span className="max-w-[180px] text-right font-medium">
                    {pickupName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Drop-off</span>
                  <span className="max-w-[180px] text-right font-medium">
                    {dropoffName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date</span>
                  <span className="font-medium">{searchForm.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Time</span>
                  <span className="font-medium">{searchForm.time}</span>
                </div>
                {searchForm.type === "return" && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Return Date</span>
                      <span className="font-medium">
                        {searchForm.returnDate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Return Time</span>
                      <span className="font-medium">
                        {searchForm.returnTime}
                      </span>
                    </div>
                  </>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Passengers</span>
                  <span className="font-medium">
                    {searchForm.adt} ADT, {searchForm.chd} CHD, {searchForm.inf}{" "}
                    INF
                  </span>
                </div>
                <hr className="border-gray-100" />
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-primary-700">
                    {totalPrice.toLocaleString()} THB
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 — Confirmation */}
        {step === 2 && (
          <div className="mx-auto max-w-lg text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <Check size={40} className="text-green-600" />
              </div>
            </div>
            <h2 className="mb-3 text-2xl font-bold text-gray-900">
              Booking Request Sent!
            </h2>
            <p className="mb-2 text-gray-500">
              Your booking reference number is:
            </p>
            <p className="mb-6 text-2xl font-bold tracking-wider text-primary-600">
              {bookingRef}
            </p>
            <div className="mb-8 rounded-xl bg-primary-50 p-6 text-left">
              <h4 className="mb-3 font-semibold text-primary-900">
                What happens next?
              </h4>
              <ul className="space-y-2 text-sm text-primary-800">
                <li className="flex items-start gap-2">
                  <Check
                    size={16}
                    className="mt-0.5 shrink-0 text-primary-600"
                  />
                  We've sent a confirmation email to{" "}
                  <strong>{bookingDetails.email}</strong>
                </li>
                <li className="flex items-start gap-2">
                  <Check
                    size={16}
                    className="mt-0.5 shrink-0 text-primary-600"
                  />
                  Our team will review your booking and contact you within{" "}
                  <strong>3 hours</strong>
                </li>
                <li className="flex items-start gap-2">
                  <Check
                    size={16}
                    className="mt-0.5 shrink-0 text-primary-600"
                  />
                  You'll receive a final confirmation with driver details before
                  your trip
                </li>
              </ul>
            </div>
            {hasSelection && (
              <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 text-left">
                <h4 className="mb-3 font-semibold text-gray-900">
                  Booking Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Route</span>
                    <span className="font-medium">
                      {pickupName} → {dropoffName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date & Time</span>
                    <span className="font-medium">
                      {searchForm.date} at {searchForm.time}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Vehicles</span>
                    <ul className="mt-1 space-y-0.5">
                      {selectedLines.map((l) => (
                        <li
                          key={l.vehicle.id}
                          className="flex justify-between text-xs"
                        >
                          <span className="font-medium text-gray-700">
                            {l.vehicle.name} × {l.qty}
                          </span>
                          <span className="text-gray-500">
                            {(
                              l.vehicle.price * l.qty * priceMultiplier
                            ).toLocaleString()}{" "}
                            THB
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Passengers</span>
                    <span className="font-medium">
                      {searchForm.adt + searchForm.chd + searchForm.inf}
                    </span>
                  </div>
                  <hr className="border-gray-100" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary-700">
                      {totalPrice.toLocaleString()} THB
                    </span>
                  </div>
                </div>
              </div>
            )}
            <p className="text-sm text-gray-400">
              Need help? Contact us at{" "}
              <a
                href="mailto:tptravelandtour@gmail.com"
                className="text-primary-600 hover:underline"
              >
                tptravelandtour@gmail.com
              </a>{" "}
              or WhatsApp{" "}
              <a
                href="https://wa.me/66803895519"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:underline"
              >
                +66 80 389 5519
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
