import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Globe,
  Shield,
  Award,
  Heart,
  Users,
} from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Safety First",
    desc: "All vehicles are regularly inspected and drivers are professionally trained with valid licenses.",
  },
  {
    icon: Award,
    title: "Quality Service",
    desc: "We pride ourselves on punctuality, comfort, and a seamless experience from booking to arrival.",
  },
  {
    icon: Heart,
    title: "Customer Care",
    desc: "Our dedicated team is available 24/7 to assist you with any questions or special requests.",
  },
  {
    icon: Users,
    title: "Local Expertise",
    desc: "With years of experience in Thailand's tourism industry, we know every route and destination.",
  },
];

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-800 to-primary-900 pt-28 pb-16">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h1 className="mb-3 text-3xl font-bold text-white lg:text-4xl">
            About SayHi Transfer
          </h1>
          <p className="mx-auto max-w-2xl text-blue-200">
            Your trusted transportation partner in Thailand since day one. We
            connect travelers with reliable, comfortable, and affordable
            transfer services.
          </p>
        </div>
      </div>

      {/* Certifications */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Certified & Licensed
            </h2>
          </div>

          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
            {[
              {
                src: "/documents/tat.png",
                title: "TAT License",
              },
              {
                src: "/documents/dbd.png",
                title: "DBD Registration",
              },
            ].map((doc) => (
              <div key={doc.title} className="flex flex-col items-center">
                <a
                  href={doc.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  <img
                    src={doc.src}
                    alt={doc.title}
                    className="h-[500px] w-full object-contain bg-gray-50 p-4 transition group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                </a>
                <h3 className="mt-5 text-lg font-semibold text-gray-900">
                  {doc.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-primary-50/50 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="mb-10 text-center text-2xl font-bold text-gray-900">
            Why Travelers Choose Us
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <v.icon size={28} />
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">{v.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                Contact Us
              </h2>
              <p className="mb-8 text-gray-500">
                Have questions or need assistance? We'd love to hear from you.
                Reach out through any of these channels.
              </p>
              <div className="space-y-4">
                <a
                  href="https://wa.me/66803895519"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Phone</p>
                    <p className="font-medium text-gray-900">+66 80 389 5519</p>
                  </div>
                </a>
                <a
                  href="mailto:tptravelandtour@gmail.com"
                  className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="font-medium text-gray-900">
                      tptravelandtour@gmail.com
                    </p>
                  </div>
                </a>
                <a
                  href="https://wa.me/66803895519"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">WhatsApp</p>
                    <p className="font-medium text-gray-900">+66 80 389 5519</p>
                  </div>
                </a>
                <a
                  href="https://www.facebook.com/share/1EVsQwfz9c/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                    <Globe size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Facebook</p>
                    <p className="font-medium text-gray-900">SayHi Transfer</p>
                  </div>
                </a>
                <div className="flex items-start gap-4 rounded-xl bg-white p-4 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Office</p>
                    <p className="font-medium text-gray-900">Krabi, Thailand</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="overflow-hidden rounded-2xl bg-gray-200">
              <iframe
                title="Office Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253057.54aborte!2d98.2882!3d7.8804!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x305031e2c462524f%3A0xe301e950e2b3e005!2sPhuket!5e0!3m2!1sen!2sth!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 400 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
