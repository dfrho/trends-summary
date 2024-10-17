'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Loader2, ImageOff } from 'lucide-react';
import { USStateMap } from './us-state-map';
import { Button } from '@/components/ui/Button';

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

const getFullStateName = (stateCode: string): string => {
  const fullNames: { [key: string]: string } = {
    'US-AL': 'Alabama',
    'US-AK': 'Alaska',
    'US-AZ': 'Arizona',
    'US-AR': 'Arkansas',
    'US-CA': 'California',
    'US-CO': 'Colorado',
    'US-CT': 'Connecticut',
    'US-DE': 'Delaware',
    'US-FL': 'Florida',
    'US-GA': 'Georgia',
    'US-HI': 'Hawaii',
    'US-ID': 'Idaho',
    'US-IL': 'Illinois',
    'US-IN': 'Indiana',
    'US-IA': 'Iowa',
    'US-KS': 'Kansas',
    'US-KY': 'Kentucky',
    'US-LA': 'Louisiana',
    'US-ME': 'Maine',
    'US-MD': 'Maryland',
    'US-MA': 'Massachusetts',
    'US-MI': 'Michigan',
    'US-MN': 'Minnesota',
    'US-MS': 'Mississippi',
    'US-MO': 'Missouri',
    'US-MT': 'Montana',
    'US-NE': 'Nebraska',
    'US-NV': 'Nevada',
    'US-NH': 'New Hampshire',
    'US-NJ': 'New Jersey',
    'US-NM': 'New Mexico',
    'US-NY': 'New York',
    'US-NC': 'North Carolina',
    'US-ND': 'North Dakota',
    'US-OH': 'Ohio',
    'US-OK': 'Oklahoma',
    'US-OR': 'Oregon',
    'US-PA': 'Pennsylvania',
    'US-RI': 'Rhode Island',
    'US-SC': 'South Carolina',
    'US-SD': 'South Dakota',
    'US-TN': 'Tennessee',
    'US-TX': 'Texas',
    'US-UT': 'Utah',
    'US-VT': 'Vermont',
    'US-VA': 'Virginia',
    'US-WA': 'Washington',
    'US-WV': 'West Virginia',
    'US-WI': 'Wisconsin',
    'US-WY': 'Wyoming',
  };
  return fullNames[stateCode] || 'United States';
};

export default function TrendsSummary() {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [location, setLocation] = useState<string>('US');
  const [locationName, setLocationName] = useState<string>('United States');
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [summary, setSummary] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const handleStateSelect = useCallback(
    (stateCode: string, stateName: string) => {
      if (isLocked) return;

      console.log(`State selected: ${stateCode} - ${stateName}`);
      if (!stateCode || !stateName) {
        console.error('State code or name is undefined');
        setError('Invalid state selection');
        return;
      }

      const apiStateCode =
        stateCode === 'US'
          ? 'US'
          : stateCode.startsWith('US-')
          ? stateCode.slice(3)
          : stateCode;
      console.log(`Setting location to: ${apiStateCode}`);
      setSelectedState(stateCode);
      setLocation(apiStateCode);
      setLocationName(getFullStateName(stateCode));
      setIsLocked(true);
    },
    [isLocked]
  );

  const fetchTrends = useCallback(async () => {
    if (!location || !locationName) {
      console.error('Location or locationName is undefined');
      setError('Invalid location data');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      console.log(
        `Fetching trends for location: ${location}, name: ${locationName}`
      );
      const response = await fetch(
        `/api/trends?location=${location}&locationName=${encodeURIComponent(
          locationName
        )}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Received trends data:', data);
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
      if (err instanceof Error) {
        setError(`Failed to fetch trends data: ${err.message}`);
      } else {
        setError('Failed to fetch trends data: Unknown error');
      }
    } finally {
      setIsLoading(false);
      // Keep the state locked for 3 more seconds after loading
      setTimeout(() => {
        setIsLocked(false);
      }, 3000);
    }
  }, [location, locationName]);

  useEffect(() => {
    console.log('Effect triggered. Fetching trends...');
    fetchTrends();
  }, [fetchTrends]);

  const getShareLink = () => {
    if (location === 'US') {
      return 'https://trends.google.com/trending?geo=US';
    }
    return `https://trends.google.com/trending?geo=US-${location}`;
  };

  return (
    <div className="w-[90%] sm:w-full max-w-4xl mx-auto bg-background shadow-md rounded-lg p-4 sm:p-6">
      <p className="text-xs sm:text-sm text-muted-foreground mb-4">
        Select a State for{' '}
        <Link
          href="https://trends.google.com/trends/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground"
        >
          Google Trends
        </Link>{' '}
        results
      </p>
      <USStateMap
        onStateSelect={handleStateSelect}
        selectedState={selectedState}
        isLocked={isLocked}
      />
      {locationName && (
        <div className="flex justify-between items-center mt-4">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Current location: {locationName}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(getShareLink(), '_blank')}
          >
            View in Google Trends
          </Button>
        </div>
      )}
      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
          <p className="ml-2 text-sm sm:text-base text-primary">
            Loading trends...
          </p>
        </div>
      ) : error ? (
        <p className="text-red-500 text-xs sm:text-sm mt-2">{error}</p>
      ) : (
        <>
          {trends.length > 0 ? (
            <>
              {summary && (
                <div className="mt-4 sm:mt-6">
                  <div className="bg-muted p-3 sm:p-4 rounded-lg">
                    <p className="text-xs sm:text-sm text-foreground whitespace-pre-wrap">
                      {summary}
                    </p>
                  </div>
                </div>
              )}
              <div className="mt-4 sm:mt-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 text-foreground">
                  Trending Topics in {locationName}
                </h3>
                <div className="space-y-4 sm:space-y-6">
                  {trends.map((trend, index) => (
                    <div
                      key={index}
                      className="bg-card border border-border p-3 sm:p-4 rounded-lg shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-2">
                        <h4 className="text-base sm:text-lg font-semibold text-card-foreground">
                          {trend.title}
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 gap-3 sm:gap-4 px-2 sm:px-4">
                        {trend.newsItems &&
                          trend.newsItems.map((newsItem, newsIndex) => (
                            <a
                              key={newsIndex}
                              href={newsItem.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex flex-col sm:flex-row items-start space-y-2 sm:space-y-0 sm:space-x-3 hover:bg-muted p-2 rounded transition duration-150 ease-in-out"
                            >
                              {newsItem.picture ? (
                                <img
                                  src={newsItem.picture}
                                  alt={newsItem.title}
                                  className="w-full sm:w-16 h-32 sm:h-16 object-cover rounded"
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src =
                                      '/placeholder.svg?height=80&width=80';
                                  }}
                                />
                              ) : (
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-muted flex items-center justify-center rounded">
                                  <ImageOff className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h5 className="font-medium text-xs sm:text-sm text-card-foreground">
                                  {newsItem.title}
                                </h5>
                                {newsItem.snippet && (
                                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                    {newsItem.snippet}
                                  </p>
                                )}
                                <p className="text-xs text-muted-foreground mt-1">
                                  {newsItem.source}
                                </p>
                              </div>
                            </a>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <p className="text-muted-foreground mt-4 text-sm">
              No trending topics available at the moment.
            </p>
          )}
        </>
      )}
      <div className="flex items-center py-10">
        <p className="text-xs sm:text-sm text-muted-foreground mb-4 text-center">
          Not for resale or integration; Research use only please. This project
          is not affiliated with or endorsed by Google.
        </p>
      </div>
    </div>
  );
}
