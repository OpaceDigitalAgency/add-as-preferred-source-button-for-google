import { DEEPLINK_BASE } from './constants';
import { isBrowser } from './environment';

/**
 * Normalise user/site input to the bare hostname Google's deeplink expects.
 * Accepts 'https://www.example.com/path', 'www.example.com:8080', 'Example.COM' and so on.
 * Returns the lowercase hostname with any protocol, path, query, hash, port and
 * trailing dot removed. Does NOT strip 'www.' (www is a subdomain and is itself
 * eligible; callers pass the exact host they want preferred).
 * Unicode hostnames pass through as `new URL()` yields them (punycode).
 * Throws TypeError on empty/whitespace-only input.
 */
export function normaliseDomain(input: string): string {
  const trimmed = typeof input === 'string' ? input.trim() : '';
  if (!trimmed) {
    throw new TypeError('normaliseDomain: expected a non-empty domain string');
  }
  const withProtocol = /:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;
  let host: string;
  try {
    host = new URL(withProtocol).hostname;
  } catch {
    // Regex fallback: strip protocol, then cut at the first /, ?, # or :
    host = trimmed.replace(/^[a-z]+:\/\//i, '').split(/[/?#:]/, 1)[0] ?? '';
  }
  host = host.toLowerCase().replace(/\.+$/, '');
  if (!host) {
    throw new TypeError('normaliseDomain: could not derive a hostname from input');
  }
  return host;
}

/**
 * Build the official no-JS deeplink:
 * https://www.google.com/preferences/source?q=<domain>
 * `domain` is passed through normaliseDomain() and URL-encoded.
 * When omitted: uses location.hostname in the browser; throws in SSR
 * (a server render must supply the domain explicitly).
 */
export function buildDeeplink(domain?: string): string {
  let source = domain;
  if (source === undefined) {
    if (!isBrowser()) {
      throw new TypeError('buildDeeplink: domain is required outside the browser (SSR)');
    }
    source = location.hostname;
  }
  return `${DEEPLINK_BASE}?q=${encodeURIComponent(normaliseDomain(source))}`;
}
