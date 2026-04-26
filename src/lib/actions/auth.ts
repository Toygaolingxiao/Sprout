"use server";

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import type { UserIdentity } from '@supabase/auth-js';
import { createClient } from '@/lib/supabase/server';
import { provisionCurrentUserFromOAuth } from '@/lib/auth/provision';

function mapAuthError(message: string) {
  const normalized = message.toLowerCase();

  if (
    normalized.includes('already registered') ||
    normalized.includes('already exists') ||
    normalized.includes('duplicate')
  ) {
    return 'auth.emailExists';
  }

  if (normalized.includes('fetch failed') || normalized.includes('network')) {
    return 'auth.networkError';
  }

  return message;
}

async function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  const headerStore = await headers();
  const host = headerStore.get('host') ?? 'localhost:3000';
  const proto = headerStore.get('x-forwarded-proto') ?? 'https';
  return `${proto}://${host}`;
}

function getSafeNextPath(rawNext: string | null | undefined, fallback = '/dashboard') {
  if (!rawNext || rawNext.length === 0) return fallback;
  if (!rawNext.startsWith('/')) return fallback;
  if (rawNext.startsWith('//')) return fallback;
  return rawNext;
}

type AuthProviderTarget = 'google' | 'line';
type IdentityLike = { provider?: string | null };

function extractProviderErrorHint(message: string) {
  const normalized = message.toLowerCase();
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

  // Keep the diagnostics short and safe for URL/query usage.
  const compact = normalized.replace(/[^a-z0-9_:\- ]+/g, ' ').replace(/\s+/g, ' ').trim();
  return compact.slice(0, 64) || 'unknown';
}

function parseAuthProviderTarget(raw: FormDataEntryValue | null): AuthProviderTarget | null {
  if (raw === 'google') return 'google';
  if (raw === 'line') return 'line';
  return null;
}

function resolveLineProvider() {
  return process.env.SUPABASE_LINE_PROVIDER || 'line';
}

function resolveProviderForLink(target: AuthProviderTarget) {
  if (target === 'google') return 'google';
  return resolveLineProvider();
}

function getIdentityProviderAliases(target: AuthProviderTarget) {
  if (target === 'google') return ['google'];

  const configured = resolveLineProvider();
  return Array.from(new Set(['line', 'custom:line', configured]));
}

function hasAnyProviderAlias(providerSet: Set<string>, aliases: string[]) {
  const normalizedAliases = aliases.map((alias) => alias.toLowerCase());

  return normalizedAliases.some((alias) => {
    if (providerSet.has(alias)) return true;

    for (const provider of providerSet) {
      if (provider.endsWith(`:${alias}`) || provider.includes(alias)) return true;
    }

    return false;
  });
}

async function getCurrentProviderSet(supabase: Awaited<ReturnType<typeof createClient>>) {
  const [{ data: identitiesData }, { data: userData }] = await Promise.all([
    supabase.auth.getUserIdentities(),
    supabase.auth.getUser(),
  ]);

  const fromEndpoint = (identitiesData?.identities ?? []) as IdentityLike[];
  const user = userData.user as ({ identities?: IdentityLike[]; app_metadata?: { providers?: unknown } } | null);
  const fromUser = Array.isArray(user?.identities) ? (user?.identities ?? []) : [];
  const rawMetadataProviders = user?.app_metadata?.providers;

  const providers = new Set<string>();
  for (const identity of [...fromEndpoint, ...fromUser]) {
    const provider = identity.provider?.toLowerCase();
    if (provider) providers.add(provider);
  }

  if (Array.isArray(rawMetadataProviders)) {
    for (const value of rawMetadataProviders) {
      if (typeof value === 'string') {
        providers.add(value.toLowerCase());
      }
    }
  }

  return providers;
}

function mapProviderError(message: string, target?: AuthProviderTarget) {
  const normalized = message.toLowerCase();

  if (normalized.includes('manual linking')) {
    return 'settings.providerManualLinkingRequired';
  }
  if (normalized.includes('unsupported provider')) {
    if (target === 'google') return 'settings.providerUnsupportedGoogle';
    if (target === 'line') return 'settings.providerUnsupportedLine';
    return 'settings.providerUnsupported';
  }
  if (target === 'line') {
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
  if (normalized.includes('at least 2 identities')) {
    return 'settings.providerUnlinkNeedAnother';
  }
  if (normalized.includes('identity not found') || normalized.includes('not linked')) {
    return 'settings.providerNotLinked';
  }
  if (normalized.includes('already linked') || normalized.includes('identity already exists')) {
    return 'settings.providerAlreadyLinked';
  }
  if (normalized.includes('fetch failed') || normalized.includes('network')) {
    return 'auth.networkError';
  }

  if (target === 'line') {
    return `settings.providerLineTroubleshooting:${extractProviderErrorHint(message)}`;
  }

  return 'settings.providerOperationFailed';
}

export async function signUp(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const nickname = formData.get('nickname') as string;
  const nextPath = getSafeNextPath(formData.get('next') as string | null);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nickname },
    },
  });

  if (error) {
    return { error: mapAuthError(error.message) };
  }

  if ((data.user?.identities ?? []).length === 0) {
    return { error: 'auth.emailExists' };
  }

  if (!data.session) {
    return { success: 'auth.signupEmailSent' };
  }

  redirect(nextPath);
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const nextPath = getSafeNextPath(formData.get('next') as string | null);

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: mapAuthError(error.message) };
  }

  redirect(nextPath);
}

