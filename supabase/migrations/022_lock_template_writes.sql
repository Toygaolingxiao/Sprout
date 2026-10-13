-- Template rows are global preset data. Authenticated users must not
-- insert or delete them. Operators seed through the service role.

DROP POLICY IF EXISTS "Authenticated can insert templates" ON public.checklist_templates;
DROP POLICY IF EXISTS "Authenticated can delete templates" ON public.checklist_templates;
