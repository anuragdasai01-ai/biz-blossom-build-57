import { CalendarCheck, MapPin, MessageCircle, Phone, Instagram, Facebook, Star } from "lucide-react";
import { business, links } from "@/config/business";
import { useBooking } from "@/lib/booking";
import heroImg from "@/assets/hero.jpg";

const quickActions = [
  { label: "Call us", href: links.call, icon: Phone },
  { label: "WhatsApp us", href: links.whatsapp(), icon: MessageCircle, external: true },
  { label: "Get directions", href: links.directions, icon: MapPin, external: true },
];

export function Hero() {
  const { openBooking } = useBooking();

  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt={`Inside ${business.fullName}`}
          width={1920}
          height={1280}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/30" />
      </div>

      <div className="relative mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-center px-4 pb-16 pt-28 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
          {business.tagline}
        </p>
        <h1 className="mt-4 max-w-2xl font-display text-5xl font-semibold leading-[1.05] text-foreground sm:text-6xl lg:text-7xl">
          Your Beauty,
          <br />
          Beautifully Yours.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          A ladies' beauty parlour in Durga Colony, Rohtak — makeup, hair, skin care and grooming
          with the personal attention you deserve.
        </p>

        <div className="mt-5 flex items-center gap-3">
          <Star className="h-5 w-5 fill-primary text-primary" />
          <span className="font-display text-xl font-semibold leading-none text-foreground sm:text-2xl">
            {business.rating.value}
          </span>
          <span className="font-display text-lg font-medium leading-none text-foreground sm:text-xl">
            · {business.rating.count} Google reviews
          </span>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            onClick={() => openBooking()}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-md transition-all hover:opacity-90"
          >
            <CalendarCheck className="h-4 w-4" /> Book Appointment
          </button>
          <a
            href={links.directions}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-background/70 px-6 py-3.5 text-sm font-medium text-foreground backdrop-blur transition-colors hover:bg-accent"
          >
            <MapPin className="h-4 w-4" /> Get Directions
          </a>
          <a
            href={links.whatsapp()}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-background/70 px-6 py-3.5 text-sm font-medium text-foreground backdrop-blur transition-colors hover:bg-accent"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp Us
          </a>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          {quickActions.map(({ label, href, icon: Icon, external }) => (
            <a
              key={label}
              href={href}
              {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
              aria-label={label}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary"
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}
          {business.instagram && (
            <a
              href={business.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Follow us on Instagram"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary"
            >
              <Instagram className="h-5 w-5" />
            </a>
          )}
          {business.facebook && (
            <a
              href={business.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Follow us on Facebook"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary"
            >
              <Facebook className="h-5 w-5" />
            </a>
          )}
          <button
            onClick={() => openBooking()}
            aria-label="Book an appointment"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary"
          >
            <CalendarCheck className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
