import type { TweetLegacy } from './twitter/models';

/**
 * Extracts the display text from a tweet, excluding media URLs.
 * Uses display_text_range when available, otherwise returns full_text.
 */
export function getDisplayText(legacy: TweetLegacy): string {
  if (legacy.display_text_range) {
    const [start, end] = legacy.display_text_range;
    return legacy.full_text.substring(start, end);
  }
  return legacy.full_text;
}

/**
 * Sanitizes a string for safe inclusion in HTML content.
 * Escapes special HTML characters to prevent XSS and broken markup.
 */
export function sanitizeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}
