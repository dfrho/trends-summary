import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import anthropic from '@/lib/anthropic';
import { fetchTrends, TrendItem } from '@/lib/trends';
import { STATES, stateName } from '@/lib/states';
import { renderReportPdf } from '@/lib/reportPdf';

const MAX_SIGNALS = 6;

interface ReportCopy {
  headline: string;
  outlook: string;
  reasons: string[];
}

const REPORT_SCHEMA = {
  type: 'object',
  properties: {
    headline: { type: 'string' },
    outlook: { type: 'string' },
    reasons: { type: 'array', items: { type: 'string' } },
  },
  required: ['headline', 'outlook', 'reasons'],
  additionalProperties: false,
};

function buildPrompt(placeName: string, signals: TrendItem[]) {
  const list = signals
    .map((t, i) => {
      const news = t.newsItems
        .filter((n) => n.title)
        .map((n) => `   - ${n.title} (${n.source})`)
        .join('\n');
      return `${i + 1}. ${t.title}\n${news || '   (no news items)'}`;
    })
    .join('\n');

  return `You are the search forecaster for ${placeName}. Below are its top trending Google searches right now, strongest first, each with the news headlines Google attached to it.

Write the copy for a one-page printed report. Plain text only, no markdown.

- headline: one sentence, 12 words or fewer, naming what leads the feed and what follows.
- outlook: three sentences, under 70 words, present tense. Describe the top search as the system leading the feed, then what sits behind it, then what is holding steady. Use order only and never state or imply numbers.
- reasons: exactly ${signals.length} items, one per search, in the same order. Each is one sentence of 16 words or fewer saying why that search is trending, based only on its headlines. If the headlines do not explain it, write "The feed gives no clear reason."

Report what people are searching; do not guess at how they feel. If a topic is a real emergency, drop the weather language and say it plainly. Write in English even when a search or headline is in another language.

Searches:
${list}`;
}

async function writeReportCopy(placeName: string, signals: TrendItem[]): Promise<ReportCopy> {
  const response = await anthropic.beta.messages.create({
    model: 'claude-opus-5-5',
    max_tokens: 16000,
    // If a safety classifier declines the request, the API retries on the fallback model.
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: [{ model: 'claude-opus-4-8' }],
    output_config: {
      effort: 'low',
      format: { type: 'json_schema', schema: REPORT_SCHEMA },
    },
    messages: [{ role: 'user', content: buildPrompt(placeName, signals) }],
  });

  if (response.stop_reason === 'refusal') {
    throw new Error('Claude declined to write this report');
  }

  const textBlock = response.content.find(
    (block): block is Anthropic.Beta.BetaTextBlock => block.type === 'text'
  );
  if (!textBlock) {
    throw new Error('No text response from Claude');
  }

  const copy = JSON.parse(textBlock.text) as ReportCopy;
  if (!copy.headline || !copy.outlook || !Array.isArray(copy.reasons)) {
    throw new Error('Claude returned an incomplete report');
  }
  return copy;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = (searchParams.get('location') || 'US').toUpperCase();

  if (location !== 'US' && !STATES.some((s) => s.code === location)) {
    return NextResponse.json({ error: 'Unknown location' }, { status: 400 });
  }

  const placeName = location === 'US' ? 'United States' : stateName(location);
  const geo = location === 'US' ? 'US' : `US-${location}`;

  try {
    const signals = (await fetchTrends(geo)).slice(0, MAX_SIGNALS);
    if (signals.length === 0) {
      return NextResponse.json(
        { error: `Nothing is trending in ${placeName} right now` },
        { status: 404 }
      );
    }

    const copy = await writeReportCopy(placeName, signals);

    const now = new Date();
    const pdf = await renderReportPdf({
      placeName,
      dateLabel: now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      headline: copy.headline,
      outlook: copy.outlook,
      signals: signals.map((t, i) => ({
        title: t.title,
        traffic: t.traffic,
        reason: copy.reasons[i] ?? '',
        source: t.newsItems.find((n) => n.source)?.source ?? '',
      })),
    });

    const slug = placeName.toLowerCase().replace(/\s+/g, '-');
    const filename = `${slug}-search-forecast-${now.toISOString().slice(0, 10)}.pdf`;

    return new Response(Buffer.from(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Error in /api/report:', error);
    return NextResponse.json(
      { error: `Failed to build the report: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
