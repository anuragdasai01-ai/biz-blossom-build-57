import { Phone, MessageCircle, MapPin, Instagram, Facebook, Clock, CalendarCheck } from "lucide-react";
import { business, links } from "@/config/business";
import { useBooking } from "@/lib/booking";

export function Footer() {
  const { openBooking } = useBooking();

  return (
    <footer className="border-t bg-foreground pb-24 text-background lg:pb-0">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-2xl font-semibold">{business.name}</p>
            <p className="mt-3 text-sm leading-relaxed text-background/70">
              A ladies' beauty parlour in Durga Colony, Rohtak — makeup, hair, skin care and
              grooming with a personal touch.
            </p>
            <div className="mt-4 flex gap-3">
              {business.instagram && (
                <a
                  href={business.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-background/20 transition-colors hover:bg-background/10"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {business.facebook && (
                <a
                  href={business.facebook}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-background/20 transition-colors hover:bg-background/10"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              <a
                href={links.whatsapp()}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-background/20 transition-colors hover:bg-background/10"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-background/80">Contact</p>
            <ul className="mt-4 space-y-3 text-sm text-background/70">
              <li>
                <a href={links.call} className="flex items-center gap-2 hover:text-background">
                  <Phone className="h-4 w-4" /> {business.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={links.whatsapp()}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:text-background"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp us
                </a>
              </li>
              <li>
                <a
                  href={links.directions}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-2 hover:text-background"
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  {business.address.line1}, {business.address.city}, {business.address.state}{" "}
                  {business.address.pincode}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-background/80">Hours</p>
            <ul className="mt-4 space-y-3 text-sm text-background/70">
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4" /> {business.hours.days}
              </li>
              <li className="pl-6">{business.hours.time}</li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-background/80">
              Ready when you are
            </p>
            <p className="mt-4 text-sm text-background/70">
              Book ahead and skip the wait — we confirm every appointment personally.
            </p>
            <button
              onClick={() => openBooking()}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-medium text-foreground transition-transform hover:-translate-y-0.5"
            >
              <CalendarCheck className="h-4 w-4" /> Book Your Appointment
            </button>
          </div>
        </div>

        <div className="mt-12 border-t border-background/15 pt-6 text-center text-xs text-background/50">
          © {new Date().getFullYear()} {business.fullName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
