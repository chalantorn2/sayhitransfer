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
      <div className="bg-gradient-to-r from-primary-800 to-primary-900 py-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h1 className="text-3xl font-bold text-white">Tour Packages</h1>
          <p className="mt-2 text-blue-200">Explore amazing day trips and excursions across Thailand</p>
        </div>
      </div>

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
