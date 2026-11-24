import { promises as fs } from 'fs';
import path from 'path';
import {
  PDFDocument,
  PDFFont,
  PDFPage,
  concatTransformationMatrix,
  popGraphicsState,
  pushGraphicsState,
  rgb,
} from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

export interface ReportSignal {
  title: string;
  /** Google's rough count, e.g. "200+". Empty when the feed gives none. */
  traffic: string;
  reason: string;
  source: string;
}

export interface ReportData {
  placeName: string;
  dateLabel: string;
  headline: string;
  outlook: string;
  signals: ReportSignal[];
}

// US Letter, in points. The layout follows the "Bulletin" design at 0.75pt per px.
const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN_X = 54;
const CONTENT_W = PAGE_W - MARGIN_X * 2;
const TOP = PAGE_H - 45;
const FOOTER_Y = 36;

// Archivo ships here at normal width; headings are stretched to the app's 125%.
const WIDE = 1.25;

const hex = (h: string) => {
  const n = parseInt(h.slice(1), 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
};

const NIGHT = hex('#0E1430');
const MUTED = hex('#4A5585');
const RULE = hex('#C5CCEE');
const SIGNAL = ['#FF5CA8', '#FFB020', '#B6F04A', '#2BD4C4'].map(hex);

const FONT_FILES = {
  display: 'Archivo_800ExtraBold.ttf',
  displayBold: 'Archivo_700Bold.ttf',
  body: 'IBMPlexSans_400Regular.ttf',
  bodyBold: 'IBMPlexSans_600SemiBold.ttf',
  mono: 'JetBrainsMono_400Regular.ttf',
} as const;

type FontKey = keyof typeof FONT_FILES;

let fontBytes: Promise<Record<FontKey, Buffer>> | null = null;

function loadFontBytes() {
  if (!fontBytes) {
    const dir = path.join(process.cwd(), 'assets', 'fonts');
    fontBytes = Promise.all(
      (Object.keys(FONT_FILES) as FontKey[]).map(
        async (key) =>
          [key, await fs.readFile(path.join(dir, FONT_FILES[key]))] as const
      )
    ).then((entries) => Object.fromEntries(entries) as Record<FontKey, Buffer>);
  }
  return fontBytes;
}

const charSets = new WeakMap<PDFFont, Set<number>>();

/** Drop characters the font cannot draw (e.g. CJK), and tidy whitespace. */
function clean(font: PDFFont, text: string): string {
  let set = charSets.get(font);
  if (!set) {
    set = new Set(font.getCharacterSet());
    charSets.set(font, set);
  }
  let out = '';
  for (const ch of text.replace(/\s+/g, ' ')) {
    if (set.has(ch.codePointAt(0)!)) out += ch;
  }
  return out.replace(/ {2,}/g, ' ').trim();
}

function fit(font: PDFFont, text: string, size: number, maxWidth: number, scale = 1) {
  if (font.widthOfTextAtSize(text, size) * scale <= maxWidth) return text;
  let t = text;
  while (t.length > 1 && font.widthOfTextAtSize(`${t}…`, size) * scale > maxWidth) {
    t = t.slice(0, -1);
  }
  return `${t.trimEnd()}…`;
}

function wrap(font: PDFFont, text: string, size: number, maxWidth: number, maxLines: number) {
  const lines: string[] = [];
  let line = '';
  const words = text.split(' ');
  for (let i = 0; i < words.length; i++) {
    const next = line ? `${line} ${words[i]}` : words[i];
    if (font.widthOfTextAtSize(next, size) <= maxWidth) {
      line = next;
      continue;
    }
    if (lines.length === maxLines - 1) {
      // Last allowed line: keep what fits and mark the cut.
      lines.push(fit(font, `${line} ${words.slice(i).join(' ')}`.trim(), size, maxWidth));
      return lines;
    }
    if (line) lines.push(line);
    line = words[i];
  }
  if (line) lines.push(fit(font, line, size, maxWidth));
  return lines;
}

function drawWide(
  page: PDFPage,
  text: string,
  opts: { x: number; y: number; size: number; font: PDFFont }
) {
  page.pushOperators(
    pushGraphicsState(),
    concatTransformationMatrix(WIDE, 0, 0, 1, 0, 0)
  );
  page.drawText(text, { ...opts, x: opts.x / WIDE, color: NIGHT });
  page.pushOperators(popGraphicsState());
}

export async function renderReportPdf(data: ReportData): Promise<Uint8Array> {
  const bytes = await loadFontBytes();
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  doc.setTitle(`${data.placeName} search forecast, ${data.dateLabel}`);
  doc.setCreator('Search Trends by State');

  const f = {} as Record<FontKey, PDFFont>;
  for (const key of Object.keys(FONT_FILES) as FontKey[]) {
    f[key] = await doc.embedFont(bytes[key], { subset: true });
  }

  const page = doc.addPage([PAGE_W, PAGE_H]);
  const right = PAGE_W - MARGIN_X;
  const label = (text: string, y: number) =>
    page.drawText(text, { x: MARGIN_X, y, size: 9, font: f.mono, color: MUTED });
  const rule = (y: number, thickness: number, color = NIGHT) =>
    page.drawLine({
      start: { x: MARGIN_X, y },
      end: { x: right, y },
      thickness,
      color,
    });

  // Header strip
  let y = TOP - 9;
  page.drawText('SEARCH TRENDS BY STATE', { x: MARGIN_X, y, size: 9, font: f.mono, color: NIGHT });
  const date = clean(f.mono, data.dateLabel.toUpperCase());
  page.drawText(date, {
    x: right - f.mono.widthOfTextAtSize(date, 9),
    y,
    size: 9,
    font: f.mono,
    color: NIGHT,
  });
  y -= 9;
  rule(y, 1.5);

  // Place name, shrunk until it fits on one line
  const name = clean(f.display, data.placeName);
  let nameSize = 60;
  while (nameSize > 28 && f.display.widthOfTextAtSize(name, nameSize) * WIDE > CONTENT_W) {
    nameSize -= 2;
  }
  y -= 18 + nameSize * 0.74;
  drawWide(page, name, { x: MARGIN_X, y, size: nameSize, font: f.display });

  // Headline
  y -= 14;
  for (const line of wrap(f.bodyBold, clean(f.bodyBold, data.headline), 15.5, CONTENT_W, 2)) {
    y -= 20;
    page.drawText(line, { x: MARGIN_X, y, size: 15.5, font: f.bodyBold, color: NIGHT });
  }

  // Outlook
  y -= 24;
  label('THE OUTLOOK · WRITTEN BY CLAUDE', y);
  y -= 3;
  for (const line of wrap(f.body, clean(f.body, data.outlook), 11.25, CONTENT_W, 6)) {
    y -= 17.5;
    page.drawText(line, { x: MARGIN_X, y, size: 11.25, font: f.body, color: NIGHT });
  }

  // Signals
  y -= 26;
  label('SIGNALS, STRONGEST FIRST', y);
  y -= 8;

  const textX = MARGIN_X + 36;
  const textW = right - textX;
  const footerTop = FOOTER_Y + 30;

  data.signals.forEach((signal, i) => {
    const reasonLines = wrap(f.body, clean(f.body, signal.reason), 10.5, textW, 2);
    const source = clean(f.mono, signal.source);
    const rowHeight = 8 + 15 + reasonLines.length * 14.5 + (source ? 13 : 0) + 8;
    if (y - rowHeight < footerTop) return; // never spill past one page

    rule(y, 0.75, RULE);

    // Rank chip
    const cy = y - 8 - 12.75;
    page.drawCircle({ x: MARGIN_X + 12.75, y: cy, size: 12.75, color: SIGNAL[Math.min(i, 3)] });
    const rank = String(i + 1);
    const rankW = f.display.widthOfTextAtSize(rank, 11) * WIDE;
    drawWide(page, rank, { x: MARGIN_X + 12.75 - rankW / 2, y: cy - 3.9, size: 11, font: f.display });

    // Title and count
    const count = signal.traffic ? `${clean(f.mono, signal.traffic)} searches` : '';
    const countW = count ? f.mono.widthOfTextAtSize(count, 9) : 0;
    let rowY = y - 8 - 11;
    const title =
      clean(f.displayBold, signal.title) || '(search term not in Latin script)';
    drawWide(page, fit(f.displayBold, title, 12, textW - countW - 12, WIDE), {
      x: textX,
      y: rowY,
      size: 12,
      font: f.displayBold,
    });
    if (count) {
      page.drawText(count, { x: right - countW, y: rowY, size: 9, font: f.mono, color: MUTED });
    }

    for (const line of reasonLines) {
      rowY -= 14.5;
      page.drawText(line, { x: textX, y: rowY, size: 10.5, font: f.body, color: NIGHT });
    }
    if (source) {
      rowY -= 13;
      page.drawText(fit(f.mono, source, 9, textW), { x: textX, y: rowY, size: 9, font: f.mono, color: MUTED });
    }

    y -= rowHeight;
  });

  // Footer
  rule(FOOTER_Y + 16, 1.5);
  page.drawText(
    "Written by Claude from the public Google Trends feed. Search counts are Google's estimates. Not affiliated with Google.",
    { x: MARGIN_X, y: FOOTER_Y, size: 8.5, font: f.body, color: MUTED }
  );

  return doc.save();
}
