import { MapPin, CalendarCheck } from "lucide-react";
import { business } from "@/config/business";
import { useBooking } from "@/lib/booking";
import aboutImg from "@/assets/about.jpg";

export function About() {
  const { openBooking } = useBooking();

  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div data-reveal className="relative">
          <div className="overflow-hidden rounded-3xl shadow-lg">
            <img
              src={aboutImg}
              alt={`A beautician at ${business.name} applying makeup for a client`}
              width={1024}
              height={1280}
              loading="lazy"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-5 -right-3 rounded-2xl bg-card px-5 py-4 shadow-lg sm:-right-6">
            <p className="font-display text-3xl font-semibold text-primary">{business.rating.value}★</p>
            <p className="text-xs text-muted-foreground">{business.rating.count} Google reviews</p>
          </div>
        </div>

        <div data-reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">About Us</p>
          <h2 className="mt-3 font-display text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            Care, skill and a personal touch
          </h2>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            {business.name} is a neighbourhood beauty parlour on Sonipat Stand Road, Durga Colony,
            Rohtak — a place where every client gets unhurried, personal attention. From everyday
            grooming like threading and waxing to facials, hair styling and complete bridal looks,
            everything is done with care, hygiene and an eye for detail.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Whether it's your big day or just a little time for yourself, walk in or book ahead —
            we're open every day from 10 AM to 8 PM.
          </p>
          <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            {business.address.line1}, {business.address.city}
          </div>
          <button
            onClick={() => openBooking()}
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
          >
            <CalendarCheck className="h-4 w-4" /> Book Your Visit
          </button>
        </div>
      </div>
    </section>
  );
}
