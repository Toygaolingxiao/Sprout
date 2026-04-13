-- ============================================================
-- Fix PostgREST PGRST205: "Could not find table in schema cache"
-- 
-- Root cause: PostgREST uses the 'authenticator' role for schema
-- introspection. If this role lacks USAGE on the 'public' schema,
-- no tables will appear in the schema cache.
-- ============================================================

-- 1. Grant to authenticator (critical for PostgREST schema discovery)
GRANT USAGE ON SCHEMA public TO authenticator;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticator;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticator;

-- 2. Grant to anon and authenticated (for runtime access)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- 3. Default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE ON SEQUENCES TO anon, authenticated;

-- 4. Reload PostgREST schema cache (multiple methods for reliability)
NOTIFY pgrst, 'reload schema';
SELECT pg_notify('pgrst', 'reload schema');

-- 5. Verify grants are in place
SELECT 
  has_schema_privilege('authenticator', 'public', 'USAGE') as authenticator_usage,
  has_schema_privilege('anon', 'public', 'USAGE') as anon_usage,
  has_schema_privilege('authenticated', 'public', 'USAGE') as authenticated_usage,
  has_table_privilege('anon', 'public.profiles', 'SELECT') as anon_can_read_profiles,
  has_table_privilege('authenticated', 'public.profiles', 'SELECT') as auth_can_read_profiles;

-- 6. Check if pgrst event trigger exists
SELECT evtname, evtevent FROM pg_event_trigger WHERE evtname LIKE '%pgrst%';

-- 7. Clean up test table (from debugging)
DROP TABLE IF EXISTS test123;
