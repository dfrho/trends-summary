'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface DownloadPdfButtonProps {
  /** 'US' or a two-letter state code */
  location: string;
  disabled: boolean;
}

type Status = 'idle' | 'writing' | 'failed';

const LABELS: Record<Status, string> = {
  idle: 'Download PDF',
  writing: 'Writing the report…',
  failed: 'PDF failed. Try again',
};

/** Renders into the nav bar slot, so the button sits in the page's upper right. */
export function DownloadPdfButton({ location, disabled }: DownloadPdfButtonProps) {
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    setSlot(document.getElementById('nav-actions'));
  }, []);

  // A failure message belongs to the place it failed for.
  useEffect(() => {
    setStatus('idle');
  }, [location]);

  const download = async () => {
    setStatus('writing');
    try {
      const response = await fetch(`/api/report?location=${location}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const filename =
        response.headers
          .get('Content-Disposition')
          ?.match(/filename="([^"]+)"/)?.[1] ?? 'news-topics.pdf';
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setStatus('idle');
    } catch (err) {
      console.error('Error downloading report:', err);
      setStatus('failed');
    }
  };

  if (!slot) return null;

  return createPortal(
    <button
      type="button"
      onClick={download}
      disabled={disabled || status === 'writing'}
      aria-live="polite"
      className="min-h-[44px] rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-wait disabled:opacity-60"
    >
      {LABELS[status]}
    </button>,
    slot
  );
}
