import { useEffect, useState } from "react";
import { X, ArrowLeft, CheckCircle2, MessageCircle } from "lucide-react";
import { business, links, serviceCategories } from "@/config/business";
import { useBooking } from "@/lib/booking";

const timeSlots = ["Morning (10 AM – 12 PM)", "Afternoon (12 PM – 4 PM)", "Evening (4 PM – 8 PM)"];

export function BookingDialog() {
  const { open, preselectedService, closeBooking } = useBooking();
  const [step, setStep] = useState(1);
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [done, setDone] = useState(false);
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

  const next = () => {
    setError("");
    if (step === 1 && !service) return setError("Please choose a service.");
    if (step === 2 && !date) return setError("Please pick a preferred date.");
    if (step === 3 && !time) return setError("Please choose a time of day.");
    if (step === 4) {
      if (name.trim().length < 2) return setError("Please enter your name.");
      if (!/^[0-9+\s-]{10,15}$/.test(phone.trim()))
        return setError("Please enter a valid phone number.");
      return setDone(true);
    }
    setStep((s) => s + 1);
  };

  const today = new Date().toISOString().split("T")[0];
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
              Thank you, {name.split(" ")[0]}! We've received your request for{" "}
              <span className="font-medium text-foreground">{service}</span> on {date}. We'll
              contact you shortly to confirm your appointment.
            </p>
            <a
              href={links.whatsapp(service)}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary px-5 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-accent"
            >
              <MessageCircle className="h-4 w-4" /> Confirm faster on WhatsApp
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
                  <input
                    type="date"
                    min={today}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
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
                  className="flex-1 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  {step === 4 ? "Request Appointment" : "Continue"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
