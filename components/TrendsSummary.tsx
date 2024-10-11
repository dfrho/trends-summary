'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2, ImageOff } from 'lucide-react';
import { USStateMap } from './us-state-map';

interface NewsItem {
  title: string;
  snippet: string;
  url: string;
  picture: string;
  source: string;
}

interface TrendItem {
  title: string;
  traffic: string;
  picture: string;
  pictureSource: string;
  newsItems: NewsItem[];
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
  const [location, setLocation] = useState<string>('US');
  const [locationName, setLocationName] = useState<string>('United States');
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [summary, setSummary] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleStateSelect = useCallback(
    (stateCode: string, stateName: string) => {
      console.log(`State selected: ${stateCode} - ${stateName}`);
      if (!stateCode) {
        console.error('State code is undefined');
        return;
      }

      const apiStateCode =
        stateCode === 'US'
          ? 'US'
          : stateCode.startsWith('US-')
          ? stateCode.slice(3)
          : stateCode;
      console.log(`Setting location to: ${apiStateCode}`);
      setLocation(apiStateCode);
      setLocationName(getFullStateName(stateCode));
    },
    []
  );

  const fetchTrends = useCallback(async () => {
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
      if (data.error) {
        throw new Error(data.error);
      }
      console.log('Received trends data:', data);
      setTrends(data.trends);
      setSummary(data.summary);
    } catch (err) {
      console.error('Error fetching trends:', err);
      setError(`Failed to fetch trends data: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [location, locationName]);

  useEffect(() => {
    console.log('Effect triggered. Fetching trends...');
    fetchTrends();
  }, [fetchTrends]);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Local Google Trends Summary
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Get AI-generated insights based on your location's trending searches
      </p>

      <USStateMap onStateSelect={handleStateSelect} />

      {locationName && (
        <p className="text-sm text-gray-600 mb-4">
          Current location: {locationName}
        </p>
      )}
      {isLoading && !error && (
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="ml-2 text-gray-700">Loading trends...</p>
        </div>
      )}
      {trends.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Trending Topics
          </h3>
          <div className="space-y-6">
            {trends.map((trend, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm"
              >
                <div className="flex items-center mb-2">
                  <h4 className="text-lg font-semibold text-gray-800">
                    {trend.title}
                  </h4>
                  <span className="ml-2 text-sm text-gray-600">
                    {trend.traffic}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trend.newsItems.map((newsItem, newsIndex) => (
                    <a
                      key={newsIndex}
                      href={newsItem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start space-x-3 hover:bg-gray-100 p-2 rounded transition duration-150 ease-in-out"
                    >
                      {newsItem.picture ? (
                        <img
                          src={newsItem.picture}
                          alt={newsItem.title}
                          className="w-20 h-20 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src =
                              '/placeholder.svg?height=80&width=80';
                          }}
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded">
                          <ImageOff className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <h5 className="font-medium text-sm text-gray-800">
                          {newsItem.title}
                        </h5>
                        {newsItem.snippet && (
                          <p className="text-xs text-gray-600 mt-1">
                            {newsItem.snippet}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
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
      )}
      {summary && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2 text-gray-800">
            AI Summary
          </h3>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-sm text-gray-800 whitespace-pre-wrap">
              {summary}
            </p>
          </div>
        </div>
      )}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
