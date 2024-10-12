'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'true');
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-purple-500/20 dark:bg-purple-700/20 border-t border-border p-4 shadow-lg backdrop-blur-sm">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
        <p className="text-sm text-foreground mb-4 sm:mb-0">
          We use cookies to track meta information about your visit. No
          personally identifiable information is collected.
        </p>
        <Button onClick={acceptCookies} variant="default">
          Accept
        </Button>
      </div>
    </div>
  );
}
