"use client";

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'green' | 'pink';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'green',
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('green');

  useEffect(() => {
    const saved = localStorage.getItem('sprout-theme') as Theme | null;
    if (saved === 'green' || saved === 'pink') {
      setThemeState(saved);
      document.documentElement.setAttribute('data-theme', saved);
    }
  }, []);

  function setTheme(t: Theme) {
    setThemeState(t);
    localStorage.setItem('sprout-theme', t);
    document.documentElement.setAttribute('data-theme', t);
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
