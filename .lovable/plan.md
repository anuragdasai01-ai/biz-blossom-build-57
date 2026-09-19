# Rotating Testimonial Carousel

Add an auto-scrolling horizontal testimonial carousel below the existing 4.7-star rating card in the Reviews section. Review texts are clearly-marked editable placeholders (never presented as real customer quotes) until real Google reviews are provided.

## What will change

1. **Config** — `src/config/business.ts` gets a new `testimonials` array of 5 entries (quote, name, rating, optional service). Each entry is flagged with a `// PLACEHOLDER — replace with real Google review` comment; the section copy stays honest (no invented specifics, no fake stats).
2. **Component** — rebuild `src/components/Reviews.tsx`:
   - Keep the existing big rating summary card (4.7 stars, 573 reviews, "Read our reviews on Google") exactly as is, positioned above.
   - Below it, a horizontal carousel of 5 testimonial cards: quote text, star row, reviewer first name + service tag.
   - Cards use CSS `scroll-snap` in a native overflow-x container — users swipe, drag, or scroll horizontally at their own pace; edge fade masks hint there is more.
3. **Auto-scroll behaviour**:
   - When idle, the carousel drifts smoothly sideways in a continuous loop (duplicated card list for seamless wrap).
   - Any user interaction (touch, pointer down, wheel, hover on desktop, drag) pauses it immediately.
   - It resumes gently ~4 seconds after the last interaction.
   - Disabled entirely under `prefers-reduced-motion: reduce` — becomes a normal swipeable row.
   - Implementation: `requestAnimationFrame` loop adjusting scroll position; cleanup on unmount; no new dependencies.
4. **Styling** — existing ivory/blush/champagne tokens, Cormorant Garamond quote marks, `data-reveal` fade-up; 300–700ms transitions only.

## Files touched

- `src/config/business.ts` — add placeholder `testimonials` array
- `src/components/Reviews.tsx` — add carousel under rating card

## Verification

- Build OK, no console errors; Playwright confirms cards render, drift animates, and manual swipe pauses auto-scroll on a 360px viewport.
