import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Car,
  Plane,
  Map,
  Star,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import TransferSearchForm from "../components/TransferSearchForm";
import { fetchTours } from "../api";

const services = [
  {
    icon: Plane,
    title: "Airport Transfer",
    desc: "Hassle-free pick-up and drop-off at all major airports in Thailand.",
  },
  {
    icon: Car,
    title: "Hotel Transfer",
    desc: "Comfortable rides between hotels, resorts, and accommodation.",
  },
  {
    icon: Map,
    title: "Tour & Sightseeing",
    desc: "Explore amazing day trips and local attractions with our guided tours.",
  },
];

const transferGallery = Array.from({ length: 10 }, (_, i) => ({
  src: `/customer/customer-${String(i + 1).padStart(2, "0")}.jpg`,
  alt: `Happy traveler ${i + 1}`,
}));

export default function Home() {
  const [tours, setTours] = useState([]);
  const sliderRef = useRef(null);
  const [sliderIdx, setSliderIdx] = useState(0);

  useEffect(() => {
    fetchTours().then(setTours).catch(() => {});
  }, []);

  /* Auto-play slider */
  const scrollTo = useCallback((idx) => {
    if (!sliderRef.current) return;
    const card = sliderRef.current.children[idx];
    if (card) {
      sliderRef.current.scrollTo({ left: card.offsetLeft - 16, behavior: "smooth" });
      setSliderIdx(idx);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSliderIdx((prev) => {
        const next = (prev + 1) % transferGallery.length;
        scrollTo(next);
        return next;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [scrollTo]);

  const slidePrev = () => {
    const prev = sliderIdx <= 0 ? transferGallery.length - 1 : sliderIdx - 1;
    scrollTo(prev);
  };
  const slideNext = () => {
    const next = (sliderIdx + 1) % transferGallery.length;
    scrollTo(next);
  };

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white" />
          <div className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-white" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pt-28 pb-16 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:pt-32 lg:pb-24">
          <div className="text-white">
            <p className="mb-3 inline-block rounded-full bg-white/15 px-4 py-1.5 text-xs font-medium tracking-wide uppercase backdrop-blur">
              Thailand's Trusted Transfer Service
            </p>
            <h1 className="mb-5 text-4xl leading-tight font-bold lg:text-5xl lg:leading-tight">
              Your Journey Starts{" "}
              <span className="text-primary-300">With Us</span>
            </h1>
            <p className="mb-8 max-w-lg text-lg leading-relaxed font-light text-blue-100">
              Reliable airport transfers, hotel shuttles, and unforgettable day
              trips across Thailand. Book in minutes, travel in comfort.
            </p>
            <div className="flex flex-wrap gap-6 text-sm">
              <div>
                <span className="text-2xl font-bold">5,000+</span>
                <p className="text-blue-200">Happy Travelers</p>
              </div>
              <div>
                <span className="text-2xl font-bold">50+</span>
                <p className="text-blue-200">Routes</p>
              </div>
              <div className="flex items-start gap-1">
                <div>
                  <span className="text-2xl font-bold">4.9</span>
                  <p className="text-blue-200">Rating</p>
                </div>
                <Star size={14} className="mt-1 fill-yellow-400 text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="lg:justify-self-end">
            <TransferSearchForm />
          </div>
        </div>
      </section>

      {/* Happy Travelers Slider */}
      <section className="bg-gray-50 py-10 lg:py-16">
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-2xl font-bold text-gray-900 lg:text-3xl">
              Our Happy Travelers
            </h2>
            <p className="text-sm text-gray-500">
              Real customers, real journeys across Thailand.
            </p>
          </div>

          {/* Prev / Next buttons */}
          <button
            onClick={slidePrev}
            className="absolute -left-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white p-2.5 shadow-lg transition hover:bg-primary-50 lg:flex"
          >
            <ChevronLeft size={20} className="text-primary-700" />
          </button>
          <button
            onClick={slideNext}
            className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white p-2.5 shadow-lg transition hover:bg-primary-50 lg:flex"
          >
            <ChevronRight size={20} className="text-primary-700" />
          </button>

          {/* Scrollable track */}
          <div
            ref={sliderRef}
            className="scrollbar-hide flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth"
          >
            {transferGallery.map((item, i) => (
              <div
                key={i}
                className="w-72 flex-shrink-0 snap-start overflow-hidden rounded-2xl bg-white shadow-md transition hover:shadow-xl sm:w-80"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  className="aspect-square h-full w-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="mt-6 flex justify-center gap-2">
            {transferGallery.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className={`h-2 rounded-full transition-all ${
                  i === sliderIdx ? "w-6 bg-primary-600" : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Day Trips */}
      {tours.length > 0 && (
        <section className="bg-white py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <h2 className="mb-3 text-3xl font-bold text-gray-900">Popular Day Trips</h2>
                <p className="max-w-xl text-gray-500">Discover the best tours and excursions around Thailand.</p>
              </div>
              <Link to="/tour" className="hidden items-center gap-1 text-sm font-medium text-primary-600 transition hover:text-primary-700 sm:flex">
                View All Tours <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tours.slice(0, 3).map((tour) => (
                <Link key={tour.id} to={`/tour/${tour.id}`} className="group overflow-hidden rounded-2xl border border-gray-100 transition hover:shadow-lg">
                  <div className="aspect-[16/10] bg-gradient-to-br from-primary-200 to-primary-400 p-6">
                    <span className="inline-block rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-primary-700">
                      {tour.province}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="mb-2 font-semibold text-gray-900 group-hover:text-primary-600">{tour.name}</h3>
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {(tour.highlights || []).slice(0, 3).map((h) => (
                        <span key={h} className="rounded-full bg-primary-50 px-2 py-0.5 text-xs text-primary-600">{h}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary-700">
                        {Number(tour.price).toLocaleString()} THB
                      </span>
                      <span className="text-xs text-gray-400">per person</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Link to="/tour" className="inline-flex items-center gap-1 text-sm font-medium text-primary-600">
                View All Tours <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Our Services */}
      <section className="bg-gray-50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-gray-900">Our Services</h2>
            <p className="mx-auto max-w-2xl text-gray-500">
              From airport pick-ups to island adventures, we offer a complete range of transportation and tour services.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div key={s.title} className="group rounded-2xl border border-gray-100 bg-white p-8 transition hover:border-primary-100 hover:shadow-lg">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition group-hover:bg-primary-600 group-hover:text-white">
                  <s.icon size={24} />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{s.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
