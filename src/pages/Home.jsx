import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Clock,
  Headphones,
  Car,
  Plane,
  Map,
  Star,
  ArrowRight,
} from "lucide-react";
import TransferSearchForm from "../components/TransferSearchForm";
import { fetchTours } from "../api";

const features = [
  {
    icon: Shield,
    title: "Safe & Reliable",
    desc: "Professional drivers, well-maintained vehicles, and comprehensive insurance for your peace of mind.",
  },
  {
    icon: Clock,
    title: "24/7 Service",
    desc: "We operate round the clock. Early morning flights or late-night arrivals — we've got you covered.",
  },
  {
    icon: Headphones,
    title: "Easy Booking",
    desc: "Book online in minutes. Get instant confirmation and our team will reach out within 3 hours.",
  },
];

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

export default function Home() {
  const [tours, setTours] = useState([]);

  useEffect(() => {
    fetchTours().then(setTours).catch(() => {});
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white" />
          <div className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-white" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
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

      {/* Services */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-gray-900">Our Services</h2>
            <p className="mx-auto max-w-2xl text-gray-500">
              From airport pick-ups to island adventures, we offer a complete range of transportation and tour services.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div key={s.title} className="group rounded-2xl border border-gray-100 p-8 transition hover:border-primary-100 hover:shadow-lg">
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

      {/* Why Choose Us */}
      <section className="bg-primary-50/50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-gray-900">Why Choose SayHi Transfer?</h2>
            <p className="mx-auto max-w-2xl text-gray-500">
              We're dedicated to making your travel experience seamless and enjoyable.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl bg-white p-8 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                  <f.icon size={24} />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{f.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tours */}
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

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-900 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-white">Ready to Start Your Journey?</h2>
          <p className="mx-auto mb-8 max-w-xl text-blue-200">
            Book your transfer now and enjoy a hassle-free travel experience. We'll confirm your booking within 3 hours.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/transfer" className="rounded-lg bg-white px-8 py-3.5 text-sm font-semibold text-primary-700 shadow-lg transition hover:bg-gray-50">
              Book Transfer
            </Link>
            <Link to="/tour" className="rounded-lg border border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10">
              Explore Tours
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
