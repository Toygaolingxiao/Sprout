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

function getSupabaseOrigin() {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!raw) return null;

  try {
    return new URL(raw).origin;
  } catch {
    return null;
  }
}

async function isSupabaseReachable(origin: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3000);

  try {
    const response = await fetch(`${origin}/auth/v1/settings`, {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal,
    });
    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

function redirectLoginWithError(origin: string, nextPath: string, errorCode: string) {
  const fallback = new URL('/login', origin);
  fallback.searchParams.set('next', nextPath);
  fallback.searchParams.set('error', errorCode);
  return NextResponse.redirect(fallback);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const nextPath = getSafeNextPath(url.searchParams.get('next'));
  const siteUrl = await getSiteUrl(url.origin);
  const provider = process.env.SUPABASE_LINE_PROVIDER || 'line';

  const supabaseOrigin = getSupabaseOrigin();
  const hasAnonKey = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  if (!supabaseOrigin || !hasAnonKey) {
    return redirectLoginWithError(url.origin, nextPath, 'supabase_config_invalid');
  }

  const reachable = await isSupabaseReachable(supabaseOrigin);
  if (!reachable) {
    return redirectLoginWithError(url.origin, nextPath, 'supabase_unreachable');
  }

  let oauthUrl: string | null = null;
  let error: { message: string } | null = null;

  try {
    const supabase = await createClient();
    const result = await supabase.auth.signInWithOAuth({
      provider: provider as never,
      options: {
        redirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(nextPath)}`,
      },
    });
    oauthUrl = result.data?.url ?? null;
    error = result.error;
  } catch {
    return redirectLoginWithError(url.origin, nextPath, 'supabase_unreachable');
  }

  if (error || !oauthUrl) {
    return redirectLoginWithError(url.origin, nextPath, 'line_oauth_failed');
  }

  return NextResponse.redirect(oauthUrl);
}
