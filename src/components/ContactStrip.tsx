import { Phone, MessageCircle, MapPin, CalendarCheck } from "lucide-react";
import { links } from "@/config/business";
import { useBooking } from "@/lib/booking";

export function ContactStrip() {
  const { openBooking } = useBooking();

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <div
        data-reveal
        className="rounded-3xl bg-primary px-6 py-14 text-center shadow-lg sm:px-14"
      >
        <h2 className="font-display text-4xl font-semibold text-primary-foreground sm:text-5xl">
          Let's Get You Ready
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-primary-foreground/85">
          For a wedding, a party, or a well-earned afternoon of self-care — we'd love to see you.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => openBooking()}
            className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-medium text-foreground shadow-sm transition-transform hover:-translate-y-0.5"
          >
            <CalendarCheck className="h-4 w-4" /> Book Appointment
          </button>
          <a
            href={links.call}
            className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/40 px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/10"
          >
            <Phone className="h-4 w-4" /> Call
          </a>
          <a
            href={links.whatsapp()}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/40 px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/10"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
          <a
            href={links.directions}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/40 px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/10"
          >
            <MapPin className="h-4 w-4" /> Directions
          </a>
        </div>
      </div>
    </section>
  );
}
