<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture decisions

- Booking form submissions are inserted server-side into `public.booking_requests` (via `src/lib/booking.functions.ts`, service-role client, zod-validated, phone rate-limit) before the success screen shows — a submission must demonstrably reach the studio, not only display success. The table is private: no anon/authenticated grants or policies; owner reads via Cloud UI or a future admin surface.

