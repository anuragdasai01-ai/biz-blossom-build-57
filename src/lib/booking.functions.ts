import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const bookingSchema = z.object({
  service: z.string().trim().min(1).max(120),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
  timeSlot: z.string().trim().min(1).max(60),
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().regex(/^[0-9+\s-]{10,15}$/),
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
    return { ok: true };
  });
