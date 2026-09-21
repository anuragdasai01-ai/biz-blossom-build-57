# Make "573 Google reviews" prominent in the Hero

## What changes

The hero currently shows the rating as a tiny muted line:

> ★ 4.7 · 573 Google reviews · Durga Colony, Rohtak

It sits in small body text (`text-sm`, muted grey) directly under a `text-5xl–7xl` serif headline, so it nearly disappears. The plan restyles it in the hero's own typographic language, matching the treatment already applied to the Reviews section card:

- Split the rating out of the muted meta line into its own prominent row:
  - Larger star icon (grows from 16px to ~24px, filled dusty rose).
  - "4.7" in the Cormorant Garamond display font, bold, sized `text-3xl` (up to `text-4xl` on larger screens) in the deep-brown foreground color — same family and weight as the hero headline.
  - "573 Google reviews" in the same display serif at `text-2xl sm:text-3xl`, bold, with **"573"** picked out in the dusty-rose primary accent — mirroring the Reviews card ("Based on **573** reviews on Google").
- The location ("· Durga Colony, Rohtak") moves to its own smaller muted line beneath, so the big rating text reads cleanly without clutter.
- Spacing adjusted (`mt-5`, generous line height) so the enlarged row keeps the hero's airy, elegant rhythm; the CTAs below shift down slightly to compensate.

## Files changed

- `src/components/Hero.tsx` — restructure the rating block (lines 42–47) only. No changes to headline, CTAs, quick actions, or any other section.

## Verification

- Playwright screenshot of the hero at desktop and mobile widths to confirm the rating text is visibly large and bold, serif, with "573" in dusty rose, and the layout stays balanced on small screens.
- Check the build log is clean.
