import { buildDeeplink } from './deeplink';
import type { FallbackAnchorOptions } from './types';

/**
 * Create the graceful-degradation anchor used when the SDK is blocked:
 * <a href="https://www.google.com/preferences/source?q=<domain>"
 *    target="_blank" rel="noopener noreferrer">label</a>
 * Also sets data-ps-fallback="" for styling hooks. Throws in SSR when domain
 * is omitted (needs location.hostname); with an explicit domain it works with
 * any Document you pass (default: the global document).
 */
export function createFallbackAnchor(
  options: FallbackAnchorOptions = {},
  doc: Document = document,
): HTMLAnchorElement {
  const anchor = doc.createElement('a');
  anchor.href = buildDeeplink(options.domain);
  anchor.target = options.target ?? '_blank';
  anchor.rel = 'noopener noreferrer';
  anchor.setAttribute('data-ps-fallback', '');
  if (options.className) anchor.className = options.className;
  anchor.textContent = options.label ?? 'Add as a preferred source on Google';
  return anchor;
}
