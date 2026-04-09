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
} from "lucide-react";
import { fetchLocations, fetchVehicles, createBooking } from "../api";
import LocationAutocomplete from "../components/LocationAutocomplete";
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
            <div className={`h-px w-8 sm:w-16 ${i < current ? "bg-green-400" : "bg-gray-200"}`} />
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
    <form onSubmit={onSearch} className="mb-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-5 text-lg font-semibold text-primary-900">Search Transfer</h3>

      <div className="mb-4 flex gap-2">
        {["oneway", "return"].map((t) => (
          <button key={t} type="button" onClick={() => set("type", t)}
            className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition ${
              form.type === t ? "bg-primary-600 text-white shadow" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}>
            {t === "oneway" ? "One Way" : "Return"}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      {form.type === "return" && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      <div className="mt-4 flex flex-wrap items-end gap-4">
        <div className="flex gap-3">
          {[
            { key: "adt", label: "Adult", min: 1 },
            { key: "chd", label: "Child", min: 0 },
            { key: "inf", label: "Infant", min: 0 },
          ].map(({ key, label, min }) => (
            <div key={key}>
              <label className="mb-1 block text-xs text-gray-500">{label}</label>
              <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50">
                <button type="button" onClick={() => set(key, Math.max(min, form[key] - 1))} className="px-2.5 py-2 text-gray-500 hover:text-primary-600">-</button>
                <span className="w-6 text-center text-sm font-medium text-gray-700">{form[key]}</span>
                <button type="button" onClick={() => set(key, form[key] + 1)} className="px-2.5 py-2 text-gray-500 hover:text-primary-600">+</button>
              </div>
            </div>
          ))}
        </div>
        <button type="submit"
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/30 transition hover:bg-primary-700 active:scale-[0.98]">
          <Search size={18} /> Search
        </button>
      </div>
    </form>
  );
}

export default function Transfer() {
  const [searchParams] = useSearchParams();
  const hasParams = searchParams.get("pickup") && searchParams.get("dropoff");

  const [locations, setLocations] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [step, setStep] = useState(hasParams ? 0 : -1);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
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
    pickup: searchParams.get("pickup") || "",
    dropoff: searchParams.get("dropoff") || "",
    date: searchParams.get("date") || "",
    time: searchParams.get("time") || "",
    returnDate: searchParams.get("returnDate") || "",
    returnTime: searchParams.get("returnTime") || "",
    adt: parseInt(searchParams.get("adt")) || 1,
    chd: parseInt(searchParams.get("chd")) || 0,
    inf: parseInt(searchParams.get("inf")) || 0,
  });

  const totalPassengers = searchForm.adt + searchForm.chd;

  // Load locations
  useEffect(() => {
    fetchLocations().then(setLocations).catch(() => {});
  }, []);

  // Load vehicles when route is set
  useEffect(() => {
    if (step >= 0 && searchForm.pickup && searchForm.dropoff) {
      fetchVehicles(searchForm.pickup, searchForm.dropoff)
        .then(setVehicles)
        .catch(() => {});
    }
  }, [step, searchForm.pickup, searchForm.dropoff]);

  const pickupName = useMemo(
    () => locations.find((l) => String(l.id) === String(searchForm.pickup))?.name || "",
    [locations, searchForm.pickup]
  );
  const dropoffName = useMemo(
    () => locations.find((l) => String(l.id) === String(searchForm.dropoff))?.name || "",
    [locations, searchForm.dropoff]
  );

  const handleInlineSearch = (e) => {
    e.preventDefault();
    setStep(0);
    setSelectedVehicle(null);
  };

  const handleSelectVehicle = (v) => {
    setSelectedVehicle(v);
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const priceMultiplier = searchForm.type === "return" ? 2 : 1;

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const result = await createBooking({
        trip_type: searchForm.type,
        pickup_location_id: Number(searchForm.pickup),
        dropoff_location_id: Number(searchForm.dropoff),
        pickup_date: searchForm.date,
        pickup_time: searchForm.time,
        return_date: searchForm.returnDate || null,
        return_time: searchForm.returnTime || null,
        adults: searchForm.adt,
        children: searchForm.chd,
        infants: searchForm.inf,
        vehicle_id: selectedVehicle.id,
        total_price: selectedVehicle.price * priceMultiplier,
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
      <div className="bg-gradient-to-r from-primary-800 to-primary-900 py-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h1 className="text-3xl font-bold text-white">Transfer Service</h1>
          <p className="mt-2 text-blue-200">Book your private transfer across Thailand</p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
        {step === -1 && (
          <InlineSearchForm form={searchForm} setForm={setSearchForm} locations={locations} onSearch={handleInlineSearch} />
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
                <span className="flex items-center gap-1"><Calendar size={14} /> {searchForm.date}</span>
                <span className="flex items-center gap-1"><Clock size={14} /> {searchForm.time}</span>
                <span className="flex items-center gap-1"><Users size={14} /> {totalPassengers} pax</span>
              </div>
              <button onClick={() => { setStep(-1); setSelectedVehicle(null); }} className="ml-2 text-xs font-medium text-primary-600 hover:underline">Edit</button>
            </div>
            <StepIndicator current={step} />
          </>
        )}

        {/* Step 0 — Vehicle Selection */}
        {step === 0 && (
          <div>
            <h2 className="mb-6 text-xl font-semibold text-gray-900">Choose Your Vehicle</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {vehicles.map((v) => (
                <button key={v.id} onClick={() => handleSelectVehicle(v)}
                  disabled={v.max_passengers < totalPassengers}
                  className={`group rounded-2xl border bg-white p-6 text-left transition hover:shadow-lg ${
                    v.max_passengers < totalPassengers
                      ? "cursor-not-allowed border-gray-100 opacity-50"
                      : "border-gray-100 hover:border-primary-200"
                  }`}>
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <Car size={28} />
                  </div>
                  <h3 className="mb-1 text-lg font-semibold text-gray-900">{v.name}</h3>
                  <p className="mb-3 text-sm text-gray-500">{v.description}</p>
                  <div className="mb-4 flex gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Users size={14} /> Max {v.max_passengers}</span>
                    <span className="flex items-center gap-1"><Briefcase size={14} /> {v.max_luggage} bags</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary-700">
                      {(v.price * priceMultiplier).toLocaleString()} THB
                    </span>
                    {v.max_passengers >= totalPassengers && (
                      <span className="rounded-lg bg-primary-600 px-4 py-2 text-xs font-semibold text-white shadow transition group-hover:bg-primary-700">Select</span>
                    )}
                  </div>
                  {searchForm.type === "return" && <p className="mt-1 text-xs text-gray-400">round trip</p>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1 — Booking Details */}
        {step === 1 && selectedVehicle && (
          <div className="grid gap-8 lg:grid-cols-3">
            <form onSubmit={handleBookingSubmit} className="space-y-5 lg:col-span-2">
              <h2 className="text-xl font-semibold text-gray-900">Passenger Details</h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">First Name *</label>
                  <div className="relative">
                    <User size={18} className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                    <input type="text" required value={bookingDetails.firstName}
                      onChange={(e) => setBookingDetails((p) => ({ ...p, firstName: e.target.value }))}
                      placeholder="John"
                      className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Last Name *</label>
                  <div className="relative">
                    <User size={18} className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                    <input type="text" required value={bookingDetails.lastName}
                      onChange={(e) => setBookingDetails((p) => ({ ...p, lastName: e.target.value }))}
                      placeholder="Doe"
                      className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none" />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Email *</label>
                  <div className="relative">
                    <Mail size={18} className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                    <input type="email" required value={bookingDetails.email}
                      onChange={(e) => setBookingDetails((p) => ({ ...p, email: e.target.value }))}
                      placeholder="john@example.com"
                      className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Phone Number *</label>
                  <div className="relative">
                    <Phone size={18} className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                    <input type="tel" required value={bookingDetails.phone}
                      onChange={(e) => setBookingDetails((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="+66 81 234 5678"
                      className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none" />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">LINE ID</label>
                  <div className="relative">
                    <MessageCircle size={18} className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                    <input type="text" value={bookingDetails.line}
                      onChange={(e) => setBookingDetails((p) => ({ ...p, line: e.target.value }))}
                      placeholder="@yourlineid"
                      className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Flight Number</label>
                  <div className="relative">
                    <Plane size={18} className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                    <input type="text" value={bookingDetails.flightNumber}
                      onChange={(e) => setBookingDetails((p) => ({ ...p, flightNumber: e.target.value }))}
                      placeholder="TG 123"
                      className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Special Requests</label>
                <textarea rows={3} value={bookingDetails.specialRequests}
                  onChange={(e) => setBookingDetails((p) => ({ ...p, specialRequests: e.target.value }))}
                  placeholder="Child seat, extra luggage, etc."
                  className="w-full rounded-lg border border-gray-200 py-3 px-4 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep(0)}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 px-6 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50">
                  <ArrowLeft size={16} /> Back
                </button>
                <button type="submit" disabled={submitting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary-600 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/30 transition hover:bg-primary-700 active:scale-[0.98] disabled:opacity-60">
                  {submitting ? <><Loader2 size={16} className="animate-spin" /> Processing...</> : <>Confirm Booking <ArrowRight size={16} /></>}
                </button>
              </div>
            </form>

            {/* Booking Summary */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-24 lg:self-start">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Booking Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Vehicle</span><span className="font-medium">{selectedVehicle.name}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Type</span><span className="font-medium">{searchForm.type === "oneway" ? "One Way" : "Return"}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Pick-up</span><span className="max-w-[180px] text-right font-medium">{pickupName}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Drop-off</span><span className="max-w-[180px] text-right font-medium">{dropoffName}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="font-medium">{searchForm.date}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Time</span><span className="font-medium">{searchForm.time}</span></div>
                {searchForm.type === "return" && (
                  <>
                    <div className="flex justify-between"><span className="text-gray-500">Return Date</span><span className="font-medium">{searchForm.returnDate}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Return Time</span><span className="font-medium">{searchForm.returnTime}</span></div>
                  </>
                )}
                <div className="flex justify-between"><span className="text-gray-500">Passengers</span><span className="font-medium">{searchForm.adt} ADT, {searchForm.chd} CHD, {searchForm.inf} INF</span></div>
                <hr className="border-gray-100" />
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-primary-700">{(selectedVehicle.price * priceMultiplier).toLocaleString()} THB</span>
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
            <h2 className="mb-3 text-2xl font-bold text-gray-900">Booking Request Sent!</h2>
            <p className="mb-2 text-gray-500">Your booking reference number is:</p>
            <p className="mb-6 text-2xl font-bold tracking-wider text-primary-600">{bookingRef}</p>
            <div className="mb-8 rounded-xl bg-primary-50 p-6 text-left">
              <h4 className="mb-3 font-semibold text-primary-900">What happens next?</h4>
              <ul className="space-y-2 text-sm text-primary-800">
                <li className="flex items-start gap-2"><Check size={16} className="mt-0.5 shrink-0 text-primary-600" />We've sent a confirmation email to <strong>{bookingDetails.email}</strong></li>
                <li className="flex items-start gap-2"><Check size={16} className="mt-0.5 shrink-0 text-primary-600" />Our team will review your booking and contact you within <strong>3 hours</strong></li>
                <li className="flex items-start gap-2"><Check size={16} className="mt-0.5 shrink-0 text-primary-600" />You'll receive a final confirmation with driver details before your trip</li>
              </ul>
            </div>
            {selectedVehicle && (
              <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 text-left">
                <h4 className="mb-3 font-semibold text-gray-900">Booking Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Route</span><span className="font-medium">{pickupName} → {dropoffName}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Date & Time</span><span className="font-medium">{searchForm.date} at {searchForm.time}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Vehicle</span><span className="font-medium">{selectedVehicle.name}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Passengers</span><span className="font-medium">{searchForm.adt + searchForm.chd + searchForm.inf}</span></div>
                  <hr className="border-gray-100" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary-700">{(selectedVehicle.price * priceMultiplier).toLocaleString()} THB</span>
                  </div>
                </div>
              </div>
            )}
            <p className="text-sm text-gray-400">
              Need help? Contact us at{" "}
              <a href="mailto:info@sayhitransfer.com" className="text-primary-600 hover:underline">info@sayhitransfer.com</a>
              {" "}or call <a href="tel:+6676123456" className="text-primary-600 hover:underline">+66 76 123 456</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
