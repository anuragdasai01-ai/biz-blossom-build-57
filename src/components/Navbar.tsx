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

// Name-only brand lockup: the studio's own words, no mark. First word carries
// the display serif, the rest sits beneath it in letterspaced capitals.
const [brandTop, ...brandTail] = business.name.split(" ");
const brandSub = brandTail.join(" ");

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
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background/70 text-foreground transition-colors hover:bg-accent"
      >
        <MoreVertical className="h-[18px] w-[18px]" />
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-50 w-60 rounded-xl border bg-popover p-2 shadow-lg">
          <div className="px-4 pb-1 pt-2 font-body text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
            Explore
          </div>
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={itemCls}
            >
              {item.label}
            </a>
          ))}
          <div className="my-2 h-px bg-border" />
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="nav-enter fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-6 sm:pt-4">
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full border px-4 py-2.5 transition-all duration-500 sm:px-5 ${
          scrolled
            ? "border-border/80 bg-background/95 shadow-md backdrop-blur-md"
            : "border-border/60 bg-background/85 shadow-sm backdrop-blur-sm"
        }`}
      >
        <a href="#top" className="flex min-w-0 flex-col leading-none">
          <span className="font-display text-[30px] font-semibold tracking-[0.015em] text-foreground sm:text-[34px]">
            {brandTop}
          </span>
          <span className="mt-[6px] font-body text-[10px] font-medium uppercase tracking-[0.3em] text-primary sm:text-[11px] sm:tracking-[0.34em]">
            {brandSub}
          </span>
        </a>

        <div className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium tracking-wide text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          <button
            onClick={() => openBooking()}
            className="inline-flex shrink-0 items-center rounded-full bg-primary px-4 py-2 text-xs font-medium tracking-wide text-primary-foreground shadow-sm transition-all hover:opacity-90 sm:px-5 sm:py-2.5 sm:text-sm"
          >
            Book Appointment
          </button>
          <MoreMenu />
        </div>
      </nav>
    </header>
  );
}
