import { describe, expect, it, vi } from 'vitest';
import preferredSource, { buildHeadSnippet } from '../src/index';

function runSetupHook(options?: Parameters<typeof preferredSource>[0]) {
  const injectScript = vi.fn();
  const logger = { warn: vi.fn(), info: vi.fn() };
  const integration = preferredSource(options);
  integration.hooks['astro:config:setup']?.({ injectScript, logger });
  return { injectScript, logger };
}

describe('astro integration', () => {
  it('injects a head-inline snippet containing the SDK URL by default', () => {
    const { injectScript } = runSetupHook();
    expect(injectScript).toHaveBeenCalledTimes(1);
    const [stage, snippet] = injectScript.mock.calls[0]!;
    expect(stage).toBe('head-inline');
    expect(snippet).toContain('https://news.google.com/swg/js/v1/publisher.js');
    expect(snippet).not.toContain('preferred-sources-control');
  });

  it('adds the manual control attribute and init push in manual mode', () => {
    const { injectScript } = runSetupHook({ mode: 'manual', theme: 'dark', lang: 'en' });
    const snippet = injectScript.mock.calls[0]![1] as string;
    expect(snippet).toContain('preferred-sources-control');
    expect(snippet).toContain('"dark"');
    expect(snippet).toContain('"en"');
    expect(snippet).toContain('PREFERRED_SOURCE');
  });

  it('skips injection when injectScript is false, warning on manual mode', () => {
    const { injectScript, logger } = runSetupHook({ mode: 'manual', injectScript: false });
    expect(injectScript).not.toHaveBeenCalled();
    expect(logger.warn).toHaveBeenCalledTimes(1);
  });

  it('buildHeadSnippet dedupes against a pre-existing publisher script', () => {
    expect(buildHeadSnippet()).toContain('querySelector');
  });
});
