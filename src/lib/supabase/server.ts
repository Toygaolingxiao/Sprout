import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { cache } from 'react';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  );
}

/** Request-scoped cached auth — deduplicates auth.getUser() within a single request */
export const getAuthUser = cache(async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
});

/** Request-scoped cached family_id lookup */
export const getFamilyId = cache(async (userId: string): Promise<string | null> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from('profiles')
    .select('family_id')
    .eq('id', userId)
    .single() as { data: { family_id: string | null } | null };
  return data?.family_id ?? null;
});
