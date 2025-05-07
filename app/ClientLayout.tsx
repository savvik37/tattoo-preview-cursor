'use client';

import { useEffect } from 'react';
import { useAccentColor, ACCENT_COLORS } from './context/AccentColorContext';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { accentColor } = useAccentColor();

  useEffect(() => {
    const colors = ACCENT_COLORS[accentColor];
    document.documentElement.style.setProperty('--accent-primary', colors.primary);
    document.documentElement.style.setProperty('--accent-hover', colors.hover);
    document.documentElement.style.setProperty('--accent-light', colors.light);
  }, [accentColor]);

  return <>{children}</>;
} 