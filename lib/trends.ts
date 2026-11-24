import { XMLParser } from 'fast-xml-parser';
import { decodeHTMLEntities } from '@/lib/utils';

export interface NewsItem {
  title: string;
  snippet: string;
  url: string;
  picture: string;
  source: string;
}

export interface TrendItem {
  title: string;
  traffic: string;
  picture: string;
  pictureSource: string;
  newsItems: NewsItem[];
}

function toNewsItem(raw: any): NewsItem {
  return {
    title: decodeHTMLEntities(raw?.['ht:news_item_title'] || ''),
    snippet: decodeHTMLEntities(raw?.['ht:news_item_snippet'] || ''),
    url: raw?.['ht:news_item_url'] || '',
    picture: raw?.['ht:news_item_picture'] || '',
    source: decodeHTMLEntities(raw?.['ht:news_item_source'] || ''),
  };
}

/**
 * Fetch and parse the Google Trends RSS feed.
 * @param geo 'US' for the national feed, or 'US-XX' for a state.
 */
export async function fetchTrends(geo: string): Promise<TrendItem[]> {
  const response = await fetch(
    `https://trends.google.com/trending/rss?geo=${geo}`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch trends: ${response.status} ${response.statusText}`
    );
  }

  const xml = await response.text();
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    textNodeName: '#text',
  });
  const result = parser.parse(xml);

  const rawItems = result?.rss?.channel?.item ?? [];
  const items = Array.isArray(rawItems) ? rawItems : [rawItems];

  return items.map((item: any) => {
    const news = item['ht:news_item'];
    return {
      title: decodeHTMLEntities(String(item.title ?? '')),
      traffic: String(item['ht:approx_traffic'] ?? ''),
      picture: item['ht:picture'] || '',
      pictureSource: item['ht:picture_source'] || '',
      newsItems: Array.isArray(news) ? news.map(toNewsItem) : [toNewsItem(news)],
    };
  });
}
