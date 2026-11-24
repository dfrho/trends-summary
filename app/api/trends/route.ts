import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import anthropic from '@/lib/anthropic';
import { fetchTrends } from '@/lib/trends';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let location = searchParams.get('location') || 'US';
  const locationName = searchParams.get('locationName') || 'United States';

  if (location !== 'US' && !location.startsWith('US-')) {
    location = `US-${location}`;
  }

  try {
    console.log(`Fetching trends for location: ${location}`);
    const trends = await fetchTrends(location);
    console.log(`Extracted ${trends.length} trends`);

    const prompt = `You are the search forecaster for ${locationName}. Below are its trending Google searches right now, strongest first.

Write the outlook: plain text only, no markdown, no headings, no preamble. Three sentences, under 70 words, present tense. Describe the top search as the system leading the feed, then what sits behind it, then what is holding steady. Use order only and never state or imply numbers. Report what people are searching; do not guess at how they feel. If a topic is a real emergency, drop the weather language and say it plainly.

Searches: ${trends.map(t => t.title).join(', ')}`;

    console.log('Sending request to Claude');
    const aiResponse = await anthropic.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 350,
      messages: [{ role: 'user', content: prompt }],
    });

    const textBlock = aiResponse.content.find(
      (block): block is Anthropic.Messages.TextBlock => block.type === 'text'
    );

    if (!textBlock) {
      throw new Error('No text response from Claude');
    }

    const summary = textBlock.text.trim();
    console.log('Successfully generated AI summary');

    return NextResponse.json({ trends, summary });
  } catch (error) {
    console.error('Error in /api/trends:', error);
    return NextResponse.json({ error: `Failed to fetch trends or generate summary: ${(error as Error).message}` }, { status: 500 }); }
}