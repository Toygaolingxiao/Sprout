import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

function getSafeNextPath(rawNext: string | null | undefined, fallback = '/dashboard') {
  if (!rawNext || rawNext.length === 0) return fallback;
  if (!rawNext.startsWith('/')) return fallback;
  if (rawNext.startsWith('//')) return fallback;
  return rawNext;
}

async function getSiteUrl(origin: string) {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  const headerStore = await headers();
  const host = headerStore.get('host') ?? new URL(origin).host;
  const proto = headerStore.get('x-forwarded-proto') ?? new URL(origin).protocol.replace(':', '');
  return `${proto}://${host}`;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const nextPath = getSafeNextPath(url.searchParams.get('next'));
  const siteUrl = await getSiteUrl(url.origin);
  const provider = process.env.SUPABASE_LINE_PROVIDER || 'line';

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as never,
    options: {
      redirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(nextPath)}`,
    },
  });

  if (error || !data.url) {
    const fallback = new URL('/login', url.origin);
    fallback.searchParams.set('error', 'line_oauth_failed');
    return NextResponse.redirect(fallback);
  }

  return NextResponse.redirect(data.url);
}
