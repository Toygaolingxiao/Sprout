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

function extractProviderErrorHint(message: string | undefined) {
  const normalized = (message ?? '').toLowerCase();
  const knownHints = [
    'access_denied',
    'invalid_request',
    'invalid_grant',
    'invalid_client',
    'invalid_scope',
    'server_error',
    'temporarily_unavailable',
    'unsupported_response_type',
    'unsupported_grant_type',
    'provider_not_enabled',
  ];

  for (const hint of knownHints) {
    if (normalized.includes(hint)) return hint;
  }

  const compact = normalized.replace(/[^a-z0-9_:\- ]+/g, ' ').replace(/\s+/g, ' ').trim();
  return compact.slice(0, 64) || 'unknown';
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
  if (provider === 'line') {
    if (normalized.includes('provider is not enabled') || normalized.includes('provider not enabled')) {
      return 'settings.providerUnsupportedLine';
    }
    if (
      normalized.includes('invalid client') ||
      normalized.includes('client id') ||
      normalized.includes('client_id')
    ) {
      return 'settings.providerLineConfigInvalid';
    }
    if (normalized.includes('redirect uri') || normalized.includes('redirect_uri')) {
      return 'settings.providerLineRedirectMismatch';
    }
    if (normalized.includes('access denied') || normalized.includes('access_denied')) {
      return 'settings.providerLineAccessDenied';
    }
    if (
      normalized.includes('server_error') ||
      normalized.includes('invalid_request') ||
      normalized.includes('invalid_grant') ||
      normalized.includes('oauth')
    ) {
      return `settings.providerLineTroubleshooting:${extractProviderErrorHint(message)}`;
    }
  }
  if (normalized.includes('fetch failed') || normalized.includes('network')) return 'auth.networkError';
  if (provider === 'line') {
    return `settings.providerLineTroubleshooting:${extractProviderErrorHint(message)}`;
  }
  return 'settings.providerOperationFailed';
}

function mapAuthCallbackError(message: string | undefined) {
  const normalized = (message ?? '').toLowerCase();

  if (normalized.includes('access denied') || normalized.includes('access_denied')) {
    return 'auth.oauthAccessDenied';
  }
  if (
    normalized.includes('provider is not enabled') ||
    normalized.includes('provider not enabled') ||
    normalized.includes('provider_not_enabled') ||
    normalized.includes('unsupported provider')
  ) {
    return 'auth.oauthProviderUnsupported';
  }
  if (normalized.includes('fetch failed') || normalized.includes('network')) {
    return 'auth.networkError';
  }

  return 'auth.oauthCallbackFailed';
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const nextPath = getSafeNextPath(searchParams.get('next'));
  const linkProvider = getLinkProvider(searchParams.get('link_provider'));
  const callbackErrorMessage = [
    searchParams.get('error'),
    searchParams.get('error_code'),
    searchParams.get('error_description'),
  ]
    .filter((value): value is string => Boolean(value && value.length > 0))
    .join(' | ') || undefined;

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

  const authErrorCode = mapAuthCallbackError(callbackErrorMessage);
  return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(authErrorCode)}`);
}
