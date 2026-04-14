import { cookies } from 'next/headers';
import { t as translate, LOCALE_COOKIE, type Locale, type TranslationKey } from '@/lib/i18n';

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;
  if (value === 'ja' || value === 'zh') return value;
  return 'ja';
}

export function serverT(locale: Locale, key: TranslationKey, params?: Record<string, string | number>): string {
  return translate(locale, key, params);
}
