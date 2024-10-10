'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
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
    AL: 'Alabama',
    AK: 'Alaska',
    AZ: 'Arizona',
    AR: 'Arkansas',
    CA: 'California',
    CO: 'Colorado',
    CT: 'Connecticut',
    DE: 'Delaware',
    FL: 'Florida',
    GA: 'Georgia',
    HI: 'Hawaii',
    ID: 'Idaho',
    IL: 'Illinois',
    IN: 'Indiana',
    IA: 'Iowa',
    KS: 'Kansas',
    KY: 'Kentucky',
    LA: 'Louisiana',
    ME: 'Maine',
    MD: 'Maryland',
    MA: 'Massachusetts',
    MI: 'Michigan',
    MN: 'Minnesota',
    MS: 'Mississippi',
    MO: 'Missouri',
    MT: 'Montana',
    NE: 'Nebraska',
    NV: 'Nevada',
    NH: 'New Hampshire',
    NJ: 'New Jersey',
    NM: 'New Mexico',
    NY: 'New York',
    NC: 'North Carolina',
    ND: 'North Dakota',
    OH: 'Ohio',
    OK: 'Oklahoma',
    OR: 'Oregon',
    PA: 'Pennsylvania',
    RI: 'Rhode Island',
    SC: 'South Carolina',
    SD: 'South Dakota',
    TN: 'Tennessee',
    TX: 'Texas',
    UT: 'Utah',
    VT: 'Vermont',
    VA: 'Virginia',
    WA: 'Washington',
    WV: 'West Virginia',
    WI: 'Wisconsin',
    WY: 'Wyoming',
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

  const handleStateSelect = (stateCode: string, stateName: string) => {
    setLocation(stateCode);
    setLocationName(getFullStateName(stateName));
  };

  const fetchTrends = async () => {
    setIsLoading(true);
    setError(null);
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
      setTrends(data.trends);
      setSummary(data.summary);
    } catch (err) {
      setError(`Failed to fetch trends data: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, [location, locationName]);

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
                    ({trend.traffic} searches)
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
                      <img
                        src={newsItem.picture}
                        alt={newsItem.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div>
                        <h5 className="font-medium text-sm text-gray-800">
                          {newsItem.title}
                        </h5>
                        <p className="text-xs text-gray-600">
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
