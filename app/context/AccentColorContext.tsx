'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type AccentColor = 'blue' | 'purple' | 'green' | 'pink' | 'orange';

interface AccentColorContextType {
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
}

const AccentColorContext = createContext<AccentColorContextType | undefined>(undefined);

const ACCENT_COLORS = {
  blue: {
    primary: '#3b82f6',
    hover: '#2563eb',
    light: '#60a5fa',
  },
  purple: {
    primary: '#8b5cf6',
    hover: '#7c3aed',
    light: '#a78bfa',
  },
  green: {
    primary: '#10b981',
    hover: '#059669',
    light: '#34d399',
  },
  pink: {
    primary: '#ec4899',
    hover: '#db2777',
    light: '#f472b6',
  },
  orange: {
    primary: '#f97316',
    hover: '#ea580c',
    light: '#fb923c',
  },
};

export function AccentColorProvider({ children }: { children: ReactNode }) {
  const [accentColor, setAccentColor] = useState<AccentColor>('blue');

  useEffect(() => {
    const storedColor = localStorage.getItem('accentColor') as AccentColor;
    if (storedColor && ACCENT_COLORS[storedColor]) {
      setAccentColor(storedColor);
    }
  }, []);

  const handleSetAccentColor = (color: AccentColor) => {
    setAccentColor(color);
    localStorage.setItem('accentColor', color);
  };

  return (
    <AccentColorContext.Provider value={{ accentColor, setAccentColor: handleSetAccentColor }}>
      {children}
    </AccentColorContext.Provider>
  );
}

export function useAccentColor() {
  const context = useContext(AccentColorContext);
  if (context === undefined) {
    throw new Error('useAccentColor must be used within an AccentColorProvider');
  }
  return context;
}

export { ACCENT_COLORS };
export type { AccentColor }; 