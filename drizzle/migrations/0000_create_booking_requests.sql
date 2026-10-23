CREATE TABLE public.booking_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service TEXT NOT NULL,
  preferred_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.booking_requests TO service_role;

ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;

-- No anon/authenticated policies: the table is private. Rows are written only
-- by server code with server-side credentials after validating input, and read
-- only by the owner (Cloud UI / future admin surface).
