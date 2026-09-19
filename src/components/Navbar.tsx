import { useEffect, useRef, useState } from "react";
import {
  MoreVertical,
  Phone,
  MessageCircle,
  MapPin,
  Instagram,
  Facebook,
  Share2,
  Clock,
  CalendarCheck,
  Menu,
  X,
} from "lucide-react";
import { business, links } from "@/config/business";
import { useBooking } from "@/lib/booking";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Reviews", href: "#reviews" },
  { label: "Visit Us", href: "#visit" },
];

function MoreMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const share = async () => {
    setOpen(false);
    const data = { title: business.name, text: business.name, url: window.location.href };
    if (navigator.share) {
      try {
        await navigator.share(data);
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard");
    }
  };

  const itemCls =
    "flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-accent";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="More options"
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent"
      >
        <MoreVertical className="h-5 w-5" />
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-50 w-56 rounded-xl border bg-popover p-2 shadow-lg">
          {business.instagram && (
            <a href={business.instagram} target="_blank" rel="noreferrer" className={itemCls}>
              <Instagram className="h-4 w-4 text-primary" /> Instagram
            </a>
          )}
          {business.facebook && (
            <a href={business.facebook} target="_blank" rel="noreferrer" className={itemCls}>
              <Facebook className="h-4 w-4 text-primary" /> Facebook
            </a>
          )}
          <a href={links.whatsapp()} target="_blank" rel="noreferrer" className={itemCls}>
            <MessageCircle className="h-4 w-4 text-primary" /> WhatsApp
          </a>
          <a href={links.call} className={itemCls}>
            <Phone className="h-4 w-4 text-primary" /> Call
          </a>
          <a href={links.directions} target="_blank" rel="noreferrer" className={itemCls}>
            <MapPin className="h-4 w-4 text-primary" /> Directions
          </a>
          <a href="#visit" onClick={() => setOpen(false)} className={itemCls}>
            <Clock className="h-4 w-4 text-primary" /> Opening Hours
          </a>
          <button onClick={share} className={itemCls}>
            <Share2 className="h-4 w-4 text-primary" /> Share
          </button>
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const { openBooking } = useBooking();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled ? "bg-background/90 shadow-sm backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <a href="#top" className="font-display text-xl font-semibold tracking-wide text-foreground sm:text-2xl">
          {business.name}
        </a>

        <div className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openBooking()}
            className="hidden items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90 sm:inline-flex"
          >
            <CalendarCheck className="h-4 w-4" />
            Book Appointment
          </button>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center rounded-full text-foreground hover:bg-accent lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <MoreMenu />
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t bg-background/95 px-4 pb-6 pt-3 backdrop-blur-md lg:hidden">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-3 text-base font-medium text-foreground hover:bg-accent"
            >
              {item.label}
            </a>
          ))}
          <button
            onClick={() => {
              setMobileOpen(false);
              openBooking();
            }}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
          >
            <CalendarCheck className="h-4 w-4" />
            Book Appointment
          </button>
        </div>
      )}
    </header>
  );
}
