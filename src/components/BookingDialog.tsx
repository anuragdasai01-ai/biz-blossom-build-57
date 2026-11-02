import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { X, ArrowLeft, CheckCircle2, Loader2, MessageCircle } from "lucide-react";
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
  const [openingWa, setOpeningWa] = useState(false);
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

  // Cleanup timer for the WhatsApp button's 3-second loading state.
  const openingWaRef = useRef<number | null>(null);
  useEffect(
    () => () => {
      if (openingWaRef.current !== null) window.clearTimeout(openingWaRef.current);
    },
    [],
  );

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

  const handleWhatsAppConfirm = () => {
    // FIRST line — zero-delay redirect, synchronously inside the click gesture.
    window.open(links.whatsappBooking(bookingDetails), "_blank", "noopener,noreferrer");
    setOpeningWa(true);
    if (openingWaRef.current !== null) window.clearTimeout(openingWaRef.current);
    openingWaRef.current = window.setTimeout(() => setOpeningWa(false), 3000);
    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      service,
      date: formatDmy(date) || date,
      time,
    };
    const scriptUrl =
      "https://script.google.com/macros/s/AKfycbyn53Fi0HlNwH1PRAw_3XGtSf_4YWWYa3_PdK22joW18sZYWJUhbPeEPQy46mMFhu9O/exec";
    try {
      const beaconOk = navigator.sendBeacon?.(
        scriptUrl,
        new Blob([JSON.stringify(payload)], { type: "text/plain" }),
      );
      if (!beaconOk) {
        fetch(scriptUrl, {
          method: "POST",
          mode: "no-cors",
          keepalive: true,
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify(payload),
        }).catch(() => {
          /* best-effort background copy — never block or fail anything */
        });
      }
    } catch {
      /* ignore — the redirect above has already happened */
    }
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
              aria-disabled={openingWa}
              onClick={(e) => {
                e.preventDefault();
                if (openingWa) return;
                handleWhatsAppConfirm();
              }}
              className={`mt-6 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-background px-6 py-3 text-sm font-semibold text-primary shadow-sm transition-transform hover:-translate-y-0.5 ${
                openingWa ? "pointer-events-none scale-95 opacity-80" : ""
              }`}
            >
              {openingWa ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Opening WhatsApp…
                </>
              ) : (
                <>
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  Confirm faster on WhatsApp
                </>
              )}
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
