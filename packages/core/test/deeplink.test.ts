import { describe, expect, it } from 'vitest';
import { buildDeeplink, normaliseDomain } from '../src/index';

describe('normaliseDomain', () => {
  it('strips protocol, path, query and hash', () => {
    expect(normaliseDomain('https://www.example.com/path?x=1#y')).toBe('www.example.com');
  });

  it('lowercases and removes a trailing dot', () => {
    expect(normaliseDomain('Example.COM.')).toBe('example.com');
  });

  it('removes a port', () => {
    expect(normaliseDomain('example.com:8080')).toBe('example.com');
  });

  it('keeps www — it is an eligible subdomain', () => {
    expect(normaliseDomain('www.example.com')).toBe('www.example.com');
  });

  it('falls back to a regex strip when URL parsing fails', () => {
    // A space makes new URL() throw; the regex path strips protocol and cuts at /?#:
    expect(normaliseDomain('https://exa mple.com/path')).toBe('exa mple.com');
  });

  it('throws TypeError when the regex fallback yields nothing', () => {
    expect(() => normaliseDomain('https://:8080')).toThrow(TypeError);
  });

  it('throws TypeError on empty input', () => {
    expect(() => normaliseDomain('')).toThrow(TypeError);
  });

  it('throws TypeError on whitespace-only input', () => {
    expect(() => normaliseDomain('   ')).toThrow(TypeError);
  });
});

describe('buildDeeplink', () => {
  it('builds the official deeplink for an explicit domain', () => {
    expect(buildDeeplink('news.example.com')).toBe(
      'https://www.google.com/preferences/source?q=news.example.com',
    );
  });

  it('uses location.hostname when the domain is omitted', () => {
    expect(buildDeeplink()).toBe(
      `https://www.google.com/preferences/source?q=${location.hostname}`,
    );
  });

  it('encodes IDN hostnames as punycode via URL parsing', () => {
    const link = buildDeeplink('bücher.example');
    expect(link).toBe('https://www.google.com/preferences/source?q=xn--bcher-kva.example');
  });
});
