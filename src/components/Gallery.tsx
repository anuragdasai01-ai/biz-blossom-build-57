import { useState } from "react";
import { CalendarCheck } from "lucide-react";
import { useBooking } from "@/lib/booking";
import hairImg from "@/assets/gallery-hair.jpg";
import makeupImg from "@/assets/gallery-makeup.jpg";
import bridalImg from "@/assets/gallery-bridal.jpg";
import nailsImg from "@/assets/gallery-nails.jpg";
import facialImg from "@/assets/gallery-facial.jpg";
import threadingImg from "@/assets/gallery-threading.jpg";

export const portfolioItems = [
  { src: hairImg, alt: "Elegant curled hairstyle", category: "Hair" },
  { src: makeupImg, alt: "Soft glam party makeup look", category: "Makeup" },
  { src: bridalImg, alt: "Traditional bridal makeup and styling", category: "Bridal" },
  { src: nailsImg, alt: "Nude rose manicure", category: "Nails" },
  { src: facialImg, alt: "Relaxing facial treatment", category: "Facial" },
  { src: threadingImg, alt: "Eyebrow threading in progress", category: "Threading" },
];

const filters = ["All", "Hair", "Makeup", "Bridal", "Nails", "Facial", "Threading"];

export function Gallery() {
  const [filter, setFilter] = useState("All");
  const { openBooking } = useBooking();
  const shown = filter === "All" ? portfolioItems : portfolioItems.filter((i) => i.category === filter);

  return (
    <section id="portfolio" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <div data-reveal className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Our Work</p>
        <h2 className="mt-3 font-display text-4xl font-semibold text-foreground sm:text-5xl">
          Beauty Portfolio
        </h2>
        <p className="mt-4 text-muted-foreground">
          A glimpse of the looks we create — from everyday elegance to bridal perfection.
        </p>
      </div>

      <div data-reveal className="mt-8 flex flex-wrap justify-center gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-4 py-2 text-sm transition-all ${
              filter === f
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-3">
        {shown.map((item) => (
          <figure
            key={item.alt}
            data-reveal
            className="group relative overflow-hidden rounded-2xl shadow-sm"
          >
            <img
              src={item.src}
              alt={item.alt}
              width={1024}
              height={1280}
              loading="lazy"
              className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/70 to-transparent px-4 pb-3 pt-10 text-sm font-medium text-background">
              {item.alt}
            </figcaption>
          </figure>
        ))}
      </div>

      <div data-reveal className="mt-12 text-center">
        <button
          onClick={() => openBooking()}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-medium text-primary-foreground shadow-md transition-opacity hover:opacity-90"
        >
          <CalendarCheck className="h-4 w-4" /> Book Your Beauty Appointment
        </button>
      </div>
    </section>
  );
}
