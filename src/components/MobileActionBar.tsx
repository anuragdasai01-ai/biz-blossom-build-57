import { CalendarCheck, MessageCircle, Phone, MapPin } from "lucide-react";
import { links } from "@/config/business";
import { useBooking } from "@/lib/booking";

export function MobileActionBar() {
  const { openBooking } = useBooking();
  const btn =
    "flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium text-foreground transition-colors";

  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-md">
        <button onClick={() => openBooking()} className={`${btn} text-primary`} aria-label="Book appointment">
          <CalendarCheck className="h-5 w-5" />
          Book
        </button>
        <a href={links.whatsapp()} target="_blank" rel="noreferrer" className={btn} aria-label="Chat on WhatsApp">
          <MessageCircle className="h-5 w-5" />
          WhatsApp
        </a>
        <a href={links.call} className={btn} aria-label="Call the parlour">
          <Phone className="h-5 w-5" />
          Call
        </a>
        <a href={links.directions} target="_blank" rel="noreferrer" className={btn} aria-label="Get directions">
          <MapPin className="h-5 w-5" />
          Directions
        </a>
      </div>
    </nav>
  );
}
