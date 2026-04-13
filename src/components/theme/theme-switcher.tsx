"use client";

import { useTheme } from './theme-provider';

const THEMES = [
  { id: 'green' as const, label: 'グリーン', emoji: '🌿', colors: 'from-green-400 to-emerald-500' },
  { id: 'pink' as const, label: 'ピンク', emoji: '🌸', colors: 'from-pink-400 to-rose-500' },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">テーマカラー</p>
      <div className="flex gap-3">
        {THEMES.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            aria-label={`テーマを${t.label}に変更`}
            className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all ${
              theme === t.id
                ? 'border-primary bg-primary/5 shadow-sm'
                : 'border-transparent bg-muted/50 hover:bg-muted'
            }`}
          >
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.colors} flex items-center justify-center text-lg`}>
              {t.emoji}
            </div>
            <span className="text-xs font-medium">{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
