import { ArrowRight } from "lucide-react";
import { serviceCategories } from "@/config/business";
import { useBooking } from "@/lib/booking";
import threadingImg from "@/assets/gallery-threading.jpg";
import facialImg from "@/assets/gallery-facial.jpg";
import hairImg from "@/assets/gallery-hair.jpg";
import makeupImg from "@/assets/gallery-makeup.jpg";
import bridalImg from "@/assets/gallery-bridal.jpg";
import nailsImg from "@/assets/gallery-nails.jpg";

const categoryImages: Record<string, string> = {
  "Threading & Grooming": threadingImg,
  Waxing: nailsImg,
  "Facials & Clean-ups": facialImg,
  "Hair Care & Styling": hairImg,
  Makeup: makeupImg,
  Bridal: bridalImg,
};

export function Services() {
  const { openBooking } = useBooking();

  return (
    <section id="services" className="bg-secondary/50 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div data-reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">What We Do</p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-foreground sm:text-5xl">
            Beauty Services
          </h2>
          <p className="mt-4 text-muted-foreground">
            Explore our range of beauty and grooming services — tap any service to book it right away.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {serviceCategories.map((cat) => (
            <article
              key={cat.category}
              data-reveal
              className="group overflow-hidden rounded-3xl border bg-card shadow-sm transition-shadow duration-500 hover:shadow-lg"
            >
              <div className="overflow-hidden">
                <img
                  src={categoryImages[cat.category]}
                  alt={cat.category}
                  width={1024}
                  height={1280}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-2xl font-semibold text-foreground">{cat.category}</h3>
                <ul className="mt-3 space-y-1.5">
                  {cat.items.map((item) => (
                    <li key={item} className="flex items-center justify-between gap-2 text-sm">
                      <span className="text-muted-foreground">{item}</span>
                      <button
                        onClick={() => openBooking(item)}
                        aria-label={`Book ${item}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-primary opacity-80 transition-opacity hover:opacity-100"
                      >
                        Book <ArrowRight className="h-3 w-3" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <p data-reveal className="mt-10 text-center text-sm text-muted-foreground">
          Looking for something specific? Call or WhatsApp us and we'll help you choose.
        </p>
      </div>
    </section>
  );
}
