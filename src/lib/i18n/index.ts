import { ja, type TranslationKey } from './translations/ja';
import { zh } from './translations/zh';
import { en } from './translations/en';

export type Locale = 'ja' | 'zh' | 'en';
export type { TranslationKey };

const dictionaries: Record<Locale, Partial<Record<TranslationKey, string>>> = { ja, zh, en };

export function t(locale: Locale, key: TranslationKey, params?: Record<string, string | number>): string {
  let text = dictionaries[locale]?.[key] ?? dictionaries.ja[key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replaceAll(`{${k}}`, String(v));
    }
  }
  return text;
}

export const LOCALE_LABELS: Record<Locale, string> = {
  ja: '日本語',
  zh: '中文（简体）',
  en: 'English',
};

export const LOCALE_COOKIE = 'sprout-locale';
