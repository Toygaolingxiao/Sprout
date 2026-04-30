"use client";

import { useTheme } from './theme-provider';
import { useTranslation } from '@/lib/i18n/context';

const THEMES = [
  { id: 'green' as const, emoji: '🌿', colors: 'from-green-400 to-emerald-500' },
  { id: 'pink' as const, emoji: '🌸', colors: 'from-pink-400 to-rose-500' },
  { id: 'yellow' as const, emoji: '🌼', colors: 'from-amber-300 to-yellow-500' },
  { id: 'aqua' as const, emoji: '💧', colors: 'from-sky-300 to-cyan-500' },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{t('theme.color')}</p>
      <div className="flex gap-3">
        {THEMES.map((th) => (
          <button
            key={th.id}
            onClick={() => setTheme(th.id)}
            aria-label={t(`theme.changeTo.${th.id}` as any)}
            className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all ${
              theme === th.id
                ? 'border-primary bg-primary/5 shadow-sm'
                : 'border-transparent bg-muted/50 hover:bg-muted'
            }`}
          >
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${th.colors} flex items-center justify-center text-lg`}>
              {th.emoji}
            </div>
            <span className="text-xs font-medium">{t(`theme.${th.id}` as any)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
