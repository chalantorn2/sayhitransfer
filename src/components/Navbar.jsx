import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/transfer", label: "Transfer" },
  { to: "/tour", label: "Tour" },
  { to: "/about", label: "About Us" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const mobileRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close mobile menu on route change
  useEffect(() => setOpen(false), [pathname]);

  /* ---- colour mode: transparent on top vs solid ---- */
  const transparent = !scrolled && !open;

  return (
    <nav
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        transparent
          ? "bg-transparent"
          : "bg-white/80 shadow-lg shadow-black/[.04] backdrop-blur-xl"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 lg:px-8">
        {/* ---- Logo ---- */}
        <Link to="/" className="group flex items-center gap-2.5">
          <div
            className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl transition-all duration-300 ${
              transparent
                ? "bg-white/20 ring-1 ring-white/30 backdrop-blur"
                : "bg-white shadow-md shadow-primary-600/25 ring-1 ring-primary-100"
            }`}
          >
            <img
              src="/logo.jpg"
              alt="SayHi Transfer"
              className="h-full w-full object-cover"
            />
          </div>
          <span
            className={`text-xl font-semibold transition-colors duration-300 ${
              transparent ? "text-white" : "text-primary-900"
            }`}
          >
            SayHi{" "}
            <span
              className={`font-light transition-colors duration-300 ${
                transparent ? "text-primary-200" : "text-primary-500"
              }`}
            >
              Transfer
            </span>
          </span>
        </Link>

        {/* ---- Desktop links ---- */}
        <ul className="hidden items-center gap-0.5 md:flex">
          {navLinks.map((l) => {
            const active = pathname === l.to;
            return (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className={`group relative px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    transparent
                      ? active
                        ? "text-white"
                        : "text-white/75 hover:text-white"
                      : active
                        ? "text-primary-700"
                        : "text-gray-500 hover:text-primary-700"
                  }`}
                >
                  {l.label}
                  {/* animated underline */}
                  <span
                    className={`absolute bottom-0 left-1/2 h-0.5 -translate-x-1/2 rounded-full transition-all duration-300 ${
                      transparent
                        ? "bg-white"
                        : "bg-primary-600"
                    } ${active ? "w-5" : "w-0 group-hover:w-4"}`}
                  />
                </Link>
              </li>
            );
          })}

          {/* CTA */}
          <li className="ml-4">
            <Link
              to="/transfer"
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                transparent
                  ? "bg-white text-primary-700 shadow-lg shadow-black/10 hover:bg-primary-50"
                  : "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md shadow-primary-600/25 hover:shadow-lg hover:shadow-primary-600/30"
              }`}
            >
              <Phone size={15} strokeWidth={2.5} />
              Book Now
            </Link>
          </li>
        </ul>

        {/* ---- Mobile toggle ---- */}
        <button
          onClick={() => setOpen(!open)}
          className={`rounded-xl p-2.5 transition-colors duration-200 md:hidden ${
            transparent
              ? "text-white hover:bg-white/10"
              : "text-gray-600 hover:bg-gray-100"
          }`}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ---- Mobile menu ---- */}
      <div
        ref={mobileRef}
        className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
          open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-gray-100/60 bg-white/95 px-4 pb-4 pt-2 backdrop-blur-xl">
          <ul className="space-y-0.5">
            {navLinks.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    pathname === l.to
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-primary-700"
                  }`}
                >
                  {pathname === l.to && (
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-600" />
                  )}
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            to="/transfer"
            onClick={() => setOpen(false)}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-primary-600/25 transition-shadow hover:shadow-lg"
          >
            <Phone size={15} strokeWidth={2.5} />
            Book Now
          </Link>
        </div>
      </div>
    </nav>
  );
}
