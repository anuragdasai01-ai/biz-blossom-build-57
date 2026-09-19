# Shaleen Makeup Studio & Beauty Salon — Website Plan

A premium, elegant, feminine, mobile-first website for **Shaleen Makeup Studio and Beauty Salon**, Sonipat Stand Road, Durga Colony, Rohtak, Haryana 124001. Primary goal: turn local visitors into appointment bookings.

## Verified business details (used throughout)
- Name: Shaleen Makeup Studio and Beauty Salon
- Address: 1073/20, Sonipat Stand Rd, opposite Durga Girls Hostel, Durga Colony, Rohtak, Haryana 124001
- Phone / WhatsApp: 092538 72499 (tel: +919253872499, wa.me/919253872499)
- Hours: 10:00 AM – 8:00 PM, every day
- Google rating: 4.7 (573 reviews)
- Instagram / Facebook: configurable placeholders in the config file — easy to fill in later; social icons stay hidden until a link is added

## Design direction (from the brief)
- Palette: ivory / warm white base, soft blush and champagne accents, deep brown-charcoal text. One elegant accent (dusty rose). Not excessively pink.
- Typography: elegant serif display headings + clean sans body (via Google Fonts link).
- Subtle animations only (300–700ms): gentle section reveals, hover transitions, navbar transform. No glitter, bouncing, or heavy parallax.

## Page structure (single-page home at `/`, in the brief's conversion order)
1. Premium navbar — logo/name, nav links, visible "Book Appointment" button, three-dot More menu (Instagram, Facebook, WhatsApp, Call, Directions, Share via Web Share API with copy fallback, Opening Hours)
2. Hero — eyebrow "BEAUTY • CARE • CONFIDENCE", brand headline, one-line description, location shown, CTAs: Book Appointment / Get Directions / WhatsApp Us, with quick-action icon row (Call, WhatsApp, Directions, Instagram, Facebook, Book — all with accessible labels)
3. Trust strip — 4.7 Google rating with 573 reviews, open 7 days 10–8, local parlour in Durga Colony, easy directions
4. About — image left, copy right (eyebrow, heading, description, location, CTA)
5. Beauty Services — card grid grouped by category (Threading & Grooming, Waxing, Facials & Clean-ups, Hair Care & Styling, Makeup, Bridal); each card has an image and a "Book this service" action that preselects the service in the booking form. No prices (not verified)
6. Beauty Packages — shown only if enabled in config (off by default, since unverified)
7. Portfolio gallery — category-filtered grid (Hair, Makeup, Bridal, Nails, Facial) using tasteful generated beauty imagery, clearly replaceable with real client photos later
8. Instagram section — 3-column desktop / 2-column mobile grid of styled post placeholders linking to the profile once the URL is added
9. Reviews — Google rating 4.7 (573 reviews) with a "Read reviews on Google" link; no fabricated testimonial text
10. Visit Us — exact address, hours table, phone, embedded Google Maps, Get Directions button
11. Contact strip — "Let's Get You Ready" with Call / WhatsApp / Directions
12. Footer — full contact info, hours, socials, Book Your Appointment CTA

## Booking flow
- Multi-step form (dialog): Step 1 choose service → Step 2 preferred date → Step 3 time preference → Step 4 name + phone, with validation
- Submission shows "Appointment Request Received — we'll contact you to confirm" (never "confirmed", no real-time scheduling)
- WhatsApp fallback: every booking CTA can instead open wa.me with a pre-filled message naming the parlour and selected service

## Mobile & polish
- Fixed bottom mobile action bar (Book / WhatsApp / Call / Directions), safe-area aware, compact, hidden behind content
- Mobile-first layout, large touch targets, accessible labels and focus states
- SEO: route-level title/description/OG tags, BeautySalon JSON-LD structured data with name, address, phone, geo, opening hours, aggregate rating
- All content driven by one central `src/config/business.ts` config (name, phone, address, hours, services, gallery, socials) so the owner can update details in one place

## Technical notes
- TanStack Start single-page site at `/` (replaces the placeholder index)
- New semantic color tokens in `src/styles.css` (oklch ivory/blush/champagne/rose); fonts loaded via `<link>` in `__root.tsx`
- Generated imagery for hero/about/gallery saved under `src/assets/`
- Components under `src/components/` (Navbar, Hero, QuickActions, TrustStrip, About, Services, Gallery, Reviews, VisitUs, BookingDialog, MobileActionBar, Footer)
- No backend/database needed — everything is static content plus tel:/wa.me/maps links
