import { describe, expect, it } from 'vitest';
import { createFallbackAnchor } from '../src/index';

describe('createFallbackAnchor', () => {
  it('creates the deeplink anchor with safe rel, target, styling hook and label', () => {
    const anchor = createFallbackAnchor({
      domain: 'example.com',
      label: 'Prefer us on Google',
      className: 'my-fallback',
    });
    expect(anchor.getAttribute('href')).toBe('https://www.google.com/preferences/source?q=example.com');
    expect(anchor.getAttribute('target')).toBe('_blank');
    expect(anchor.rel).toContain('noopener');
    expect(anchor.rel).toContain('noreferrer');
    expect(anchor.hasAttribute('data-ps-fallback')).toBe(true);
    expect(anchor.textContent).toBe('Prefer us on Google');
    expect(anchor.className).toBe('my-fallback');
  });

  it('defaults the label and target', () => {
    const anchor = createFallbackAnchor({ domain: 'example.com' });
    expect(anchor.textContent).toBe('Add as a preferred source on Google');
    expect(anchor.getAttribute('target')).toBe('_blank');
  });
});
