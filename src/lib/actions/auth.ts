"use server";

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
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
