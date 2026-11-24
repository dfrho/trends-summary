'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { StateTileMap } from './StateTileMap';
import { DownloadPdfButton } from './DownloadPdfButton';
import { STATES_BY_NAME, stateName } from '@/lib/states';

interface TrendItem {
  title: string;
  picture: string;
  pictureSource: string;
  newsItems: NewsItem[];
  traffic: string;
}

interface NewsItem {
  title: string;
  snippet: string;
  url: string;
  picture: string;
  source: string;
}

// Rank in the feed, strongest first. Ranks past the fourth share the last color.
const SIGNAL_CLASSES = [
  'bg-signal-1',
  'bg-signal-2',
  'bg-signal-3',
  'bg-signal-4',
];

const eyebrow = 'font-mono text-sm tracking-[0.04em]';

// Placeholder rows shown while the feed loads. Widths vary so it reads as text.
const SKELETON_ROWS = [
  { title: '82%', news: ['92%', '74%', '85%'] },
  { title: '48%', news: ['80%', '88%', '66%'] },
  { title: '66%', news: ['86%', '70%', '78%'] },
  { title: '38%', news: ['72%', '90%'] },
];

function Bone({
  className = '',
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={style}
      className={`bg-border motion-safe:animate-pulse ${
        className.includes('rounded-') ? '' : 'rounded-md'
      } ${className}`}
    />
  );
}

