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

function buildRedirectWithLinkResult(
  origin: string,
  nextPath: string,
  provider: 'google' | 'line',
  status: 'linked' | 'failed',
  linkError?: string,
) {
  const target = new URL(nextPath, origin);
  target.searchParams.set('link_provider', provider);
  target.searchParams.set('link_status', status);
  if (linkError) {
    target.searchParams.set('link_error', linkError);
  }
  return NextResponse.redirect(target.toString());
}

function getLineProviderAliases() {
  const configured = process.env.SUPABASE_LINE_PROVIDER || 'line';
  return Array.from(new Set(['line', 'custom:line', configured.toLowerCase()]));
}

function hasAnyProviderAlias(providerSet: Set<string>, aliases: string[]) {
  return aliases.some((aliasRaw) => {
    const alias = aliasRaw.toLowerCase();
    if (providerSet.has(alias)) return true;

    for (const provider of providerSet) {
      if (provider.endsWith(`:${alias}`) || provider.includes(alias)) return true;
    }

    return false;
  });
}

async function isProviderLinked(linkProvider: 'google' | 'line') {
  const supabase = await createClient();
  const [{ data: identitiesData }, { data: userData }] = await Promise.all([
    supabase.auth.getUserIdentities(),
    supabase.auth.getUser(),
  ]);

  type IdentityLike = { provider?: string | null };
  const fromEndpoint = (identitiesData?.identities ?? []) as IdentityLike[];
  const user = userData.user as ({ identities?: IdentityLike[]; app_metadata?: { providers?: unknown } } | null);
  const fromUser = Array.isArray(user?.identities) ? (user?.identities ?? []) : [];
  const fromMeta = Array.isArray(user?.app_metadata?.providers)
    ? user!.app_metadata!.providers.filter((value): value is string => typeof value === 'string')
    : [];

  const providerSet = new Set<string>();
  for (const identity of [...fromEndpoint, ...fromUser]) {
    const provider = identity.provider?.toLowerCase();
    if (provider) providerSet.add(provider);
  }
  for (const provider of fromMeta) {
    providerSet.add(provider.toLowerCase());
  }

  const aliases = linkProvider === 'google' ? ['google'] : getLineProviderAliases();
  return hasAnyProviderAlias(providerSet, aliases);
}

function mapLinkCallbackError(message: string | undefined, provider: 'google' | 'line') {
  const normalized = (message ?? '').toLowerCase();
  if (normalized.includes('manual linking')) return 'settings.providerManualLinkingRequired';
  if (normalized.includes('already linked') || normalized.includes('identity already exists')) return 'settings.providerAlreadyLinked';
  if (normalized.includes('unsupported provider')) {
    return provider === 'google' ? 'settings.providerUnsupportedGoogle' : 'settings.providerUnsupportedLine';
  }
  if (normalized.includes('fetch failed') || normalized.includes('network')) return 'auth.networkError';
  return 'settings.providerOperationFailed';
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const nextPath = getSafeNextPath(searchParams.get('next'));
  const linkProvider = getLinkProvider(searchParams.get('link_provider'));
  const callbackErrorMessage = searchParams.get('error_description') ?? searchParams.get('error') ?? undefined;

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

    if (linkProvider) {
      const linked = await isProviderLinked(linkProvider);
      if (linked) {
        return buildRedirectWithLinkResult(origin, nextPath, linkProvider, 'linked');
      }

      return buildRedirectWithLinkResult(
        origin,
        nextPath,
        linkProvider,
        'failed',
        mapLinkCallbackError(error.message, linkProvider),
      );
    }
  }

  if (linkProvider) {
    return buildRedirectWithLinkResult(
      origin,
      nextPath,
      linkProvider,
      'failed',
      mapLinkCallbackError(callbackErrorMessage, linkProvider),
    );
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
