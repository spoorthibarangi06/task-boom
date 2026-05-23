
-- Tighten profiles SELECT: owner only
DROP POLICY IF EXISTS "Public emergency view" ON public.profiles;

CREATE POLICY "Owner can read own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Tighten emergency_contacts SELECT: owner only
DROP POLICY IF EXISTS "Public can view emergency contacts" ON public.emergency_contacts;

CREATE POLICY "Owner can read own contacts"
ON public.emergency_contacts FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Secure RPC: returns minimal emergency data by public_id (no email, no user_id)
CREATE OR REPLACE FUNCTION public.get_emergency_profile(_public_id uuid)
RETURNS TABLE (
  name text,
  date_of_birth date,
  blood_group text,
  allergies text,
  conditions text,
  medications text,
  organ_donor boolean,
  notes text,
  phone text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.name, p.date_of_birth, p.blood_group, p.allergies, p.conditions,
         p.medications, p.organ_donor, p.notes, p.phone
  FROM public.profiles p
  WHERE p.public_id = _public_id;
$$;

CREATE OR REPLACE FUNCTION public.get_emergency_contacts(_public_id uuid)
RETURNS TABLE (
  id uuid,
  name text,
  relationship text,
  phone text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT c.id, c.name, c.relationship, c.phone
  FROM public.emergency_contacts c
  JOIN public.profiles p ON p.user_id = c.user_id
  WHERE p.public_id = _public_id
  ORDER BY c.created_at;
$$;

GRANT EXECUTE ON FUNCTION public.get_emergency_profile(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_emergency_contacts(uuid) TO anon, authenticated;
