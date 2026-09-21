# Make "573 Google reviews" larger and bolder, matched to the hero/rating typography

## Current state (verified)

- `src/components/Reviews.tsx`, lines 137–142, the rating card shows:
  - The **4.7** score: `font-display text-5xl font-semibold text-foreground` (Cormorant Garamond, deep brown-charcoal).
  - The line below: `text-lg font-semibold text-foreground sm:text-xl` — body font (Jost), regular weight for "Based on … reviews on Google", with "573" in dusty rose (`text-primary`).
- The hero section (src/components/Hero.tsx) uses `font-display text-5xl font-semibold` for its headline and dusty-rose `text-primary` for accents.

So the review-count line is noticeably smaller and lighter than both the 4.7 above it and the hero headline.

## Change

Single edit in `src/components/Reviews.tsx`, the paragraph at lines 140–142:

1. Switch the whole line from the body font to the display font (`font-display`) so it shares Cormorant Garamond with the 4.7 and the hero headline.
2. Increase size from `text-lg sm:text-xl` to `text-2xl sm:text-3xl` — a clear step up, while staying smaller than the 4.7 so the score remains the focal point.
3. Increase weight to `font-bold` (700) so the line stands out next to the regular-weight supporting text.
4. Keep the existing colors: `text-foreground` (deep brown-charcoal, same as hero and 4.7) for the words, `text-primary` (dusty rose) for "573" — exactly the palette already shared by the hero.

## Result

"Based on **573** reviews on Google" renders larger and bolder in the same display typeface, brown and dusty-rose tones as the hero and the 4.7-star rating — no other sections or files touched.

## Verification

- Check the build log for a clean build.
- Playwright screenshot of the reviews card at mobile width (360px) to confirm the line is visibly larger/bolder and colors match the 4.7 above it.
