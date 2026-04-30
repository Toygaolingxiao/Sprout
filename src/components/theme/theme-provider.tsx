"use client";

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'green' | 'pink' | 'yellow' | 'aqua';
type FontSize = 'small' | 'medium' | 'large';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fontSize: FontSize;
  setFontSize: (fontSize: FontSize) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'green',
  setTheme: () => {},
  fontSize: 'medium',
  setFontSize: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('green');
  const [fontSize, setFontSizeState] = useState<FontSize>('medium');

  useEffect(() => {
    const savedTheme = localStorage.getItem('sprout-theme') as Theme | null;
    const nextTheme = savedTheme === 'green' || savedTheme === 'pink' || savedTheme === 'yellow' || savedTheme === 'aqua'
      ? savedTheme
      : 'green';
    setThemeState(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);

    const savedFontSize = localStorage.getItem('sprout-font-size') as FontSize | null;
    const nextFontSize = savedFontSize === 'small' || savedFontSize === 'medium' || savedFontSize === 'large'
      ? savedFontSize
      : 'medium';
    setFontSizeState(nextFontSize);
    document.documentElement.setAttribute('data-font-size', nextFontSize);
  }, []);

  function setTheme(t: Theme) {
    setThemeState(t);
    localStorage.setItem('sprout-theme', t);
    document.documentElement.setAttribute('data-theme', t);
  }

  function setFontSize(size: FontSize) {
    setFontSizeState(size);
    localStorage.setItem('sprout-font-size', size);
    document.documentElement.setAttribute('data-font-size', size);
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, fontSize, setFontSize }}>
      {children}
    </ThemeContext.Provider>
  );
}
