import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Globe, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary-950 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-sm font-bold text-white">
                SH
              </div>
              <span className="text-lg font-semibold text-white">
                SayHi Transfer
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Your trusted transfer and tour service in Thailand. Reliable,
              comfortable, and affordable transportation for every journey.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="transition hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/transfer" className="transition hover:text-white">
                  Transfer Service
                </Link>
              </li>
              <li>
                <Link to="/tour" className="transition hover:text-white">
                  Tour Packages
                </Link>
              </li>
              <li>
                <Link to="/about" className="transition hover:text-white">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4 font-semibold text-white">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>Airport Transfer</li>
              <li>Hotel Transfer</li>
              <li>Pier Transfer</li>
              <li>One Day Trip</li>
              <li>Private Charter</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-semibold text-white">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-primary-400" />
                <span>+66 76 123 456</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-primary-400" />
                <span>info@sayhitransfer.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0 text-primary-400" />
                <span>Phuket, Thailand</span>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle size={16} className="text-primary-400" />
                <span>@sayhitransfer</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe size={16} className="text-primary-400" />
                <span>SayHi Transfer</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-primary-900 pt-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} SayHi Transfer. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
