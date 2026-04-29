import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Check, X, MapPin, Calendar, Users, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchTour } from "../api";

export default function TourDetail() {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);

  const gallery = tour?.gallery || [];

  const openLightbox = (index) => { setCurrentImg(index); setLightboxOpen(true); };
  const closeLightbox = () => setLightboxOpen(false);
  const prevImg = useCallback(() => setCurrentImg((p) => (p - 1 + gallery.length) % gallery.length), [gallery.length]);
  const nextImg = useCallback(() => setCurrentImg((p) => (p + 1) % gallery.length), [gallery.length]);

  useEffect(() => {
    setLoading(true);
    fetchTour(id)
      .then(setTour)
      .catch(() => setTour(null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevImg();
      if (e.key === "ArrowRight") nextImg();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxOpen, prevImg, nextImg]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary-600" />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">Tour Not Found</h2>
        <Link to="/tour" className="flex items-center gap-2 text-primary-600 hover:underline">
          <ArrowLeft size={16} /> Back to Tours
        </Link>
      </div>
    );
  }

  const highlights = tour.highlights || [];
  const schedule = tour.schedule || [];
  const included = tour.included || [];
  const notIncluded = tour.not_included || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative bg-gradient-to-br from-primary-700 to-primary-900 pt-28 pb-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-white" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <Link to="/tour" className="mb-4 inline-flex items-center gap-1 text-sm text-blue-200 transition hover:text-white">
            <ArrowLeft size={16} /> Back to Tours
          </Link>
          <span className="mb-3 block">
            <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur">{tour.province}</span>
          </span>
          <h1 className="text-3xl font-bold text-white lg:text-4xl">{tour.name}</h1>
        </div>
      </div>

      {/* Gallery */}
      {gallery.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 pt-10 lg:px-8">
          <div className={`grid gap-3 ${gallery.length === 1 ? "grid-cols-1" : gallery.length === 2 ? "grid-cols-2" : "grid-cols-2 md:grid-cols-4"}`}>
            {gallery.slice(0, 5).map((img, i) => (
              <button
                key={i}
                onClick={() => openLightbox(i)}
                className={`group relative overflow-hidden rounded-xl ${
                  gallery.length >= 3 && i === 0 ? "col-span-2 row-span-2" : ""
                }`}
              >
                <img src={img} alt={`${tour.name} ${i + 1}`} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" style={{ minHeight: gallery.length >= 3 && i === 0 ? "320px" : "154px" }} />
                <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
                {i === 4 && gallery.length > 5 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <span className="text-lg font-semibold text-white">+{gallery.length - 5} more</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90" onClick={closeLightbox}>
          <button onClick={(e) => { e.stopPropagation(); closeLightbox(); }} className="absolute top-4 right-4 text-3xl text-white/80 hover:text-white">&times;</button>
          <button onClick={(e) => { e.stopPropagation(); prevImg(); }} className="absolute left-4 rounded-full bg-white/10 p-2 text-white backdrop-blur hover:bg-white/20"><ChevronLeft size={28} /></button>
          <img src={gallery[currentImg]} alt="" className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain" onClick={(e) => e.stopPropagation()} />
          <button onClick={(e) => { e.stopPropagation(); nextImg(); }} className="absolute right-4 rounded-full bg-white/10 p-2 text-white backdrop-blur hover:bg-white/20"><ChevronRight size={28} /></button>
          <div className="absolute bottom-4 text-sm text-white/70">{currentImg + 1} / {gallery.length}</div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            {/* Description */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-3 text-xl font-semibold text-gray-900">Overview</h2>
              <p className="leading-relaxed text-gray-600">{tour.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {highlights.map((h) => (
                  <span key={h} className="rounded-full bg-primary-50 px-3 py-1 text-sm text-primary-600">{h}</span>
                ))}
              </div>
            </div>

            {/* Schedule */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Program Schedule</h2>
              <div className="space-y-4">
                {schedule.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50">
                        <Clock size={16} className="text-primary-600" />
                      </div>
                      {i < schedule.length - 1 && <div className="h-full w-px bg-primary-100" />}
                    </div>
                    <div className="pb-4">
                      <span className="text-sm font-semibold text-primary-700">{item.time}</span>
                      <p className="text-gray-600">{item.activity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Included / Not Included */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="mb-3 text-lg font-semibold text-green-700">What's Included</h3>
                <ul className="space-y-2">
                  {included.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check size={16} className="mt-0.5 shrink-0 text-green-500" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="mb-3 text-lg font-semibold text-red-600">Not Included</h3>
                <ul className="space-y-2">
                  {notIncluded.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                      <X size={16} className="mt-0.5 shrink-0 text-red-400" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 text-center">
                <span className="text-3xl font-bold text-primary-700">{Number(tour.price).toLocaleString()} THB</span>
                <p className="text-sm text-gray-400">per person</p>
              </div>
              <div className="mb-4 space-y-3 text-sm text-gray-500">
                <div className="flex items-center gap-2"><MapPin size={16} className="text-primary-500" />{tour.province}, Thailand</div>
                <div className="flex items-center gap-2"><Calendar size={16} className="text-primary-500" />Full day trip</div>
                <div className="flex items-center gap-2"><Users size={16} className="text-primary-500" />Group or private</div>
              </div>
              <a href="https://line.me/R/ti/p/@sayhitransfer" target="_blank" rel="noopener noreferrer"
                className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/30 transition hover:bg-primary-700">
                Book This Tour
              </a>
              <p className="text-center text-xs text-gray-400">Contact us via LINE or email to book</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
