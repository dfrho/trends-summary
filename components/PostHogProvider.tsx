'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';

interface PostHogProviderProps {
  children: React.ReactNode;
  posthogKey: string;
}

export function PostHogProvider({
  children,
  posthogKey,
}: PostHogProviderProps) {
  useEffect(() => {
    // Check that we're in the browser environment
    if (typeof window !== 'undefined') {
      posthog.init(posthogKey, {
        api_host: 'https://us.i.posthog.com',
        person_profiles: 'always',
        // Disable in development
        loaded: (posthog) => {
          if (process.env.NODE_ENV === 'development')
            posthog.opt_out_capturing();
        },
      });
    }
  }, [posthogKey]);

  return <>{children}</>;
}
