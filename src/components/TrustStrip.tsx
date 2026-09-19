import { Sparkles, CalendarCheck, MapPin, Star } from "lucide-react";
import { business } from "@/config/business";

const items = [
  { icon: Star, title: `${business.rating.value} Google Rating`, sub: `${business.rating.count} verified reviews` },
  { icon: CalendarCheck, title: "Appointments Available", sub: "Open 7 days, 10 AM – 8 PM" },
  { icon: Sparkles, title: "Ladies' Beauty Parlour", sub: "Makeup, hair, skin & grooming" },
  { icon: MapPin, title: "Easy to Reach", sub: "Sonipat Stand Rd, Durga Colony" },
];

export function TrustStrip() {
  return (
    <section className="border-y bg-secondary/60">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, sub }) => (
          <div key={title} data-reveal className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-card text-primary shadow-sm">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
