import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const bookingSchema = z.object({
  service: z.string().trim().min(1).max(120),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
  timeSlot: z.string().trim().min(1).max(60),
  name: z.string().trim().min(2).max(100),
// Indian mobile numbers: optional +91 prefix, starts 6-9, exactly 10 digits.
const normalizePhone = (raw: string) => raw.trim().replace(/[\s-]/g, "");

const bookingSchema = z.object({
  service: z.string().trim().min(1).max(120),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
  timeSlot: z.string().trim().min(1).max(60),
  name: z.string().trim().min(2).max(100),
  phone: z
    .string()
    .trim()
    .transform(normalizePhone)
    .pipe(z.string().regex(/^(\+91)?[6-9]\d{9}$/, "Invalid phone")),
  notes: z.string().trim().max(500).optional(),
});

export interface SubmitBookingResult {
  ok: boolean;
  error?: string;
}

export const submitBookingRequest = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => bookingSchema.parse(input))
  .handler(async ({ data }): Promise<SubmitBookingResult> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Abuse guard: at most 3 requests from the same phone number in 10 minutes.
    const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { count } = await supabaseAdmin
      .from("booking_requests")
      .select("id", { count: "exact", head: true })
      .eq("phone", data.phone)
      .gte("created_at", since);
    if ((count ?? 0) >= 3) {
      return {
        ok: false,
        error:
          "We've received several requests from this number already. Please call us instead.",
      };
    }

    const { error } = await supabaseAdmin.from("booking_requests").insert({
      service: data.service,
      preferred_date: data.date,
      time_slot: data.timeSlot,
      name: data.name,
      phone: data.phone,
      notes: data.notes ?? null,
    });
    if (error) {
      console.error("booking insert failed:", error.message);
      return {
        ok: false,
        error: "Your request could not be sent. Please try again, or call us.",
      };
    }

    // Forward a copy to the owner's Google Sheet via their Apps Script Web App.
    // The booking row above is the source of truth — a forwarding failure is
    // logged but never fails the visitor's request.
    const appsScriptUrl = process.env["APPS_SCRIPT_WEBAPP_URL"];
    if (appsScriptUrl) {
      try {
        const [y, m, d] = data.date.split("-").map(Number);
        const prettyDate = new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(
          "en-IN",
          { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" },
        );
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 8000);
        const res = await fetch(appsScriptUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({
            name: data.name,
            phone: data.phone,
            service: data.service,
            dateTime: `${prettyDate}, ${data.timeSlot}`,
            notes: data.notes ?? "",
          }),
          signal: controller.signal,
          redirect: "follow",
        });
        clearTimeout(timer);
        if (!res.ok) console.error("apps script forward failed:", res.status);
      } catch (e) {
        console.error("apps script forward error:", e);
      }
    }

    return { ok: true };
  });