export default function TrendsSummary() {
  // 'US' is the national feed; otherwise a two-letter state code.
  const [location, setLocation] = useState<string>('US');
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [summary, setSummary] = useState<string>('');
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const forecastRef = useRef<HTMLElement>(null);

  const locationName = location === 'US' ? 'United States' : stateName(location);
  const selectedState = location === 'US' ? null : location;

  const handleSelect = useCallback(
    (code: string) => {
      if (isLocked || code === location) return;
      setLocation(code);
      setIsLocked(true);

      // The forecast sits above the map on small screens: bring it back into view.
      const el = forecastRef.current;
      if (el && el.getBoundingClientRect().top < 0) {
        const reduceMotion = window.matchMedia(
          '(prefers-reduced-motion: reduce)'
        ).matches;
        el.scrollIntoView({
          behavior: reduceMotion ? 'auto' : 'smooth',
          block: 'start',
        });
      }
    },
    [isLocked, location]
  );

  const fetchTrends = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await fetch(
        `/api/trends?location=${location}&locationName=${encodeURIComponent(
          locationName
        )}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      if (!data.trends || !Array.isArray(data.trends)) {
        throw new Error('Invalid trends data received');
      }
      setTrends(data.trends);
      setSummary(data.summary || '');
    } catch (err) {
      console.error('Error fetching trends:', err);
      setTrends([]);
      setSummary('');
      setHasError(true);
    } finally {
      setIsLoading(false);
      // Keep the picker locked for 3 more seconds after loading
      setTimeout(() => {
        setIsLocked(false);
      }, 3000);
    }
  }, [location, locationName]);

  useEffect(() => {
    fetchTrends();
  }, [fetchTrends]);

  const sourceLink =
    location === 'US'
      ? 'https://trends.google.com/trending?geo=US'
      : `https://trends.google.com/trending?geo=US-${location}`;

  const showResults = !isLoading && !hasError;

  return (
    <div className="flex flex-col gap-12">
      <DownloadPdfButton
        location={location}
        disabled={isLoading || hasError || trends.length === 0}
      />
      <div className="flex flex-wrap items-center gap-10">
        <section
          ref={forecastRef}
          aria-live="polite"
          className="flex min-w-0 flex-[999_1_520px] scroll-mt-6 flex-col gap-4"
        >
          <h1 className="font-display text-5xl font-extrabold leading-[0.95] tracking-[-0.02em] text-balance sm:text-7xl lg:text-8xl">
            {locationName}
          </h1>

          {isLoading && (
            <p role="status" className="mt-2 text-lg text-muted-foreground sm:text-xl">
              Scanning {locationName}&hellip;
            </p>
          )}

          {isLoading && (
            <div aria-hidden="true" className="flex max-w-[56ch] flex-col gap-3">
              <Bone className="h-3.5 w-56" />
              <Bone className="h-5 w-full" />
              <Bone className="h-5 w-[96%]" />
              <Bone className="h-5 w-[90%]" />
              <Bone className="h-5 w-[58%]" />
            </div>
          )}

          {hasError && (
            <div className="mt-2 flex flex-col items-start gap-3">
              <p role="alert" className="text-lg sm:text-xl">
                We lost the signal from Google Trends. Try again in a minute.
              </p>
              <button
                type="button"
                onClick={fetchTrends}
                className="min-h-[44px] rounded-full border border-input px-4 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Try again
              </button>
            </div>
          )}

          {showResults && trends.length === 0 && (
            <p className="mt-2 text-lg sm:text-xl">
              Clear skies. Nothing is trending in {locationName} right now.
            </p>
          )}

          {showResults && summary && (
            <>
              <h2
                className={`${eyebrow} mt-2 font-medium uppercase text-muted-foreground`}
              >
                The outlook &middot; written by Claude
              </h2>
              <p className="max-w-[56ch] whitespace-pre-line text-lg leading-[1.55] sm:text-xl">
                {summary}
              </p>
            </>
          )}

          <a
            href={sourceLink}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start py-2.5 text-[15px] font-semibold text-link underline underline-offset-4 hover:text-foreground"
          >
            See the raw feed on Google Trends
          </a>
        </section>

        <section className="relative flex min-w-0 flex-[1_1_480px] flex-col gap-4 rounded-[20px] border border-border bg-card p-4 sm:p-6">
          {/* Radar rings, centered on the bottom of the panel */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-[20px]">
            {[900, 600, 300].map((size) => (
              <div
                key={size}
                className="absolute left-[36%] top-[96%] rounded-full border border-ring-line"
                style={{
                  width: size,
                  height: size,
                  marginLeft: -size / 2,
                  marginTop: -size / 2,
                }}
              />
            ))}
          </div>

          <div className="relative flex flex-col gap-1.5">
            <label htmlFor="state-picker" className="text-sm font-semibold">
              Pick a state for the local forecast
            </label>
            <select
              id="state-picker"
              value={location}
              disabled={isLocked}
              onChange={(e) => handleSelect(e.target.value)}
              className="min-h-[48px] rounded-[10px] border border-input bg-background px-3 text-base font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-wait disabled:opacity-60"
            >
              <option value="US">United States</option>
              {STATES_BY_NAME.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <StateTileMap
            selected={selectedState}
            disabled={isLocked}
            onSelect={handleSelect}
          />
        </section>
      </div>

      {isLoading && (
        <section aria-hidden="true" className="flex flex-col gap-2">
          <div className="pb-3">
            <Bone className="h-8 w-[min(100%,28rem)]" />
          </div>
          {SKELETON_ROWS.map((row, index) => (
            <div
              key={index}
              className="flex flex-wrap items-start gap-x-6 gap-y-4 border-t border-border py-5"
            >
              <Bone className="h-12 w-12 shrink-0 rounded-full" />
              <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-2 pt-1">
                <Bone className="h-6" style={{ width: row.title }} />
                <Bone className="h-3.5 w-24" />
              </div>
              <div className="flex min-w-0 flex-[2_1_420px] flex-col gap-4 pt-2">
                {row.news.map((width, newsIndex) => (
                  <Bone key={newsIndex} className="h-4" style={{ width }} />
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {showResults && trends.length > 0 && (
        <section className="flex flex-col gap-2">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 pb-3">
            <h2 className="font-display text-2xl font-extrabold sm:text-[28px]">
              Signals over {location === 'US' ? 'the United States' : locationName},{' '}
              strongest first
            </h2>
            <p className="text-sm text-muted-foreground">
              Color marks rank in the feed. Search counts are Google&rsquo;s
              estimates.
            </p>
          </div>

          {trends.map((trend, index) => {
            const news = (trend.newsItems || []).filter((n) => n.title);
            return (
              <article
                key={index}
                className="flex flex-wrap items-start gap-x-6 gap-y-4 border-t border-border py-5"
              >
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-display text-xl font-extrabold text-[#0e1430] ${
                    SIGNAL_CLASSES[Math.min(index, SIGNAL_CLASSES.length - 1)]
                  }`}
                >
                  {index + 1}
                </span>
                <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-0.5">
                  <h3 className="font-display text-xl font-bold leading-tight sm:text-2xl">
                    {trend.title}
                  </h3>
                  {trend.traffic && (
                    <p className="font-mono text-[13px] text-muted-foreground">
                      {trend.traffic} searches
                    </p>
                  )}
                </div>
                <div className="flex min-w-0 flex-[2_1_420px] flex-col">
                  {news.map((newsItem, newsIndex) => (
                    <a
                      key={newsIndex}
                      href={newsItem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-wrap items-baseline gap-x-3 gap-y-0.5 py-2"
                    >
                      <span className="underline decoration-tile underline-offset-[3px] group-hover:decoration-foreground">
                        {newsItem.title}
                      </span>
                      <span className="font-mono text-[13px] text-muted-foreground">
                        {newsItem.source}
                      </span>
                    </a>
                  ))}
                </div>
              </article>
            );
          })}
        </section>
      )}

      <p className="border-t border-border pt-4 text-sm text-muted-foreground">
        Not affiliated with Google. Data comes from the public Google Trends
        feed.
      </p>
    </div>
  );
}
