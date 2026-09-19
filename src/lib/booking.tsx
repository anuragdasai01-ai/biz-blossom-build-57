import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

interface BookingContextValue {
  open: boolean;
  preselectedService: string | undefined;
  openBooking: (service?: string) => void;
  closeBooking: () => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<string | undefined>();

  const openBooking = useCallback((service?: string) => {
    setPreselectedService(service);
    setOpen(true);
  }, []);
  const closeBooking = useCallback(() => setOpen(false), []);

  return (
    <BookingContext.Provider value={{ open, preselectedService, openBooking, closeBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
