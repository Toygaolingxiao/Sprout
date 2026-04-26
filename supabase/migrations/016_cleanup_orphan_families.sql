-- Repair family/profile inconsistencies.
-- 1) If family owner is not a member of the family anymore, transfer ownership.
-- 2) Delete families that have zero members.

WITH owner_replacements AS (
  SELECT DISTINCT ON (f.id)
    f.id AS family_id,
    p.id AS replacement_owner_id
  FROM public.families f
  JOIN public.profiles p ON p.family_id = f.id
  LEFT JOIN public.profiles owner_in_family
    ON owner_in_family.id = f.owner_id
   AND owner_in_family.family_id = f.id
  WHERE owner_in_family.id IS NULL
  ORDER BY f.id, p.created_at ASC, p.id ASC
)
UPDATE public.families f
SET owner_id = o.replacement_owner_id
FROM owner_replacements o
WHERE f.id = o.family_id;

DELETE FROM public.families f
WHERE NOT EXISTS (
  SELECT 1
  FROM public.profiles p
  WHERE p.family_id = f.id
);

NOTIFY pgrst, 'reload schema';
