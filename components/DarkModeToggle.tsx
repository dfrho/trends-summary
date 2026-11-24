'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

const className =
  'min-h-[44px] min-w-[7.5rem] rounded-full border border-input bg-transparent px-3.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

export function DarkModeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Render a same-size placeholder until the theme is known on the client.
  if (!mounted) {
    return <button type="button" className={className} aria-hidden="true" />;
  }

  const isNight = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      className={className}
      onClick={() => setTheme(isNight ? 'light' : 'dark')}
    >
      {isNight ? 'Day mode' : 'Night mode'}
    </button>
  );
}
