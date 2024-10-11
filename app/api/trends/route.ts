import { NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';
import openai from '@/lib/openai';

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

function decodeHTMLEntities(text: string | undefined): string {
  if (typeof text !== 'string') {
    return '';
  }
  return text.replace(/&amp;/g, '&')
             .replace(/&lt;/g, '<')
             .replace(/&gt;/g, '>')
             .replace(/&quot;/g, '"')
             .replace(/&#39;/g, "'");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let location = searchParams.get('location') || 'US';
  const locationName = searchParams.get('locationName') || 'United States';

  if (location !== 'US' && !location.startsWith('US-')) {
    location = `US-${location}`;
  }

  try {
    console.log(`Fetching trends for location: ${location}`);
    const response = await fetch(`https://trends.google.com/trending/rss?geo=${location}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch trends: ${response.status} ${response.statusText}`);
    }

    const xml = await response.text();
    console.log('Successfully fetched XML data');

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      textNodeName: "#text"
    });
    const result = parser.parse(xml);
    console.log('Successfully parsed XML data');

    const trends: TrendItem[] = result.rss.channel.item.map((item: any) => {
      console.log('Processing item:', JSON.stringify(item, null, 2));
      return {
        title: decodeHTMLEntities(item.title),
        traffic: item['ht:approx_traffic'] || 'Unknown',
        picture: item['ht:picture'] || '',
        pictureSource: item['ht:picture_source'] || '',
        newsItems: Array.isArray(item['ht:news_item']) 
          ? item['ht:news_item'].map((newsItem: any) => {
              console.log('Processing news item:', JSON.stringify(newsItem, null, 2));
              return {
                title: decodeHTMLEntities(newsItem['ht:news_item_title'] || ''),
                snippet: decodeHTMLEntities(newsItem['ht:news_item_snippet'] || ''),
                url: newsItem['ht:news_item_url'] || '',
                picture: newsItem['ht:news_item_picture'] || '',
                source: decodeHTMLEntities(newsItem['ht:news_item_source'] || ''),
              };
            })
          : [{
              title: decodeHTMLEntities(item['ht:news_item']?.['ht:news_item_title'] || ''),
              snippet: decodeHTMLEntities(item['ht:news_item']?.['ht:news_item_snippet'] || ''),
              url: item['ht:news_item']?.['ht:news_item_url'] || '',
              picture: item['ht:news_item']?.['ht:news_item_picture'] || '',
              source: decodeHTMLEntities(item['ht:news_item']?.['ht:news_item_source'] || ''),
            }]
      };
    });

    console.log(`Extracted ${trends.length} trends`);
    console.log('First trend:', JSON.stringify(trends[0], null, 2));

    const prompt = `Based on the following trending topics in ${locationName}, provide a brief analysis of what these trends suggest about current interests and concerns in the area: ${trends.map(t => t.title).join(', ')}`;

    console.log('Sending request to OpenAI');
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
      temperature: 0.7,
    });

    if (!aiResponse.choices || aiResponse.choices.length === 0) {
      throw new Error('No response from OpenAI');
    }

    const summary = aiResponse.choices[0].message.content?.trim();
    console.log('Successfully generated AI summary');

    return NextResponse.json({ trends, summary });
  } catch (error) {
    console.error('Error in /api/trends:', error);
    return NextResponse.json({ error: `Failed to fetch trends or generate summary: ${error.message}` }, { status: 500 });
  }
}