import { useCallback, useEffect, useRef, useState } from "react";
import { Star, ExternalLink, Quote } from "lucide-react";
import { business, testimonials } from "@/config/business";

const RESUME_DELAY_MS = 4000;
const DRIFT_SPEED = 0.4; // px per frame

function TestimonialCard({
  quote,
  name,
  service,
  ariaHidden = false,
}: {
  quote: string;
  name: string;
  service: string;
  ariaHidden?: boolean;
}) {
  return (
    <figure
      aria-hidden={ariaHidden}
      className="flex w-[280px] shrink-0 snap-center flex-col rounded-3xl border bg-card p-7 shadow-sm sm:w-[340px]"
    >
      <Quote className="h-6 w-6 text-primary/50" aria-hidden="true" />
      <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-foreground/90">
        {quote}
      </blockquote>
      <div
        className="mt-5 flex items-center gap-1"
        aria-label={`Rated 5 out of 5`}
      >
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
        ))}
      </div>
      <figcaption className="mt-3 flex items-baseline gap-2">
        <span className="font-display text-lg font-semibold text-foreground">
          {name}
        </span>
        <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {service}
        </span>
      </figcaption>
    </figure>
  );
}

export function Reviews() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reducedMotion = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion.current = mq.matches;
    const onChange = (e: MediaQueryListEvent) => {
      reducedMotion.current = e.matches;
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // When the user interacts, stop the drift and align the row to the nearest
  // card so manual browsing starts from a clean position.
  const pause = useCallback(() => {
    setPaused(true);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setPaused(false), RESUME_DELAY_MS);
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("figure");
    if (!card) return;
    const step = card.getBoundingClientRect().width + 20; // card + gap
    const target = Math.round(track.scrollLeft / step) * step;
    track.scrollTo({ left: target, behavior: "smooth" });
  }, []);

  // Continuous drift: rAF advances scroll position, wrapping seamlessly across
  // the duplicated card list. Paused while the user is interacting.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let raf = 0;
    let acc = track.scrollLeft;
    const step = () => {
      if (!paused && !reducedMotion.current) {
        const half = track.scrollWidth / 2;
        if (half > 0) {
          acc += DRIFT_SPEED;
          if (acc >= half) acc -= half;
          track.scrollLeft = acc;
        }
      } else {
        acc = track.scrollLeft;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  useEffect(() => {
    return () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
  }, []);

  const pauseHandlers = {
    onPointerDown: pause,
    onTouchStart: pause,
    onWheel: pause,
    onMouseEnter: pause,
    onFocus: pause,
  };

  return (
    <section id="reviews" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
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

        <div data-reveal className="mt-14">
          <div
            {...pauseHandlers}
            className="-mx-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [mask-image:linear-gradient(to_right,transparent,black_32px,black_calc(100%-32px),transparent)]"
            ref={trackRef}
            role="region"
            aria-label="Client testimonials carousel"
          >
            <div className="flex w-max gap-5">
              {[...testimonials, ...testimonials].map((t, i) => (
                <TestimonialCard
                  key={`${t.name}-${i}`}
                  quote={t.quote}
                  name={t.name}
                  service={t.service}
                  ariaHidden={i >= testimonials.length}
                />
              ))}
            </div>
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Swipe to browse · <a href={business.mapsUrl} target="_blank" rel="noreferrer" className="story-link text-primary">Read all reviews on Google</a>
          </p>
        </div>
      </div>
    </section>
  );
}
