import { useCallback, useEffect, useRef, useState } from "react";
import { Star, ExternalLink, Quote } from "lucide-react";
import { business, testimonials } from "@/config/business";

const RESUME_DELAY_MS = 4000;
const DRIFT_SPEED = 0.8; // px per frame

function TestimonialCard({
  quote,
  name,
  service,
  rating,
  ariaHidden = false,
}: {
  quote: string;
  name: string;
  service: string;
  rating?: number | undefined;
  ariaHidden?: boolean;
}) {
  return (
    <figure
      aria-hidden={ariaHidden}
      data-reveal="soft"
      className="flex w-[280px] shrink-0 snap-center flex-col rounded-3xl border bg-card p-7 shadow-sm sm:w-[340px]"
    >
      <Quote className="h-6 w-6 text-primary/50" aria-hidden="true" />
      <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-foreground/90">
        {quote}
      </blockquote>
      {typeof rating === "number" ? (
        <div
          className="mt-5 flex items-center gap-1"
          aria-label={`Rated ${rating} out of 5`}
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${
                i <= Math.round(rating)
                  ? "fill-primary text-primary"
                  : "text-border"
              }`}
            />
          ))}
        </div>
      ) : (
        <p className="mt-5 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Google review
        </p>
      )}
      <figcaption className="mt-3 flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent font-display text-lg font-semibold text-accent-foreground"
        >
          {name.charAt(0).toUpperCase()}
        </span>
        <span className="flex flex-col">
          <span className="font-display text-lg font-semibold text-foreground">
            {name}
          </span>
          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {service}
          </span>
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

  // Count the rating and review total up once the rating card scrolls into view.
  const cardRef = useRef<HTMLDivElement>(null);
  const [shownRating, setShownRating] = useState(business.rating.value);
  const [shownCount, setShownCount] = useState(business.rating.count);
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const duration = 1400;
        const start = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setShownRating(Math.round(business.rating.value * eased * 10) / 10);
          setShownCount(Math.round(business.rating.count * eased));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // When the user interacts, stop the drift; it resumes automatically a few
  // seconds after the user lets go.
  const pause = useCallback(() => {
    setPaused(true);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setPaused(false), RESUME_DELAY_MS);
  }, []);

  // Width of one card + gap, and the length of one full set of cards.
  const stepSize = useCallback(() => {
    const track = trackRef.current;
    const card = track?.querySelector("figure");
    if (!track || !card) return 0;
    return card.getBoundingClientRect().width + 20; // card + gap
  }, []);
  const loopLength = useCallback(() => stepSize() * testimonials.length, [stepSize]);

  // Continuous drift: rAF advances scroll position, wrapping seamlessly across
  // the duplicated card list. Paused while the user is interacting. The loop
  // idles completely when the carousel is off-screen or the tab is hidden, so
  // it never burns frames while the visitor is elsewhere on the page.
  const inView = useRef(true);
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const io = new IntersectionObserver(
      (entries) => {
        inView.current = entries.some((e) => e.isIntersecting);
        if (inView.current) acc.current = track.scrollLeft;
      },
      { threshold: 0.05 },
    );
    io.observe(track);
    return () => io.disconnect();
  }, []);

  const acc = useRef(0);
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    acc.current = track.scrollLeft;

    let raf = 0;
    const step = () => {
      if (
        inView.current &&
        document.visibilityState === "visible" &&
        !paused &&
        !reducedMotion.current
      ) {
        const half = loopLength();
        if (half > 0) {
          acc.current += DRIFT_SPEED;
          if (acc.current >= half) acc.current -= half;
          track.scrollLeft = acc.current;
        }
      } else {
        acc.current = track.scrollLeft;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [paused, loopLength]);

  useEffect(() => {
    return () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
      if (settleTimer.current) clearTimeout(settleTimer.current);
    };
  }, []);

  // Move exactly one card per swipe/wheel gesture, so a fast flick can never
  // jump from the first testimonial to the last. Native horizontal scrolling
  // is disabled on the track; gestures are handled here.
  const targetIndex = useRef<number | null>(null);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollByCard = useCallback(
    (dir: 1 | -1) => {
      const track = trackRef.current;
      if (!track) return;
      const step = stepSize();
      if (!step) return;
      const loop = loopLength();
      pause();
      // Start from the card currently in view (or the card we are already
      // animating towards), then move exactly one card.
      let idx = targetIndex.current ?? Math.round(track.scrollLeft / step);
      // Wrap inside the duplicated list so there is always room to move.
      if (dir === 1 && idx >= testimonials.length) {
        idx -= testimonials.length;
        track.scrollLeft -= loop;
      } else if (dir === -1 && idx <= 0) {
        idx += testimonials.length;
        track.scrollLeft += loop;
      }
      const next = idx + dir;
      targetIndex.current = next;
      track.scrollTo({ left: next * step, behavior: "smooth" });
      if (settleTimer.current) clearTimeout(settleTimer.current);
      settleTimer.current = setTimeout(() => {
        targetIndex.current = null;
      }, 600);
    },
    [pause, stepSize, loopLength],
  );

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const wheelLock = useRef(false);

  const gestureHandlers = {
    onMouseEnter: pause,
    onFocus: pause,
    onTouchStart: (e: React.TouchEvent<HTMLDivElement>) => {
      const t = e.touches[0];
      if (!t) return;
      touchStartX.current = t.clientX;
      touchStartY.current = t.clientY;
      pause();
    },
    onTouchEnd: (e: React.TouchEvent<HTMLDivElement>) => {
      const startX = touchStartX.current;
      const startY = touchStartY.current;
      touchStartX.current = null;
      touchStartY.current = null;
      const t = e.changedTouches[0];
      if (startX == null || startY == null || !t) return;
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      if (Math.abs(dx) > 24 && Math.abs(dx) > Math.abs(dy)) {
        scrollByCard(dx < 0 ? 1 : -1);
      }
    },
    onWheel: (e: React.WheelEvent<HTMLDivElement>) => {
      // Only horizontal wheel/trackpad swipes move the carousel; vertical
      // scrolling keeps scrolling the page.
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      pause();
      if (Math.abs(e.deltaX) < 8 || wheelLock.current) return;
      wheelLock.current = true;
      setTimeout(() => {
        wheelLock.current = false;
      }, 500);
      scrollByCard(e.deltaX > 0 ? 1 : -1);
    },
  };

  return (
    <section id="reviews" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div ref={cardRef} data-reveal="zoom" className="mx-auto max-w-3xl rounded-3xl border bg-card p-8 text-center shadow-sm sm:p-14">
          <p className="eyebrow eyebrow-center text-xs font-semibold uppercase tracking-[0.3em] text-primary">
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
            {shownRating}
          </p>
          <p className="mt-4 font-display text-2xl font-bold text-foreground sm:text-3xl">
            Based on <span className="text-primary">{shownCount}</span> reviews on Google
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
            {...gestureHandlers}
            className="-mx-4 overflow-x-hidden px-4 pb-2 [touch-action:pan-y] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [mask-image:linear-gradient(to_right,transparent,black_32px,black_calc(100%-32px),transparent)]"
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
                  rating={t.rating}
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
