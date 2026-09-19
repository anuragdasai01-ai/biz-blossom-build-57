import { Star, ExternalLink } from "lucide-react";
import { business } from "@/config/business";

export function Reviews() {
  return (
    <section id="reviews" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <div data-reveal className="mx-auto max-w-3xl rounded-3xl border bg-card p-8 text-center shadow-sm sm:p-14">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
          What Clients Say
        </p>
        <div className="mt-6 flex items-center justify-center gap-1.5" aria-label={`Rated ${business.rating.value} out of 5`}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className={`h-7 w-7 ${
                i <= Math.round(business.rating.value)
                  ? "fill-primary text-primary"
                  : "text-border"
              }`}
            />
          ))}
        </div>
        <p className="mt-4 font-display text-5xl font-semibold text-foreground">
          {business.rating.value}
        </p>
        <p className="mt-2 text-muted-foreground">
          Based on {business.rating.count} reviews on Google
        </p>
        <a
          href={business.mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-primary px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-accent"
        >
          Read our reviews on Google <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}
