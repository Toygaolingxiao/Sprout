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
  try {
    await fetch(`${origin}/auth/v1/settings`, {
      method: 'GET',
      cache: 'no-store',
    });

    // Any HTTP response means DNS/TLS/network path is alive.
    // We only want to fail when request itself cannot be made.
    return true;
  } catch {
    return false;
  }
}

function redirectLoginWithError(origin: string, nextPath: string, errorCode: string) {
  const fallback = new URL('/login', origin);
  fallback.searchParams.set('next', nextPath);
  fallback.searchParams.set('error', errorCode);
  return NextResponse.redirect(fallback);
}

function mapLineOauthStartError(message: string | undefined) {
  const normalized = (message ?? '').toLowerCase();

  if (normalized.includes('unsupported provider')) {
    return 'line_provider_unsupported';
  }
  if (
    normalized.includes('invalid client') ||
    normalized.includes('client id') ||
    normalized.includes('client_id')
  ) {
    return 'line_oauth_config_invalid';
  }
  if (normalized.includes('redirect uri') || normalized.includes('redirect_uri')) {
    return 'line_redirect_mismatch';
  }

  return 'line_oauth_failed';
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
    return redirectLoginWithError(url.origin, nextPath, mapLineOauthStartError(error?.message));
  }

  return NextResponse.redirect(oauthUrl);
}
