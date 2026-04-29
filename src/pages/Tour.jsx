import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, SlidersHorizontal, ArrowRight } from "lucide-react";
import { fetchTours } from "../api";

const sortOptions = [
  { value: "name", label: "Name" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "province", label: "Province" },
];

export default function Tour() {
  const [tours, setTours] = useState([]);
  const [search, setSearch] = useState("");
  const [province, setProvince] = useState("");
  const [sort, setSort] = useState("name");

  useEffect(() => {
    fetchTours().then(setTours).catch(() => {});
  }, []);

  const provinces = useMemo(() => [...new Set(tours.map((t) => t.province))], [tours]);

  const filtered = useMemo(() => {
    let result = tours.filter((t) => {
      const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
      const matchProvince = !province || t.province === province;
      return matchSearch && matchProvince;
    });

    result.sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "province":
          return a.province.localeCompare(b.province);
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return result;
  }, [tours, search, province, sort]);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative overflow-hidden bg-primary-950">
        {/* Layered gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_70%_30%,rgba(59,130,246,0.25),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_20%_70%,rgba(16,185,129,0.12),transparent)]" />

        {/* Subtle decorative dots */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-20 right-[12%] h-2 w-2 rounded-full bg-white" />
          <div className="absolute top-28 right-[18%] h-1.5 w-1.5 rounded-full bg-white" />
          <div className="absolute top-24 right-[10%] h-1 w-1 rounded-full bg-white" />
          <div className="absolute bottom-28 left-[15%] h-2 w-2 rounded-full bg-white" />
          <div className="absolute bottom-20 left-[20%] h-1.5 w-1.5 rounded-full bg-white" />
          <div className="absolute top-16 left-[40%] h-1 w-1 rounded-full bg-white" />
        </div>

        {/* Soft glow accents */}
        <div className="absolute -top-24 left-1/4 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute -bottom-16 right-1/3 h-48 w-48 rounded-full bg-primary-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pt-24 pb-14 text-center lg:px-8 lg:pt-28 lg:pb-16">
          <h1 className="mb-3 text-3xl font-bold text-white lg:text-4xl">
            Discover <span className="bg-gradient-to-r from-primary-300 to-emerald-300 bg-clip-text text-transparent">Thailand</span>
          </h1>
          <p className="mx-auto mb-6 max-w-lg text-base font-light leading-relaxed text-blue-100/80">
            Handpicked day trips and sightseeing tours — from island hopping to temple visits.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {["Island Tours", "Temple Visits", "Adventure", "Cultural"].map((tag) => (
              <span key={tag} className="rounded-full border border-white/10 bg-white/[0.07] px-3.5 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm transition hover:bg-white/[0.12]">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom curve */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 48" fill="none" className="w-full text-gray-50" preserveAspectRatio="none">
            <path d="M0 48h1440V24C1200 0 960 40 720 40S240 0 0 24v24z" fill="currentColor" />
          </svg>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        {/* Filters */}
        <div className="mb-8 flex flex-wrap items-center gap-4 rounded-xl bg-white p-4 shadow-sm">
          <div className="relative flex-1">
            <Search size={18} className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search tours..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none" />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-gray-400" />
            <select value={province} onChange={(e) => setProvince(e.target.value)}
              className="rounded-lg border border-gray-200 bg-gray-50 py-2.5 px-3 text-sm text-gray-700 focus:border-primary-400 focus:outline-none">
              <option value="">All Provinces</option>
              {provinces.map((p) => (<option key={p} value={p}>{p}</option>))}
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)}
              className="rounded-lg border border-gray-200 bg-gray-50 py-2.5 px-3 text-sm text-gray-700 focus:border-primary-400 focus:outline-none">
              {sortOptions.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400">No tours found matching your criteria.</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((tour) => (
              <Link key={tour.id} to={`/tour/${tour.id}`} className="group overflow-hidden rounded-2xl border border-gray-100 bg-white transition hover:shadow-lg">
                <div className="aspect-[16/10] bg-gradient-to-br from-primary-200 to-primary-400 p-6">
                  <span className="inline-block rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-primary-700">{tour.province}</span>
                </div>
                <div className="p-5">
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 group-hover:text-primary-600">{tour.name}</h3>
                  <p className="mb-3 line-clamp-2 text-sm text-gray-500">{tour.description}</p>
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {(tour.highlights || []).map((h) => (
                      <span key={h} className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs text-primary-600">{h}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-primary-700">{Number(tour.price).toLocaleString()} THB</span>
                      <span className="ml-1 text-xs text-gray-400">/ person</span>
                    </div>
                    <span className="flex items-center gap-1 text-sm font-medium text-primary-600 opacity-0 transition group-hover:opacity-100">
                      Details <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
