'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import Logo from '@/content/docs/assets/logo-white-nobg.svg';
import LogoDark from '@/content/docs/assets/logo-black.svg';

export function ThemedLogo() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Use resolvedTheme to handle system preference
  const isDark = mounted && (resolvedTheme === 'dark' || theme === 'dark');

  // White logo for dark mode, black logo for light mode
  return (
    <img
      src={isDark ? Logo.src : LogoDark.src}
      alt="Stately"
      className="h-8 w-auto"
    />
  );
}
