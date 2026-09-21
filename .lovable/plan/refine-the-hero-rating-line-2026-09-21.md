# Refine the Hero rating line

## Current state (verified)
In `src/components/Hero.tsx`, lines 42–56 render the rating block:
- Star icon `h-6`
- "4.7" — `font-display text-3xl font-bold sm:text-4xl`
- "573 Google reviews" — `font-display text-2xl font-bold sm:text-3xl`, with "573" in the dusty-rose accent (`text-primary`)
- Below it, a separate small line: "Durga Colony, Rohtak"

## Changes (all in src/components/Hero.tsx)

1. **Remove the location line.** Delete the `<p className="mt-2 text-sm ...">Durga Colony, Rohtak</p>` element. The address stays untouched everywhere else (Visit Us section, footer, contact cards).

2. **Make "4.7" smaller.** Reduce from `text-3xl sm:text-4xl` to `text-xl sm:text-2xl`, keeping the display serif and dropping to `font-semibold` so it reads as a quiet companion to the headline, not a second headline. Shrink the star icon to `h-5 w-5` to stay in proportion.

3. **Reduce "Google reviews" font size.** From `text-2xl sm:text-3xl` down to `text-lg sm:text-xl`, weight from `font-bold` to `font-medium` — same display serif family so it stays in the hero's typographic language.

4. **Clean up "573".** Remove the dusty-rose accent so the number sits in the same deep-brown foreground color as the rest of the line, at the same size and medium weight as "Google reviews". The result reads as one calm line — ★ 4.7 · 573 Google reviews — instead of competing emphasis.

## Result
A single understated serif line under the headline: star + "4.7 · 573 Google reviews", with no location text. All other sections, colors, and tokens unchanged.

## Verification
Playwright screenshot of the hero at desktop and mobile widths; check build log for errors.
