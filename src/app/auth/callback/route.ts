import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { provisionCurrentUserFromOAuth } from '@/lib/auth/provision';

function getSafeNextPath(rawNext: string | null | undefined, fallback = '/dashboard') {
  if (!rawNext || rawNext.length === 0) return fallback;
  if (!rawNext.startsWith('/')) return fallback;
  if (rawNext.startsWith('//')) return fallback;
  return rawNext;
}

function getLinkProvider(raw: string | null): 'google' | 'line' | null {
  if (raw === 'google' || raw === 'line') return raw;
  return null;
}

function buildRedirectWithLinkResult(origin: string, nextPath: string, provider: 'google' | 'line', status: 'linked' | 'failed') {
  const target = new URL(nextPath, origin);
  target.searchParams.set('link_provider', provider);
  target.searchParams.set('link_status', status);
  return NextResponse.redirect(target.toString());
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const nextPath = getSafeNextPath(searchParams.get('next'));
  const linkProvider = getLinkProvider(searchParams.get('link_provider'));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      await provisionCurrentUserFromOAuth();
      if (linkProvider) {
        return buildRedirectWithLinkResult(origin, nextPath, linkProvider, 'linked');
      }
      return NextResponse.redirect(`${origin}${nextPath}`);
    }
  }

  if (linkProvider) {
    return buildRedirectWithLinkResult(origin, nextPath, linkProvider, 'failed');
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
