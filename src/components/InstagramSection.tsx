import { Instagram } from "lucide-react";
import { business } from "@/config/business";
import { portfolioItems } from "./Gallery";

export function InstagramSection() {
  const hasProfile = Boolean(business.instagram);

  return (
    <section className="bg-secondary/50 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div data-reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Stay Connected
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-foreground sm:text-5xl">
            Latest on Instagram
          </h2>
          <p className="mt-4 text-muted-foreground">
            {hasProfile
              ? "Fresh looks, offers and behind-the-scenes from the studio."
              : "We're setting up our Instagram — follow us soon for fresh looks and offers."}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-3">
          {portfolioItems.map((item) => {
            const inner = (
              <>
                <img
                  src={item.src}
                  alt={item.alt}
                  width={1024}
                  height={1280}
                  loading="lazy"
                  className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-foreground/30 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <Instagram className="h-8 w-8 text-background" />
                </span>
              </>
            );
            const cls = "group relative overflow-hidden rounded-2xl shadow-sm";
            return hasProfile ? (
              <a
                key={item.alt}
                href={business.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label={`View on Instagram: ${item.alt}`}
                className={cls}
              >
                {inner}
              </a>
            ) : (
              <div key={item.alt} className={cls}>
                {inner}
              </div>
            );
          })}
        </div>

        {hasProfile && (
          <div className="mt-10 text-center">
            <a
              href={business.instagram}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-accent"
            >
              <Instagram className="h-4 w-4" /> Follow @{business.name.replace(/\s+/g, "").toLowerCase()}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
