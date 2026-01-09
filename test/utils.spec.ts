import { describe, it, expect } from 'vitest';
import { sanitizeHtml } from '../src/utils';

describe('sanitizeHtml', () => {
	describe('basic character escaping', () => {
		it('escapes ampersand to &amp;', () => {
			expect(sanitizeHtml('&')).toBe('&amp;');
		});

		it('escapes less-than to &lt;', () => {
			expect(sanitizeHtml('<')).toBe('&lt;');
		});

		it('escapes greater-than to &gt;', () => {
			expect(sanitizeHtml('>')).toBe('&gt;');
		});

		it('escapes double quote to &quot;', () => {
			expect(sanitizeHtml('"')).toBe('&quot;');
		});

		it('escapes single quote to &#x27;', () => {
			expect(sanitizeHtml("'")).toBe('&#x27;');
		});
	});

	describe('multiple characters', () => {
		it('escapes script tags', () => {
			expect(sanitizeHtml('<script>')).toBe('&lt;script&gt;');
		});

		it('escapes ampersand in text', () => {
			expect(sanitizeHtml('a & b')).toBe('a &amp; b');
		});

		it('escapes full HTML tag', () => {
			expect(sanitizeHtml('<a href="x">')).toBe('&lt;a href=&quot;x&quot;&gt;');
		});
	});

	describe('edge cases', () => {
		it('handles empty string', () => {
			expect(sanitizeHtml('')).toBe('');
		});

		it('preserves text with no special characters', () => {
			expect(sanitizeHtml('Hello World')).toBe('Hello World');
		});

		it('escapes repeated ampersands', () => {
			expect(sanitizeHtml('&&&')).toBe('&amp;&amp;&amp;');
		});

		it('escapes alternating brackets', () => {
			expect(sanitizeHtml('<><><>')).toBe('&lt;&gt;&lt;&gt;&lt;&gt;');
		});

		it('double escapes already escaped ampersand', () => {
			expect(sanitizeHtml('already &amp; escaped')).toBe('already &amp;amp; escaped');
		});

		it('escapes XSS attempt', () => {
			expect(sanitizeHtml("<script>alert('xss')</script>")).toBe(
				'&lt;script&gt;alert(&#x27;xss&#x27;)&lt;/script&gt;',
			);
		});
	});

	describe('unicode and whitespace', () => {
		it('preserves newlines', () => {
			expect(sanitizeHtml('Hello\nWorld')).toBe('Hello\nWorld');
		});

		it('preserves tabs', () => {
			expect(sanitizeHtml('Tab\there')).toBe('Tab\there');
		});

		it('preserves unicode and escapes ampersand', () => {
			expect(sanitizeHtml('Emoji 🎉 & 日本語')).toBe('Emoji 🎉 &amp; 日本語');
		});

		it('preserves whitespace', () => {
			expect(sanitizeHtml('  spaces  ')).toBe('  spaces  ');
		});
	});

	describe('complex real-world scenarios', () => {
		it('escapes mixed quotes and ampersand', () => {
			expect(sanitizeHtml('Tom & Jerry\'s "Adventure"')).toBe(
				'Tom &amp; Jerry&#x27;s &quot;Adventure&quot;',
			);
		});

		it('escapes code expression', () => {
			expect(sanitizeHtml('5 > 3 && 3 < 5')).toBe('5 &gt; 3 &amp;&amp; 3 &lt; 5');
		});
	});
});
