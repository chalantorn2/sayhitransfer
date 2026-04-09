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
      <div className="bg-gradient-to-r from-primary-800 to-primary-900 py-16">
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

      {/* Story */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Our Story
            </h2>
            <p className="mb-4 leading-relaxed text-gray-600">
              SayHi Transfer was founded with a simple mission: to make travel
              in Thailand stress-free and enjoyable. We noticed that many
              travelers struggled with finding safe, reliable transportation
              — especially between airports, hotels, and popular attractions.
            </p>
            <p className="leading-relaxed text-gray-600">
              Today, we serve thousands of happy travelers every year, offering
              airport transfers, hotel shuttles, and curated day trips across
              Thailand's most beautiful destinations. Our fleet of modern
              vehicles and team of professional drivers ensure every journey is
              comfortable and memorable.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary-50/50 py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 lg:grid-cols-4 lg:px-8">
          {[
            { number: "5,000+", label: "Happy Travelers" },
            { number: "50+", label: "Routes Available" },
            { number: "24/7", label: "Customer Support" },
            { number: "4.9/5", label: "Average Rating" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-primary-700">
                {stat.number}
              </p>
              <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-16">
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
                <div className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Phone</p>
                    <p className="font-medium text-gray-900">+66 76 123 456</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="font-medium text-gray-900">
                      info@sayhitransfer.com
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">LINE</p>
                    <p className="font-medium text-gray-900">@sayhitransfer</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                    <Globe size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Facebook</p>
                    <p className="font-medium text-gray-900">SayHi Transfer</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-xl bg-white p-4 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Office</p>
                    <p className="font-medium text-gray-900">
                      Phuket, Thailand
                    </p>
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
