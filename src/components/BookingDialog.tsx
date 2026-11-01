import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { X, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { business, links, serviceCategories } from "@/config/business";
import { submitBookingRequest } from "@/lib/booking.functions";
import { useBooking } from "@/lib/booking";

const timeSlots = ["Morning (10 AM – 12 PM)", "Afternoon (12 PM – 4 PM)", "Evening (4 PM – 8 PM)"];

export function BookingDialog() {
  const { open, preselectedService, closeBooking } = useBooking();
  const submitFn = useServerFn(submitBookingRequest);
  const [step, setStep] = useState(1);
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setStep(1);
      setDone(false);
      setError("");
      setService(preselectedService ?? "");
      setDate("");
      setTime("");
      setName("");
      setPhone("");
      setNotes("");
      setSubmitting(false);
    }
  }, [open, preselectedService]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeBooking();
    if (open) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, closeBooking]);

  if (!open) return null;

  const next = async () => {
    setError("");
    if (step === 1 && !service) return setError("Please choose a service.");
    if (step === 2 && !date) return setError("Please pick a preferred date.");
    if (step === 3 && !time) return setError("Please choose a time of day.");
    if (step === 4) {
      if (name.trim().length < 2) return setError("Please enter your name.");
      if (!/^(\+91[\s-]?)?[6-9]\d{9}$/.test(phone.trim().replace(/[\s-]/g, "")))
        return setError("Please enter a valid 10-digit Indian mobile number.");
      if (submitting) return;
      setSubmitting(true);
      try {
        const res = await submitFn({
          data: {
            service,
            date,
            timeSlot: time,
            name: name.trim(),
            phone: phone.trim(),
            notes: notes.trim() ? notes.trim() : undefined,
          },
        });
        if (!res.ok) {
          setError(res.error ?? "Your request could not be sent. Please try again, or call us.");
          return;
        }
        // Request is stored (and forwarded) — show the success screen. The
        // visitor opens WhatsApp themselves via the "Confirm faster" button.
        setDone(true);
      } catch {
        setError(
          `Something went wrong. Please try again, or call us on ${business.phoneDisplay}.`,
        );
      } finally {
        setSubmitting(false);
      }
      return;
    }
    setStep((s) => s + 1);
  };

  const today = new Date().toISOString().split("T")[0];
  // YYYY-MM-DD → dd/mm/yy (e.g. 05/11/26) — the format the studio reads best.
  const formatDmy = (iso: string) => {
    if (!iso) return "";
    const [y, m, d] = iso.split("-").map(Number);
    return `${String(d).padStart(2, "0")}/${String(m ?? 1).padStart(2, "0")}/${String(y ?? 0).slice(2)}`;
  };
  const prettyDate = date
    ? new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";
  const timeShort = time.split(" (")[0];
  const summary = `${service} · ${prettyDate}${time ? ` · ${timeShort}` : ""}`;
  const bookingDetails = {
    service,
    date: prettyDate || date,
    time,
    name: name.trim(),
    phone: phone.trim(),
    notes: notes.trim() || undefined,
  };

  // "Confirm faster on WhatsApp": fire-and-forget copy of the booking into the
  // owner's Google Sheet (via Apps Script, which also emails the owner), then
  // redirect to WhatsApp with zero delay — the keepalive request survives the
  // navigation.
  const handleWhatsAppConfirm = () => {
    try {
      fetch(
        "https://script.google.com/macros/s/AKfycbyn53Fi0HlNwH1PRAw_3XGtSf_4YWWYa3_PdK22joW18sZYWJUhbPeEPQy46mMFhu9O/exec",
        {
          method: "POST",
          mode: "no-cors",
          keepalive: true,
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify({
            name: name.trim(),
            phone: phone.trim(),
            service,
            date: formatDmy(date) || date,
            time,
          }),
        },
      ).catch(() => {
        /* best-effort background copy — never block or fail the redirect */
      });
    } catch {
      /* ignore — the redirect below must always happen */
    }
    window.location.href = links.whatsappBooking(bookingDetails);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={(e) => e.target === e.currentTarget && closeBooking()}
      role="dialog"
      aria-modal="true"
      aria-label="Book an appointment"
    >
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-card p-6 shadow-2xl sm:rounded-3xl sm:p-8">
        {done ? (
          <div className="py-6 text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
            <h3 className="mt-4 font-display text-3xl font-semibold text-foreground">
              Appointment Request Received
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Thank you, {name.split(" ")[0]}! Your request has been sent to the studio. We'll
              contact you shortly to confirm your appointment.
            </p>
            <dl className="mx-auto mt-5 max-w-xs space-y-2 rounded-2xl bg-accent px-5 py-4 text-left text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Service</dt>
                <dd className="text-right font-medium text-foreground">{service}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Date</dt>
                <dd className="text-right font-medium text-foreground">{prettyDate}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Time</dt>
                <dd className="text-right font-medium text-foreground">{time}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Name</dt>
                <dd className="text-right font-medium text-foreground">{name}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Phone</dt>
                <dd className="text-right font-medium text-foreground">{phone}</dd>
              </div>
            </dl>
            <a
              href={links.whatsappBooking(bookingDetails)}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => {
                e.preventDefault();
                handleWhatsAppConfirm();
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
              </svg>
              Confirm faster on WhatsApp
            </a>
            <button
              onClick={closeBooking}
              className="mt-4 block w-full rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
                  Step {step} of 4
                </p>
                <h3 className="mt-1 font-display text-2xl font-semibold text-foreground sm:text-3xl">
                  Book Your Appointment
                </h3>
              </div>
              <button
                onClick={closeBooking}
                aria-label="Close booking form"
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-accent"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-3 flex gap-1.5" aria-hidden="true">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-border"}`}
                />
              ))}
            </div>

            <div className="mt-6">
              {step === 1 && (
                <div>
                  <p className="mb-3 text-sm font-medium text-foreground">Choose a service</p>
                  <div className="max-h-72 space-y-4 overflow-y-auto pr-1">
                    {serviceCategories.map((cat) => (
                      <div key={cat.category}>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {cat.category}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {cat.items.map((item) => (
                            <button
                              key={item}
                              onClick={() => setService(item)}
                              className={`rounded-full border px-4 py-2 text-sm transition-all ${
                                service === item
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border bg-background text-foreground hover:border-primary"
                              }`}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <p className="mb-3 text-sm font-medium text-foreground">Preferred date</p>
                  <div className="relative">
                    {/* Visual box that always shows dd/mm/yy — the native date input
                        hides its placeholder on mobile, so we render our own text. */}
                    <div className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground">
                      <span className={date ? "text-foreground" : "text-muted-foreground"}>
                        {formatDmy(date) || "dd/mm/yy"}
                      </span>
                    </div>
                    {/* Invisible native date input on top: tapping anywhere opens
                        the calendar picker and the custom span shows the selection. */}
                    <input
                      type="date"
                      min={today}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      onClick={(e) => {
                        try {
                          e.currentTarget.showPicker?.();
                        } catch {
                          /* some browsers restrict showPicker — the tap still opens it */
                        }
                      }}
                      aria-label="Preferred date"
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Open {business.hours.days}, {business.hours.time}
                  </p>
                </div>
              )}

              {step === 3 && (
                <div>
                  <p className="mb-3 text-sm font-medium text-foreground">Preferred time of day</p>
                  <div className="space-y-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setTime(slot)}
                        className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                          time === slot
                            ? "border-primary bg-accent text-foreground"
                            : "border-border bg-background text-foreground hover:border-primary"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <p className="rounded-xl bg-accent px-4 py-3 text-sm text-accent-foreground">{summary}</p>
                  <div>
                    <label htmlFor="bk-name" className="mb-1.5 block text-sm font-medium text-foreground">
                      Your name
                    </label>
                    <input
                      id="bk-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full name"
                      className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label htmlFor="bk-phone" className="mb-1.5 block text-sm font-medium text-foreground">
                      Phone number
                    </label>
                    <input
                      id="bk-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 98765 43210"
                      className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label htmlFor="bk-notes" className="mb-1.5 block text-sm font-medium text-foreground">
                      Anything we should know? <span className="font-normal text-muted-foreground">(optional)</span>
                    </label>
                    <textarea
                      id="bk-notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. occasion, preferred artist, allergies…"
                      rows={2}
                      className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
              )}

              {error && (
                <p role="alert" className="mt-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}

              <div className="mt-6 flex gap-3">
                {step > 1 && (
                  <button
                    onClick={() => {
                      setError("");
                      setStep((s) => s - 1);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-3 text-sm font-medium text-foreground hover:bg-accent"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                )}
                <button
                  onClick={next}
                  disabled={submitting}
                  className="flex-1 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {step === 4 ? (
                    submitting ? (
                      <>
                        <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                        Sending details…
                      </>
                    ) : (
                      "Request Appointment"
                    )
                  ) : (
                    "Continue"
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