export async function signInWithGoogle(formData?: FormData) {
  const supabase = await createClient();
  const siteUrl = await getSiteUrl();
  const nextPath = getSafeNextPath((formData?.get('next') as string | null) ?? null);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(nextPath)}`,
    },
  });

  if (error) {
    return { error: mapAuthError(error.message) };
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function signInWithLineOAuth(rawNextPath?: string) {
  const supabase = await createClient();
  const siteUrl = await getSiteUrl();
  const nextPath = getSafeNextPath(rawNextPath ?? '/dashboard');
  const provider = process.env.SUPABASE_LINE_PROVIDER || 'line';

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as never,
    options: {
      redirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(nextPath)}`,
    },
  });

  if (error) {
    return { error: mapAuthError(error.message) };
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function signInWithLineIdToken(idToken: string, rawNextPath?: string) {
  if (!idToken) {
    return { error: 'LINE IDトークンが取得できませんでした。' };
  }

  const supabase = await createClient();
  const provider = process.env.SUPABASE_LINE_PROVIDER || 'line';
  const nextPath = getSafeNextPath(rawNextPath ?? '/dashboard');

  const { error } = await supabase.auth.signInWithIdToken({
    provider,
    token: idToken,
  });

  if (error) {
    return { error: mapAuthError(error.message) };
  }

  await provisionCurrentUserFromOAuth();

  return { success: true, nextPath };
}

export async function updateEmail(formData: FormData) {
  const supabase = await createClient();

  const email = (formData.get('email') as string | null)?.trim() ?? '';
  if (!email) {
    return { error: 'settings.emailRequired' };
  }

  const { error } = await supabase.auth.updateUser({ email });
  if (error) {
    return { error: mapAuthError(error.message) };
  }

  return { success: true };
}

export async function createProviderLink(formData: FormData) {
  const target = parseAuthProviderTarget(formData.get('provider'));
  if (!target) {
    return { error: 'settings.providerUnsupported' };
  }

  const supabase = await createClient();
  const siteUrl = await getSiteUrl();
  const nextPath = getSafeNextPath((formData.get('next') as string | null) ?? '/settings', '/settings');
  const provider = resolveProviderForLink(target);
  const idToken = ((formData.get('idToken') as string | null) ?? '').trim();
  const aliases = getIdentityProviderAliases(target);
  const currentProviders = await getCurrentProviderSet(supabase);

  if (hasAnyProviderAlias(currentProviders, aliases)) {
    return { alreadyLinked: true };
  }

  // Prefer direct OIDC token linking for LINE when LIFF can provide an ID token.
  // This avoids provider-side OAuth redirect path mismatches in some LINE setups.
  if (target === 'line' && idToken.length > 0) {
    const { error } = await supabase.auth.linkIdentity({
      provider: provider as never,
      token: idToken,
    });

    if (error) {
      return { error: mapProviderError(error.message, target) };
    }

    return { success: true };
  }

  const { data, error } = await supabase.auth.linkIdentity({
    provider: provider as never,
    options: {
      redirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(nextPath)}&link_provider=${encodeURIComponent(target)}`,
    },
  });

  if (error) {
    return { error: mapProviderError(error.message, target) };
  }

  if (!data?.url) {
    return { error: 'settings.providerOperationFailed' };
  }

  return { url: data.url };
}

export async function unlinkProvider(formData: FormData) {
  const target = parseAuthProviderTarget(formData.get('provider'));
  if (!target) {
    return { error: 'settings.providerUnsupported' };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUserIdentities();
  if (error || !data) {
    return { error: mapProviderError(error?.message ?? '', target) };
  }

  const identities = data.identities ?? [];
  if (identities.length <= 1) {
    return { error: 'settings.providerUnlinkNeedAnother' };
  }

  const aliases = getIdentityProviderAliases(target);
  const match = identities.find((identity: UserIdentity) => {
    const provider = identity.provider.toLowerCase();
    return hasAnyProviderAlias(new Set([provider]), aliases);
  });
  if (!match) {
    return { error: 'settings.providerNotLinked' };
  }

  const { error: unlinkError } = await supabase.auth.unlinkIdentity(match);
  if (unlinkError) {
    return { error: mapProviderError(unlinkError.message, target) };
  }

  return { success: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient();
  const siteUrl = await getSiteUrl();

  const email = formData.get('email') as string;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?next=/settings`,
  });

  if (error) {
    return { error: mapAuthError(error.message) };
  }

  return { success: 'パスワードリセットメールを送信しました' };
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();

  const password = formData.get('new_password') as string;

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
