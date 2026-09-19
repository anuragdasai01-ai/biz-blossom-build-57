import { MapPin, Phone, Clock, Navigation, MessageCircle } from "lucide-react";
import { business, links } from "@/config/business";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function VisitUs() {
  return (
    <section id="visit" className="bg-secondary/50 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div data-reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Find Us</p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-foreground sm:text-5xl">
            Visit Us
          </h2>
          <p className="mt-4 text-muted-foreground">
            Drop by the studio — we're easy to find on Sonipat Stand Road, opposite Durga Girls Hostel.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div data-reveal className="space-y-6">
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">{business.fullName}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {business.address.line1}
                    <br />
                    {business.address.line2}
                    <br />
                    {business.address.city}, {business.address.state} {business.address.pincode}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div className="w-full">
                  <p className="font-semibold text-foreground">Opening Hours</p>
                  <dl className="mt-2 space-y-1 text-sm">
                    {days.map((d) => (
                      <div key={d} className="flex justify-between text-muted-foreground">
                        <dt>{d}</dt>
                        <dd className="font-medium text-foreground">10:00 AM – 8:00 PM</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">Call or WhatsApp</p>
                  <a href={links.call} className="text-sm text-primary hover:underline">
                    {business.phoneDisplay}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={links.directions}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
              >
                <Navigation className="h-4 w-4" /> Get Directions
              </a>
              <a
                href={links.whatsapp()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-accent"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp Us
              </a>
            </div>
          </div>

          <div data-reveal className="overflow-hidden rounded-3xl border shadow-sm">
            <iframe
              title={`Map showing ${business.fullName}`}
              src={business.mapsEmbed}
              className="h-full min-h-[420px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}
