// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { decodeHTMLEntities } from '@/lib/utils';

describe('decodeHTMLEntities', () => {
  it('decodes common HTML entities', () => {
    expect(decodeHTMLEntities('Tom &amp; Jerry')).toBe('Tom & Jerry');
    expect(decodeHTMLEntities('&lt;script&gt;')).toBe('<script>');
    expect(decodeHTMLEntities('&quot;quoted&quot;')).toBe('"quoted"');
    expect(decodeHTMLEntities('it&#39;s')).toBe("it's");
  });

  it('returns an empty string for non-string input', () => {
    expect(decodeHTMLEntities(undefined)).toBe('');
  });
});
