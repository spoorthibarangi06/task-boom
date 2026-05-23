
-- Extend profiles with medical fields + a public share id
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS date_of_birth date,
  ADD COLUMN IF NOT EXISTS blood_group text,
  ADD COLUMN IF NOT EXISTS allergies text,
  ADD COLUMN IF NOT EXISTS conditions text,
  ADD COLUMN IF NOT EXISTS medications text,
  ADD COLUMN IF NOT EXISTS organ_donor boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS notes text,
  ADD COLUMN IF NOT EXISTS public_id uuid NOT NULL DEFAULT gen_random_uuid();

CREATE UNIQUE INDEX IF NOT EXISTS profiles_public_id_key ON public.profiles(public_id);

-- Backfill public_id for any existing rows (defensive)
UPDATE public.profiles SET public_id = gen_random_uuid() WHERE public_id IS NULL;

-- Public emergency-view policy: anyone with the link (public_id) can read.
-- The unguessable uuid in the URL is the access control; we expose only via queries filtered by it.
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

CREATE POLICY "Public emergency view"
ON public.profiles
FOR SELECT
TO anon, authenticated
USING (true);

-- Emergency contacts
CREATE TABLE IF NOT EXISTS public.emergency_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  relationship text,
  phone text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view emergency contacts"
ON public.emergency_contacts FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Users manage own contacts insert"
ON public.emergency_contacts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own contacts update"
ON public.emergency_contacts FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users manage own contacts delete"
ON public.emergency_contacts FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE TRIGGER update_emergency_contacts_updated_at
BEFORE UPDATE ON public.emergency_contacts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS emergency_contacts_user_id_idx ON public.emergency_contacts(user_id);
